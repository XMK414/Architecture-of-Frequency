/* Builds a single self-contained standalone.html by inlining the local
 * CSS and JS into index.html. CDN <script>/<link> tags (Tailwind, Three.js,
 * FontAwesome, Google Fonts) are left as remote references — they need the
 * public internet either way. Run: node build-standalone.js */

const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

let html = read('index.html');

// Inline the local stylesheet
const css = read('css/style.css');
html = html.replace(
    '<link rel="stylesheet" href="css/style.css">',
    `<style>\n${css}\n    </style>`
);

// Inline local JS modules in load order. Escape any "</script>" so the
// inlined content can't terminate the wrapping <script> tag early.
const jsFiles = ['js/config.js', 'js/data.js', 'js/store.js', 'js/audio-engine.js', 'js/visualizer.js', 'js/app.js'];
for (const f of jsFiles) {
    const code = read(f).replace(/<\/script>/gi, '<\\/script>');
    html = html.replace(
        `<script src="${f}"></script>`,
        `<script>\n${code}\n    </script>`
    );
}

// Sanity check: no un-inlined local references should remain
const leftovers = [...html.matchAll(/(?:src|href)="(?:js\/|css\/)[^"]+"/g)];
if (leftovers.length) {
    console.error('WARNING: un-inlined local refs remain:', leftovers.map(m => m[0]));
    process.exit(1);
}

fs.writeFileSync(path.join(root, 'standalone.html'), html);
console.log(`standalone.html written (${(html.length / 1024).toFixed(1)} KB)`);
