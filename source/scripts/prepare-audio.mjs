import {cpSync,existsSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const source=fileURLToPath(new URL('../../audio/',import.meta.url));
const dest=fileURLToPath(new URL('../public/audio/',import.meta.url));
if(existsSync(source)){mkdirSync(dest,{recursive:true});cpSync(source,dest,{recursive:true})}
if(!existsSync(new URL('../public/audio/original/0001-0040.m4a',import.meta.url)))throw Error('请保留仓库根目录的 audio 文件夹；它包含网站需要的原书音频。');
