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
- Omit the inactive Resume label; no downloadable resume or destination link was discoverable. Add the real PDF when available.
- Connect the five featured projects in order; replace Unearth's original `/Starjob` next-project target with Design System, and return from Design System to Fohlio.
- Preserve the source's 2024 copyright date and stated work durations for the review pass.

## Copy to review before the domain cutover

1. **Unearth pain points** discuss stock trading, apparently copied from Nebulink. Kept verbatim rather than inventing research findings.
2. **Design System goals** discuss memories and storytelling, apparently copied from Unearth. Kept for owner review.
3. **Fohlio ending** mentions “Junior,” which appears tailored to one prospective employer.
4. **Fohlio metrics** include reported, tested, designed-for, and expected outcomes. Their qualifiers are preserved; this migration does not independently validate those claims.
5. **About biography** says seven years of design and three years of product design. Confirm these are still current.
6. **Availability and copyright** may need updating.
7. **Resume** needs a real PDF or link.
8. **Copy edits** are still needed in several places (for example “Questionare,” “Retain and Engagement,” and the homepage Nebulink summary). The first pass favors source fidelity.

## Verification scope

The automated check covers generated routes, local file references, anchor targets, image alt attributes, metadata, single primary headings, maximum file size, and absence of Framer runtime/CDN references in the published HTML and CSS. The source site's appearance was inspected in the browser. The recreated site has not undergone a full browser, accessibility, or device test suite; visual review remains appropriate before replacing the live domain.

## Hosting state

This is a prepared repository, not evidence of a GitHub deployment. GitHub authentication, repository creation, workflow success, and the final live URL must be verified separately. DNS and Framer billing remain unchanged.
