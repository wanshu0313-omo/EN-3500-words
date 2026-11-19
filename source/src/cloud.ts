import type {Review} from '../lib/study.ts';
export type Session={access_token:string;refresh_token:string;expires_in?:number;expires_at:number;user:{id:string;email?:string}};
declare global{interface Window{IELTS_CONFIG?:{supabaseUrl:string;supabaseKey:string}}}
const config=typeof window!=='undefined'?window.IELTS_CONFIG:undefined;
const url=(config?.supabaseUrl||'').replace(/\/$/,'');
const key=config?.supabaseKey||'';
export const configured=Boolean(/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)&&key&&(key.startsWith('sb_publishable_')||key.startsWith('eyJ')));
const storageKey='ielts-auth-'+url;
let refreshing:Promise<Session>|null=null;
export function readSession():Session|null{try{return JSON.parse(localStorage.getItem(storageKey)||'null')}catch{return null}}
function save(s:Session){s.expires_at=Date.now()+(s.expires_in||3600)*1000;localStorage.setItem(storageKey,JSON.stringify(s));return s}
async function request(path:string,init:RequestInit={},token?:string){
 const r=await fetch(url+path,{...init,headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...init.headers}});
 if(!r.ok){const data=await r.json().catch(()=>({})) as Record<string,string>;throw Error(data.msg||data.error_description||data.message||data.error||'云端请求失败 ('+r.status+')')}
 return r;
}
export async function login(email:string,password:string){const r=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});return save(await r.json() as Session)}
export async function signup(email:string,password:string){const r=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password})});const data=await r.json() as Session;if(data.access_token)return save(data);return null}
export async function getSession():Promise<Session>{
 const s=readSession();if(!s)throw Error('请重新登录');if(s.expires_at>Date.now()+60000)return s;
 if(!refreshing){const refresh=async()=>{const latest=readSession();if(latest&&latest.expires_at>Date.now()+60000)return latest;const r=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:latest?.refresh_token||s.refresh_token})});return save(await r.json() as Session)};
 refreshing=(async()=>{if(typeof navigator!=='undefined'&&navigator.locks)return await navigator.locks.request(storageKey,refresh);return await refresh()})().finally(()=>{refreshing=null});}
 return await refreshing!;
}
export async function verifySession(){const s=await getSession();await request('/auth/v1/user',{},s.access_token);return s}
export async function logout(){const s=readSession();if(s){try{await request('/auth/v1/logout?scope=local',{method:'POST'},s.access_token)}catch{}}localStorage.removeItem(storageKey)}
export function validateReview(e:unknown):e is Review{
 if(!e||typeof e!=='object')return false;const x=e as Review;return typeof x.id==='string'&&/^[a-f0-9-]{36}$/i.test(x.id)&&Number.isInteger(x.wordId)&&x.wordId>=1&&x.wordId<=80&&['again','hard','good'].includes(x.rating)&&Number.isFinite(x.at)&&x.at>0;
}
export async function cloudFetch(_path:string,init:RequestInit={},expectedUser?:string):Promise<Response>{
 const s=await getSession();if(expectedUser&&s.user.id!==expectedUser)throw Error('账户已切换，请刷新页面');
 if(init.method==='POST'){
 const body=JSON.parse(String(init.body));
 if(body.kind==='target'){
 if(!Number.isInteger(body.target)||body.target<20||body.target>150)throw Error('每日目标无效');
 await request('/rest/v1/ielts_preferences?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:JSON.stringify({user_id:s.user.id,target:body.target})},s.access_token);
 }else{
 if(!validateReview(body.event))throw Error('学习记录无效');
 await request('/rest/v1/ielts_reviews?on_conflict=user_id,id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates'},body:JSON.stringify({user_id:s.user.id,id:body.event.id,word_id:body.event.wordId,rating:body.event.rating,at:body.event.at})},s.access_token);
 }
 return Response.json({ok:true});
 }
 const events:Review[]=[];
 // Paginate: PostgREST normally returns at most 1000 rows per request.
 for(let offset=0;;offset+=500){
 const r=await request(`/rest/v1/ielts_reviews?select=id,word_id,rating,at&user_id=eq.${encodeURIComponent(s.user.id)}&order=at.asc,id.asc&offset=${offset}&limit=500`,{},s.access_token);
 const rows=await r.json() as {id:string;word_id:number;rating:Review['rating'];at:number}[];
 events.push(...rows.map(e=>({id:e.id,wordId:e.word_id,rating:e.rating,at:Number(e.at)})));if(rows.length<500)break;
 }
 const r=await request('/rest/v1/ielts_preferences?select=target&user_id=eq.'+encodeURIComponent(s.user.id),{},s.access_token);const prefs=await r.json() as {target:number}[];
 return Response.json({events,target:prefs[0]?.target??100});
}
