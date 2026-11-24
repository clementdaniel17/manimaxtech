MANIMAX TECH — FINAL MOTION POLISH

This package is based on the latest project-gallery-fixed website and the latest screen recording.

INSTALLATION
1. Extract this ZIP into a NEW folder (keep the previous version as backup).
2. Open the extracted MANIMAX_TECH_Final_Visual_Fix folder in VS Code.
3. Run index.html with Live Server.
4. Hard refresh with Ctrl+Shift+R.

WHAT CHANGED
- Replaced main.js with one shared observer and one requestAnimationFrame scroll pipeline.
- Waits for web fonts (or a short timeout) before starting hero entrance animations to reduce text reflow during the entrance.
- Removed hero scroll-time style writes and corrected pointer parallax to use the latest pointer coordinates.
- Removed persistent will-change from reveal elements.
- Uses individual translate for card hover so hover movement does not overwrite scroll-reveal transforms.
- Reduced orbital speed and logo movement amplitude.
- Kept the header consistently dark to avoid the translucent colour shift.
- Normalised all four project cards to consistent image frames and equal card structure.
- Added final-polish.css last on every page so these corrections take precedence.
- Preserved seven separate pages, original content, logo and images, responsive CSS and reduced-motion support.

