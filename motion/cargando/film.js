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



// Tendencia «cargando %»: el contador sube con cada paso hasta 100 % y cierra en coral.
const STEPS = [
  [2, 12, 'Dominio y correo'],
  [5, 31, 'Diseño a tu medida'],
  [8, 54, 'Textos que venden'],
  [11, 72, 'Pensada para el móvil'],
  [14, 90, 'Lista para Google'],
  [17, 100, 'Publicada'],
];
const END = 19;
const HITS = [
  ...STEPS.map(([b], i) => [b, 'paso', i === STEPS.length - 1 ? 'impact' : 'tick']),
  [END, 'cierre', 'whoosh', { len: 0.4, from: 600, to: 2400 }],
  [END + 1.5, 'logo', 'bell', { pitch: 'A5' }],
  [END + 3.4, 'botón', 'pop', { pitch: 'E6' }],
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






function pct(u) {
  let v = 0;
  for (let i = 0; i < STEPS.length; i++) {
    const [b, p] = STEPS[i], prev = i ? STEPS[i - 1][1] : 0;
    if (u < b) break;
    v = prev + (p - prev) * E.outCubic(prog(u, b, b + 1.2));
  }
  return v;
}
function loading(ctx, u) {
  fill(ctx, C.bone);
  const h = 96, w = h * ARCH_VB[2] / ARCH_VB[3];
  drawArch(ctx, 76, 290, h, C.ink);
  text(ctx, 'Bahiga.', 76 + w + 22, 372, D(78), C.ink, 'left', -1.5);
  label(ctx, u, 'Tu web nueva', 76, 640, 0, C.coral);
  line(ctx, u, [['Cargando', 0], ['…', 1]], 70, 790, 130, 0.3, C.ink, C.coral, { emAt: 0.6 });
  const v = pct(u);
  text(ctx, Math.round(v) + '%', 70, 1080, font(300, 380, 'Display'), C.ink, 'left', -10);
  // barra
  ctx.fillStyle = 'rgba(15,28,36,.12)'; rrect(ctx, 76, 1150, W - 152, 22, 11); ctx.fill();
  ctx.fillStyle = C.coral; rrect(ctx, 76, 1150, Math.max(22, (W - 152) * v / 100), 22, 11); ctx.fill();
  // pasos hechos
  STEPS.forEach(([b, p, t], i) => {
    const k = springU(u, b + 0.3, SPRING.gentle);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(k);
    const y = 1260 + i * 62 + (1 - k) * 14;
    text(ctx, '✓', 76, y, UI(40, 600), C.coral);
    text(ctx, t, 126, y, UI(40, i === STEPS.length - 1 ? 600 : 400), C.ink);
    ctx.restore();
  });
}
function endCard(ctx, u) {
  fill(ctx, C.coral);
  const b = END;
  const h = 430, w = h * ARCH_VB[2] / ARCH_VB[3], nP = ARCHP.length;
  drawArch(ctx, (W - w) / 2, 400, h, C.ink, (i) => springU(u, b + 0.2 + (nP - 1 - i) * 0.11, SPRING.bouncy));
  line(ctx, u, [['Bahiga.', 0]], W / 2, 1040, 170, b + 1.5, C.ink, C.ink, { align: 'center' });
  const kt = springU(u, b + 2.5, SPRING.gentle);
  if (kt > 0) { ctx.save(); ctx.globalAlpha = kt; text(ctx, 'Webs desde 900 € + IVA, en 3 a 6 semanas.', W / 2, 1125, UI(40), C.ink, 'center'); ctx.restore(); }
  const kb = springU(u, b + 3.4, SPRING.bouncy);
  if (kb > 0) {
    const f = UI(38, 600), s = 'Pide la tuya por WhatsApp', tw = layout(ctx, s, f).width, bw = tw + 96, bh = 96;
    ctx.save(); ctx.translate(W / 2, 1250); ctx.scale(kb, kb);
    rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = C.ink; ctx.fill();
    text(ctx, s, 0, 13, f, C.bone, 'center'); ctx.restore();
  }
  const kw = springU(u, b + 4, SPRING.gentle);
  if (kw > 0) { ctx.save(); ctx.globalAlpha = kw; text(ctx, 'BAHIGA.ES', W / 2, 1390, MONO(28), C.ink, 'center', 3); ctx.restore(); }
}
M.film({
  fonts: [D(100), DI(100), UI(40), UI(40, 600), MONO(26)],
  images: {},
  hits: HITS,
  draw(ctx, u) {
    if (u < END - 0.8) return loading(ctx, u);
    if (u < END) { loading(ctx, u); const e = E.inOutCubic(prog(u, END - 0.8, END)); ctx.fillStyle = C.coral; ctx.fillRect(0, H * (1 - e), W, H * e + 2); return; }
    endCard(ctx, u);
  },
});
