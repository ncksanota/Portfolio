# Portfolio v2 design system

The system extends Nicolas’s acid-yellow, editorial identity with a clear separation between expressive display type, comfortable reading type, and precise metadata. Open `/system/` in the local preview for the actual type, color, spacing, and control specimens.

## Foundations and semantic tokens

`public/styles/tokens.css` owns the palette, semantic roles, typography, spacing, widths, radii, and motion values. Components reference roles such as `--surface`, `--text`, `--text-secondary`, `--line`, and `--focus`. A `data-theme="dark"` section remaps those roles rather than requiring a separate component implementation.

| Role | Choice | Application |
| --- | --- | --- |
| Display | Local Anton, regular | Hero, project statements, chapter introductions, contact close |
| Reading | Helvetica Neue → Helvetica → Arial → sans-serif | Summaries, descriptions, and case-study prose |
| Detail | Local IBM Plex Mono, regular | Navigation, captions, indexes, metadata, controls |
| Accent | `#edff50` | Identity surfaces, active chapter, emphasis |
| Ink | `#10110f` | Main text and work collection |
| Paper | `#f5f4ee` | Reading surfaces |
| White | `#ffffff` | Native product imagery and specimen surface |

Antonio and unused Plex weights are no longer requested by CSS. Original font files and licenses remain in the asset collection. Display sizes use fluid scales; the desktop hero also considers viewport height. Mobile headings wrap intentionally. Prose is bounded to 65 characters where the layout allows it.

Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, and 128px. Shared controls use a 44–48px minimum height and visible focus. Small optical adjustments within components are intentional.

## Source organization

| File | Responsibility |
| --- | --- |
| `scripts/build.mjs` | Read project content, assemble routes, copy public files, write metadata |
| `scripts/lib/ui.mjs` | Escaping, link/button primitive, document shell, header and contact footer partials |
| `scripts/lib/pages.mjs` | Homepage, curated project cards, archive, About layout, editorial project summaries |
| `scripts/lib/case-study.mjs` | Case-study layout, chapters, media, evidence summary, demo gallery, Fohlio decision sequence |
| `scripts/lib/media.mjs` | Extract image dimensions at build time to reserve layout space |
| `scripts/lib/specimen.mjs` | Internal design-system specimen |
| `public/styles/tokens.css` | Foundations and semantic tokens |
| `public/styles/primitives.css` | Reset, typography utilities, container, links/buttons, focus, reveal and reduced-motion defaults |
| `public/style.css` | Shared components, page layouts, responsive compositions, motion stages |
| `public/site.js` | Progressive enhancements and interaction state |

The build remains dependency-free. Edit source, then run `npm run build`; the server serves `dist`. The existing GitHub Pages workflow remains intact.

## Components and layouts

- The homepage uses a hero composition, three curated features, a compact archive containing all other studies, a working philosophy, and a contact close.
- Case studies share a project header, reading summary, chapter navigation, content/media modules, and next-project destination. All existing case-study media remain accessible.
- Fohlio adds qualified reported/tested results and a three-step visual decision sequence. Its complete feature descriptions remain in the chapters.
- Multiple prototype videos use accessible tabs with arrow, Home, and End key support. Changing the selection pauses the previous video.
- About uses the same editorial type hierarchy and contact flow.
- The resume placeholder is omitted because no usable resume asset was supplied.

## Motion behavior

| Behavior | Implementation | Fallback |
| --- | --- | --- |
| Pixel assembly | A finite, replayable sequence of 36 decorative cells | Static portrait under reduced motion or without JS |
| Hero scroll | Coalesced animation-frame updates for small translations and rotation | Static composition on mobile and reduced motion |
| Project reveal | IntersectionObserver, opacity and transform | All content visible without JS |
| Cover continuity | Native cross-document view transitions where supported | Normal navigation |
| Fohlio decisions | Sticky image stage responds to three reading steps | All three captioned images appear in normal flow on mobile, reduced motion, and without JS |
| Demo selection | Reserved media panels, short entry animation | Every demonstration appears in sequence without JS |
| Header and chapters | Compact fixed header after scrolling; active chapter follows reading position | Native links remain usable |

No scroll interception, automatic video playback, or perpetual decorative loop is required. Offscreen and backgrounded videos pause. The inherited animated GIF is represented by a still with an explicit link to open the original animation. Motion preference changes are handled during an active session. The footer also provides a persistent motion toggle; a system-level reduced-motion preference takes precedence.

## Media and content

The homepage portrait has locally derived 640px and 1280px JPEG variants; originals are retained. Video posters are extracted from the existing recordings. These are delivery optimizations, not new portfolio evidence. Raster and SVG dimensions are added during the build where available.

Fohlio’s source distinguishes reported and early-test results from projected benefits. The summary retains those qualifiers. Application-specific “Junior!” copy was removed. Project claims have not been independently substantiated. Resume, availability, and exact project release status still require owner-provided current information before adding new claims.

## Verification

Run `npm run build` and `npm run check`. The checker validates routes, metadata, unique anchors, source media retention, image dimensions, tab relationships, and local files. Browser verification for v2 covers 320px, 390px, and 1440px route layouts, demo keyboard selection, contact copy feedback, and representative visual compositions. Automated browser observations are a layout and interaction check, not a formal assistive-technology audit or a measured Core Web Vitals report.

The PR integrates the latest Spechub case study from main, including its lead placement, prototype status, collaboration context, rich media, comparisons, journeys, social image, and related links. Fohlio remains identified as historical work.
