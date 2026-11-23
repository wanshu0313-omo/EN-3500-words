import data from './words-data.json' with {type:'json'};
export type Word = {id:number;word:string;pos:string;meaning:string;meaningJa:string;related:string;phrase:string;sourcePage?:number};
export const words:Word[]=data;
export const tracks=Array.from({length:25},(_,i)=>{const from=i*40+1,to=from+39,id=String(from).padStart(4,'0')+'-'+String(to).padStart(4,'0');return {id,label:'基础词 '+String(from).padStart(4,'0')+'—'+String(to).padStart(4,'0'),from,to}});
