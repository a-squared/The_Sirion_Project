const fs = require('fs'), vm = require('vm'), assert = require('assert');
const base = require('path').join(__dirname, '..', 'public') + require('path').sep;
const turn = () => new Promise((resolve) => setImmediate(resolve));
class Element { constructor(id=''){this.id=id;this.html='';this.textContent='';this.dataset={};this.handlers={};this.children={};this.value='';this.disabled=false;this.classList={toggle(){}};} set innerHTML(x){this.html=String(x);this.children={};} get innerHTML(){return this.html;} addEventListener(n,f){this.handlers[n]=f;} setAttribute(){} removeAttribute(){} querySelector(s){return this.children[s]||(this.children[s]=new Element(s));} querySelectorAll(){return [];} focus(){} }
(async()=>{
 const els=Object.fromEntries(['view','drawer-root','popover-root','toast-root','page-title','add-contract','global-ai-button','reminders-button'].map(x=>[x,new Element(x)]));
 const nav=['overview','library','board','story'].map(v=>{const e=new Element();e.dataset.view=v;return e;});
 const storage={}, localStorage={getItem(k){return storage[k]||null;},setItem(k,v){storage[k]=String(v);}};
 let rendered; const window={scrollTo(){},renderOverview(root,state,actions){rendered={name:'overview',state,actions};},renderLibrary(root,state,actions){rendered={name:'library',state,actions};},renderBoard(root,state,actions){rendered={name:'board',state,actions};},renderStory(){rendered={name:'story'};}};
 const doc={getElementById(id){return els[id];},querySelectorAll(sel){return sel==='[data-view]'?nav:[];}};
 class FormData {get(k){return ({email:'someone@arbitrary.example',assignee:'Priya Nair'})[k];}}
 let serverContracts=[], subscriptions=[], requests=[];
 const fakeResponse=(result)=>({ok:true,status:200,json:async()=>result});
 const fetch=async(url,options={})=>{const method=options.method||'GET';requests.push([method,url]);
  if(url==='/api/status')return fakeResponse({aiConfigured:false,emailConfigured:false,sampleEmailEnabled:false});
  if(url==='/api/state'&&method==='GET')return fakeResponse({contracts:serverContracts});
  if(url==='/api/state'&&method==='POST'){serverContracts=JSON.parse(options.body).contracts;return fakeResponse({contracts:serverContracts});}
  if(url==='/api/subscriptions'&&method==='GET')return fakeResponse({subscriptions});
  if(url==='/api/subscriptions'&&method==='POST'){const input=JSON.parse(options.body),entry={id:'fixture-subscription',...input};subscriptions.push(entry);return fakeResponse(entry);}
  if(url==='/api/ask'&&method==='POST')return fakeResponse({answer:'Mock model answer for integration test.', evidence:[{id:'staffing--staffing-amendment',quote:'From 1 August 2026, the rate for a standard weekday sales-assistant shift in Zone A changes to ₹650 before tax.'}]});
  throw new Error(`Unexpected fetch: ${method} ${url}`);
 };
 const context={window,document:doc,localStorage,fetch,FormData,console,Date,Map,Set,JSON,Promise,Number,String,Array,RegExp,Error,Math,setTimeout:()=>0,clearTimeout:()=>{}};vm.createContext(context);
 vm.runInContext(fs.readFileSync(base+'fixtures.js','utf8'),context);
 serverContracts=JSON.parse(JSON.stringify(window.DEMO_CONTRACTS));const date=new Date();date.setDate(date.getDate()+10);const iso=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
 serverContracts.push({id:'notice-test',supplier:'Demo supplier',title:'Verified due test',status:'Monitoring',noticeVerified:true,noticeDate:iso,flags:[],documents:[]});
 vm.runInContext(fs.readFileSync(base+'app.js','utf8'),context);
 await turn();await turn();await turn();assert.strictEqual(rendered.state.serverConnected,true);assert.strictEqual(rendered.state.contracts.find(c=>c.id==='notice-test').status,'Action due');assert.strictEqual(serverContracts.find(c=>c.id==='notice-test').status,'Action due');
 rendered.actions.updateContract('staffing',{owner:'Changed owner'});rendered.actions.updateContract('staffing',{notes:'Changed note'});await turn();await turn();await turn();const saved=serverContracts.find(c=>c.id==='staffing');assert.strictEqual(saved.owner,'Changed owner');assert.strictEqual(saved.notes,'Changed note');
 rendered.state.aiConfigured=true;const output=new Element();await rendered.actions.ask('Explain the agreement in your own words',output,null);assert.ok(output.innerHTML.includes('AI response · review sources'));assert.ok(output.innerHTML.includes('Mock model answer'));assert.ok(output.innerHTML.includes('From 1 August 2026'));
 await rendered.actions.openEmailSettings();assert.ok(els['drawer-root'].innerHTML.includes('Email delivery is not configured'));const form=els['drawer-root'].querySelector('#app-email-form');await form.handlers.submit({preventDefault(){}});assert.strictEqual(subscriptions[0].email,'someone@arbitrary.example');assert.ok(!requests.some(([method,url])=>method==='POST'&&url.endsWith('/send')));
 console.log('PASS: mocked server bootstrap and persistent automatic notice transition');console.log('PASS: ordered state writes preserve successive updates');console.log('PASS: configured-model route renders validated mock source evidence');console.log('PASS: arbitrary-domain subscription saves without triggering unconfigured email');
})().catch(e=>{console.error(e);process.exit(1)});
