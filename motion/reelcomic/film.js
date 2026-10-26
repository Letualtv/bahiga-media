// Bahiga · reel en viñetas de cómic. Contenido en comic.json; ilustraciones en assets/p1..p4.jpg.
// Cuatro viñetas que entran como páginas, con caja de narración, titular y bocadillo, y un cierre
// con la oferta. La marca va fija arriba y el botón de contacto aparece pronto, en la zona segura.
import * as M from './lib/motion.js';
import { ARCH, ARCH_VB } from './arch.js';

const { W, H, E, prog, clamp, springU, SPRING, font, layout, text, fill, rrect, cover } = M;
const C = { ink: '#0F1C24', bone: '#FAF8F5', coral: '#E8683C', coralL: '#F0A07E' };
const D = (s) => font(s, 430, 'Display');
const UI = (s, w = 400) => font(s, w, 'UI');
const MONO = (s) => `500 ${Math.round(s)}px Mono`;
const ARCHP = ARCH.map((d) => new Path2D(d));
const K = await (await fetch('comic.json')).json();

const LEN = 6.5;                     // beats por viñeta (~3,5 s)
const END0 = K.panels.length * LEN;  // inicio del cierre
const PX = 110, PY = 500, PW = 860, PH = 1065; // viñeta 4:5 dentro de la zona segura (250..1570)

function drawArch(ctx, x, y, h, color) {
  const [vx, vy, , vh] = ARCH_VB, s = h / vh;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-vx, -vy);
  ctx.fillStyle = color; ARCHP.forEach((p) => ctx.fill(p)); ctx.restore();
}
function marca(ctx, col) {
  const h = 74, w = h * ARCH_VB[2] / ARCH_VB[3];
  drawArch(ctx, 90, 300, h, col);
  text(ctx, 'Bahiga.', 90 + w + 18, 362, D(60), col, 'left', -1.2);
}
// Texto en varias líneas dentro de un ancho.
function wrap(ctx, str, f, maxW) {
  const words = str.split(' '), out = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (layout(ctx, t, f).width > maxW && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
}
function bocadillo(ctx, k, str, cx, top, tailX) {
  if (k <= 0) return;
  const f = UI(40, 600), lines = str.includes('|') ? str.split('|') : wrap(ctx, str, f, 520), lh = 52;
  const w = Math.max(...lines.map((l) => layout(ctx, l, f).width)) + 80, h = lines.length * lh + 50;
  const x = clamp(cx - w / 2, PX + 30, PX + PW - 30 - w);
  ctx.save();
  ctx.translate(x + w / 2, top + h); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(top + h));
  ctx.globalAlpha = clamp(k * 1.4);
  ctx.beginPath(); ctx.roundRect(x, top, w, h, 34);
  ctx.moveTo(tailX - 26, top + h - 2); ctx.lineTo(tailX + 6, top + h + 54); ctx.lineTo(tailX + 30, top + h - 2);
  ctx.fillStyle = C.bone; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.bone; ctx.fillRect(tailX - 22, top + h - 6, 48, 10); // tapa la costura del rabo
  lines.forEach((l, i) => text(ctx, l, x + w / 2, top + 58 + i * lh, f, C.ink, 'center'));
  ctx.restore();
}
function vineta(ctx, u, i, IMG) {
  const P = K.panels[i], u0 = i * LEN;
  const kin = i === 0 ? 1 : E.outCubic(prog(u, u0, u0 + 0.9));       // entra desde la derecha
  const kout = i === K.panels.length - 1 ? 0 : E.inCubic(prog(u, u0 + LEN - 0.4, u0 + LEN + 0.5));
  const x = PX + (1 - kin) * W * 1.1 - kout * W * 1.15;
  const rot = (i % 2 ? 0.7 : -0.7) * Math.PI / 180;
  ctx.save();
  ctx.translate(x + PW / 2, PY + PH / 2); ctx.rotate(rot); ctx.translate(-(x + PW / 2), -(PY + PH / 2));
  ctx.shadowColor = 'rgba(15,28,36,.25)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
  ctx.fillStyle = C.ink; ctx.fillRect(x - 8, PY - 8, PW + 16, PH + 16);
  ctx.shadowColor = 'transparent';
  const img = IMG['p' + (i + 1)];
  if (img) cover(ctx, img, x, PY, PW, PH);
  // Caja de narración arriba a la izquierda.
  const kc = springU(u, u0 + 0.5, SPRING.snappy);
  if (kc > 0) {
    ctx.save(); ctx.globalAlpha = clamp(kc);
    const f = MONO(26), tw = layout(ctx, P.caja.toUpperCase(), f, 2).width;
    ctx.fillStyle = C.coral; ctx.fillRect(x + 28, PY + 28, tw + 44, 58);
    ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.strokeRect(x + 28, PY + 28, tw + 44, 58);
    text(ctx, P.caja.toUpperCase(), x + 50, PY + 67, f, C.ink, 'left', 2);
    ctx.restore();
  }
  // Bocadillo en la parte alta de la viñeta, apuntando al personaje.
  const kb = springU(u, u0 + 1.4, SPRING.bouncy);
  const cx = x + PW * (P.bx ?? 0.5);
  bocadillo(ctx, clamp(kb, 0, 1.15), P.bocadillo, cx, PY + 120, cx);
  ctx.restore();
}
function titular(ctx, u, i) {
  const P = K.panels[i], u0 = i * LEN;
  const k = springU(u, u0 + 0.2, SPRING.gentle) * (1 - E.inCubic(prog(u, u0 + LEN - 0.3, u0 + LEN)));
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k);
  text(ctx, P.titulo, 90, 462 + (1 - k) * 14, D(74), C.ink, 'left', -1.5);
  ctx.restore();
}
function cta(ctx, u) {
  const kb = springU(u, 5, SPRING.bouncy) * (1 - E.outCubic(prog(u, END0 - 0.4, END0)));
  if (kb <= 0) return;
  const f = UI(36, 600), s = K.end.cta, tw = layout(ctx, s, f).width, bw = tw + 90, bh = 92;
  ctx.save(); ctx.translate(W / 2, 1520); ctx.scale(clamp(kb, 0, 1.2), clamp(kb, 0, 1.2));
  ctx.shadowColor = 'rgba(15,28,36,.3)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = C.ink; ctx.fill();
  ctx.shadowColor = 'transparent';
  text(ctx, s, 0, 12, f, C.bone, 'center'); ctx.restore();
}
function cierre(ctx, u) {
  fill(ctx, C.coral);
  const b = END0;
  const ka = springU(u, b + 0.1, SPRING.gentle);
  const h = 380, w = h * ARCH_VB[2] / ARCH_VB[3];
  ctx.save(); ctx.globalAlpha = clamp(ka); drawArch(ctx, (W - w) / 2, 430 + (1 - ka) * 40, h, C.ink); ctx.restore();
  const kt = springU(u, b + 0.8, SPRING.gentle);
  ctx.save(); ctx.globalAlpha = clamp(kt);
  text(ctx, 'Bahiga.', W / 2, 1010, D(150), C.ink, 'center', -2);
  text(ctx, K.end.oferta, W / 2, 1100, UI(42, 600), C.ink, 'center');
  ctx.restore();
  const kb = springU(u, b + 1.6, SPRING.bouncy);
  if (kb > 0) {
    const f = UI(38, 600), s = K.end.cta, tw = layout(ctx, s, f).width, bw = tw + 96, bh = 96;
    ctx.save(); ctx.translate(W / 2, 1240); ctx.scale(kb, kb);
    rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = C.ink; ctx.fill();
    text(ctx, s, 0, 13, f, C.bone, 'center'); ctx.restore();
  }
  const kw = springU(u, b + 2.2, SPRING.gentle);
  ctx.save(); ctx.globalAlpha = clamp(kw); text(ctx, 'BAHIGA.ES', W / 2, 1380, MONO(28), C.ink, 'center', 3); ctx.restore();
}

const HITS = [];
K.panels.forEach((_, i) => {
  const u0 = i * LEN;
  if (i) HITS.push([u0, 'página', 'whoosh', { len: 0.35, from: 900, to: 2600 }]);
  HITS.push([u0 + 0.5, 'caja', 'click'], [u0 + 1.4, 'bocadillo', 'pop', { pitch: ['E5', 'A5', 'C6', 'E6'][i] }]);
});
HITS.push([5, 'botón', 'pop', { pitch: 'E6' }], [END0, 'cierre', 'impact'], [END0 + 1.6, 'botón', 'pop', { pitch: 'A6' }]);

M.film({
  fonts: [D(100), UI(40), UI(40, 600), MONO(26)],
  images: Object.fromEntries(K.panels.map((p, i) => ['p' + (i + 1), p.img])),
  hits: HITS,
  draw(ctx, u, t, IMG) {
    if (u >= END0) return cierre(ctx, u);
    fill(ctx, C.bone);
    marca(ctx, C.ink);
    const i = Math.min(K.panels.length - 1, Math.floor(u / LEN));
    if (i > 0) vineta(ctx, u, i - 1, IMG); // la anterior sale mientras entra la nueva
    vineta(ctx, u, i, IMG);
    titular(ctx, u, i);
    cta(ctx, u);
    const ke = E.inOutCubic(prog(u, END0 - 0.4, END0));
    if (ke > 0) { ctx.fillStyle = C.coral; ctx.fillRect(0, H * (1 - ke), W, H * ke + 2); }
  },
});
