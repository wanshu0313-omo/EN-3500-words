import {test} from 'node:test';
import assert from 'node:assert/strict';
import {playOriginal,stopOriginal} from './original-player.ts';
const starts:number[][]=[],nodes:{stop:()=>void;stopped:boolean}[]=[];let fetches=0,release:(r:Response)=>void;
const buffer={duration:80};
class FakeContext{
 destination={};async resume(){}async decodeAudioData(){return buffer}
 createBufferSource(){const node={buffer:null as unknown,stopped:false,onended:null as unknown,connect(){},disconnect(){},start(...args:number[]){starts.push(args)},stop(){this.stopped=true}};nodes.push(node);return node}
}
Object.defineProperty(globalThis,'window',{value:{AudioContext:FakeContext,location:{href:'https://example.test/repo/'}},configurable:true});
test('rapid switches play only the newest word and load a shared group once',async()=>{
 globalThis.fetch=()=>{fetches++;return new Promise<Response>(r=>{release=r})};
 const first=playOriginal({file:'audio/original/a.m4a',start:1,duration:.8});await Promise.resolve();await Promise.resolve();
 const second=playOriginal({file:'audio/original/a.m4a',start:3,duration:.9});await Promise.resolve();await Promise.resolve();
 release(new Response(new ArrayBuffer(8)));await Promise.all([first,second]);
 assert.equal(fetches,1);assert.deepEqual(starts,[[0,3,.9]]);stopOriginal();assert.equal(nodes[0].stopped,true);
});
test('a stopped pending load cannot start playing when it eventually finishes',async()=>{
 const before=starts.length;const pending=playOriginal({file:'audio/original/b.m4a',start:5,duration:1});await Promise.resolve();await Promise.resolve();stopOriginal();release(new Response(new ArrayBuffer(8)));await pending;assert.equal(starts.length,before);
});
test('failed group loads can be retried instead of poisoning the cache',async()=>{
 let calls=0;globalThis.fetch=async()=>{calls++;return calls===1?new Response(null,{status:404}):new Response(new ArrayBuffer(8))};
 const clip={file:'audio/original/failure.m4a',start:7,duration:1};await assert.rejects(()=>playOriginal(clip));await playOriginal(clip);assert.equal(calls,2);assert.deepEqual(starts.at(-1),[0,7,1]);
});
