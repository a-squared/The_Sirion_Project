#!/usr/bin/env python3
"""Send one email through a configured TLS-protected SMTP service.

This program reads one JSON object from stdin and emits a single JSON result.
It deliberately never includes message content, credentials, SMTP responses,
or recipient addresses in its output.
"""

import json
import os
import re
import smtplib
import ssl
import sys
from email.message import EmailMessage


MAX_INPUT_BYTES = 128 * 1024
MAX_BODY_LENGTH = 100_000
MAX_SUBJECT_LENGTH = 250
MAX_EMAIL_LENGTH = 254

# Support ordinary Internet mailbox addresses without accepting display names,
# line breaks, or multiple recipients. Internationalized domain names are
# converted to their ASCII form before the message is sent.
LOCAL_PART = re.compile(r"^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$")
DOMAIN_LABEL = re.compile(r"^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$")


class InputError(Exception):
    """A safe-to-display validation or configuration error."""


def valid_address(value):
    if not isinstance(value, str):
        return None
    address = value.strip()
    if (
        not address
        or len(address) > MAX_EMAIL_LENGTH
        or "\r" in address
        or "\n" in address
        or address.count("@") != 1
    ):
        return None
    local, domain = address.rsplit("@", 1)
    if (
        not local
        or len(local) > 64
        or not LOCAL_PART.fullmatch(local)
        or local.startswith(".")
        or local.endswith(".")
        or ".." in local
    ):
        return None
    try:
        ascii_domain = domain.encode("idna").decode("ascii")
    except (UnicodeError, ValueError):
        return None
    labels = ascii_domain.split(".")
    if (
        len(labels) < 2
        or len(ascii_domain) > 253
        or any(not DOMAIN_LABEL.fullmatch(label) for label in labels)
        or len(local) + 1 + len(ascii_domain) > MAX_EMAIL_LENGTH
    ):
        return None
    return f"{local}@{ascii_domain}"


def load_request():
    data = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    if len(data) > MAX_INPUT_BYTES:
        raise InputError("The email request is too large.")
    try:
        request = json.loads(data)
    except (json.JSONDecodeError, UnicodeDecodeError, ValueError):
        raise InputError("Invalid JSON input.") from None
    if not isinstance(request, dict):
        raise InputError("Expected a JSON object.")

    recipient = valid_address(request.get("recipient"))
    if recipient is None:
        raise InputError("Enter a valid recipient email address.")
    subject = request.get("subject")
    if (
        not isinstance(subject, str)
        or not subject.strip()
        or len(subject) > MAX_SUBJECT_LENGTH
        or "\r" in subject
        or "\n" in subject
    ):
        raise InputError("The email subject is empty or invalid.")
    body = request.get("body")
    if not isinstance(body, str) or not body.strip() or len(body) > MAX_BODY_LENGTH:
        raise InputError("The email body is empty or too long.")
    return recipient, subject.strip(), body


def load_config():
    host = os.environ.get("SMTP_HOST", "").strip()
    sender = valid_address(os.environ.get("SMTP_FROM", ""))
    username = os.environ.get("SMTP_USERNAME", "")
    password = os.environ.get("SMTP_PASSWORD", "")
    if not host or any(c.isspace() for c in host) or sender is None:
        raise InputError("Email delivery is not configured.")
    if bool(username) != bool(password):
        raise InputError("SMTP credentials must be configured together.")
    try:
        port = int(os.environ.get("SMTP_PORT", "587"))
        if port < 1 or port > 65535:
            raise ValueError
    except ValueError:
        raise InputError("The SMTP port is invalid.") from None
    return host, port, username, password, sender


def send_one(recipient, subject, body, config):
    host, port, username, password, sender = config
    message = EmailMessage()
    message["From"] = sender
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body, charset="utf-8")
    context = ssl.create_default_context()

    if port == 465:
        smtp = smtplib.SMTP_SSL(host=host, port=port, context=context, timeout=20)
    else:
        smtp = smtplib.SMTP(host=host, port=port, timeout=20)
    try:
        smtp.ehlo()
        if port != 465:
            # Failure to negotiate STARTTLS is fatal: there is no plaintext
            # fallback for credentials or contract information.
            smtp.starttls(context=context)
            smtp.ehlo()
        if username and password:
            smtp.login(username, password)
        rejected = smtp.send_message(message, from_addr=sender, to_addrs=[recipient])
        if rejected:
            raise smtplib.SMTPException("Recipient rejected")
    finally:
        # Once the server has accepted the message, a failed QUIT must not
        # turn a success into a false failure that could cause a duplicate.
        try:
            smtp.quit()
        except (OSError, smtplib.SMTPException):
            smtp.close()


def main():
    try:
        recipient, subject, body = load_request()
        config = load_config()
        send_one(recipient, subject, body, config)
    except InputError as exc:
        result = {"ok": False, "error": str(exc)}
    except smtplib.SMTPAuthenticationError:
        result = {"ok": False, "error": "SMTP authentication failed."}
    except smtplib.SMTPRecipientsRefused:
        result = {"ok": False, "error": "Email delivery was refused by the mail server."}
    except smtplib.SMTPNotSupportedError:
        result = {"ok": False, "error": "The mail server does not support the required secure connection."}
    except ssl.SSLError:
        result = {"ok": False, "error": "A secure mail-server connection could not be established."}
    except (OSError, smtplib.SMTPException):
        result = {"ok": False, "error": "Email delivery failed."}
    except Exception:
        result = {"ok": False, "error": "Unexpected email delivery error."}
    else:
        result = {"ok": True}
    print(json.dumps(result, separators=(",", ":")))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
