// ReparoNovo · caso real. Pure function of time: window.seek(t) paints frame t.
// Timing in beats (u) on the measured grid; docs/shotlist.md is the plan.
import * as M from './lib/motion.js';
import { ARCH, ARCH_VB } from './arch.js';

const { W, H, E, prog, lerp, clamp, springU, springKeys, SPRING, wobble, font, layout, glyph, text, fill, rrect } = M;

const C = { ink: '#0F1C24', bone: '#FAF8F5', coral: '#E8683C', coralL: '#F0A07E', bezel: '#070B0E' };
const D = (s) => font(s, 430, 'Display');
const DI = (s) => `italic 380 ${Math.round(s)}px Display`;
const UI = (s, w = 400) => font(s, w, 'UI');
const MONO = (s) => `500 ${Math.round(s)}px Mono`;
const RISE = { stiffness: 210, damping: 24 };
const ARCHP = ARCH.map((d) => new Path2D(d));


// Contenido: content.json (tipo, label, title con *cursiva*, sub [hasta 3 líneas], cta, img opcional).
const H_ = await (await fetch('content.json')).json();
// Un color por tipo de historia (obligatorio).
const TIPOS = {
  aviso:   { bg: C.coral,  fg: C.ink,  em: C.bone,   lab: C.ink,    btn: C.ink,   btnT: C.bone }, // seguridad, urgente, plazos
  novedad: { bg: C.ink,    fg: C.bone, em: C.coralL, lab: C.coralL, btn: C.coral, btnT: C.ink },  // noticias, cambios, nuevo en el perfil
  consejo: { bg: C.bone,   fg: C.ink,  em: C.coral,  lab: C.coral,  btn: C.ink,   btnT: C.bone }, // trucos, preguntas, cómo se hace
  oferta:  { bg: C.coralL, fg: C.ink,  em: C.ink,    lab: C.ink,    btn: C.ink,   btnT: C.bone }, // precios, promociones, servicios
};
const TH = TIPOS[H_.tipo] || TIPOS.aviso;
const SUBS = [].concat(H_.sub || []);

// Todo entra en los primeros ~3 s y luego se queda quieto. Sin zoom ni cámara.
const HITS = [
  [0.4, 'titular', 'pop', { pitch: 'E5' }],
  [3.2, 'apoyo', 'blip', { pitch: 'A6' }],
  [3.4 + SUBS.length * 0.5, 'botón', 'pop', { pitch: 'E6' }],
];
// ------------------------------------------------------------ helpers
const dots = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Rich display line: segs = [[text, em]]. Glyphs rise from a clipped baseline; em words
// focus in (blur + spread -> sharp) starting at emAt.
function line(ctx, u, segs, x, base, size, u0, col, colEm, { emAt = null, align = 'left' } = {}) {
  const track = -0.02 * size;
  const parts = segs.map(([t, em]) => ({ t, em, f: em ? DI(size) : D(size) }));
  const widths = parts.map((p) => layout(ctx, p.t, p.f, track).width);
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - total / 2 : x;
  let idx = 0;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, base - size * 1.1, W, size * 1.45); ctx.clip();
  parts.forEach((p, pi) => {
    const L = layout(ctx, p.t, p.f, track);
    const n = L.glyphs.length;
    L.glyphs.forEach((g, j) => {
      if (g.ch === ' ') { idx++; return; }
      if (p.em) {
        const s0 = emAt ?? u0;
        const e = E.outCubic(prog(u, s0, s0 + 2.2));
        const k = springU(u, s0 + j * 0.02, RISE);
        if (k <= 0) return;
        const spread = (1 - e) * 0.16 * size * (j - n / 2);
        ctx.save(); ctx.globalAlpha = clamp(e * 1.6);
        if (e < 0.98) ctx.filter = `blur(${((1 - e) * 16).toFixed(1)}px)`;
        glyph(ctx, g.ch, cx + g.cx + spread, base + (1 - k) * size * 0.5, p.f, colEm);
        ctx.restore();
      } else {
        const k = springU(u, u0 + idx * 0.022, RISE);
        if (k > 0) glyph(ctx, g.ch, cx + g.cx, base + (1 - k) * size * 1.15, p.f, col);
      }
      idx++;
    });
    cx += widths[pi];
  });
  ctx.restore();
}

function label(ctx, u, str, x, y, u0, col, align = 'left') {
  const k = springU(u, u0, SPRING.snappy);
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k);
  text(ctx, str.toUpperCase(), x + (1 - k) * -24 * (align === 'left' ? 1 : 0), y, MONO(26), col, align, 2.2);
  ctx.restore();
}

function tag(ctx, u, n, str, x, y, side, uIn, uOut = 999) {
  const k = springU(u, uIn, SPRING.bouncy);
  const o = E.inBack(prog(u, uOut, uOut + 0.5), 1.6);
  if (k <= 0 || o >= 1) return;
  const f = UI(31, 600), fm = MONO(22);
  const tw = layout(ctx, str, f).width, nw = layout(ctx, n, fm).width;
  const w = 28 + nw + 14 + tw + 30, h = 68;
  const x0 = side === 'r' ? x - w : x;
  const ax = side === 'r' ? x : x;
  ctx.save();
  ctx.translate(ax, y + h / 2); ctx.scale(k * (1 - o * 0.3), k * (1 - o * 0.3)); ctx.translate(-ax, -(y + h / 2));
  ctx.globalAlpha = clamp(k) * (1 - o);
  ctx.translate(0, -o * 30);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 14;
  rrect(ctx, x0, y, w, h, h / 2); ctx.fillStyle = C.bone; ctx.fill();
  ctx.shadowColor = 'transparent';
  text(ctx, n, x0 + 28, y + 43, fm, C.coral);
  text(ctx, str, x0 + 28 + nw + 14, y + 45, f, C.ink);
  ctx.restore();
}

const PH = { x: 150, y: 500, w: 780, h: 1560 };
function phone(ctx, img, x, y, scroll, zoom = 1) {
  const { w, h } = PH;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 90; ctx.shadowOffsetY = 40;
  rrect(ctx, x, y, w, h, 76); ctx.fillStyle = C.bezel; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.stroke();
  const ix = x + 16, iy = y + 16, iw = w - 32, ih = h - 32;
  rrect(ctx, ix, iy, iw, ih, 60); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(ix, iy, iw, ih);
  if (img) {
    const s = (iw / img.width) * zoom;
    const maxS = img.height * s - ih;
    const sc = clamp(scroll, 0, maxS);
    ctx.drawImage(img, ix - (img.width * s - iw) / 2, iy - sc, img.width * s, img.height * s);
  }
  ctx.restore();
  rrect(ctx, x + w / 2 - 62, y + 32, 124, 36, 18); ctx.fillStyle = C.bezel; ctx.fill();
}

function drawArch(ctx, x, y, h, color, per = null) {
  const [vx, vy, vw, vh] = ARCH_VB, s = h / vh;
  ARCHP.forEach((p, i) => {
    const k = per ? per(i) : 1;
    if (k <= 0) return;
    ctx.save();
    ctx.globalAlpha = clamp(k);
    ctx.translate(x, y + (1 - k) * 70); ctx.scale(s, s); ctx.translate(-vx, -vy);
    ctx.fillStyle = color; ctx.fill(p);
    ctx.restore();
  });
}





// Parte el titular (con *cursiva*) en líneas que quepan en el ancho.
let LINES = null, SIZE = 116;
function wrapTitle(ctx) {
  const words = []; let em = false;
  H_.title.split(' ').forEach((w) => {
    let st = em; if (w.startsWith('*')) { st = true; w = w.slice(1); }
    let end = st; if (w.endsWith('*')) { end = false; w = w.slice(0, -1); }
    words.push([w, st ? 1 : 0]); em = end;
  });
  const maxW = W - 150;
  for (SIZE = 116; SIZE >= 84; SIZE -= 8) {
    const lines = []; let cur = [], cw = 0;
    const wid = (t, e) => layout(ctx, t, e ? DI(SIZE) : D(SIZE), -0.02 * SIZE).width;
    words.forEach(([t, e]) => {
      const add = wid((cur.length ? ' ' : '') + t, e);
      if (cur.length && cw + add > maxW) { lines.push(cur); cur = []; cw = 0; }
      cur.push([t, e]); cw += wid((cur.length > 1 ? ' ' : '') + t, e);
    });
    if (cur.length) lines.push(cur);
    LINES = lines.map((ln) => { const segs = []; ln.forEach(([t, e], i) => { const tt = (i ? ' ' : '') + t; if (segs.length && segs.at(-1)[1] === e) segs.at(-1)[0] += tt; else segs.push([tt, e]); }); return segs; });
    if (LINES.length <= 4) break;
  }
}

function story(ctx, u, IMG) {
  if (!LINES) wrapTitle(ctx);
  fill(ctx, TH.bg);
  // Identidad obligatoria: arco + «Bahiga.» en Fraunces, siempre visible y quieto.
  const h = 96, w = h * ARCH_VB[2] / ARCH_VB[3];
  drawArch(ctx, 76, 290, h, TH.fg);
  text(ctx, 'Bahiga.', 76 + w + 22, 372, D(78), TH.fg, 'left', -1.5);

  const img = H_.img && IMG.img;
  const lh = SIZE * 1.2;
  let y = img ? 720 : 780 - Math.max(0, LINES.length - 3) * 40;
  label(ctx, u, H_.label, 76, y - 150 + (img ? 0 : 0), 0, TH.lab);
  LINES.forEach((segs, i) => line(ctx, u, segs, 70, y + i * lh, SIZE, 0.4 + i * 0.6, TH.fg, TH.em, { emAt: 0.4 + i * 0.6 + 0.3 }));
  y += (LINES.length - 1) * lh + 115;
  SUBS.forEach((t, i) => {
    const last = i === SUBS.length - 1 && SUBS.length > 1;
    const ks = springU(u, 3.2 + i * 0.5, SPRING.gentle);
    if (ks > 0) { ctx.save(); ctx.globalAlpha = clamp(ks); text(ctx, t, 76, y + i * 62 + (1 - ks) * 16, UI(last ? 44 : 42, last ? 600 : 400), TH.fg); ctx.restore(); }
  });
  y += (SUBS.length ? (SUBS.length - 1) * 62 : -60);
  if (img) {
    const ki = springU(u, 2.6, SPRING.gentle);
    const iy = y + 60, ih = Math.min(400, 1440 - iy), iw = W - 152;
    if (ki > 0 && ih > 120) {
      ctx.save(); ctx.globalAlpha = clamp(ki);
      rrect(ctx, 76, iy + (1 - ki) * 20, iw, ih, 28); ctx.clip();
      const s = Math.max(iw / img.width, ih / img.height);
      ctx.drawImage(img, 76 + (iw - img.width * s) / 2, iy + (1 - ki) * 20, img.width * s, img.height * s); // arriba alineado
      ctx.restore();
    }
    y = iy + ih;
    if (H_.url) text(ctx, H_.url.toUpperCase(), 76, y + 50, MONO(26), TH.fg, 'left', 2.2);
    y += 40;
  }
  const yBtn = Math.max(1480, y + 150);
  const kb = springU(u, 3.4 + SUBS.length * 0.5, SPRING.bouncy);
  if (kb > 0) {
    const f = UI(40, 600), s = H_.cta, tw = layout(ctx, s, f).width, bw = tw + 100, bh = 104;
    ctx.save(); ctx.translate(76 + bw / 2, yBtn); ctx.scale(clamp(kb, 0, 1.2), clamp(kb, 0, 1.2));
    rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = TH.btn; ctx.fill();
    text(ctx, s, 0, 14, f, TH.btnT, 'center'); ctx.restore();
  }
  text(ctx, 'BAHIGA.ES', 76, Math.max(1600, yBtn + 120), MONO(28), TH.fg, 'left', 3);
}
M.film({
  fonts: [D(100), DI(100), UI(40), UI(40, 600), MONO(26)],
  images: H_.img ? { img: H_.img } : {},
  hits: HITS,
  draw(ctx, u, t, IMG) { story(ctx, u, IMG || {}); },
});
