import {readFile} from 'node:fs/promises';
import path from 'node:path';
// Read raster headers at build time so image loading never changes article height.
export async function imageDimensions(file) {
 const b=await readFile(file);
 if(b.toString('ascii',0,3)==='GIF') return [b.readUInt16LE(6),b.readUInt16LE(8)];
 if(file.endsWith('.svg')) {
  const svg=b.toString('utf8');
  const w=svg.match(/<svg[^>]*\bwidth="([\d.]+)"/)?.[1];
  const h=svg.match(/<svg[^>]*\bheight="([\d.]+)"/)?.[1];
  if(w&&h)return [Number(w),Number(h)];
 }
 if(b.toString('ascii',1,4)==='PNG') return [b.readUInt32BE(16),b.readUInt32BE(20)];
 if(b[0]===255&&b[1]===216){
  let i=2;
  while(i<b.length-9){
   if(b[i]!==255){i++;continue;}
   const marker=b[i+1];i+=2;
   if(marker===216||marker===217)continue;
   const length=b.readUInt16BE(i);
   if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker))return [b.readUInt16BE(i+5),b.readUInt16BE(i+3)];
   if(length<2)break;i+=length;
  }
 }
 return null;
}
export async function stabilizeImages(html,root){
 const images=[...html.matchAll(/<img\b[^>]*>/g)];
 for(const [tag] of images){
  if(/width="/.test(tag)&&/height="/.test(tag))continue;
  const src=tag.match(/src="[^"]*assets\/([^"]+)"/)?.[1];
  if(!src||! /\.(png|jpe?g|gif|svg)$/i.test(src))continue;
  const size=await imageDimensions(path.join(root,'public/assets',src));
  if(size)html=html.replace(tag,tag.replace(/>$/,` width="${size[0]}" height="${size[1]}">`));
 }
 return html;
}
