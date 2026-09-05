import {readFile, writeFile, mkdir, cp, readdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const siteURL = new URL(process.env.SITE_URL || 'https://ncksanota.github.io/Portfolio/');
if (!siteURL.pathname.endsWith('/')) siteURL.pathname += '/';
const projects = JSON.parse(await readFile(path.join(root, 'src/projects.json'), 'utf8'));
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});
await cp(path.join(root, 'public'), out, {recursive: true});

const nav = (base, active = '') => `<header class="site-header"><div class="nav-wrap"><a href="${base}" class="brand" aria-label="Nicolas Sanabria — home"><img src="${base}assets/logo.svg" width="80" height="53" alt=""></a><p class="availability">Open and looking for full time opportunities</p><nav aria-label="Main navigation"><a href="${base}#portfolio" ${active === 'portfolio' ? 'aria-current="page"' : ''}>Portfolio</a><a href="${base}About/" ${active === 'about' ? 'aria-current="page"' : ''}>About</a></nav></div></header>`;
const footer = (base) => `<footer class="site-footer"><div class="footer-grid"><div><p class="eyebrow">Links 🔗</p><a href="https://www.linkedin.com/in/ncksanota/" target="_blank" rel="noopener noreferrer">Linkedin ↗</a><h4 class="resume-label">Resume</h4></div><div><p class="eyebrow">Say hey! 👋</p><div class="email-row"><a href="mailto:nicksanota@gmail.com">nicksanota@gmail.com</a><button type="button" data-copy-email aria-label="Copy email address">Copy</button></div><span class="copy-status" role="status" aria-live="polite"></span></div></div><p class="copyright">Nicolas Sanabria ©️ 2024</p></footer>`;

function shell(title, description, body, base = './', cls = '', pathname = '', socialImageFile = 'Se27uSPfxrflC01YaaGHXVaMms.png') {
  const pageURL = pathname === null ? null : new URL(pathname, siteURL).href;
  const socialImage = new URL(`assets/${socialImageFile}`, siteURL).href;
  const canonical = pageURL ? `<link rel="canonical" href="${esc(pageURL)}"><meta property="og:url" content="${esc(pageURL)}">` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#edff50"><title>${esc(title)} — Nicolas Sanabria</title><meta name="description" content="${esc(description)}">${canonical}<meta property="og:type" content="website"><meta property="og:site_name" content="Nicolas Sanabria"><meta property="og:title" content="${esc(title)} — Nicolas Sanabria"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(socialImage)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)} — Nicolas Sanabria"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(socialImage)}"><link rel="icon" href="${base}assets/FcKGaeV308Gr1frry5QgNy0JUe8.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}fonts.css"><link rel="stylesheet" href="${base}style.css?v=spechub-20260905b"><script src="${base}site.js" defer></script></head><body class="${esc(cls)}"><a class="skip-link" href="#main">Skip to content</a>${body}</body></html>`;
}

const featuredProjects = projects.filter((project) => project.featured !== false && !project.earlier);
const earlierProjects = projects.filter((project) => project.featured === false || project.earlier);
const cards = featuredProjects.map((project, index) => `<a class="project-card" href="./${esc(project.slug)}/"><img src="./assets/${esc(project.cover)}" alt="" loading="lazy" decoding="async" width="1440" height="900"${project.coverPosition ? ` style="object-position:${esc(project.coverPosition)}"` : ''}><div class="card-shade"></div><div class="card-text"><div class="card-heading"><h3><span>${String(index + 1).padStart(2, '0')}</span> ${esc(project.title)}</h3><span class="card-arrow" aria-hidden="true">↗</span></div><p class="project-type">${esc(project.type)}</p><p>${esc(project.description)}</p></div></a>`).join('');
const earlierWork = earlierProjects.length ? `<aside class="earlier-work" aria-labelledby="earlier-work-title"><p class="eyebrow" id="earlier-work-title">Earlier work</p>${earlierProjects.map((project) => `<a href="./${esc(project.slug)}/"><span><strong>${esc(project.title)}</strong><small>${esc(project.type)}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</aside>` : '';
const banner = `<div class="ticker" aria-label="Nicolas Sanabria. Product designer. Design for people."><div class="ticker-track" aria-hidden="true">${Array(2).fill('<span>NICOLAS SANABRIA</span><span class="ticker-star">✳</span><span>PRODUCT DESIGNER</span><span class="ticker-star">✳</span><span>DESIGN FOR PEOPLE</span><span class="ticker-star">✳</span>').join('')}</div></div>`;

await writeFile(path.join(out, 'index.html'), shell('Product Designer', 'Nicolas Sanabria is a product designer based in New York. Explore selected product design, UX research, and design system projects.', `${nav('./', 'portfolio')}<main id="main"><section class="hero"><div class="hero-panel"><img class="hero-portrait" src="./assets/WKcDRgRgaZFTbwOwsEZULjMzfJk.png" alt="Nicolas Sanabria in a sunlit garden" width="2364" height="2280" decoding="async" fetchpriority="high"><h1>PEOPLE-POWERED PIXELS<span aria-hidden="true">PEOPLE-POWERED PIXELS</span></h1><h2>Designing backward, thinking forwards</h2><p class="hero-intro">Hey! 👋🏼 I’m Nicolas a Product Designer <br>based in New York</p></div></section>${banner}<section id="portfolio" class="portfolio"><div class="portfolio-inner"><h2>PORTFOLIO.</h2><div class="project-list">${cards}${earlierWork}</div></div></section></main>${footer('./')}`, './', 'home', ''));

await mkdir(path.join(out, 'About'), {recursive: true});
await writeFile(path.join(out, 'About/index.html'), shell('About', 'Meet Nicolas Sanabria, a product designer based in New York City.', `${nav('../', 'about')}<main id="main" class="about"><section class="about-intro"><div><h1>Hey! My name is Nicolas Sanabria, I’m a product designer based in NYC.</h1><div class="about-copy"><p>I was born in Colombia, I've been working as a designer in some form or another for more than 7 years, with a focus on UX/UI and Product design for the past 3 years. I'm a creative thinker who enjoys creating strong brands through well-thought out products, leading creative teams, and coming up with user-centric solutions.</p><p>I believe great product design is a compromise between hitting business goals and meeting high user expectations.</p></div><a class="text-link" href="https://www.linkedin.com/in/ncksanota/" target="_blank" rel="noopener noreferrer">Linkedin ↗</a></div><img src="../assets/bi1YwoFLVknxKipJZLMWszlXVI.png" alt="Nicolas Sanabria on a New York rooftop" width="788" height="808" decoding="async"></section><section class="clients"><h2>Selected clients</h2><dl>${[['Daily Hugs', '2024'], ['Fintron', '2023'], ['Emdash', '2023'], ['Inbound', '2023'], ['Cathpoint', '2022']].map(([name, year]) => `<div><dt>${esc(name)}</dt><dd>${esc(year)}</dd></div>`).join('')}</dl></section><section class="get-in-touch"><h2>Let's get to know each other.<br><a href="mailto:nicksanota@gmail.com">Get in touch. ↗</a></h2></section></main>${footer('../')}`, '../', 'about-page', 'About/'));

const files = await readdir(path.join(root, 'src/content'));
for (const project of projects) {
  const file = `${project.slug}.json`;
  if (!files.includes(file)) continue;
  const content = JSON.parse(await readFile(path.join(root, 'src/content', file), 'utf8'));
  content.mediaLabels ||= {};
  for (const section of content.sections) {
    for (const [index, media] of (section.media || []).entries()) content.mediaLabels[media] ||= `${section.title}${section.media.length > 1 ? ` (image ${index + 1})` : ''}`;
  }

  const renderImage = (item, extraClass = '') => `<figure class="case-media rich-media ${esc(extraClass)}"><a href="../assets/${esc(item.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(item.alt)} at full size"><img src="../assets/${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy" decoding="async"></a>${item.caption ? `<figcaption>${esc(item.caption)}</figcaption>` : ''}</figure>`;
  const renderLegacyMedia = (media) => media.endsWith('.mp4')
    ? `<figure class="case-media video-media"><video controls playsinline preload="none" aria-label="${esc(content.title)} interface demonstration"><source src="../assets/${esc(media)}" type="video/mp4">Your browser does not support video. <a href="../assets/${esc(media)}">Download demonstration</a></video></figure>`
    : renderImage({src: media, alt: `${content.title} — ${content.mediaLabels?.[media] || 'project design and research artifact'}`}, 'legacy-media');
  const renderBlock = (block) => {
    if (typeof block === 'string') return `<p>${esc(block)}</p>`;
    if (block.heading) return `<h3>${esc(block.heading)}</h3>`;
    if (block.list) return `<ul>${block.list.map((text) => `<li>${esc(text)}</li>`).join('')}</ul>`;
    if (block.type === 'image') return renderImage(block);
    if (block.type === 'video') return `<figure class="case-media video-media rich-media"><video controls playsinline preload="none"${block.poster ? ` poster="../assets/${esc(block.poster)}"` : ''} aria-label="${esc(block.alt)}"><source src="../assets/${esc(block.src)}" type="video/mp4">Your browser does not support video. <a href="../assets/${esc(block.src)}">Download demonstration</a></video>${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''}</figure>`;
    if (block.type === 'comparison') return `<div class="comparison" role="group" aria-label="Design iteration comparison"><div>${renderImage(block.before, 'comparison-media')}<p class="comparison-label">${esc(block.before.label)}</p></div><div>${renderImage(block.after, 'comparison-media')}<p class="comparison-label">${esc(block.after.label)}</p></div></div>`;
    if (block.type === 'journey') return `<div class="journey"><p class="eyebrow">${esc(block.label)}</p><ol>${block.steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(step.title)}</strong><p>${esc(step.detail)}</p></li>`).join('')}</ol></div>`;
    if (block.type === 'relatedWork') return `<a class="related-work" href="../${esc(block.slug)}/"><span><small>${esc(block.eyebrow)}</small><strong>${esc(block.title)}</strong><p>${esc(block.text)}</p></span><span aria-hidden="true">↗</span></a>`;
    return '';
  };

  const sections = content.sections.map((section, index) => `<section class="case-section" id="${esc(section.id || `section-${index}`)}"><div class="section-label"><h2>${esc(section.title)}</h2>${section.date ? `<p class="eyebrow">${esc(section.date)}</p>` : ''}</div><div class="section-body">${(section.blocks || []).map(renderBlock).join('')}</div>${(section.media || []).map(renderLegacyMedia).join('')}</section>`).join('');
  const chapterNav = content.chapterNavigation ? `<nav class="chapter-nav" aria-label="Case study chapters"><ol>${content.sections.map((section) => `<li><a href="#${esc(section.id)}">${esc(section.chapterLabel || section.title)}</a></li>`).join('')}</ol></nav>` : '';
  const next = projects.find((candidate) => candidate.slug === project.nextSlug) || projects[(projects.indexOf(project) + 1) % projects.length];
  const heroMedia = content.hero.map((media, index) => `<img src="../assets/${esc(media)}" alt="${esc(content.heroLabels?.[index] || `${content.title} product mockup${content.hero.length > 1 ? ` ${index + 1}` : ''}`)}" decoding="async" fetchpriority="high">`).join('');
  const facts = [['Contribution', content.contribution], ['Reviewed period', content.duration], ['Status', content.status], ['Collaborated with', content.collaborators]].filter(([, value]) => value);
  const page = `${nav('../', 'portfolio')}<main id="main"><section class="case-hero ${content.fullWidthHero ? 'case-hero-wide' : ''}"><div class="case-title">${content.eyebrow ? `<p class="case-eyebrow">${esc(content.eyebrow)}</p>` : ''}<h1>${esc(content.headline || content.title)}</h1><p>${esc(content.type)}</p></div><div class="hero-devices ${content.hero.length > 1 ? 'multiple' : ''}">${heroMedia}</div><div class="case-problem">${content.problemLabel ? `<strong>${esc(content.problemLabel)}</strong>` : ''}<p>${esc(content.problem)}</p></div></section>${chapterNav}<div class="case-content"><section class="case-overview"><div><h2>${esc(content.overview)}</h2>${(content.role || []).map((text) => `<p>${esc(text)}</p>`).join('')}</div><dl>${facts.map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join('')}</dl></section>${(content.overviewMedia || []).map(renderLegacyMedia).join('')}${sections}<a class="next-project" href="../${esc(next.slug)}/"><span>Next project</span><strong>${esc(next.title)}</strong><span aria-hidden="true">↗</span></a></div></main>${footer('../')}`;
  await mkdir(path.join(out, project.slug), {recursive: true});
  await writeFile(path.join(out, project.slug, 'index.html'), shell(content.title, project.description, page, '../', `case-page ${project.slug.toLowerCase()}-case`, `${project.slug}/`, content.socialImage || 'Se27uSPfxrflC01YaaGHXVaMms.png'));
}

await writeFile(path.join(out, '.nojekyll'), '');
await writeFile(path.join(out, '404.html'), shell('Page not found', 'This page could not be found.', `<main class="not-found" id="main"><h1>Page not found.</h1><p>Let’s get you back to the portfolio.</p><a href="${esc(siteURL.href)}">Back to home ↗</a></main>`, siteURL.href, '', null));
console.log(`Built homepage, About, and ${files.filter((file) => file.endsWith('.json')).length} case studies in dist/`);
