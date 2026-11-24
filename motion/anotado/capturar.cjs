// Captura las muestras reales de bahiga.es/webs desde una copia local del sitio (repo Letualtv/Bahiga servido en 127.0.0.1:4399).
const { chromium } = require('playwright');
const D = '/home/claude/bahiga-media/motion/anotado/capturas/';
const S = ['barberia','estetica','taller','reformas','bar','rural','floristeria','autoescuela','entreno','merceria','fisio','panaderia','electricista','moda','peluqueria'];
(async () => {
  const b = await chromium.launch();
  for (const s of S) {
    const c = await b.newContext({ viewport: { width: 372, height: 746 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const p = await c.newPage();
    await p.goto(`http://127.0.0.1:4399/webs/${s}/demo`, { waitUntil: 'networkidle' });
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(120); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(350);
    await p.screenshot({ path: `${D}${s}.jpg`, type: 'jpeg', quality: 84 });
    if (['barberia', 'estetica', 'taller'].includes(s)) {
      await p.screenshot({ path: `${D}${s}-barra.jpg`, type: 'jpeg', quality: 88, clip: { x: 0, y: 746 - 62, width: 372, height: 62 } });
      await p.evaluate(() => { for (const e of document.querySelectorAll('body *')) { const f = getComputedStyle(e).position; if (f === 'fixed') e.style.visibility = 'hidden'; } });
      await p.screenshot({ path: `${D}${s}-larga.jpg`, type: 'jpeg', quality: 80, fullPage: true });
    }
    await c.close();
  }
  await b.close();
})();
