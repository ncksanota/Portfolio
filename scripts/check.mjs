import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const siteURL=new URL(process.env.SITE_URL||'https://ncksanota.github.io/Portfolio/');
if(!siteURL.pathname.endsWith('/'))siteURL.pathname+='/';
const errors=[];
async function files(dir){const list=[];for(const d of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,d.name);if(d.isDirectory())list.push(...await files(p));else list.push(p);}return list;}
const all=await files(root),html=all.filter(p=>p.endsWith('.html'));
const expected=['index.html','About/index.html','fohlio/index.html','Nebulink/index.html','WAO-Shop/index.html','Unearth/index.html','Design-System/index.html','404.html'];
for(const p of expected)if(!all.includes(path.join(root,p)))errors.push(`Missing route: ${p}`);
let references=0;
for(const file of html){
 const content=await readFile(file,'utf8'),rel=path.relative(root,file);
 if((content.match(/<h1\b/g)||[]).length!==1)errors.push(`${rel}: expected one h1`);
 if(!content.includes('<title>')||!content.includes('name="description"'))errors.push(`${rel}: missing metadata`);
 if(/framerusercontent|events\.framer|framer\.com/.test(content))errors.push(`${rel}: hosted Framer dependency`);
 for(const img of content.matchAll(/<img\b[^>]*>/g))if(!/\balt="[^"]*"/.test(img[0]))errors.push(`${rel}: image has no alt text`);
 for(const match of content.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  let url=match[1];
  let siteAbsolute=false;
  if(url.startsWith(siteURL.href)){url=url.slice(siteURL.href.length);siteAbsolute=true;}
  if(/^(https?:|mailto:|data:)/.test(url))continue;
  const [pathname,fragment]=url.split('#');
  let resolved=path.resolve(siteAbsolute?root:path.dirname(file),decodeURIComponent(pathname||(siteAbsolute?'index.html':path.basename(file))));
  if(!resolved.startsWith(root+path.sep)&&resolved!==root){errors.push(`${rel}: reference leaves site: ${url}`);continue;}
  try{const s=await stat(resolved);if(s.isDirectory())resolved=path.join(resolved,'index.html');await stat(resolved);references++;
   if(fragment){const target=await readFile(resolved,'utf8');if(!target.includes(`id="${fragment}"`))errors.push(`${rel}: missing anchor ${url}`);}
  }catch{errors.push(`${rel}: broken reference ${url}`);}
 }
}
for(const file of html){
 const content=await readFile(file,'utf8');
 for(const match of content.matchAll(/<meta[^>]+(?:property="og:image"|name="twitter:image")[^>]+content="([^"]+)"/g)){
  if(!match[1].startsWith(siteURL.href)){errors.push('Unexpected social image origin: '+match[1]);continue;}
  try{await stat(path.join(root,match[1].slice(siteURL.href.length)));references++;}catch{errors.push('Missing social image: '+match[1]);}
 }
}
for(const file of all.filter(p=>p.endsWith('.css'))){
 const css=await readFile(file,'utf8');
 for(const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
  if(/^https?:/.test(match[1])){errors.push('Remote CSS asset: '+match[1]);continue;}
  try{await stat(path.resolve(path.dirname(file),match[1]));references++;}catch{errors.push('Missing CSS asset: '+match[1]);}
 }
}
for(const file of all){const s=await stat(file);if(s.size>95*1024*1024)errors.push('File too large for ordinary Git: '+file);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Verified ${html.length} HTML pages and ${references} local references; all routes, anchors, fonts, and media resolve. No Framer runtime or CDN dependencies.`);
