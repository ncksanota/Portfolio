# Migration and design audit

Reviewed September 5, 2026. Source: https://ncksanota.com/.

## Original site

The site identifies its generator as Framer. Its visual identity is editorial and high contrast: bright acid yellow, black backgrounds, white panels, very large condensed headings, monospaced body copy, monochrome portraits, and large interface imagery. The home page pairs a portrait with “PEOPLE-POWERED PIXELS” and “Designing backward, thinking forwards.” A horizontal moving name banner separates the introduction from the black portfolio area. The portfolio uses a left-side heading beside vertically stacked image cards with text overlays.

The original fonts are Anton for display headings, IBM Plex Mono for body text, and Antonio for the header status line. The recreation uses locally stored copies of these fonts. The main content width is approximately 1080px, with a 1000px homepage portrait panel. The accent color is approximated as #edff50.

## Structure reproduced

| Page | Content |
| --- | --- |
| Home | Logo, availability, navigation, portrait introduction, moving banner, five project cards, contact footer |
| About | Biography, portrait, selected clients, LinkedIn, email |
| Fohlio | Challenge, process, seven redesign areas, design system, outcomes and learnings |
| Nebulink | Overview, research, personas/journey, wireframes, usability testing, three video demos, accessibility and next steps |
| WAO Shop | Overview, seller research, pain points, insights, usability testing, new engagement features and demos |
| Unearth | Overview, user research, design process, testing, final interfaces, accessibility and next steps |
| Starjob | Career mentorship and first-job platform, research, competitive audit, design process, usability testing, final interfaces, accessibility and next steps |
| Design System | Bank component system, goals, design process, visual artifacts, typography inventory, accessibility and next steps |

## First-pass implementation decisions

- Preserve the visual direction, public case-study content, images, videos, and original route names.
- Replace the Framer runtime with static HTML, shared CSS, and a tiny email-copy script. Build with Node's standard library; no npm dependencies.
- Store the assets in the repository and keep a source manifest. Images use a 2048px download limit to keep repository weight manageable.
- Use semantic headings, keyboard-visible focus, a skip link, image descriptions, reduced-motion support, and small-screen layouts.
- Replace the rotating scrambled header status with readable static text. The horizontal name banner remains animated and respects reduced-motion preferences.
- Present prototype videos with native playback controls in sequence instead of Framer's carousel. This makes every demo directly accessible. Carousel timing and transitions are not recreated.
- Keep a consistent two-link navigation on all pages. The original case-study navigation differs across pages.
- Reuse the source logo artwork, omitting redundant export mask/stroke data. The original smiley artwork in the ticker is represented by a typographic asterisk.
- List the design-system typeface names as content rather than redistributing the commercial Texta font or recreating its live font specimens.
- Preserve the source's inactive Resume label; no downloadable resume or destination link was discoverable. Add the real PDF when available.
- Preserve the five featured homepage projects and the original next-project sequence, including the unfeatured Starjob case study between Unearth and Design System.
- Preserve the source's 2024 copyright date and stated work durations for the review pass.

## Content to review before the domain cutover

1. **Fohlio metrics** include reported, tested, designed-for, and expected outcomes. Their qualifiers are preserved; this migration does not independently validate those claims.
2. **About biography** says more than seven years of design experience. Confirm that positioning still fits.
3. **Availability** still says Nicolas is looking for full-time opportunities.
4. **Resume** needs a real PDF or link before the preserved label can become functional.

Source copy is preserved verbatim where practical. Apparent cross-project copy issues remain owner-authored content and are not silently rewritten during migration. Two Starjob screenshots that were embedded in Fohlio's “Search by Image” gallery were removed from the migrated Fohlio page and retained only on Starjob.

## Verification scope

The automated check covers the project/content relationship, generated routes, local file references, anchor targets, image alt attributes, canonical and social metadata, document landmarks, current navigation state, unique IDs, single primary headings, maximum file size, and absence of Framer runtime/CDN references. Every generated route was also tested in a browser at desktop and mobile sizes, including breakpoint edges from 320px to 1440px, lazy-loaded media, the email-copy interaction, horizontal overflow, and console errors. A formal assistive-technology audit is still recommended before replacing the live domain.

## Hosting state

This is a prepared repository, not evidence of a GitHub deployment. GitHub authentication, repository creation, workflow success, and the final live URL must be verified separately. DNS and Framer billing remain unchanged.

## V2 implementation

The migration audit above describes the first-pass recreation. The subsequent v2 implementation uses the same original assets and route names with new editorial layouts, semantic tokens, shared partials, comfortable case-study typography, progressive motion, chapter navigation, and demonstration tabs. See `DESIGN-SYSTEM.md` for the current implementation and verification scope. The inert Resume label and stale availability claim are omitted pending current information; the source copyright year now follows the build year. No DNS or hosting configuration was changed by this redesign.
