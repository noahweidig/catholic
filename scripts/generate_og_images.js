/**
 * Generates Open Graph / social share cards (1200x630) for every page of the site.
 *
 * Usage: node scripts/generate_og_images.js
 *
 * Requires Playwright with a Chromium build available. Cards are written to
 * images/og/<slug>.jpg and are committed to the repository so that crawlers can
 * fetch them as static assets.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'images', 'og');
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'site_pages.json'), 'utf8'));

const WIDTH = 1200;
const HEIGHT = 630;

function loadPlaywright() {
    try {
        return require('playwright');
    } catch (err) {
        // Fall back to a globally installed Playwright (common in CI images).
        const globalRoot = process.env.NODE_PATH || '/usr/lib/node_modules';
        return require(path.join(globalRoot, 'playwright'));
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const MARK_SVG = fs.readFileSync(path.join(ROOT, 'images', 'favicon.svg'), 'utf8');

function cardHtml(page, siteName) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(120% 90% at 50% -20%, rgba(216, 184, 113, 0.28) 0%, rgba(216, 184, 113, 0) 60%),
      linear-gradient(150deg, #16304F 0%, #0F2540 45%, #081726 100%);
    font-family: 'Lora', 'Liberation Serif', Georgia, serif;
    color: #F6F2E9;
  }
  .frame {
    position: absolute;
    inset: 28px;
    border: 1px solid rgba(216, 184, 113, 0.42);
    border-radius: 4px;
  }
  .frame::after {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(216, 184, 113, 0.16);
    border-radius: 2px;
  }
  .watermark {
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
    width: 470px;
    height: 470px;
    opacity: 0.09;
  }
  .watermark svg { width: 100%; height: 100%; }
  .content {
    position: absolute;
    inset: 0;
    padding: 66px 90px 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .brand svg { width: 54px; height: 54px; display: block; }
  .brand-name {
    font-family: 'Cinzel', 'Liberation Serif', Georgia, serif;
    font-weight: 600;
    font-size: 27px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: #E7CE94;
  }
  .body { max-width: 790px; }
  .eyebrow {
    font-family: 'Cinzel', 'Liberation Serif', Georgia, serif;
    font-size: 19px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: rgba(231, 206, 148, 0.86);
    margin-bottom: 22px;
  }
  h1 {
    font-family: 'Cinzel', 'Liberation Serif', Georgia, serif;
    font-weight: 600;
    font-size: 66px;
    line-height: 1.1;
    letter-spacing: 0.005em;
    color: #FBF7EF;
  }
  .rule {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 28px 0 24px;
    width: 340px;
  }
  .rule span { height: 1px; flex: 1; }
  .rule .left { background: linear-gradient(90deg, rgba(216,184,113,0) 0%, #D8B871 100%); }
  .rule .right { background: linear-gradient(90deg, #D8B871 0%, rgba(216,184,113,0) 100%); }
  .rule .diamond {
    width: 9px; height: 9px; flex: none;
    background: #D8B871;
    transform: rotate(45deg);
  }
  .subtitle {
    font-family: 'Cormorant Garamond', 'Lora', Georgia, serif;
    font-size: 31px;
    line-height: 1.4;
    font-style: italic;
    color: rgba(246, 242, 233, 0.82);
    max-width: 720px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Cinzel', 'Liberation Serif', Georgia, serif;
    font-size: 17px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(246, 242, 233, 0.55);
  }
  .footer .motto { color: rgba(231, 206, 148, 0.72); letter-spacing: 0.18em; }
</style>
</head>
<body>
  <div class="watermark">${MARK_SVG.replace(/<rect[^>]*fill="url\(#tile\)"\/>/, '').replace(/<rect x="3.25"[\s\S]*?\/>/, '')}</div>
  <div class="frame"></div>
  <div class="content">
    <div class="brand">${MARK_SVG}<div class="brand-name">${escapeHtml(siteName)}</div></div>
    <div class="body">
      <div class="eyebrow">${escapeHtml(page.eyebrow)}</div>
      <h1>${escapeHtml(page.title)}</h1>
      <div class="rule"><span class="left"></span><span class="diamond"></span><span class="right"></span></div>
      <div class="subtitle">${escapeHtml(page.subtitle)}</div>
    </div>
    <div class="footer">
      <div class="domain">noahweidig.com/catholic</div>
      <div class="motto">Ad Maiorem Dei Gloriam</div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
    const { chromium } = loadPlaywright();
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const browser = await chromium.launch();
    try {
        for (const page of CONFIG.pages) {
            const tab = await browser.newPage({
                viewport: { width: WIDTH, height: HEIGHT },
                deviceScaleFactor: 1
            });
            await tab.setContent(cardHtml(page, CONFIG.siteName), { waitUntil: 'load' });
            await tab.evaluate(() => document.fonts && document.fonts.ready);
            await tab.waitForTimeout(300);
            const out = path.join(OUT_DIR, page.slug + '.jpg');
            await tab.screenshot({ path: out, type: 'jpeg', quality: 92 });
            await tab.close();
            console.log('Wrote ' + path.relative(ROOT, out));
        }
    } finally {
        await browser.close();
    }
}

main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
