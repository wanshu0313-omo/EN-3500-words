import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {words,tracks} from './words.ts';
import clips from './original-audio.json' with {type:'json'};
import sources from './original-audio-sources.json' with {type:'json'};
test('all 1000 book entries have exactly one original audio interval',()=>{
 assert.equal(clips.length,1000);assert.deepEqual(clips.map(c=>c.id),words.map(w=>w.id));
 for(const c of clips){assert.equal(c.word,words[c.id-1].word);assert.ok(c.start>=0&&c.duration>.4&&c.duration<2.5,c.word);const t=tracks.find(t=>t.from<=c.id&&c.id<=t.to)!;assert.equal(c.source,t.id+'.mp3');assert.equal(c.file,'audio/original/'+t.id+'.m4a')}
});
test('all 25 packaged AAC groups exist and all 40 intervals fit without overlap',()=>{
 assert.equal(sources.length,25);
 for(const s of sources){
  const b=readFileSync(new URL('../public/audio/original/'+s.track+'.m4a',import.meta.url));assert.equal(b.toString('ascii',4,8),'ftyp');assert.ok(b.length>10000);
  const group=clips.filter(c=>c.source===s.track+'.mp3');assert.equal(group.length,40);
  for(let i=0;i<group.length;i++){const c=group[i];assert.ok(c.start+c.duration<=s.duration+.001);assert.ok(c.start<c.speechStart&&c.start+c.duration>c.speechEnd);if(i)assert.ok(group[i-1].start+group[i-1].duration<c.start)}
  assert.ok(Math.abs(s.measuredDelay)<.001);assert.ok(s.candidateMatches>=29);
 }
});
test('approved first 40 pilot boundaries remain unchanged',()=>{
 const pilot=JSON.parse(readFileSync(new URL('./fixtures/pilot-audio40.json',import.meta.url),'utf8'));
 for(const old of pilot){const c=clips[old.id-1];assert.equal(c.word,old.word);assert.ok(Math.abs(c.start-old.decodedStart)<.003);assert.ok(Math.abs(c.duration-old.duration)<.003)}
});
