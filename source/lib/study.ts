export type Review = {id:string;wordId:number;rating:'again'|'hard'|'good';at:number};
export type Progress = {stage:number;due:number;last:number;rating:Review['rating'];lapses:number};
export const gaps=[1,2,4,7,16,30];
export function derive(events:Review[]):Record<number,Progress>{
 const out:Record<number,Progress>={};const ids=new Set<string>();
 for(const e of [...events].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id))){
 if(ids.has(e.id))continue;ids.add(e.id);const p=out[e.wordId];
 const stage=e.rating==='good'?(p&&p.stage>0&&e.at<p.due?p.stage:Math.min((p?.stage||0)+1,6)):e.rating==='again'?0:(p?.stage||0);
 const delay=e.rating==='again'?600000:e.rating==='hard'?86400000:gaps[Math.max(0,stage-1)]*86400000;
 const due=e.rating==='good'&&p&&p.stage>0&&e.at<p.due?p.due:e.at+delay;
 out[e.wordId]={stage,due,last:e.at,rating:e.rating,lapses:(p?.lapses||0)+(e.rating==='again'?1:0)};
 }return out;
}
export function dayKey(at:number){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));}
