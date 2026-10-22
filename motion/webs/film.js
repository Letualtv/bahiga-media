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
  [2, 'línea 3', 'pop', { pitch: 'C6' }],
  [3, 'línea 4', 'pop', { pitch: 'F6' }],
  [4, 'arco aparece', 'pop', { pitch: 'F5' }],
  [8, 'el arco llena el plano', 'riser', { len: 1.6 }],
  [8, 'si no lo sabes', 'thud'],
  [9, 'línea', 'tick'], [10, 'respuesta', 'blip', { pitch: 'C7' }],
  [16, 'push al móvil', 'impact'],
  [18, 'etiqueta 1', 'pop', { pitch: 'A5' }],
  [21, 'etiqueta 2', 'pop', { pitch: 'C6' }],
  [25, 'etiqueta 3', 'pop', { pitch: 'F6' }],
  [32, 'barrido a las claves', 'whoosh', { len: 0.5 }],
  [32.4, 'fila 1', 'click'], [36.4, 'fila 2', 'click'], [40.4, 'fila 3', 'click'],
  [44, 'precio', 'impact'],
  [44.5, 'contador', 'tick'], [45, 'contador', 'tick'], [45.5, 'contador', 'tick'],
  [46, 'dato 1', 'click'], [47, 'dato 2', 'click'], [48, 'dato 3', 'click'],
  [52, 'cierre', 'impact'],
  [53.5, 'logo', 'bell', { pitch: 'F6' }],
  [55.5, 'botón', 'pop', { pitch: 'C6' }],
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


// ------------------------------------------------------------ S1 gancho (0..8)
function s1(ctx, u) {
  fill(ctx, C.bone);
  label(ctx, u, '01 — Pregunta incómoda', 76, 700, -0.4, C.coral);
  const sz = 140;
  line(ctx, u, [['¿Cuántos', 0]], 70, 870, sz, -0.7, C.ink, C.coral);
  line(ctx, u, [['clientes te', 0]], 70, 1015, sz, 0.6, C.ink, C.coral);
  line(ctx, u, [['trajo tu web', 0]], 70, 1160, sz, 1.6, C.ink, C.coral);
  line(ctx, u, [['este ', 0], ['mes?', 1]], 70, 1305, sz, 2.6, C.ink, C.coral, { emAt: 3 });
  const kS = springU(u, 3.8, SPRING.gentle);
  if (kS > 0) { ctx.save(); ctx.globalAlpha = kS; text(ctx, 'Una web no está para estar. Está para que te llamen.', 76, 1400 + (1 - kS) * 20, UI(36), C.ink); ctx.restore(); }
  const ka = springU(u, 4, SPRING.bouncy);
  if (ka > 0) {
    const h0 = 150, [vx, vy] = ARCH_VB, s0 = h0 / ARCH_VB[3];
    const ax = 880, ay = 380;
    const fxs = ax + (195 - vx) * s0, fys = ay + (840 - vy) * s0;
    const p = E.inCubic(prog(u, 6, 8));
    const z = 90 ** p;
    const cx = lerp(fxs, W / 2, E.inOutCubic(p)), cy = lerp(fys, H / 2, E.inOutCubic(p));
    ctx.save(); ctx.translate(cx, cy); ctx.scale(z * ka, z * ka); ctx.translate(-fxs, -fys);
    drawArch(ctx, ax, ay, h0, C.ink); ctx.restore();
    const kw = springU(u, 4.3, SPRING.gentle) * (1 - E.outCubic(prog(u, 6, 6.8)));
    if (kw > 0) { ctx.save(); ctx.globalAlpha = clamp(kw); text(ctx, 'Bahiga.', 852 - (1 - kw) * 30, ay + 128, D(84), C.ink, 'right', -1.5); ctx.restore(); }
  }
}

// ------------------------------------------------------------ S2 si no lo sabes (8..16)
function s2(ctx, u) {
  fill(ctx, C.ink);
  ctx.save(); ctx.translate(0, -40 * E.inOutSine(prog(u, 10.5, 15.2)));
  const sz = 150;
  line(ctx, u, [['Si no lo sabes,', 0]], 70, 860, sz, 7.9, C.bone, C.coralL);
  line(ctx, u, [['ya tienes la', 0]], 70, 1020, sz, 8.9, C.bone, C.coralL);
  line(ctx, u, [['respuesta.', 1]], 70, 1180, sz, 9.9, C.bone, C.coralL, { emAt: 10 });
  const kr = E.inOutCubic(prog(u, 11, 15));
  if (kr > 0) { ctx.fillStyle = C.coralL; ctx.fillRect(76, 1240, (W - 152) * kr, 3); }
  ctx.restore();
}

// ------------------------------------------------------------ S3 Pulido en el móvil (16..32)
function s3(ctx, u, IMG) {
  fill(ctx, C.ink);
  label(ctx, u, 'Trabajo real · Priego de Córdoba', 76, 330, 15.6, C.coralL);
  line(ctx, u, [['Pulido ', 0], ['Inmobiliaria.', 1]], 70, 440, 96, 15.8, C.bone, C.coralL, { emAt: 16.4 });
  const k = springU(u, 15.4, SPRING.gentle);
  const y = lerp(H + 60, PH.y, k) + 10 * wobble(u - 16.6, 1.6, 4) + 8 * Math.sin(u * 0.7);
  const sc = M.kf(u, [[16.5, 0], [19.4, 40], [20.8, 330], [23.6, 380], [24.8, 760], [31.4, 1180]], E.inOutSine);
  phonePages(ctx, IMG.home, null, PH.x, y, sc, 0, 0);
  tag(ctx, u, '01', 'Qué hace y dónde, a la primera', W - 40, 760, 'r', 18, 20.6);
  tag(ctx, u, '02', 'Pedir valoración, un clic', W - 40, 1080, 'r', 21, 24.4);
  tag(ctx, u, '03', 'Inmuebles siempre al día', 40, 1150, 'l', 25);
}
function phonePages(ctx, a, b, x, y, scA, sw, scB) {
  const { w, h } = PH;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 90; ctx.shadowOffsetY = 40;
  rrect(ctx, x, y, w, h, 96); ctx.fillStyle = C.bezel; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.stroke();
  const ix = x + 18, iy = y + 18, iw = w - 36, ih = h - 36;
  rrect(ctx, ix, iy, iw, ih, 78); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(ix, iy, iw, ih);
  const draw = (img, sc, dx) => {
    if (!img) return;
    const s = iw / img.width, maxS = Math.max(0, img.height * s - ih);
    ctx.drawImage(img, ix + dx, iy - clamp(sc, 0, maxS), img.width * s, img.height * s);
  };
  if (sw < 1) draw(a, scA, -sw * iw);
  if (sw > 0 && b) {
    const dx = (1 - sw) * iw, s = iw / b.width, bh = (b.height - 10) * s;
    ctx.fillStyle = '#26243f'; ctx.fillRect(ix + dx, iy, iw, ih);
    ctx.save(); ctx.filter = 'blur(26px)'; ctx.globalAlpha = 0.45;
    ctx.drawImage(b, 0, b.height - 160, b.width, 150, ix + dx - 20, iy + bh - 40, iw + 40, ih - bh + 80);
    ctx.restore();
    ctx.drawImage(b, 0, 0, b.width, b.height - 10, ix + dx, iy, iw, bh);
  }
  ctx.restore();
  rrect(ctx, x + w / 2 - 80, y + 38, 160, 44, 22); ctx.fillStyle = C.bezel; ctx.fill();
}

// ------------------------------------------------------------ S4 lo que tiene que hacer (32..44)
const ROWS = [
  [['Cargar rápido', 0]], [['en el ', 0], ['móvil.', 1]],
  [['Decir qué haces', 0]], [['y ', 0], ['dónde.', 1]],
  [['Que la cambies', 0]], [['tú.', 1]],
];
function s4(ctx, u) {
  fill(ctx, C.bone);
  label(ctx, u, '02 — Lo que tiene que hacer', 76, 360, 31.9, C.coral);
  for (let j = 0; j < 3; j++) {
    const u0 = 32 + j * 4, top = 410 + j * 350;
    const hp = E.inOutCubic(prog(u, u0 - 0.1, u0 + 0.9));
    if (hp > 0) { ctx.fillStyle = 'rgba(15,28,36,.18)'; ctx.fillRect(76, top, (W - 152) * hp, 2); }
    const kn = springU(u, u0 + 0.2, SPRING.snappy);
    if (kn > 0) { ctx.save(); ctx.globalAlpha = clamp(kn); text(ctx, '0' + (j + 1), 76, top + 90, MONO(28), C.coral); ctx.restore(); }
    line(ctx, u, ROWS[j * 2], 196, top + 125, 96, u0 + 0.4, C.ink, C.coral, { emAt: u0 + 1.2 });
    line(ctx, u, ROWS[j * 2 + 1], 196, top + 230, 96, u0 + 0.8, C.ink, C.coral, { emAt: u0 + 1.2 });
  }
  const hl = E.inOutCubic(prog(u, 41.5, 42.5));
  if (hl > 0) { ctx.fillStyle = 'rgba(15,28,36,.18)'; ctx.fillRect(76, 1460, (W - 152) * hl, 2); }
}

// ------------------------------------------------------------ S5 precio (44..52)
const COLS = [['Precio', '+ IVA'], ['Presupuesto', 'Cerrado'], ['Plazo', '3–6 semanas']];
function s5(ctx, u) {
  fill(ctx, C.ink);
  text(ctx, '03 — WEBS DESDE', 76, 600, MONO(26), C.coralL, 'left', 2.2);
  const n = 900 * E.outExpo(prog(u, 43.9, 46.2));
  const sz = 380, f = font(sz, 380, 'Display');
  const L = layout(ctx, dots(n), f, -0.05 * sz);
  text(ctx, dots(n), 58, 960, f, C.bone, 'left', -0.05 * sz);
  text(ctx, '€', 58 + L.width + 16, 960, DI(sz * 0.5), C.coralL);
  const cw = (W - 152 - 48) / 3;
  COLS.forEach(([a, b], j) => {
    const u0 = 46 + j, x = 76 + j * (cw + 24), y = 1060;
    const hp = E.inOutCubic(prog(u, u0 - 0.1, u0 + 0.7));
    if (hp > 0) { ctx.fillStyle = 'rgba(250,248,245,.35)'; ctx.fillRect(x, y, cw * hp, 2); }
    const k = springU(u, u0 + 0.15, SPRING.snappy);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(k); ctx.translate(0, (1 - k) * 24);
    text(ctx, a.toUpperCase(), x, y + 56, MONO(24), 'rgba(250,248,245,.6)', 'left', 1.8);
    text(ctx, b, x, y + 116, UI(42, 600), C.bone);
    ctx.restore();
  });
  const kl = springU(u, 49, SPRING.gentle);
  if (kl > 0) { ctx.save(); ctx.globalAlpha = kl; text(ctx, 'Sabes lo que pagas antes de empezar.', 76, 1340 + (1 - kl) * 20, UI(46), C.bone); ctx.restore(); }
}

// ------------------------------------------------------------ S6 cierre (52..62)
function s6(ctx, u) {
  fill(ctx, C.coral);
  const h = 430, w = h * ARCH_VB[2] / ARCH_VB[3];
  const nP = ARCHP.length;
  drawArch(ctx, (W - w) / 2, 400, h, C.ink, (i) => springU(u, 51.9 + (nP - 1 - i) * 0.11, SPRING.bouncy));
  line(ctx, u, [['Bahiga.', 0]], W / 2, 1040, 170, 53.3, C.ink, C.ink, { align: 'center' });
  const kt = springU(u, 54.3, SPRING.gentle);
  if (kt > 0) { ctx.save(); ctx.globalAlpha = kt; text(ctx, 'Webs, tiendas online e IA para pymes.', W / 2, 1125 + (1 - kt) * 20, UI(40), C.ink, 'center'); ctx.restore(); }
  const kb = springU(u, 55.4, SPRING.bouncy);
  if (kb > 0) {
    const f = UI(38, 600), s = 'Pide presupuesto por WhatsApp', tw = layout(ctx, s, f).width, bw = tw + 96, bh = 96;
    ctx.save(); ctx.translate(W / 2, 1250); ctx.scale(kb, kb);
    rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = C.ink; ctx.fill();
    text(ctx, s, 0, 13, f, C.bone, 'center');
    ctx.restore();
  }
  const kw = springU(u, 56, SPRING.gentle);
  if (kw > 0) { ctx.save(); ctx.globalAlpha = kw; text(ctx, 'BAHIGA.ES', W / 2, 1390, MONO(28), C.ink, 'center', 3); ctx.restore(); }
}

// ------------------------------------------------------------ edit
M.film({
  fonts: [D(100), DI(100), UI(40), UI(40, 600), MONO(26)],
  images: { home: 'assets/pulido-movil.jpg', val: 'assets/pulido-val.jpg' },
  hits: HITS,
  draw(ctx, u, t, IMG) {
    if (u < 8) return s1(ctx, u);
    if (u < 15.2) return s2(ctx, u);
    if (u < 16.6) {                                  // push: the statement lifts away as the phone rises
      const e = E.inOutCubic(prog(u, 15.2, 16.6));
      s3(ctx, u, IMG);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); ctx.translate(0, -e * H * 0.9); ctx.globalAlpha = 1 - e;
      const sz = 150;
      line(ctx, u, [['Si no lo sabes,', 0]], 70, 860, sz, 7.9, C.bone, C.coralL);
      line(ctx, u, [['ya tienes la', 0]], 70, 1020, sz, 8.9, C.bone, C.coralL);
      line(ctx, u, [['respuesta.', 1]], 70, 1180, sz, 9.9, C.bone, C.coralL, { emAt: 10 });
      ctx.restore();
      return;
    }
    if (u < 31.4) return s3(ctx, u, IMG);
    if (u < 32.6) {                                  // whip: both on screen, peaks on 32
      const e = E.inOutCubic(prog(u, 31.4, 32.6));
      ctx.save(); ctx.translate(-e * W, 0); s3(ctx, u, IMG); ctx.restore();
      ctx.save(); ctx.translate((1 - e) * W, 0); s4(ctx, u); ctx.restore();
      return;
    }
    if (u < 44) return s4(ctx, u);
    if (u < 52) {
      s5(ctx, u);
      const e = E.inOutCubic(prog(u, 51.2, 52));
      if (e > 0) { ctx.fillStyle = C.coral; ctx.fillRect(0, H * (1 - e), W, H * e + 2); }
      return;
    }
    s6(ctx, u);
  },
});
