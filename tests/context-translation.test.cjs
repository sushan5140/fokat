const {test}=require('node:test');
const assert=require('node:assert/strict');
const handler=require('../api/translate-context.js');
function response(){return {statusCode:200,data:null,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.data=v;return this},end(){return this}}}
const valid={text:'Can we meet tomorrow?',source:'en',target:'ko',style:'polite',relationship:'professor',situation:'school',history:[{speaker:'other',text:'Are you free next week?'}]};
test('rejects invalid style and history without calling provider',async()=>{
 const req={method:'POST',headers:{origin:'https://sushan5140.github.io'},body:{...valid,style:'anything'}},res=response();
 const old=process.env.SMART_TRANSLATION_API_KEY;
 process.env.SMART_TRANSLATION_API_KEY='test';process.env.SMART_TRANSLATION_BASE_URL='https://example.test';process.env.SMART_TRANSLATION_MODEL='fake';
 await handler(req,res);assert.equal(res.statusCode,400);
 if(old===undefined)delete process.env.SMART_TRANSLATION_API_KEY;else process.env.SMART_TRANSLATION_API_KEY=old;
 delete process.env.SMART_TRANSLATION_BASE_URL;delete process.env.SMART_TRANSLATION_MODEL;
});
test('responds unavailable if server-side credentials are missing',async()=>{
 delete process.env.SMART_TRANSLATION_API_KEY;delete process.env.SMART_TRANSLATION_BASE_URL;delete process.env.SMART_TRANSLATION_MODEL;
 const res=response();await handler({method:'POST',headers:{origin:'https://sushan5140.github.io'},body:valid},res);
 assert.equal(res.statusCode,503);assert.match(res.data.error,/not configured/);
});
test('rejects unknown origin',async()=>{
 const res=response();await handler({method:'POST',headers:{origin:'https://untrusted.example'},body:valid},res);
 assert.equal(res.statusCode,403);
});
