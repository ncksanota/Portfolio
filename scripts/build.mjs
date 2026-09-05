import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {shell,button} from './lib/ui.mjs';
import {home,about} from './lib/pages.mjs';
import {specimen} from './lib/specimen.mjs';
import {caseStudy} from './lib/case-study.mjs';
import {stabilizeImages} from './lib/media.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const siteURL=new URL(process.env.SITE_URL||'https://ncksanota.github.io/Portfolio/');
if(!siteURL.pathname.endsWith('/'))siteURL.pathname+='/';
const projects=JSON.parse(await readFile(path.join(root,'src/projects.json'),'utf8'));
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
await cp(path.join(root,'public'),out,{recursive:true});
async function page(file,options){await mkdir(path.dirname(path.join(out,file)),{recursive:true});await writeFile(path.join(out,file),await stabilizeImages(shell({...options,siteURL}),root));}
await page('index.html',{title:'Product Designer',description:'Nicolas Sanabria is a product designer in New York, turning complex workflows into clear, useful experiences. Explore selected work.',body:home(projects)});
await page('About/index.html',{title:'About',description:'Meet Nicolas Sanabria, a Colombian product designer based in New York.',body:about(),base:'../',pathname:'About/'});
for(const [i,project] of projects.entries()){
 const content=JSON.parse(await readFile(path.join(root,'src/content',project.slug+'.json'),'utf8'));
 await page(project.slug+'/index.html',{title:content.title,description:project.description,body:caseStudy(project,content,projects.find(p=>p.slug===project.nextSlug)||projects[(i+1)%projects.length]),base:'../',pathname:project.slug+'/',socialImage:content.socialImage});
}
await page('404.html',{title:'Page not found',description:'This page could not be found.',pathname:null,base:siteURL.href,body:`<main id="main" class="not-found wrap"><p class="eyebrow">404 / A small detour</p><h1>LET’S GET<br>YOU BACK.</h1><p>That page is no longer here. There’s plenty of work to explore.</p>${button('Back to the portfolio',siteURL.href)}</main>`});
await page('system/index.html',{title:'Design language',description:'Typography, tokens, and components for the Nicolas Sanabria portfolio.',body:specimen(),base:'../',pathname:'system/'});
await writeFile(path.join(out,'.nojekyll'),'');
console.log(`Built Home, About, ${projects.length} case studies, design specimen, and 404 in dist/`);
