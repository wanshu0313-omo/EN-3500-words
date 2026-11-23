import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cloudFetch,validateReview} from './cloud.ts';
const data=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>data.get(k)||null,setItem:(k:string,v:string)=>data.set(k,v),removeItem:(k:string)=>data.delete(k)}});
const user='11111111-1111-4111-8111-111111111111';
data.set('ielts-auth-',JSON.stringify({access_token:'test',refresh_token:'refresh',expires_at:Date.now()+3600000,user:{id:user}}));
const e={id:'22222222-2222-4222-8222-222222222222',wordId:1,rating:'good',at:1234};
test('cloud insert is idempotent and always scopes to authenticated user',async()=>{
 const calls:{url:string;options:RequestInit}[]=[];
 globalThis.fetch=async(input,options={})=>{calls.push({url:String(input),options});return new Response(null,{status:201})};
 await cloudFetch('/api/progress',{method:'POST',body:JSON.stringify({event:e})});
 assert.match(calls[0].url,/on_conflict=user_id,id/);assert.equal((calls[0].options.headers as Record<string,string>).Prefer,'resolution=ignore-duplicates');
 assert.equal(JSON.parse(String(calls[0].options.body)).user_id,user);
});
test('cloud loading paginates beyond the REST default limit',async()=>{
 const calls:string[]=[];globalThis.fetch=async(input)=>{const u=String(input);calls.push(u);if(u.includes('preferences'))return Response.json([{target:80}]);const length=u.includes('offset=0&')?500:1;return Response.json(Array.from({length},(_,i)=>({id:String(calls.length)+'-'+i,word_id:1,rating:'good',at:1234})))};
 const r=await cloudFetch('/api/progress');const result=await r.json() as {events:unknown[];target:number};assert.equal(result.events.length,501);assert.equal(result.target,80);assert.equal(calls.length,3);assert.ok(calls.every(u=>u.includes(user)));
});
test('invalid queued review data is rejected before network access',async()=>{assert.equal(validateReview(e),true);assert.equal(validateReview({...e,wordId:1000}),true);assert.equal(validateReview({...e,wordId:1001}),false);assert.equal(validateReview({...e,rating:'unknown'}),false);assert.equal(validateReview({...e,at:NaN}),false);await assert.rejects(()=>cloudFetch('/api/progress',{method:'POST',body:JSON.stringify({event:{...e,wordId:1001}})}));});
