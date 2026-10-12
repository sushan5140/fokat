/* Fokat 2.0a: browser Translator API + segmented MyMemory. No secret keys. */
const FokatTranslation=(()=>{
 const encoder=new TextEncoder(),sessions=new Map();
 const bytes=s=>encoder.encode(s).length;
 function chunkText(input,limit=450){
  if(typeof input!=='string'||!input.trim())throw Error('Nothing to translate.');
  const text=input.trim();
  if(text.length>8000)throw Error('Input exceeds 8,000 characters; send smaller sections.');
  const chunks=[];let current='';
  const flush=()=>{if(current.trim())chunks.push(current.trim());current=''};
  for(const token of text.match(/\S+\s*|\s+/gu)||[]){
   if(bytes(current+token)<=limit){current+=token;continue}
   flush();
   if(bytes(token)<=limit){current=token;continue}
   for(const ch of token){if(bytes(current+ch)>limit)flush();current+=ch}
  }
  flush();
  if(chunks.length>20)throw Error('Too many sections; send smaller passages.');
  return chunks;
 }
 function inspect(input,output,target,segments){
  const warnings=[];
  if(target==='ko'&&!/[가-힣]/u.test(output))warnings.push('Result may not be Korean.');
  if(target==='en'&&/[가-힣]/u.test(output)&&!/[a-z]/i.test(output))warnings.push('Result may still be Korean.');
  if(input.trim().toLowerCase()===output.trim().toLowerCase())warnings.push('Result matches the input.');
  const numbers=input.match(/\d+(?:[.,:]\d+)*/g)||[];
  if(numbers.some(x=>!output.includes(x)))warnings.push('Check numbers, dates and times.');
  if(segments>1)warnings.push('Sections translated independently; verify context.');
  return warnings;
 }
 const supported=()=>typeof Translator!=='undefined'&&typeof Translator.create==='function';
 async function deviceAvailability(source,target){
  if(!supported())return 'unsupported';
  try{return await Translator.availability({sourceLanguage:source,targetLanguage:target})}
  catch{return 'unavailable'}
 }
 async function prepareDevice(source,target,onProgress){
  if(!supported())throw Error('Built-in Translator API is not supported.');
  const key=source+'>'+target;if(sessions.has(key))return;
  // For a downloadable model, invoke this from an explicit user-click handler.
  const session=await Translator.create({sourceLanguage:source,targetLanguage:target,
   monitor(m){m.addEventListener('downloadprogress',e=>{
    onProgress?.('Downloading local language pack '+Math.round(100*e.loaded/(e.total||1))+'%');
   })}});
  sessions.set(key,session);
 }
 async function local(text,source,target,signal){
  const key=source+'>'+target;
  if(!sessions.has(key)){
   const a=await deviceAvailability(source,target);
   if(a!=='available')throw Error(a==='downloadable'||a==='downloading'?'Language pack not installed. Click Prepare model first.':'On-device translation not available on this browser/device.');
   await prepareDevice(source,target);
  }
  const output=String(await sessions.get(key).translate(text,{signal})).trim();
  if(!output)throw Error('On-device translator returned empty output.');
  return {text:output,provider:'Edge on-device',segments:1,warnings:inspect(text,output,target,1)};
 }
 async function online(text,source,target,signal,onProgress){
  const parts=chunkText(text),out=[];
  for(let i=0;i<parts.length;i++){
   if(signal?.aborted)throw Error('Translation stopped.');
   onProgress?.('Translating section '+(i+1)+'/'+parts.length+'…');
   const ctrl=new AbortController(),abort=()=>ctrl.abort();
   signal?.addEventListener('abort',abort,{once:true});
   const timeout=setTimeout(()=>ctrl.abort(),15000);
   try{
    const u=new URL('https://api.mymemory.translated.net/get');
    u.searchParams.set('q',parts[i]);u.searchParams.set('langpair',source+'|'+target);
    const r=await fetch(u.toString(),{signal:ctrl.signal});
    if(!r.ok)throw Error('MyMemory HTTP '+r.status);
    const data=await r.json();
    if(data.responseStatus!==200||!data.responseData?.translatedText)throw Error('MyMemory: '+String(data.responseDetails||data.responseStatus||'no result'));
    const translated=String(data.responseData.translatedText).trim();
    if(!translated)throw Error('Empty provider result.');
    out.push(translated);
   }finally{clearTimeout(timeout);signal?.removeEventListener('abort',abort)}
  }
  const translation=out.join(' ');
  return {text:translation,provider:'MyMemory',segments:parts.length,warnings:inspect(text,translation,target,parts.length)};
 }
 async function translate({text,source,target,provider='online',signal,onProgress}){
  if(!['en','ko'].includes(source)||!['en','ko'].includes(target)||source===target)throw Error('Select English ↔ Korean.');
  if(provider==='online')return online(text,source,target,signal,onProgress);
  if(provider==='device')return local(text,source,target,signal);
  if(provider==='auto'){
   if(await deviceAvailability(source,target)==='available'){
    try{return await local(text,source,target,signal)}
    catch(e){if(signal?.aborted)throw e;onProgress?.('Local model unavailable; using MyMemory.')}
   }
   return online(text,source,target,signal,onProgress);
  }
  throw Error('Unknown translation engine.');
 }
 function dispose(){for(const s of sessions.values())s.destroy?.();sessions.clear()}
 return {chunkText,deviceAvailability,prepareDevice,translate,inspect,dispose};
})();