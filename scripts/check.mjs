import {readFile, readdir, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(projectRoot, 'dist');
const siteURL = new URL(process.env.SITE_URL || 'https://ncksanota.github.io/Portfolio/');
if (!siteURL.pathname.endsWith('/')) siteURL.pathname += '/';

const errors = [];
const projects = JSON.parse(await readFile(path.join(projectRoot, 'src/projects.json'), 'utf8'));

async function walk(dir) {
  const entries = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) entries.push(...await walk(file));
    else entries.push(file);
  }
  return entries;
}

if (!Array.isArray(projects) || !projects.length) errors.push('src/projects.json: expected at least one project');
const slugs = projects.map((project) => project.slug);
if (new Set(slugs).size !== slugs.length) errors.push('src/projects.json: project slugs must be unique');

for (const project of projects) {
  for (const field of ['slug', 'title', 'type', 'description', 'cover']) {
    if (!project[field]) errors.push(`src/projects.json: ${project.slug || 'project'} is missing ${field}`);
  }

  try {
    const content = JSON.parse(await readFile(path.join(projectRoot, 'src/content', `${project.slug}.json`), 'utf8'));
    if (!content.title || !content.overview || !content.problem) errors.push(`${project.slug}.json: missing core case-study content`);
    if (!Array.isArray(content.sections) || !content.sections.length) errors.push(`${project.slug}.json: expected at least one section`);
    const sectionIds = (content.sections || []).map((section) => section.id).filter(Boolean);
    if (new Set(sectionIds).size !== sectionIds.length) errors.push(`${project.slug}.json: section ids must be unique`);
    if (content.chapterNavigation && sectionIds.length !== content.sections.length) errors.push(`${project.slug}.json: chapter navigation requires an id on every section`);
    for (const section of content.sections || []) {
      for (const block of section.blocks || []) {
        if (block?.type === 'image' && (!block.src || !block.alt || !block.caption)) errors.push(`${project.slug}.json: rich images require src, alt, and caption`);
        if (block?.type === 'video' && (!block.src || !block.alt || !block.caption)) errors.push(`${project.slug}.json: rich videos require src, alt, and caption`);
        if (block?.type === 'comparison') {
          for (const side of ['before', 'after']) if (!block[side]?.src || !block[side]?.alt || !block[side]?.caption || !block[side]?.label) errors.push(`${project.slug}.json: comparisons require complete before and after media`);
        }
        if (block?.type === 'journey' && (!block.label || !Array.isArray(block.steps) || block.steps.length < 2)) errors.push(`${project.slug}.json: journeys require a label and at least two steps`);
        if (block?.type === 'relatedWork' && !slugs.includes(block.slug)) errors.push(`${project.slug}.json: related work points to unknown slug ${block.slug}`);
      }
    }
  } catch {
    errors.push(`Missing or invalid content file: src/content/${project.slug}.json`);
  }
}

for (const project of projects) {
  if (project.nextSlug && !slugs.includes(project.nextSlug)) errors.push(`src/projects.json: ${project.slug} has unknown nextSlug ${project.nextSlug}`);
  for (const slug of project.relatedSlugs || []) if (!slugs.includes(slug)) errors.push(`src/projects.json: ${project.slug} has unknown related slug ${slug}`);
}

const all = await walk(root);
const htmlFiles = all.filter((file) => file.endsWith('.html'));
const expected = ['index.html', 'About/index.html', ...slugs.map((slug) => `${slug}/index.html`), '404.html'];
for (const route of expected) {
  if (!all.includes(path.join(root, route))) errors.push(`Missing route: ${route}`);
}

let references = 0;
for (const file of htmlFiles) {
  const content = await readFile(file, 'utf8');
  const relative = path.relative(root, file);
  const is404 = relative === '404.html';

  if ((content.match(/<h1\b/g) || []).length !== 1) errors.push(`${relative}: expected one h1`);
  if (!content.includes('<html lang="en">')) errors.push(`${relative}: missing document language`);
  if (!content.includes('<main') || !content.includes('id="main"')) errors.push(`${relative}: missing main landmark`);
  if (!content.includes('<title>') || !content.includes('name="description"')) errors.push(`${relative}: missing metadata`);
  if (!is404 && !content.includes('class="skip-link"')) errors.push(`${relative}: missing skip link`);
  if (!is404 && (content.match(/aria-current="page"/g) || []).length !== 1) errors.push(`${relative}: expected one current navigation item`);
  if (/framerusercontent|events\.framer|framer\.com/.test(content)) errors.push(`${relative}: hosted Framer dependency`);

  const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${relative}: duplicate id`);

  if (is404) {
    if (/rel="canonical"/.test(content)) errors.push(`${relative}: error pages should not be canonicalized`);
  } else {
    const route = relative === 'index.html' ? '' : relative.replace(/index\.html$/, '');
    const expectedCanonical = new URL(route, siteURL).href;
    if (!content.includes(`<link rel="canonical" href="${expectedCanonical}">`)) errors.push(`${relative}: incorrect canonical URL`);
  }

  for (const img of content.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(img[0])) errors.push(`${relative}: image has no alt attribute`);
  }

  for (const match of content.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    let url = match[1];
    let siteAbsolute = false;
    if (url.startsWith(siteURL.href)) {
      url = url.slice(siteURL.href.length);
      siteAbsolute = true;
    }
    if (/^(https?:|mailto:|data:)/.test(url)) continue;

    const [pathnameWithQuery, fragment] = url.split('#');
    const pathname = pathnameWithQuery.split('?')[0];
    let resolved = path.resolve(
      siteAbsolute ? root : path.dirname(file),
      decodeURIComponent(pathname || (siteAbsolute ? 'index.html' : path.basename(file))),
    );

    if (!resolved.startsWith(`${root}${path.sep}`) && resolved !== root) {
      errors.push(`${relative}: reference leaves site: ${url}`);
      continue;
    }

    try {
      const fileStat = await stat(resolved);
      if (fileStat.isDirectory()) resolved = path.join(resolved, 'index.html');
      await stat(resolved);
      references++;
      if (fragment) {
        const target = await readFile(resolved, 'utf8');
        if (!target.includes(`id="${fragment}"`)) errors.push(`${relative}: missing anchor ${url}`);
      }
    } catch {
      errors.push(`${relative}: broken reference ${url}`);
    }
  }
}

for (const file of htmlFiles) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(/<meta[^>]+(?:property="og:image"|name="twitter:image")[^>]+content="([^"]+)"/g)) {
    if (!match[1].startsWith(siteURL.href)) {
      errors.push(`Unexpected social image origin: ${match[1]}`);
      continue;
    }
    try {
      await stat(path.join(root, match[1].slice(siteURL.href.length)));
      references++;
    } catch {
      errors.push(`Missing social image: ${match[1]}`);
    }
  }
}

for (const file of all.filter((entry) => entry.endsWith('.css'))) {
  const css = await readFile(file, 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    if (/^https?:/.test(match[1])) {
      errors.push(`Remote CSS asset: ${match[1]}`);
      continue;
    }
    try {
      await stat(path.resolve(path.dirname(file), match[1]));
      references++;
    } catch {
      errors.push(`Missing CSS asset: ${match[1]}`);
    }
  }
}

for (const file of all) {
  const fileStat = await stat(file);
  if (fileStat.size > 95 * 1024 * 1024) errors.push(`File too large for ordinary Git: ${file}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML pages and ${references} local references; routes, metadata, landmarks, anchors, fonts, and media resolve.`);
