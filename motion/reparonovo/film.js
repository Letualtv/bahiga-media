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

const HITS = [
  [0, 'gancho', 'impact'],
  [1, 'línea 2', 'pop', { pitch: 'A5' }],
  [2, 'línea 3', 'pop', { pitch: 'D6' }],
  [4, 'arco aparece', 'pop', { pitch: 'D5' }],
  [8, 'el arco llena el plano', 'riser', { len: 1.6 }],
  [8, 'teléfono', 'thud'],
  [10, 'etiqueta 1', 'pop', { pitch: 'A5' }],
  [16, 'entra el ritmo', 'impact'],
  [20, 'etiqueta 3', 'pop', { pitch: 'E6' }],
  [24, 'barrido a la cifra', 'whoosh', { len: 0.5 }],
  [24, 'cifra', 'thud'],
  [24.5, 'contador', 'tick'], [25.0, 'contador', 'tick'], [25.5, 'contador', 'tick'],
  [26, 'tarjeta de reseñas', 'pop', { pitch: 'A5' }],
  [28, 'ahora también venden', 'blip', { pitch: 'A6' }],
  [32, 'push a la ficha', 'whoosh', { len: 0.5, from: 2400, to: 600 }],
  [32, 'ficha', 'thud'],
  [34, 'etiqueta recogida', 'pop', { pitch: 'A5' }],
  [38, 'etiqueta envío', 'pop', { pitch: 'D6' }],
  [44, 'barrido hueso', 'whoosh', { len: 0.4, from: 600, to: 2400 }],
  [44.4, 'fila 1', 'click'], [48.4, 'fila 2', 'click'], [52.4, 'fila 3', 'click'],
  [56, 'precio', 'impact'],
  [56.5, 'contador', 'tick'], [57, 'contador', 'tick'], [57.5, 'contador', 'tick'],
  [58, 'dato 1', 'click'], [59, 'dato 2', 'click'], [60, 'dato 3', 'click'],
  [64, 'cierre', 'impact'],
  [65.5, 'logo', 'bell', { pitch: 'D6' }],
  [67.5, 'botón', 'pop', { pitch: 'A5' }],
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
  rrect(ctx, x, y, w, h, 96); ctx.fillStyle = C.bezel; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.stroke();
  const ix = x + 18, iy = y + 18, iw = w - 36, ih = h - 36;
  rrect(ctx, ix, iy, iw, ih, 78); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(ix, iy, iw, ih);
  if (img) {
    const s = (iw / img.width) * zoom;
    const maxS = img.height * s - ih;
    const sc = clamp(scroll, 0, maxS);
    ctx.drawImage(img, ix - (img.width * s - iw) / 2, iy - sc, img.width * s, img.height * s);
  }
  ctx.restore();
  rrect(ctx, x + w / 2 - 80, y + 38, 160, 44, 22); ctx.fillStyle = C.bezel; ctx.fill();
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

// ------------------------------------------------------------ S1 gancho  (0..8)
function s1(ctx, u) {
  fill(ctx, C.bone);
  label(ctx, u, '01 — Caso real', 76, 780, -0.4, C.coral);
  const sz = 150;
  line(ctx, u, [['Un taller de', 0]], 70, 960, sz, -0.7, C.ink, C.coral);
  line(ctx, u, [['móviles que', 0]], 70, 1115, sz, 0.6, C.ink, C.coral);
  line(ctx, u, [['vende ', 0], ['online.', 1]], 70, 1270, sz, 1.6, C.ink, C.coral, { emAt: 2.1 });
  const kS = springU(u, 3.2, SPRING.gentle);
  if (kS > 0) { ctx.save(); ctx.globalAlpha = kS; text(ctx, 'ReparoNovo · Priego de Córdoba', 76, 1370 + (1 - kS) * 20, UI(40), C.ink); ctx.restore(); }
  // the arch: lands, then a log-space dolly into its left pillar until ink fills the frame
  const ka = springU(u, 4, SPRING.bouncy);
  if (ka > 0) {
    const h0 = 150, [vx, vy, vw, vh] = ARCH_VB, s0 = h0 / vh;
    const ax = 880, ay = 420;
    const fxs = ax + (195 - vx) * s0, fys = ay + (840 - vy) * s0;          // pillar on screen
    const p = E.inCubic(prog(u, 6, 8));
    const z = 1 * (90 / 1) ** p;
    const cx = lerp(fxs, W / 2, E.inOutCubic(p)), cy = lerp(fys, H / 2, E.inOutCubic(p));
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(z * ka, z * ka); ctx.translate(-fxs, -fys);
    drawArch(ctx, ax, ay, h0, C.ink);
    ctx.restore();
  }
}

// ------------------------------------------------------------ S2+S3 la web en el móvil (8..24)
function s23(ctx, u, IMG) {
  fill(ctx, C.ink);
  label(ctx, u, 'Trabajo real · Priego de Córdoba', 76, 330, 8.3, C.coralL);
  line(ctx, u, [['Reparo', 0], ['Novo.', 1]], 70, 440, 104, 8.5, C.bone, C.coralL, { emAt: 9 });
  const k = springU(u, 7.9, SPRING.gentle);
  const y = lerp(H + 60, PH.y, k) + 10 * wobble(u - 9.2, 1.6, 4) + 8 * Math.sin(u * 0.7);
  const sc = M.kf(u, [[8.5, 0], [10, 300], [15.6, 560], [16.6, 760], [23.4, 1072]], E.inOutSine);
  phone(ctx, IMG.movil, PH.x, y, sc);
  tag(ctx, u, '01', 'Presupuesto en un toque', 40, 760, 'l', 10, 15.4);
  tag(ctx, u, '02', 'Reacondicionados con stock real', W - 40, 980, 'r', 16);
  tag(ctx, u, '03', 'Pensada para el móvil', 40, 1220, 'l', 20);
}

// ------------------------------------------------------------ S4 confianza (24..32)
function s4(ctx, u, IMG) {
  fill(ctx, C.bone);
  label(ctx, u, '02 — Lo que ya tenían', 76, 400, 23.8, C.coral);
  const n = 1014 * E.outExpo(prog(u, 23.9, 26.2));
  const kn = springU(u, 23.8, SPRING.snappy);
  ctx.save(); ctx.globalAlpha = clamp(kn);
  text(ctx, dots(n), 62, 700 + (1 - kn) * 60, font(300, 380, 'Display'), C.ink, 'left', -12);
  ctx.restore();
  line(ctx, u, [['reseñas en Google.', 0]], 70, 830, 84, 24.8, C.ink, C.coral);
  line(ctx, u, [['Ahora también ', 0], ['venden.', 1]], 70, 930, 84, 27.4, C.ink, C.coral, { emAt: 28 });
  const kc = springU(u, 26, SPRING.gentle);
  if (kc > 0 && IMG.rev) {
    const w = 760, h = Math.round(w * 280 / 500), x = (W - w) / 2, y = lerp(H, 1010, kc) + 8 * wobble(u - 27, 1.6, 4) - 26 * prog(u, 27, 32);
    ctx.save();
    ctx.shadowColor = 'rgba(15,28,36,.18)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
    rrect(ctx, x, y, w, h, 28); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.clip();
    ctx.drawImage(IMG.rev, 160, 18, 500, 280, x, y, w, h);
    ctx.restore();
  }
}

// ------------------------------------------------------------ S5 la ficha (32..44)
function s5(ctx, u, IMG) {
  fill(ctx, C.ink);
  label(ctx, u, '03 — La ficha de producto', 76, 330, 31.8, C.coralL);
  line(ctx, u, [['Pensada para ', 0], ['comprar.', 1]], 70, 440, 96, 32.1, C.bone, C.coralL, { emAt: 32.8 });
  const sc = M.kf(u, [[32.4, 0], [33.8, 1060], [37.6, 1140], [38.6, 1195], [44, 1195]], E.inOutSine);
  const z = 1 + 0.025 * prog(u, 38, 44);
  phone(ctx, IMG.producto, PH.x, PH.y + 8 * Math.sin(u * 0.7), sc, z);
  tag(ctx, u, '01', 'Recogida gratis en Priego', W - 40, 1160, 'r', 34);
  tag(ctx, u, '02', 'Envío MRW en 24/48 h', 40, 1380, 'l', 38);
}

// ------------------------------------------------------------ S6 lo que montamos (44..56)
const ROWS = [
  [['Tienda con', 0]], [['pagos y ', 0], ['envíos.', 1]],
  [['Presupuestos de', 0]], [['reparación.', 1]],
  [['SEO local en', 0]], [['Priego.', 1]],
];
function s6(ctx, u) {
  fill(ctx, C.bone);
  label(ctx, u, '04 — Lo que montamos', 76, 360, 43.9, C.coral);
  for (let j = 0; j < 3; j++) {
    const u0 = 44 + j * 4, top = 410 + j * 350;
    const hp = E.inOutCubic(prog(u, u0 - 0.1, u0 + 0.9));
    if (hp > 0) { ctx.fillStyle = 'rgba(15,28,36,.18)'; ctx.fillRect(76, top, (W - 152) * hp, 2); }
    const kn = springU(u, u0 + 0.2, SPRING.snappy);
    if (kn > 0) { ctx.save(); ctx.globalAlpha = clamp(kn); text(ctx, '0' + (j + 1), 76, top + 90, MONO(28), C.coral); ctx.restore(); }
    line(ctx, u, ROWS[j * 2], 196, top + 125, 96, u0 + 0.4, C.ink, C.coral, { emAt: u0 + 1.2 });
    line(ctx, u, ROWS[j * 2 + 1], 196, top + 230, 96, u0 + 0.8, C.ink, C.coral, { emAt: u0 + 1.2 });
  }
  const hl = E.inOutCubic(prog(u, 53.5, 54.5));
  if (hl > 0) { ctx.fillStyle = 'rgba(15,28,36,.18)'; ctx.fillRect(76, 1460, (W - 152) * hl, 2); }
}

// ------------------------------------------------------------ S7 precio (56..64)
const COLS = [['Precio', '+ IVA'], ['Presupuesto', 'Cerrado'], ['Incluye', 'Pagos y envíos']];
function s7(ctx, u) {
  fill(ctx, C.ink);
  text(ctx, '05 — TIENDAS DESDE', 76, 600, MONO(26), C.coralL, 'left', 2.2);
  const n = 1000 * E.outExpo(prog(u, 55.9, 58.2));
  const sz = 360;
  const f = font(sz, 380, 'Display');
  const L = layout(ctx, dots(n), f, -0.05 * sz);
  text(ctx, dots(n), 58, 950, f, C.bone, 'left', -0.05 * sz);
  text(ctx, '€', 58 + L.width + 16, 950, DI(sz * 0.5), C.coralL);
  const cw = (W - 152 - 48) / 3;
  COLS.forEach(([a, b], j) => {
    const u0 = 58 + j, x = 76 + j * (cw + 24), y = 1060;
    const hp = E.inOutCubic(prog(u, u0 - 0.1, u0 + 0.7));
    if (hp > 0) { ctx.fillStyle = 'rgba(250,248,245,.35)'; ctx.fillRect(x, y, cw * hp, 2); }
    const k = springU(u, u0 + 0.15, SPRING.snappy);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(k); ctx.translate(0, (1 - k) * 24);
    text(ctx, a.toUpperCase(), x, y + 56, MONO(24), 'rgba(250,248,245,.6)', 'left', 1.8);
    text(ctx, b, x, y + 116, UI(42, 600), C.bone);
    ctx.restore();
  });
  const kl = springU(u, 61, SPRING.gentle);
  if (kl > 0) { ctx.save(); ctx.globalAlpha = kl; text(ctx, 'Sabes lo que pagas antes de empezar.', 76, 1340 + (1 - kl) * 20, UI(46), C.bone); ctx.restore(); }
}

// ------------------------------------------------------------ S8 cierre (64..74)
function s8(ctx, u) {
  fill(ctx, C.coral);
  const h = 430, w = h * ARCH_VB[2] / ARCH_VB[3];
  const nP = ARCHP.length;
  drawArch(ctx, (W - w) / 2, 400, h, C.ink, (i) => springU(u, 63.9 + (nP - 1 - i) * 0.11, SPRING.bouncy));
  line(ctx, u, [['Bahiga.', 0]], W / 2, 1040, 170, 65.3, C.ink, C.ink, { align: 'center' });
  const kt = springU(u, 66.3, SPRING.gentle);
  if (kt > 0) { ctx.save(); ctx.globalAlpha = kt; text(ctx, 'Tiendas online para comercios de Córdoba.', W / 2, 1125 + (1 - kt) * 20, UI(40), C.ink, 'center'); ctx.restore(); }
  const kb = springU(u, 67.4, SPRING.bouncy);
  if (kb > 0) {
    const f = UI(38, 600), tw = layout(ctx, 'Cuéntanos qué vendes', f).width, bw = tw + 96, bh = 96;
    ctx.save(); ctx.translate(W / 2, 1250); ctx.scale(kb, kb);
    rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = C.ink; ctx.fill();
    text(ctx, 'Cuéntanos qué vendes', 0, 13, f, C.bone, 'center');
    ctx.restore();
  }
  const kw = springU(u, 68, SPRING.gentle);
  if (kw > 0) { ctx.save(); ctx.globalAlpha = kw; text(ctx, 'BAHIGA.ES', W / 2, 1390, MONO(28), C.ink, 'center', 3); ctx.restore(); }
}

// ------------------------------------------------------------ edit
M.film({
  fonts: [D(100), DI(100), UI(40), UI(40, 600), MONO(26)],
  images: { movil: 'assets/reparonovo-movil.jpg', producto: 'assets/reparonovo-producto-movil.jpg', rev: 'assets/rm-rev.png' },
  hits: HITS,
  draw(ctx, u, t, IMG) {
    if (u < 8) return s1(ctx, u);
    if (u < 23.4) return s23(ctx, u, IMG);
    if (u < 24.6) {                                   // whip: both shots on screen, peaks on beat 24
      const e = E.inOutCubic(prog(u, 23.4, 24.6));
      ctx.save(); ctx.translate(-e * W, 0); s23(ctx, u, IMG); ctx.restore();
      ctx.save(); ctx.translate((1 - e) * W, 0); s4(ctx, u, IMG); ctx.restore();
      return;
    }
    if (u < 31.4) return s4(ctx, u, IMG);
    if (u < 32.6) {                                   // vertical push into the product page
      const e = E.inOutCubic(prog(u, 31.4, 32.6));
      ctx.save(); ctx.translate(0, -e * H); s4(ctx, u, IMG); ctx.restore();
      ctx.save(); ctx.translate(0, (1 - e) * H); s5(ctx, u, IMG); ctx.restore();
      return;
    }
    if (u < 44) {
      s5(ctx, u, IMG);
      const e = E.inOutCubic(prog(u, 43.3, 44));       // bone sweep becomes the next background
      if (e > 0) { ctx.fillStyle = C.bone; ctx.fillRect(W * (1 - e), 0, W * e + 2, H); }
      return;
    }
    if (u < 56) return s6(ctx, u);
    if (u < 64) {
      s7(ctx, u);
      const e = E.inOutCubic(prog(u, 63.2, 64));       // coral rises into the end card
      if (e > 0) { ctx.fillStyle = C.coral; ctx.fillRect(0, H * (1 - e), W, H * e + 2); }
      return;
    }
    s8(ctx, u);
  },
});
