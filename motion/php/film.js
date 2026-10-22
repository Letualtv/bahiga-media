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
  [1, 'línea 2', 'pop', { pitch: 'E5' }],
  [2, 'afecta', 'blip', { pitch: 'A6' }],
  [8, 'cifra', 'impact'],
  [8.5, 'contador', 'tick'], [9, 'contador', 'tick'], [9.5, 'contador', 'tick'],
  [10, 'dos fallos', 'pop', { pitch: 'A5' }],
  [12, 'sin contraseña', 'blip', { pitch: 'E6' }],
  [16, 'versiones', 'thud'],
  [18, 'diez años', 'pop', { pitch: 'C6' }],
  [20, 'explotar', 'blip', { pitch: 'A6' }],
  [24, 'qué hacer', 'whoosh', { len: 0.4, from: 600, to: 2400 }],
  [24.4, 'fila 1', 'click'], [28.4, 'fila 2', 'click'], [32.4, 'fila 3', 'click'],
  [40, 'pregunta', 'impact'],
  [42, 'gratis', 'blip', { pitch: 'E6' }],
  [48, 'cierre', 'impact'],
  [49.5, 'logo', 'bell', { pitch: 'A5' }],
  [51.5, 'botón', 'pop', { pitch: 'E6' }],
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



function s1(ctx, u) {
  fill(ctx, C.bone);
  label(ctx, u, 'Aviso · Seguridad web', 76, 780, -0.4, C.coral);
  line(ctx, u, [['Si tu web', 0]], 70, 960, 150, -0.7, C.ink, C.coral);
  line(ctx, u, [['usa PHP, esto', 0]], 70, 1115, 150, 0.6, C.ink, C.coral);
  line(ctx, u, [['te ', 0], ['afecta.', 1]], 70, 1270, 150, 1.6, C.ink, C.coral, { emAt: 2 });
  const k = springU(u, 3.2, SPRING.gentle);
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; text(ctx, 'WordPress, WooCommerce, PrestaShop… casi todas.', 76, 1370 + (1 - k) * 20, UI(38), C.ink); ctx.restore(); }
  const ka = springU(u, 4, SPRING.bouncy) * (1 - E.outCubic(prog(u, 7.2, 8)));
  if (ka > 0) { ctx.save(); ctx.globalAlpha = clamp(ka); drawArch(ctx, 880, 380, 150 * (0.6 + 0.4 * ka), C.ink); text(ctx, 'Bahiga.', 852, 508, D(84), C.ink, 'right', -1.5); ctx.restore(); }
}
function s2(ctx, u) {
  fill(ctx, C.ink);
  label(ctx, u, 'Publicado el 21 de octubre', 76, 470, 7.8, C.coralL);
  const n = 9.2 * E.outExpo(prog(u, 7.9, 9.8));
  const kn = springU(u, 7.8, SPRING.snappy);
  const f = font(380, 380, 'Display');
  const s = n.toFixed(1).replace('.', ',');
  ctx.save(); ctx.globalAlpha = clamp(kn);
  text(ctx, s, 58, 860 + (1 - kn) * 60, f, C.bone, 'left', -19);
  const L = layout(ctx, s, f, -19);
  text(ctx, '/10', 58 + L.width + 20, 860, DI(150), C.coralL);
  ctx.restore();
  line(ctx, u, [['Dos fallos críticos', 0]], 70, 1010, 84, 9.8, C.bone, C.coralL);
  line(ctx, u, [['en el núcleo de PHP.', 0]], 70, 1105, 84, 10.4, C.bone, C.coralL);
  line(ctx, u, [['Permiten entrar sin ', 0]], 70, 1250, 84, 11.6, C.bone, C.coralL);
  line(ctx, u, [['contraseña.', 1]], 70, 1345, 84, 12, C.bone, C.coralL, { emAt: 12 });
}
function s3(ctx, u) {
  fill(ctx, C.coral);
  label(ctx, u, 'A quién afecta', 76, 560, 15.8, C.ink);
  line(ctx, u, [['PHP 5.4', 0]], 70, 760, 170, 16, C.ink, C.bone);
  const kr = E.inOutCubic(prog(u, 16.6, 17.6));
  if (kr > 0) { ctx.fillStyle = C.ink; ctx.fillRect(80, 820, 600 * kr, 4); }
  line(ctx, u, [['→ PHP 8.5', 0]], 70, 960, 170, 17, C.ink, C.bone);
  const k = springU(u, 18, SPRING.gentle);
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; text(ctx, 'Casi todas las versiones de los últimos diez años.', 76, 1060 + (1 - k) * 20, UI(40), C.ink); ctx.restore(); }
  line(ctx, u, [['Y ya se intenta ', 0]], 70, 1240, 92, 19.6, C.ink, C.bone);
  line(ctx, u, [['explotar.', 1]], 70, 1345, 92, 20, C.ink, C.bone, { emAt: 20 });
}
const ROWS = [
  ['Actualiza PHP hoy', '8.2.35 · 8.3.36 · 8.4.27 · 8.5.12'],
  ['¿PHP 8.1 o anterior?', 'No hay parche oficial: toca migrar.'],
  ['Copia y revisión', 'Busca accesos raros desde el 17 de octubre.'],
];
function s4(ctx, u) {
  fill(ctx, C.bone);
  label(ctx, u, 'Qué hacer hoy', 76, 360, 23.9, C.coral);
  ROWS.forEach(([t, s], j) => {
    const u0 = 24 + j * 4, top = 410 + j * 350;
    const hp = E.inOutCubic(prog(u, u0 - 0.1, u0 + 0.9));
    if (hp > 0) { ctx.fillStyle = 'rgba(15,28,36,.18)'; ctx.fillRect(76, top, (W - 152) * hp, 2); }
    const kn = springU(u, u0 + 0.2, SPRING.snappy);
    if (kn > 0) { ctx.save(); ctx.globalAlpha = clamp(kn); text(ctx, '0' + (j + 1), 76, top + 90, MONO(28), C.coral); ctx.restore(); }
    line(ctx, u, [[t, 0]], 196, top + 125, 80, u0 + 0.4, C.ink, C.coral);
    const ks = springU(u, u0 + 1.2, SPRING.gentle);
    if (ks > 0) { ctx.save(); ctx.globalAlpha = ks; text(ctx, s, 200, top + 205 + (1 - ks) * 16, j === 0 ? MONO(30) : UI(38), j === 0 ? C.coral : C.ink); ctx.restore(); }
  });
  const hl = E.inOutCubic(prog(u, 37.5, 38.5));
  if (hl > 0) { ctx.fillStyle = 'rgba(15,28,36,.18)'; ctx.fillRect(76, 1460, (W - 152) * hl, 2); }
}
function s5(ctx, u) {
  fill(ctx, C.ink);
  line(ctx, u, [['¿No sabes qué', 0]], 70, 860, 130, 39.8, C.bone, C.coralL);
  line(ctx, u, [['versión tienes?', 0]], 70, 1000, 130, 40.4, C.bone, C.coralL);
  line(ctx, u, [['Te lo miramos ', 0]], 70, 1190, 104, 41.6, C.bone, C.coralL);
  line(ctx, u, [['gratis.', 1]], 70, 1305, 104, 42, C.bone, C.coralL, { emAt: 42 });
}
function s6(ctx, u) {
  fill(ctx, C.coral);
  const h = 430, w = h * ARCH_VB[2] / ARCH_VB[3], nP = ARCHP.length;
  drawArch(ctx, (W - w) / 2, 400, h, C.ink, (i) => springU(u, 47.9 + (nP - 1 - i) * 0.11, SPRING.bouncy));
  line(ctx, u, [['Bahiga.', 0]], W / 2, 1040, 170, 49.3, C.ink, C.ink, { align: 'center' });
  const kt = springU(u, 50.3, SPRING.gentle);
  if (kt > 0) { ctx.save(); ctx.globalAlpha = kt; text(ctx, 'Mantenimiento y seguridad web.', W / 2, 1125 + (1 - kt) * 20, UI(40), C.ink, 'center'); ctx.restore(); }
  const kb = springU(u, 51.4, SPRING.bouncy);
  if (kb > 0) {
    const f = UI(38, 600), s = 'Escríbenos por WhatsApp', tw = layout(ctx, s, f).width, bw = tw + 96, bh = 96;
    ctx.save(); ctx.translate(W / 2, 1250); ctx.scale(kb, kb);
    rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = C.ink; ctx.fill();
    text(ctx, s, 0, 13, f, C.bone, 'center'); ctx.restore();
  }
  const kw = springU(u, 52, SPRING.gentle);
  if (kw > 0) { ctx.save(); ctx.globalAlpha = kw; text(ctx, 'BAHIGA.ES', W / 2, 1390, MONO(28), C.ink, 'center', 3); ctx.restore(); }
}
M.film({
  fonts: [D(100), DI(100), UI(40), UI(40, 600), MONO(26)],
  images: {},
  hits: HITS,
  draw(ctx, u) {
    if (u < 8) return s1(ctx, u);
    if (u < 16) return s2(ctx, u);
    if (u < 23.4) return s3(ctx, u);
    if (u < 24.6) {
      const e = E.inOutCubic(prog(u, 23.4, 24.6));
      ctx.save(); ctx.translate(0, -e * H); s3(ctx, u); ctx.restore();
      ctx.save(); ctx.translate(0, (1 - e) * H); s4(ctx, u); ctx.restore();
      return;
    }
    if (u < 40) return s4(ctx, u);
    if (u < 48) {
      s5(ctx, u);
      const e = E.inOutCubic(prog(u, 47.2, 48));
      if (e > 0) { ctx.fillStyle = C.coral; ctx.fillRect(0, H * (1 - e), W, H * e + 2); }
      return;
    }
    s6(ctx, u);
  },
});
