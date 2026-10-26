// Bahiga · reel de escenas ilustradas a pantalla completa. Contenido en escenas.json.
// Gancho con contador, cuatro escenas con texto grande y bocadillos, un fotograma de valor
// (cómo comprobarlo tú) y un cierre que pide un comentario. Imágenes con un barrido lateral
// suave (sin zoom). Todo el texto dentro de la zona segura (250..1570).
import * as M from './lib/motion.js';
import { ARCH, ARCH_VB } from './arch.js';

const { W, H, E, prog, clamp, springU, SPRING, font, layout, text, fill, rrect } = M;
const C = { ink: '#0F1C24', bone: '#FAF8F5', coral: '#E8683C', coralL: '#F0A07E' };
const D = (s) => font(s, 430, 'Display');
const DI = (s) => `italic 380 ${Math.round(s)}px Display`;
const UI = (s, w = 400) => font(s, w, 'UI');
const MONO = (s) => `500 ${Math.round(s)}px Mono`;
const ARCHP = ARCH.map((d) => new Path2D(d));
const K = await (await fetch('escenas.json')).json();

const LEN = 4.5;                          // beats por escena (~2,5 s)
const N = K.escenas.length;
const V0 = N * LEN, V1 = V0 + 4.5;        // fotograma de valor
const END1 = V1 + 5;                      // fin

function drawArch(ctx, x, y, h, color) {
  const [vx, vy, , vh] = ARCH_VB, s = h / vh;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-vx, -vy);
  ctx.fillStyle = color; ARCHP.forEach((p) => ctx.fill(p)); ctx.restore();
}
function marca(ctx, col) {
  const h = 64, w = h * ARCH_VB[2] / ARCH_VB[3];
  drawArch(ctx, 76, 222, h, col);
  text(ctx, 'Bahiga.', 76 + w + 16, 276, D(52), col, 'left', -1);
}
function pop(ctx, k, x, y, draw) { if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(x, y + (1 - k) * 30); draw(); ctx.restore(); }
function bocadillo(ctx, k, str, cx, top) {
  if (k <= 0) return;
  const f = UI(42, 600), lines = str.split('|'), lh = 54;
  const w = Math.max(...lines.map((l) => layout(ctx, l, f).width)) + 84, h = lines.length * lh + 52;
  const x = clamp(cx - w / 2, 60, W - 60 - w);
  ctx.save();
  ctx.translate(cx, top + h); ctx.scale(k, k); ctx.translate(-cx, -(top + h));
  ctx.globalAlpha = clamp(k * 1.4);
  ctx.beginPath(); ctx.roundRect(x, top, w, h, 36);
  ctx.moveTo(cx - 26, top + h - 2); ctx.lineTo(cx + 4, top + h + 56); ctx.lineTo(cx + 30, top + h - 2);
  ctx.fillStyle = C.bone; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.bone; ctx.fillRect(cx - 22, top + h - 6, 48, 10);
  lines.forEach((l, i) => text(ctx, l, x + w / 2, top + 60 + i * lh, f, C.ink, 'center'));
  ctx.restore();
}
function escena(ctx, u, i, IMG) {
  const S = K.escenas[i], u0 = i * LEN, p = prog(u, u0, u0 + LEN);
  const img = IMG['e' + i];
  fill(ctx, C.bone);
  if (img) {
    // Cubre la pantalla y se desplaza en horizontal un poco a lo largo de la escena.
    const s = H / img.height, iw = img.width * s, maxX = iw - W;
    const cx = clamp((S.fx ?? 0.5) * iw - W / 2 + (p - 0.5) * 70, 0, maxX);
    ctx.drawImage(img, -cx, 0, iw, H);
    // Velo claro arriba para que el texto se lea siempre.
    const g = ctx.createLinearGradient(0, 0, 0, 700);
    g.addColorStop(0, 'rgba(250,248,245,.9)'); g.addColorStop(0.45, 'rgba(250,248,245,.82)'); g.addColorStop(1, 'rgba(250,248,245,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 700);
  }
  marca(ctx, C.ink);
  const kt = springU(u, u0 + 0.15, SPRING.snappy);
  pop(ctx, kt, 0, 0, () => text(ctx, S.titulo, 76, 410, D(S.contador ? 120 : 92), C.ink, 'left', -2));
  if (S.titulo2) pop(ctx, springU(u, u0 + 0.6, SPRING.snappy), 0, 0, () => text(ctx, S.titulo2, 76, 510, DI(96), C.coral, 'left', -2));
  if (S.sub) pop(ctx, springU(u, u0 + 0.7, SPRING.gentle), 0, 0, () => text(ctx, S.sub, 78, S.contador ? 500 : 485, UI(44, 600), C.ink));
  if (S.contador) {
    // Contador de carga: 0:01 ... 0:08 en coral, con la ruedita.
    const n = Math.min(S.contador, 1 + Math.floor(prog(u, u0 + 0.9, u0 + LEN - 0.6) * S.contador));
    const kc = springU(u, u0 + 0.8, SPRING.bouncy);
    pop(ctx, kc, 0, 0, () => {
      rrect(ctx, 76, 580, 370, 120, 60); ctx.fillStyle = C.ink; ctx.fill();
      text(ctx, '0:0' + n, 290, 667, MONO(64), C.coralL, 'center', 2);
      ctx.save(); ctx.translate(126, 640); ctx.rotate(u * 3.5); ctx.strokeStyle = C.coralL; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 1.4); ctx.stroke(); ctx.restore();
    });
  }
  if (S.bocadillo) bocadillo(ctx, clamp(springU(u, u0 + 1.1, SPRING.bouncy), 0, 1.15), S.bocadillo, W * (S.bx ?? 0.5), S.by ?? 780);
}
function pill(ctx, u) {
  const kb = springU(u, 2 * LEN, SPRING.bouncy) * (1 - E.outCubic(prog(u, V1 - 0.3, V1)));
  if (kb <= 0) return;
  const f = UI(34, 600), s = K.cierre.pill, tw = layout(ctx, s, f).width, bw = tw + 86, bh = 80;
  ctx.save(); ctx.translate(W / 2, 1500); ctx.scale(clamp(kb, 0, 1.2), clamp(kb, 0, 1.2));
  ctx.shadowColor = 'rgba(15,28,36,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  rrect(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fillStyle = C.ink; ctx.fill();
  ctx.shadowColor = 'transparent'; text(ctx, s, 0, 12, f, C.bone, 'center'); ctx.restore();
}
function valor(ctx, u) {
  fill(ctx, C.ink);
  marca(ctx, C.bone);
  const V = K.valor;
  pop(ctx, springU(u, V0 + 0.1, SPRING.snappy), 0, 0, () => text(ctx, V.titulo, 76, 780, D(150), C.bone, 'left', -3));
  pop(ctx, springU(u, V0 + 0.8, SPRING.gentle), 0, 0, () => text(ctx, V.sub, 80, 900, UI(48), C.bone));
  pop(ctx, springU(u, V0 + 1.3, SPRING.bouncy), 0, 0, () => {
    const f = MONO(54), tw = layout(ctx, V.url, f, 1).width;
    rrect(ctx, 70, 950, tw + 70, 110, 22); ctx.fillStyle = C.coral; ctx.fill();
    text(ctx, V.url, 105, 1024, f, C.ink, 'left', 1);
  });
  if (V.nota) pop(ctx, springU(u, V0 + 2, SPRING.gentle), 0, 0, () => V.nota.split('|').forEach((l, i) => text(ctx, l, 80, 1150 + i * 58, UI(42), C.bone)));
}
function cierre(ctx, u) {
  fill(ctx, C.coral);
  const b = V1, Cc = K.cierre;
  const h = 300, w = h * ARCH_VB[2] / ARCH_VB[3];
  pop(ctx, springU(u, b + 0.1, SPRING.gentle), 0, 0, () => drawArch(ctx, (W - w) / 2, 380, h, C.ink));
  pop(ctx, springU(u, b + 0.6, SPRING.snappy), 0, 0, () => text(ctx, Cc.grande, W / 2, 860, D(150), C.ink, 'center', -3));
  pop(ctx, springU(u, b + 1.2, SPRING.gentle), 0, 0, () => {
    const f = UI(44, 600), lines = ['en comentarios y te la revisamos', 'sin compromiso.'];
    lines.forEach((l, i) => text(ctx, l, W / 2, 960 + i * 58, f, C.ink, 'center'));
  });
  pop(ctx, springU(u, b + 1.8, SPRING.gentle), 0, 0, () => {
    text(ctx, 'Bahiga.', W / 2, 1220, D(96), C.ink, 'center', -1.5);
    text(ctx, 'BAHIGA.ES', W / 2, 1300, MONO(28), C.ink, 'center', 3);
  });
}

const HITS = [[0, 'gancho', 'impact']];
for (let n = 1; n <= 8; n++) HITS.push([0.9 + (n - 1) * ((LEN - 1.5) / 8), 'contador', 'tick']);
K.escenas.forEach((S, i) => {
  if (i) HITS.push([i * LEN, 'corte', 'whoosh', { len: 0.25, from: 1200, to: 3000 }]);
  if (S.bocadillo) HITS.push([i * LEN + 1.1, 'bocadillo', 'pop', { pitch: ['E5', 'A5', 'C6', 'E6'][i] }]);
});
HITS.push([2 * LEN, 'botón', 'pop', { pitch: 'E6' }], [V0, 'valor', 'impact'], [V0 + 1.3, 'url', 'blip', { pitch: 'A6' }], [V1, 'cierre', 'impact'], [V1 + 0.6, 'cta', 'pop', { pitch: 'E6' }]);

M.film({
  fonts: [D(100), DI(100), UI(40), UI(40, 600), MONO(26)],
  images: Object.fromEntries(K.escenas.map((S, i) => ['e' + i, S.img])),
  hits: HITS,
  draw(ctx, u, t, IMG) {
    if (u >= V1) return cierre(ctx, u);
    if (u >= V0) return valor(ctx, u);
    const i = Math.min(N - 1, Math.floor(u / LEN));
    // Corte con barrido rápido: la escena nueva entra desde la derecha en un cuarto de beat.
    const e = E.outCubic(prog(u, i * LEN, i * LEN + 0.28));
    if (i > 0 && e < 1) {
      ctx.save(); ctx.translate(-e * W, 0); escena(ctx, u, i - 1, IMG); ctx.restore();
      ctx.save(); ctx.translate((1 - e) * W, 0); escena(ctx, u, i, IMG); ctx.restore();
    } else escena(ctx, u, i, IMG);
    pill(ctx, u);
  },
});
