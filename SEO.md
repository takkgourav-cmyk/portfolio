# Portfolio SEO and deployment

This is the existing Next.js 16 App Router portfolio. Its production origin is
`https://portfolio-olive-tau-93.vercel.app`. Keep the Vercel project connected to
the GitHub repository's `main` branch with the Next.js framework preset. The build
command is `npm run build`; use Vercel's default output directory. No custom
rewrites, static export, or extra hosting service is needed.

## Verification

```powershell
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

In another terminal:

```powershell
npm run check:seo
npm run check:seo -- https://portfolio-olive-tau-93.vercel.app
```

The HTTP checks use a Googlebot user agent. They check public page responses,
unique titles/descriptions, canonical URLs, index/follow directives, a single H1,
JSON-LD syntax and the Schema.org properties used here, sitemap coverage,
internal links, and actual 404/noindex behavior. They do not emulate Google
indexing or validate ownership of a Search Console account.

## Production URLs

- https://portfolio-olive-tau-93.vercel.app/
- https://portfolio-olive-tau-93.vercel.app/#services
- https://portfolio-olive-tau-93.vercel.app/#contact
- https://portfolio-olive-tau-93.vercel.app/projects/saas-landing-page
- https://portfolio-olive-tau-93.vercel.app/projects/e-commerce-ui
- https://portfolio-olive-tau-93.vercel.app/projects/portfolio-v1
- https://portfolio-olive-tau-93.vercel.app/projects/task-manager-app
- https://portfolio-olive-tau-93.vercel.app/robots.txt
- https://portfolio-olive-tau-93.vercel.app/sitemap.xml

The sitemap lists the homepage and four distinct project URLs. Homepage sections
use fragment links, not separate pages, so they are not sitemap entries. Real
missing URLs return 404 and are not indexed.

## Google Search Console

1. Add the URL-prefix property `https://portfolio-olive-tau-93.vercel.app/` in
   [Google Search Console](https://search.google.com/search-console).
2. The existing Google verification meta token is retained in `src/app/layout.jsx`.
   Check that it matches the token issued to your Google account. To replace it,
   set `GOOGLE_SITE_VERIFICATION` in Vercel's production environment and redeploy;
   `.env.example` documents the optional local build setting. Never use a Google
   password or account credential as this value.
3. After deployment, confirm that `/robots.txt` and `/sitemap.xml` return 200.
   Submit `sitemap.xml` under Sitemaps.
4. Inspect the homepage and each project URL with URL Inspection, run the live
   test, and request indexing where available. If access is blocked, check Vercel
   Deployment Protection and Firewall settings for the public production domain.
5. Check the public pages in the [Schema.org validator](https://validator.schema.org/)
   and Google's [Rich Results Test](https://search.google.com/test/rich-results).
   Person, WebSite and CreativeWork describe the portfolio; they do not promise
   eligibility for a particular Google rich result.

Only the existing name, contact details, profiles, skills, location, and project
information are used. There is no LocalBusiness/ProfessionalService markup,
street address, review, rating, or new client claim. Keep descriptions accurate
as projects change. Search Console account verification, sitemap submission, and
Google indexing must be completed with the site owner's account. Crawling,
indexing, and rankings are not guaranteed.

See Google's guidance on [building and submitting a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Files changed

- `src/app/layout.jsx`: shared metadata, Person/WebSite JSON-LD, verification setting, skip link.
- `src/app/page.jsx`: homepage metadata, main landmark, homepage-only intro.
- `src/app/sitemap.js`: canonical homepage and the four existing project URLs.
- `src/app/not-found.jsx`: noindex metadata, no canonical, accessible main landmark.
- `src/app/projects/[slug]/page.jsx`: missing project metadata uses the real 404 path.
- `src/lib/seo.js`: local search title/description, shared robots, project metadata and escaped JSON-LD.
- `src/lib/load-three.js`: one shared, asynchronous download for the decorative canvases.
- `src/components/portfolio/sections.jsx`: local introduction, H1/H2s, services, project links, contact details, optimized images and accessibility.
- `src/components/portfolio/projectsData.js`: original, project-specific descriptions and metadata.
- `src/components/portfolio/ProjectPageView.jsx`: accurate link labels, project markup, service/contact links.
- `src/components/portfolio/Navbar.jsx`: Services link, mobile/tablet menu, keyboard and screen reader support.
- `src/components/portfolio/HelloIntro.jsx`: skip control, session reuse, reduced-motion and no-JavaScript behavior.
- `src/components/portfolio/RobotCanvas3D.jsx`: deferred setup, mobile rendering, offscreen pause, cleanup and touch scrolling.
- `src/components/portfolio/ThreeContactBackground.jsx`: desktop-only, near-viewport setup, offscreen pause and cleanup.
- `src/styles.css`: focus styles, skip link, reduced-motion behavior and small-screen contact sizing.
- `next.config.mjs`: allowlisted Unsplash sources for Next.js image optimization.
- `package.json`: repeatable `check:seo` command.
- `scripts/check-seo.mjs`: HTTP-based SEO, structured data and internal link checks.
- `.env.example`: optional public Search Console verification value.
- `SEO.md`: deployment, verification and Search Console handoff.

## Local validation completed

The production build and `check:seo` pass. Chrome checks at 320, 375, 768, 1024,
and 1440 pixels found no page overflow. Menu navigation, contact links, skills
switching, project selection, the WebGL robot, and optimized project image
loading work. Reduced-motion and JavaScript-disabled checks pass. No uncaught
browser JavaScript errors were reported during those checks. These are checks
of this build, not a Lighthouse score or a prediction of search rankings.
