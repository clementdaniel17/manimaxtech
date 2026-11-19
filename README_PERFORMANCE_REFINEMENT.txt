MANIMAX TECH — PERFORMANCE-REFINED RESPONSIVE WEBSITE
======================================================

This package is based on the latest ZIP supplied by the user.

WHAT WAS REFINED
----------------
1. Consolidated scroll-reveal ownership: motion.css is now the single
   shared source for reveal transitions. Duplicate homepage reveal
   declarations were removed from home-animations.css.
2. Removed persistent will-change hints from every reveal element.
   This avoids keeping a large number of elements promoted unnecessarily.
3. Optimized the scroll pipeline:
   - requestAnimationFrame throttling
   - cached maximum scroll distance
   - refreshes metrics on resize/content-size changes
   - removed the unused homepage scroll-fade write
4. Corrected pointer response to use the latest pointer coordinates
   when frames are coalesced.
5. Kept the existing seven-page navigation, mobile breakpoint (1100px),
   content, images, visual identity, and responsive stylesheet.
6. Kept reduced-motion support and disabled pointer parallax on touch
   devices and for reduced-motion preferences.

INSTALLATION
------------
Recommended: extract this complete folder and open it in VS Code.
Run index.html with Live Server.

If applying changes to an existing copy, replace:
- assets/js/main.js
- assets/css/motion.css
- assets/css/home-animations.css

Keep the HTML and responsive.css files from this package together.

VALIDATION
----------
- JavaScript syntax checked with Node.js.
- ZIP archive integrity checked.
- All seven HTML pages and local assets retained.

NOTE
----
These are code-level performance refinements. Actual frame rate depends
on the browser, device GPU, display refresh rate, and other running apps.
The contact form remains a front-end demonstration until connected to
a backend or form service.
