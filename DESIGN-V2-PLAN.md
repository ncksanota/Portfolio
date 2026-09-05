# Portfolio v2 — People → Pixels

Design proposal · September 5, 2026

Implemented in the v2 source. See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) for the delivered components, motion behavior, and validation scope. This document retains the original design rationale.

## Direction

Evolve Nicolas Sanabria’s portfolio into an expressive editorial experience that makes his product judgment easy to understand. Keep the acid yellow, condensed typography, monochrome photography, custom logo, and friendly voice. Introduce more deliberate scale, quieter reading surfaces, a curated project sequence, and one recognizable motion system.

Working concept: **People → Pixels.** Human needs become patterns; patterns become useful interfaces. This gives the existing “People-powered pixels” headline an interaction language grounded in the work.

Assumption: the main audience is hiring managers and design leads considering Nicolas for product design roles. This follows the current availability message; confirm the target role and current availability before final copy.

## Evidence and scope

Reviewed the local homepage at desktop and 390px width, followed project navigation into Fohlio, read the shared templates, CSS, interaction script, migration notes, project inventory, and section structures across all six studies. Reviewed the Astra reference in a live browser: hero, transition into introduction, persistent visual background, and benchmark tab switching. This is a design audit, not a complete accessibility or performance audit.

Reference: [GPT-6 Astra landing page](https://openai.com/index/gpt-6-astra/). Observed a full-viewport spiral field, widely separated hero labels, replay control, a star-field rotation control exposed to keyboard users, an atmospheric introduction, and compact selectable evidence panels. The relevant design lesson is a repeated visual motif combined with changes of pace and reader-controlled detail. Exact rendering technology, timing, and mobile reference behavior were not verified. All timing and implementation choices below are proposals.

Local sources: `public/style.css`, `public/site.js`, `scripts/build.mjs`, `src/projects.json`, `src/content/*.json`, and `MIGRATION.md`.

## Your design language

| Existing trait | What it communicates | V2 evolution |
| --- | --- | --- |
| Acid yellow, black, white | Confidence, graphic energy, immediate recognition | Retain yellow as a signature opening and closing surface; use smaller accents throughout reading sections |
| Anton display type | Poster-like, assertive editorial voice | Reserve the largest sizes for a few statements; make project and chapter hierarchy more varied |
| IBM Plex Mono | Precision and a visible interest in craft | Keep for labels, indexes, captions, and short asides; use a neutral sans stack for sustained reading |
| Monochrome personal photography | A human presence, informal warmth | Keep an intentional portrait crop in the opening and more personal context on About |
| Outlined text over photography | Layering and playful graphic composition | Turn the solid-to-outline relationship into a repeatable mask reveal |
| Moving name banner | Rhythm and personality | Shorten its role into a transition; provide pause if continuous motion remains |
| Large product imagery | Visual confidence and evidence of craft | Use clean stages with captions and selective detail views so actual interfaces remain legible |

The current visual voice is bold, human, graphic, and slightly irreverent. Its maturation should come from stronger editing and better pacing.

## Main problems to solve

1. **The introduction establishes personality before specialization.** At 390px, the identity sentence sits beneath the portrait; selected work starts beyond the initial viewport. Add a concise value proposition and visible “Explore selected work” action before the photo on mobile.
2. **Five similarly weighted project cards dilute curation.** Their image overlays also compete with the work itself. Create a lead story, two supporting stories, and an accessible archive.
3. **Case studies make readers assemble the argument.** The shared template repeats section labels, paragraphs, and full-width media. Bring role, scope, status, and evidence forward; organize the deeper reading around consequential decisions.
4. **Contact is mostly a footer destination.** Add a persistent Contact link and a contextual invitation after a case study. Resume currently has no destination and must become a real link or be omitted.
5. **Motion is disconnected from the story.** The migration deliberately simplified the original status animation and video carousel. Current movement is primarily the ticker and card hover. V2 needs coordinated transitions, purposeful demonstrations, and consistent interaction feedback.

## Homepage composition

### 1. Compact navigation

Logo at left; Work, About, and Contact at right. Keep navigation available during long reading, with surface and text colors that stay legible against changing sections. Availability is secondary text, conditional on current status. Resume appears only with a verified destination.

### 2. Living editorial opening

Use an acid field with a large, deliberately broken “PEOPLE-POWERED / PIXELS” headline. Combine a monochrome portrait and a sparse grid of square fragments inside a bounded visual stage. Keep the existing solid/outline contrast, with the outline restricted to the image area.

Proposed supporting copy: “I’m Nicolas, a product designer in New York. I turn complex workflows into clear, useful experiences.” Treat this as draft positioning for review.

Primary action: **Explore selected work**. Secondary action: **About me**. Both are immediately usable. On desktop, let the next section’s label or upper edge signal continuation. On mobile, place identity, proposition, and primary action before the compact portrait stage.

Opening sequence: the composition appears readable immediately; a short pixel assembly finishes the visual. On scroll, fragments align into a grid and the next project stage enters normal document flow. No loading ritual or requirement to watch the sequence.

### 3. Selected work

Lead with **Fohlio**, based on the current material: a long-running redesign, complex workflows, and a system spanning multiple modules. Give it a full-width feature with a clean interface image, a one-sentence problem, Nicolas’s responsibility, and a labeled result when evidence supports it.

Suggested feature headline: “Bringing clarity to complex project workflows.”

Follow with **WAO Shop** for engagement and commerce, and **Nebulink** for mobile interaction and research. Their order can change if target roles or stronger evidence suggest otherwise. Use offset editorial layouts with text adjacent to images; keep the sequence linear on mobile.

Place Unearth, Design System, and Starjob in a compact “More work” index on the same page. Every study remains discoverable. Avoid a filter interface for only six projects.

### 4. Short point of view

Reintroduce “Designing backward, thinking forwards” as a short explanation of how Nicolas works: start with the human problem, find the system underneath it, and shape the interaction. Pair three short statements with actual artifacts already used in the studies. Keep detailed process discussion in the projects.

### 5. Personal close and contact

One personal paragraph linking to About, followed by a generous acid-yellow contact panel: “Have something worth figuring out?” Use a visible email link, copy button with status feedback, and LinkedIn. No form is needed for this scope.

## User flows

| Visitor intent | Intended path | Completion signal |
| --- | --- | --- |
| Assess fit quickly | Opening → selected-work summaries → role and result → Contact or Resume | Visitor can name the specialization and a relevant project without opening every study |
| Evaluate design judgment | Fohlio → summary → key decisions → supporting evidence → related project | Visitor can explain a tradeoff and Nicolas’s contribution |
| Explore the craft | Project visual → captioned detail or demonstration → return to same reading position | Visitor sees a meaningful interaction without losing context |
| Learn about Nicolas | About → biography, working approach, selected experience → email | Contact is available without returning to the homepage |

Preserve native navigation, back-button behavior, direct case-study URLs, and the existing route capitalization. Return-to-work links should land at the project collection; browser Back should restore position. Keep the main project content visible and linkable without JavaScript.

## Case-study design

Start with a compact project header and strong product visual. Immediately include a short summary: problem, contribution, team context when supplied, duration, project status, and evidence. Offer “Read the story” and “Jump to outcomes” anchors.

Use a desktop chapter rail: Overview / Decisions / System / Outcomes. On mobile use a compact accessible contents disclosure and normal vertical reading. Each decision module answers: What was difficult? What did I choose? Why? What evidence or tradeoff shaped that choice?

For Fohlio, group the existing feature inventory into three narratives:

- **Orient:** navigation, workflow unification, project analytics.
- **Find and evaluate:** library, image search, similar items.
- **Reuse and scale:** prototypes/packages, table rules, shared design patterns.

Each narrative gets one primary artifact, targeted annotations, and supporting detail. Include a real before/after comparison only where matching source assets exist; do not manufacture an old state. Present more specialized feature detail in optional disclosures, while keeping conclusions in the main reading flow.

For Nebulink, combine Purchase, Stock/Crypto, and Dashboard demonstrations in an explicit selector. Selecting a demo changes its title, caption, and video together. Playback is user-controlled; the previous video pauses. A stacked fallback preserves access to all demonstrations.

Finish each study with evidence, limitations, what changed in Nicolas’s thinking, a relevant next study, and Contact. Supporting studies use the same structure with fewer modules.

## Motion specification

| Moment | Proposed choreography | Purpose and fallback |
| --- | --- | --- |
| Hero arrival | 700–1100ms assembly of a bounded set of square fragments; short stagger in decorative layers | Establish the pixel motif; static composition with reduced motion or unavailable rendering |
| Hero exit | Over roughly one viewport of natural scroll, fragments align while the project stage moves into view; optional short desktop sticky interval | Connect identity to work; mobile uses a simple linear reveal |
| Project entry | Image mask opens once, 450–650ms; heading and caption follow with a small offset | Direct attention to the work; all content visible if scripts fail |
| Pointer exploration | Subtle 4–8px movement in decorative layers on fine pointers only | Add tactility; focus and touch receive clear static affordances |
| Project navigation | Optional 250–400ms visual continuity between cover and hero where supported | Preserve orientation; ordinary document navigation remains complete |
| Decision chapter | Scroll progress changes an annotation or highlight beside a stable image | Explain a design choice; mobile and reduced motion use captioned stacked frames |
| Demo selection | 180–240ms crossfade inside a reserved media stage | Clarify selection without layout jumps; keyboard-accessible controls |
| Contact feedback | 120–180ms button and label feedback; live status for copy success/failure | Confirm the action |

Use one easing family and a small number of duration tokens. Prototype the effect at normal scroll speed and during fast scrolling and reversals. Keep reading copy stable. Limit the first release to the signature hero, project reveals, one explanatory case-study sequence, and polished controls. Remove overlapping perpetual animation. If any decorative animation persists beyond five seconds, provide a discoverable pause control.

## Visual and technical system

Keep acid `#edff50`; test ink near `#0b0b0b`, warm paper near `#f5f4ee`, and white product stages. Yellow should serve identity, selected states, and focal moments. Maintain adequate contrast in every state. Keep imagery in its native product colors.

Use a flexible 12-column desktop grid with roughly 1200–1320px maximum width, 24–48px outer gutters, and a 60–68-character reading measure. Start body text at 17–18px with generous line height. Use Anton for major statements, Plex Mono for metadata, and a system sans stack for prose in the first prototype. Validate optical balance before adding another font dependency.

The existing static build is a useful foundation. Retain it for the first prototype. Extend project data with summary, role, status, evidence qualifiers, chapters, captions, related project, and media dimensions. Split the large template builder into small rendering modules as needed. Enhance with CSS transforms, masks, native browser animation APIs, and small modules. Test a lightweight canvas only if DOM/SVG cannot achieve the signature composition smoothly. Choose libraries after the prototype establishes a need; a framework migration is not a prerequisite.

Serve responsive image variants, explicit dimensions, and video posters. Prioritize the opening portrait; defer offscreen media and optional effects. Pause offscreen rendering and video. Proposed release targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 where measurable, with smooth motion on a representative midrange phone. These are targets, not current measurements.

## Content work before release

- Verify current availability, target role, experience wording, project status, and dates.
- Provide a current resume or omit the inert label.
- Fohlio distinguishes **reported** 40% faster decisions, **early testing** showing 35% fewer clicks, a **design goal** of 50% less search time, and an **expected** 60% reduction in package creation time. Retain these distinctions; request measurement context before promoting numbers to headline proof.
- Review Fohlio’s closing reference to “Junior!”; it reads as application-specific copy in a general portfolio.
- Replace generic category labels such as “Webpage platform” with meaningful domain and contribution labels. Tighten grammar in summaries.
- Confirm which studies are shipped work, prototypes, or concept work; do not infer this from presentation quality.
- Inventory matching before/after assets and source-resolution screenshots before committing to zoom or comparison effects.

## Implementation sequence and acceptance

1. **Story and curation:** settle positioning, project hierarchy, content qualifiers, and media inventory. Deliver the homepage outline and Fohlio decision narrative.
2. **Art direction:** create desktop and mobile static compositions for the opening, selected work, and one case-study chapter. Accept when hierarchy and readability work without motion.
3. **Motion prototype:** build the opening → Fohlio transition and one decision module. Review regular, fast, reversed, touch, keyboard, and reduced-motion behavior. This is the first concrete demonstration of the desired polish.
4. **Reusable implementation:** apply the approved layout and motion vocabulary across Home, About, and all six studies; complete contact and resume behavior.
5. **Validation:** run existing build/check commands, review representative widths from 320px to wide desktop, inspect keyboard/focus behavior, direct links, back restoration, media controls, reduced motion, contrast, and performance. Ask a few representative readers to find the strongest project, identify Nicolas’s contribution, and reach contact without guidance.

The first build should focus on Home and Fohlio together: the public promise and the evidence behind it. Success means visitors recognize Nicolas’s style immediately, find useful work quickly, and leave with a clear account of his design decisions.
