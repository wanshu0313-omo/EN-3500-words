import {test} from 'node:test';
import assert from 'node:assert/strict';
import {derive,dayKey,type Review} from './study.ts';
const at=Date.UTC(2026,10,18,0);
function event(id:string,rating:Review['rating'],time:number):Review{return{id,wordId:1,rating,at:time}}
test('successful spaced recalls fall on days 1, 3, 7, 14, 30',()=>{
 const list:Review[]=[];let next=at;for(const [i,day] of [1,3,7,14,30].entries()){list.push(event(String(i),'good',next));const p=derive(list)[1];assert.equal(p.due,at+day*86400000);next=p.due}
});
test('retries are idempotent and out of order sync is deterministic',()=>{const a=event('a','good',at),b=event('b','hard',at+1000);assert.deepEqual(derive([b,a,a]),derive([a,b]));assert.equal(derive([a,a])[1].stage,1)});
test('forgotten words return in 10 minutes and reset intervals',()=>{const p=derive([event('a','good',at),event('b','again',at+86400000)])[1];assert.equal(p.stage,0);assert.equal(p.due,at+86400000+600000);assert.equal(p.lapses,1)});
test('study day uses Tokyo midnight',()=>{assert.equal(dayKey(Date.UTC(2026,10,18,14,59)),'2026-11-18');assert.equal(dayKey(Date.UTC(2026,10,18,15,0)),'2026-11-19')});
test('immediate extra practice does not skip spaced reviews',()=>{const p=derive([event('a','good',at),event('b','good',at+1000),event('c','good',at+2000)])[1];assert.equal(p.stage,1);assert.equal(p.due,at+86400000)});
