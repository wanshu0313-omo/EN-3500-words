import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {words,tracks} from './words.ts';
test('basic vocabulary has exactly 1000 unique consecutive bilingual entries',()=>{
 assert.equal(words.length,1000);assert.deepEqual(words.map(w=>w.id),Array.from({length:1000},(_,i)=>i+1));assert.equal(new Set(words.map(w=>w.word)).size,1000);
 for(const w of words){for(const key of ['word','meaning','meaningJa','related'] as const)assert.ok(w[key].trim(),`${w.id}: ${key}`)}
});
test('book numbering stays aligned at OCR trouble spots and both endpoints',()=>{
 for(const [id,word] of [[1,'being'],[80,'responsibility'],[120,'setting'],[195,'absolutely'],[271,'ship'],[621,'unexpected'],[861,'float'],[875,'sore'],[1000,'civil engineering']] as const)assert.equal(words[id-1].word,word);
});
test('25 original tracks partition the entire 1000 word catalog without gaps',()=>{
 assert.equal(tracks.length,25);const ids:number[]=[];
 for(const t of tracks){assert.equal(t.to-t.from+1,40);for(let id=t.from;id<=t.to;id++)ids.push(id);assert.ok(existsSync(new URL('../public/audio/'+t.id+'.mp3',import.meta.url)),t.id)}
 assert.deepEqual(ids,words.map(w=>w.id));
});
test('original first 80 bilingual entries and progress IDs are preserved',()=>{
 const previous=JSON.parse(readFileSync(new URL('./fixtures/original80.json',import.meta.url),'utf8'));assert.deepEqual(words.slice(0,80),previous);
});
