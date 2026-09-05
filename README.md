# Nicolas Sanabria — Portfolio

A standalone, static recreation of [ncksanota.com](https://ncksanota.com/), prepared for the GitHub repository `ncksanota/Portfolio` and GitHub Pages. Source content was reviewed on September 5, 2026.

## Run locally

Requires Node.js 22+ and Python 3. No npm packages, installation step, backend, or Framer account are required.

```sh
npm run dev
```

Open http://127.0.0.1:4173. After editing, run `npm run build` to regenerate the pages, then refresh. The server serves the generated `dist` directory.

```sh
npm run build
npm run check
```

## Portfolio v2

The design system, component map, motion behavior, and editing guidance are documented in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). The implementation follows [DESIGN-V2-PLAN.md](DESIGN-V2-PLAN.md).

Open `/system/` in the local preview to inspect the typography, palette, spacing, and controls together. This specimen is not included in portfolio navigation.

## Edit the portfolio

- `src/projects.json`: project identity, source covers, and preserved routes.
- `src/content/*.json`: case-study copy and media.
- `scripts/lib/pages.mjs`: editorial summaries, selected-work order, Home and About layouts.
- `scripts/lib/ui.mjs`: shared shell, navigation, footer, and button primitive.
- `scripts/lib/case-study.mjs`: chapters, case-study components, and demonstration galleries.
- `public/styles/tokens.css`: palette, semantic roles, type scales, spacing, motion.
- `public/styles/primitives.css`: shared typography, layout and interaction primitives.
- `public/style.css`: components and responsive page layouts.
- `public/site.js`: progressive motion, demo tabs, chapter state, media behavior, email copy.
- `public/assets`: original media; `optimized/` contains derived portrait variants, video posters, and a GIF still.

The build writes only to `dist/`. Edit source files, not generated HTML. All content and navigation remain available without JavaScript; videos become a linear sequence and motion becomes static.

## Publish to GitHub Pages

The included workflow builds and checks the site and publishes `dist/` when `main` changes. In the repository, select **Settings → Pages → Build and deployment → Source: GitHub Actions**. Use a public repository for free Pages hosting on a GitHub Free account.

When published as `ncksanota/Portfolio`, the default address is `https://ncksanota.github.io/Portfolio/`. Links use relative paths, so the same build also works at a custom domain. Existing route capitalization is preserved: `/About/`, `/fohlio/`, `/Nebulink/`, `/WAO-Shop/`, `/Unearth/`, `/Starjob/`, `/Design-System/`. The homepage features Spechub, WAO Shop, and Nebulink; Fohlio, Unearth, Starjob, and Design System remain directly accessible in the More to explore index. Explicit next-project and related-work links from the latest project inventory are preserved.

If the repository has not yet been created, sign in to the GitHub CLI with `gh auth login`, then, from this directory:

```sh
git init -b main
git add .
git commit -m "Recreate product design portfolio as a standalone static site"
gh repo create ncksanota/Portfolio --public --source=. --remote=origin --push
```

If a local Git repository or remote already exists, inspect it before running setup commands again. Do not overwrite an existing remote repository.

## Move ncksanota.com after review

First review the deployed GitHub Pages version. Then configure and verify the custom domain in GitHub and update its DNS following [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site). Add `public/CNAME` containing `ncksanota.com` when the domain is ready to move; rebuilding copies it to the published root. Set `SITE_URL: https://ncksanota.com/` in the build step's environment in `.github/workflows/pages.yml` so social image URLs and the 404 page target the new domain. Enable HTTPS after GitHub provisions the certificate. Confirm all pages and media on the custom domain before ending Framer hosting.

No DNS settings or Framer subscription were changed by preparing this repository. Domain registration remains a separate recurring expense.

## Assets and ownership

Portfolio copy, branding, screenshots, and prototype recordings are carried over from the owner's public site. They are not assigned a new open-source license. Fonts use their original upstream licenses (see `public/assets/licenses/`). No Framer analytics, scripts, editor integration, or external font/image hosting is required. The existing social-preview image and favicon are preserved as local assets. Images were downloaded at up to 2048px; the provenance manifest retains their original URLs for higher-resolution retrieval.

The PR integrates the latest Spechub case study from main, including its lead placement, prototype status, collaboration context, rich media, comparisons, journeys, social image, and related links. Fohlio remains identified as historical work.
