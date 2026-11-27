const { chromium, devices } = require('playwright');
/**
 * Screenshots of a theme running in a shop, per device: laptop, mobile-v, mobile-h, mobile-folded-v.
 * Writes <screenshotsDir>/<device>/0N-*.jpg and screenshots.json; then build the gallery with
 * `python3 bin/screenshot-gallery.py`.
 *
 *   npm i --no-save playwright && npx playwright install chromium
 *   [RESOLVE="MAP *.example.test 127.0.0.1"] node bin/screenshots.cjs apex-child-2/docs/screenshots \
 *       electronics.example.test /Smartphones/ /Smartphones/Some-Product.html "apex-child-2 · Voltage" "Electronics shop"
 *
 * The product page must show the one-page checkout's "Jetzt kaufen" button (OPC module active).
 */
const fs = require('fs'); const path = require('path');
const DEVICES = [
  { folder: 'laptop', label: 'Laptop · 1440 × 900', ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  { folder: 'mobile-v', label: 'Phone portrait · iPhone 14 (390 × 664)', ctx: devices['iPhone 14'] },
  { folder: 'mobile-h', label: 'Phone landscape · iPhone 14 (750 × 340)', ctx: devices['iPhone 14 landscape'] },
  { folder: 'mobile-folded-v', label: 'Foldable, folded, portrait · Galaxy Z Fold cover screen (344 × 882)', ctx: {
      viewport: { width: 344, height: 882 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-F946B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36' } },
];
(async () => {
  const [out, host, category, product, themeLabel, shopLabel] = process.argv.slice(2);
  const base = `https://${host}`;
  // RESOLVE="MAP *.example.test 127.0.0.1" maps local-only shop domains without touching /etc/hosts
  const b = await chromium.launch({ args: process.env.RESOLVE ? [`--host-resolver-rules=${process.env.RESOLVE}`] : [] });
  const prep = async (p) => {
    await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'));
    await p.waitForTimeout(2500);
    // reproducible header: stop apex's rotating USP animation in its resting state (first USP shown)
    await p.addStyleTag({ content: '.usp-list .list-inline-item{animation:none!important;transform:none!important}'
      + '.header .usp-list .list-inline-item:not(:first-child){visibility:hidden}'
      + '@media (min-width:992px){.header .usp-list .list-inline-item:not(:first-child){visibility:visible}}' });
    await p.evaluate(() => {   // hide the OPC developer bar (debug mode) — not part of the theme
      for (const el of document.querySelectorAll('body *')) {
        if (getComputedStyle(el).position === 'fixed' && /^\s*⚙?\s*OPC Dev/.test(el.innerText || '')) el.style.display = 'none';
      }
    });
  };
  const manifest = { theme: themeLabel, shop: shopLabel, url: base + '/', taken: new Date().toISOString().slice(0, 10), devices: [] };
  for (const dev of DEVICES) {
    const dir = path.join(out, dev.folder); fs.mkdirSync(dir, { recursive: true });
    const p = await (await b.newContext({ ...dev.ctx, ignoreHTTPSErrors: true })).newPage();
    const shots = [];
    const shoot = async (file, caption, fullPage) => {
      await p.screenshot({ path: path.join(dir, file), type: 'jpeg', quality: 78, fullPage, scale: fullPage ? 'css' : 'device' });
      shots.push({ file, caption });
    };
    await p.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 60000 }); await prep(p);
    await shoot('01-start.jpg', 'Start page (full length)', true);
    await p.goto(`${base}${category}`, { waitUntil: 'domcontentloaded' }); await prep(p);
    await shoot('02-category.jpg', `Category page ${category}`, false);
    await p.goto(`${base}${product}`, { waitUntil: 'domcontentloaded' }); await prep(p);
    await shoot('03-product.jpg', 'Product detail page', false);
    const buy = p.locator('button:has-text("Jetzt kaufen")').first();
    await buy.scrollIntoViewIfNeeded().catch(() => {});
    await buy.click();
    await p.locator('.modal.show').first().waitFor({ state: 'visible', timeout: 15000 }); await prep(p);
    await shoot('04-checkout-opc.jpg', 'One-page checkout modal after "Jetzt kaufen"', false);
    manifest.devices.push({ folder: dev.folder, label: dev.label, shots });
    console.log(`  ${dev.folder}: ${shots.length} shots`);
    await p.context().close();
  }
  fs.writeFileSync(path.join(out, 'screenshots.json'), JSON.stringify(manifest, null, 2) + '\n');
  await b.close();
})();
