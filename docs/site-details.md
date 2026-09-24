# Supporting site details

The approved portrait is used for browser PNG/ICO icons, the Apple touch icon, 192/512px home-screen icons, and a padded maskable icon. The manifest uses browser display mode; it does not add offline caching or promise an installable/offline application. Icon behavior varies by browser and platform.

The root HTML includes a manifest link, application/Apple shortcut names, author, locale, conservative referrer policy and Person/WebSite structured data containing existing public identity and profile links. The static sitemap lists the canonical homepage only; hash sections are not separate documents. Robots explicitly permits crawling. Archive noindex directives remain intact.

The standalone 404 page matches the paper palette and provides home, work and contact links without depending on JavaScript. Vercel should serve this for unmatched paths with HTTP 404; verify that status and content on production rather than assuming a local static-server test proves platform behavior.

Section navigation updates browser titles and moves focus to the section heading when activated from navigation. Skip to content focuses main without changing the selected section. Copy-email feedback has a polite status announcement. Focus indicators have additional contrast and offset.

Validation: build, check-details.cjs, check-opening-sharing.cjs, check-mobile.cjs and check-production.cjs, one browser suite at a time. Local checks use loopback servers and mocked APIs. Production checks do not submit messages or increment traffic counters.

References: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons and https://developers.google.com/crawling/docs/robots-txt/create-robots-txt .
