// Keep the original narrator and use the measured word intervals. Only load the tapped group.
export type OriginalClip={file:string;start:number;duration:number};
let context:AudioContext|null=null;
let current:AudioBufferSourceNode|null=null;
let generation=0;
const groups=new Map<string,Promise<AudioBuffer>>();
export function stopOriginal(){generation++;if(current){try{current.stop()}catch{}current=null}}
export async function playOriginal(clip:OriginalClip){
 stopOriginal();const token=generation;
 const AudioContextClass=window.AudioContext||(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
 if(!AudioContextClass)throw Error('此浏览器不支持原书逐词播放，请使用 Safari 或 Chrome。');
 context??=new AudioContextClass();
 // Resume during the tap before waiting for network loading, including on iPhone.
 await context.resume();
 const ctx=context;
 let pending=groups.get(clip.file);
 if(!pending){
  const url=new URL('./'+clip.file,window.location.href);
  pending=(async()=>{const r=await fetch(url);if(!r.ok)throw Error('原书音频未完整上传或网络连接失败。');const data=await r.arrayBuffer();return await ctx.decodeAudioData(data)})();
  groups.set(clip.file,pending);
  // Bound decoded memory use to three recently used groups.
  if(groups.size>3){const oldest=groups.keys().next().value;if(oldest&&oldest!==clip.file)groups.delete(oldest)}
  const loading=pending;loading.catch(()=>{if(groups.get(clip.file)===loading)groups.delete(clip.file)});
 }
 const buffer=await pending;
 if(token!==generation)return;
 if(clip.start<0||clip.duration<=0||clip.start+clip.duration>buffer.duration+.08)throw Error('录音时间点与音频不匹配，请更新网页和音频文件。');
 const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);current=source;
 source.onended=()=>{source.disconnect();if(current===source)current=null};
 source.start(0,clip.start,Math.min(clip.duration,buffer.duration-clip.start));
}
