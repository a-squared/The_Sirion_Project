#!/bin/zsh
cd -- "${0:A:h}" || exit 1

# Keep this launcher usable from Finder on Macs with Homebrew Node.
export PATH="/opt/homebrew/opt/node@20/bin:/opt/homebrew/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' 'Node.js 20 or later is required to run the local server.'
  exit 1
fi

printf '%s\n' 'Starting the local Contract Desk at http://127.0.0.1:3000'
printf '%s\n' 'Press Control-C to stop it.'
exec node server.js
