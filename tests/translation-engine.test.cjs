const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {TextEncoder}=require('node:util');
const source=fs.readFileSync(path.join(__dirname,'..','translation-engine.js'),'utf8');
function makeEngine({fetch,Translator}={}){
 const context={TextEncoder,URL,AbortController,setTimeout,clearTimeout,fetch:fetch||(()=>{throw Error('Unexpected request')}),Translator};
 return vm.runInNewContext(source+'\nFokatTranslation;',context);
}
test('chunks English and Korean without exceeding MyMemory byte budget',()=>{
 const engine=makeEngine();
 for(const text of ['Hi! '.repeat(340),'안녕하세요. '.repeat(150)]){
  const chunks=engine.chunkText(text);
  assert.ok(chunks.length>1);
  assert.ok(chunks.every(c=>new TextEncoder().encode(c).length<=450));
  assert.ok(chunks.length<=20);
 }
});
test('rejects overlength input and blanks',()=>{
 const engine=makeEngine();
 assert.throws(()=>engine.chunkText('a'.repeat(8001)),/8,000/);
 assert.throws(()=>engine.chunkText('  '),/Nothing/);
});
test('MyMemory translates the supplied target pair and exposes source',async()=>{
 const calls=[];
 const engine=makeEngine({fetch:async u=>{
  calls.push(new URL(u));
  return {ok:true,json:async()=>({responseStatus:200,responseData:{translatedText:'안녕하세요'}})};
 }});
 const r=await engine.translate({text:'hello',source:'en',target:'ko'});
 assert.equal(r.text,'안녕하세요');
 assert.equal(r.provider,'MyMemory');
 assert.equal(calls[0].searchParams.get('langpair'),'en|ko');
 assert.equal(r.segments,1);
});
test('MyMemory provider errors are propagated without fake success',async()=>{
 const engine=makeEngine({fetch:async()=>({ok:true,json:async()=>({responseStatus:429,responseDetails:'LIMIT EXCEEDED'})})});
 await assert.rejects(()=>engine.translate({text:'Something',source:'en',target:'ko'}),/LIMIT EXCEEDED/);
});
test('Auto routes to MyMemory when on-device API is absent',async()=>{
 const engine=makeEngine({fetch:async()=>({ok:true,json:async()=>({responseStatus:200,responseData:{translatedText:'Hello'}})})});
 const result=await engine.translate({text:'안녕',source:'ko',target:'en',provider:'auto'});
 assert.equal(result.provider,'MyMemory');
});
test('Device translation requires preparation when model is downloadable',async()=>{
 let created=0;
 const Translator={
  availability:async()=> 'downloadable',
  create:async()=>{created++;return {translate:async()=> '안녕하세요',destroy(){}}}
 };
 const engine=makeEngine({Translator});
 await assert.rejects(()=>engine.translate({text:'Hello',source:'en',target:'ko',provider:'device'}),/Prepare model/);
 assert.equal(created,0);
 await engine.prepareDevice('en','ko');
 const result=await engine.translate({text:'Hello',source:'en',target:'ko',provider:'device'});
 assert.equal(result.provider,'Edge on-device');
 engine.dispose();
});
test('Quality warnings flag changed numerals and multi-section context',()=>{
 const warnings=makeEngine().inspect('Meet me at 7:30','오후 여덟 시에 만나요','ko',2);
 assert.ok(warnings.some(w=>w.includes('numbers')));
 assert.ok(warnings.some(w=>w.includes('Sections')));
});
test('main app loads the same engine deployed by GitHub Pages',()=>{
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
 const workflow=fs.readFileSync(path.join(__dirname,'..','.github','workflows','pages.yml'),'utf8');
 assert.match(html,/src="\.\/translation-engine\.js"/);
 assert.match(html,/id="engine"/);
 assert.match(workflow,/cp index\.html benchmark\.html translation-engine\.js public\//);
});