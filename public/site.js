/* Progressive enhancements: every route and story remains readable without JS. */
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
let quietMotion = false;
try { quietMotion = localStorage.getItem('portfolio-quiet-motion') === 'true'; } catch {}
const reducedMotion = new EventTarget();
Object.defineProperty(reducedMotion, 'matches', {get: () => systemMotion.matches || quietMotion});
function syncMotionPreference() {
  document.body.dataset.motion = reducedMotion.matches ? 'reduce' : 'full';
  document.querySelectorAll('[data-motion-toggle]').forEach(button => {
    button.hidden = false;
    button.disabled = systemMotion.matches;
    button.textContent = systemMotion.matches ? 'Reduced motion' : reducedMotion.matches ? 'Motion off' : 'Motion on';
    button.setAttribute('aria-pressed', String(!reducedMotion.matches));
  });
}
systemMotion.addEventListener('change', () => { syncMotionPreference(); reducedMotion.dispatchEvent(new Event('change')); });
document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
  quietMotion = !quietMotion;
  try { localStorage.setItem('portfolio-quiet-motion', String(quietMotion)); } catch {}
  syncMotionPreference(); reducedMotion.dispatchEvent(new Event('change'));
}));
syncMotionPreference();
const hero = document.querySelector('.hero');
let heroTimer;
function replayHero() {
  if (!hero || reducedMotion.matches) return;
  clearTimeout(heroTimer);
  hero.classList.remove('is-playing');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    hero.classList.add('is-playing');
    heroTimer = setTimeout(() => hero.classList.remove('is-playing'), 2000);
  }));
}
const replay = document.querySelector('[data-replay]');
if (replay) {
  replay.hidden = reducedMotion.matches;
  replay.addEventListener('click', replayHero);
  replayHero();
}
const reveals = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('is-waiting'); observer.unobserve(entry.target); }
  }), {rootMargin: '0px 0px 50px 0px', threshold: .04});
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight) el.classList.add('is-waiting');
    observer.observe(el);
  });
}
reducedMotion.addEventListener('change', () => {
  if (replay) replay.hidden = reducedMotion.matches;
  if (reducedMotion.matches) {
    hero?.classList.remove('is-playing');
    reveals.forEach(el => el.classList.remove('is-waiting'));
    clearTimeout(heroTimer);
  }
});
// Copy controls are scoped, announce success/failure, and never block email links.
document.querySelectorAll('[data-copy-email]').forEach(button => {
  let timer;
  button.addEventListener('click', async () => {
    const status = button.parentElement.querySelector('.copy-status');
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText('nicksanota@gmail.com');
      button.textContent = 'Copied ✓';
      status.textContent = 'Email address copied.';
      timer = setTimeout(() => { button.textContent = 'Copy ↗'; status.textContent = ''; }, 3000);
    } catch {
      button.textContent = 'Copy failed';
      status.textContent = 'Could not copy. Select the email address or use the email link.';
      status.classList.remove('sr-only');
    }
  });
});
// Tabs activate only after their event handlers exist. The static version stacks all demos.
document.querySelectorAll('[data-demo-gallery]').forEach(gallery => {
  const tablist = gallery.querySelector('[role="tablist"]');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = [...gallery.querySelectorAll('[data-demo-panel]')];
  const select = (index,focus=false) => {
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(i===index));
      tab.tabIndex = i===index ? 0 : -1;
      panels[i].hidden = i!==index;
      panels[i].setAttribute('role','tabpanel');
      panels[i].setAttribute('aria-labelledby',tab.id);
      panels[i].tabIndex = 0;
      if(i!==index) panels[i].querySelectorAll('video').forEach(video=>video.pause());
    });
    if(focus) tabs[index].focus();
  };
  tabs.forEach((tab,i) => {
    tab.addEventListener('click',()=>select(i));
    tab.addEventListener('keydown',event=>{
      let index;
      if(event.key==='ArrowRight')index=(i+1)%tabs.length;
      if(event.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;
      if(event.key==='Home')index=0;
      if(event.key==='End')index=tabs.length-1;
      if(index!==undefined){event.preventDefault();select(index,true);}
    });
  });
  select(0); tablist.hidden=false;
  // Deep links to a demo retain access even when it is not the first tab.
  const revealHash = () => {
    let id;
    try { id=decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const index=panels.findIndex(panel=>panel.id===id||[...panel.querySelectorAll('[id]')].some(el=>el.id===id));
    if(index>=0){select(index);document.getElementById(id)?.scrollIntoView();}
  };
  addEventListener('hashchange',revealHash); if(location.hash)revealHash();
});
const chapterLinks=[...document.querySelectorAll('[data-chapter-link]')];
if(chapterLinks.length){
 let scheduled=false;
 const updateChapter=()=>{
   scheduled=false;
   const passed=chapterLinks.filter(link=>document.querySelector(link.getAttribute('href')).getBoundingClientRect().top<innerHeight*.35);
   const current=passed.at(-1)||chapterLinks[0];
   chapterLinks.forEach(link=>link===current?link.setAttribute('aria-current','location'):link.removeAttribute('aria-current'));
 };
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateChapter);}},{passive:true});
 updateChapter();
}
// Stop media that is no longer visible or when the page is backgrounded.
if('IntersectionObserver' in window){
 const videos=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)target.pause();}),{threshold:.05});
 document.querySelectorAll('video').forEach(video=>videos.observe(video));
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('video').forEach(video=>video.pause());});

// Scroll work is coalesced into one frame; transforms never change reading layout.
let motionFrame = false;
const desktopMotion = matchMedia('(min-width: 701px)');
const story = document.querySelector('[data-decision-story]');
const storyStage = story?.querySelector('.decision-stage');
const steps = [...document.querySelectorAll('[data-decision-step]')];
const decisionImages = [...document.querySelectorAll('[data-decision-image]')];
let currentDecision = -1;
function renderScrollMotion() {
  motionFrame = false;
  const enabled = desktopMotion.matches && !reducedMotion.matches;
  if (hero && enabled) {
    const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
    hero.style.setProperty('--hero-progress', progress);
    hero.style.setProperty('--hero-type-y', `${progress * 35}px`);
    hero.style.setProperty('--hero-image-y', `${progress * -45}px`);
    hero.style.setProperty('--hero-rotate', `${2-progress*2}deg`);
  }
  if (story) {
    story.classList.toggle('is-enhanced',enabled);
    storyStage.hidden = !enabled;
    if (enabled) {
      const passed=steps.filter(step=>step.getBoundingClientRect().top<innerHeight*.55);
      const active=Number((passed.at(-1)||steps[0]).dataset.decisionStep);
      if(currentDecision!==active){
        currentDecision=active;
        decisionImages.forEach((image,i)=>image.classList.toggle('is-active',i===active));
        story.querySelector('[data-decision-counter]').textContent=String(active+1).padStart(2,'0');
      }
    }
  }
}
function scheduleMotion(){if(!motionFrame){motionFrame=true;requestAnimationFrame(renderScrollMotion);}}
if(hero||story){
 addEventListener('scroll',scheduleMotion,{passive:true});
 desktopMotion.addEventListener('change',scheduleMotion);
 reducedMotion.addEventListener('change',scheduleMotion);
 renderScrollMotion();
}

const header = document.querySelector('.site-header');
let headerFrame=false;
const updateHeader=()=>{headerFrame=false;header?.classList.toggle('is-scrolled',scrollY>120);};
addEventListener('scroll',()=>{if(!headerFrame){headerFrame=true;requestAnimationFrame(updateHeader);}},{passive:true});
updateHeader();
