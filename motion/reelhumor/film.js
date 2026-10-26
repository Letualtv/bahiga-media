// Bahiga · reel de humor seco (serie de la panadera). Contenido en humor.json.
// Portada con titular enorme a dos colores, la llamada contada como una conversación dibujada,
// un sello que remata el chiste, el giro final con la verdad, un fotograma útil y un cierre
// que pide un comentario. Texto dentro de la zona segura (250..1570).
import * as M from './lib/motion.js';
import { ARCH, ARCH_VB } from './arch.js';

const { W, H, E, prog, clamp, springU, SPRING, font, layout, text, fill, rrect } = M;
const C = { ink: '#0F1C24', bone: '#FAF8F5', coral: '#E8683C', coralL: '#F0A07E', gris: '#E9E4DC' };
const D = (s) => font(s, 430, 'Display');
const DI = (s) => `italic 380 ${Math.round(s)}px Display`;
const UI = (s, w = 400) => font(s, w, 'UI');
const MONO = (s) => `500 ${Math.round(s)}px Mono`;
const ARCHP = ARCH.map((d) => new Path2D(d));
const K = await (await fetch('humor.json')).json();

// Tiempos en beats (110 bpm), pensados para que dé tiempo a leer cada frase.
const T1 = 5, T2 = 20, T3 = 27, T4 = 34, FIN = 40; // portada | llamada | giro | valor | cierre
const MS = 3.2; // separación entre mensajes de la llamada

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
function pop(ctx, k, draw) { if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(0, (1 - k) * 30); draw(); ctx.restore(); }
function fondo(ctx, img, p) {
  fill(ctx, C.bone);
  if (!img) return;
  // Un 5 % más grande que la pantalla para que el barrido nunca deje ver el borde.
  // Las imágenes vienen preparadas a 1134x2016 (un 5 % mayores que la pantalla) y enfocadas.
  // Se dibujan a tamaño real y en píxeles enteros para que no pierdan nitidez al moverse.
  const s = Math.max(W * 1.05 / img.width, H * 1.05 / img.height), iw = Math.round(img.width * s), ih = Math.round(img.height * s);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, Math.round((W - iw) / 2 + (p - 0.5) * 36), Math.round((H - ih) / 2), iw, ih);
  const g = ctx.createLinearGradient(0, 0, 0, 720);
  g.addColorStop(0, 'rgba(250,248,245,.9)'); g.addColorStop(0.5, 'rgba(250,248,245,.8)'); g.addColorStop(1, 'rgba(250,248,245,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 720);
}
// Titular en mayúsculas a dos colores que se ajusta al ancho.
function titular(ctx, u, u0, l1, l2, y, size) {
  const fit = (s, sz) => Math.min(sz, sz * (W - 152) / layout(ctx, s, D(sz), -0.02 * sz).width);
  const s1 = fit(l1, size), s2 = fit(l2, size);
  pop(ctx, springU(u, u0, SPRING.snappy), () => text(ctx, l1, 76, y, D(s1), C.ink, 'left', -0.02 * s1));
  pop(ctx, springU(u, u0 + 0.45, SPRING.snappy), () => text(ctx, l2, 76, y + s1 * 0.98, D(s2), C.coral, 'left', -0.02 * s2));
}
function portada(ctx, u, IMG) {
  fondo(ctx, IMG.g1, prog(u, 0, T1));
  marca(ctx, C.ink);
  titular(ctx, u, 0.1, K.portada.l1, K.portada.l2, 450, 140);
}
function llamada(ctx, u) {
  fill(ctx, C.gris);
  marca(ctx, C.ink);
  const L = K.llamada;
  // Cabecera de llamada.
  pop(ctx, springU(u, T1, SPRING.snappy), () => {
    rrect(ctx, 76, 320, W - 152, 176, 38); ctx.fillStyle = C.ink; ctx.fill();
    ctx.beginPath(); ctx.arc(168, 408, 50, 0, Math.PI * 2); ctx.fillStyle = C.coral; ctx.fill();
    text(ctx, '?', 168, 430, D(66), C.ink, 'center');
    text(ctx, L.quien, 244, 395, UI(50, 600), C.bone);
    const secs = 3 + Math.floor(prog(u, T1, T2) * 50);
    text(ctx, 'Llamada en curso · 00:' + String(secs).padStart(2, '0'), 244, 452, MONO(32), C.coralL, 'left', 1);
  });
  // Mensajes de la llamada, uno a uno.
  let y = 570;
  L.mensajes.forEach(([quien, t], i) => {
    const u0 = T1 + 0.9 + i * MS, k = clamp(springU(u, u0, SPRING.bouncy), 0, 1.1);
    const f = UI(52, quien === 'ella' ? 700 : 500), tw = Math.min(layout(ctx, t, f).width, 860);
    const w = tw + 76, h = 128, x = quien === 'ella' ? W - 76 - w : 76;
    if (k > 0) {
      ctx.save(); ctx.globalAlpha = clamp(k * 1.5);
      ctx.translate(x + (quien === 'ella' ? w : 0), y + h / 2); ctx.scale(k, k); ctx.translate(-(x + (quien === 'ella' ? w : 0)), -(y + h / 2));
      rrect(ctx, x, y, w, h, 30); ctx.fillStyle = quien === 'ella' ? C.coral : C.bone; ctx.fill();
      text(ctx, t, x + 38, y + 82, f, C.ink);
      ctx.restore();
    }
    y += h + 38;
  });
  // Sello final que remata el chiste.
  const ks = springU(u, T2 - 3, { stiffness: 320, damping: 16 });
  if (ks > 0) {
    ctx.save(); ctx.translate(W / 2, 1390); ctx.rotate(-0.1); ctx.scale(1 + (1 - clamp(ks)) * 0.6, 1 + (1 - clamp(ks)) * 0.6);
    ctx.globalAlpha = clamp(ks * 1.4);
    const [a, b] = L.sello.split('|');
    rrect(ctx, -330, -110, 660, 220, 16); ctx.lineWidth = 9; ctx.strokeStyle = C.coral; ctx.stroke();
    text(ctx, a, 0, -14, D(74), C.coral, 'center', -1); text(ctx, b, 0, 66, MONO(40), C.coral, 'center', 4);
    ctx.restore();
  }
}
function giro(ctx, u, IMG) {
  fondo(ctx, IMG.g2, prog(u, T2, T3));
  marca(ctx, C.ink);
  const G = K.giro;
  pop(ctx, springU(u, T2 + 0.15, SPRING.snappy), () => text(ctx, G.l1, 76, 410, D(88), C.ink, 'left', -2));
  pop(ctx, springU(u, T2 + 0.6, SPRING.snappy), () => text(ctx, G.l2, 76, 510, DI(100), C.coral, 'left', -2));
  pop(ctx, springU(u, T2 + 1.3, SPRING.gentle), () => text(ctx, G.sub, 78, 590, UI(44, 600), C.ink));
}
function valor(ctx, u) {
  fill(ctx, C.ink); marca(ctx, C.bone);
  const V = K.valor;
  pop(ctx, springU(u, T3 + 0.1, SPRING.snappy), () => text(ctx, V.titulo, 76, 700, D(120), C.bone, 'left', -2));
  V.lineas.forEach((l, i) => pop(ctx, springU(u, T3 + 0.7 + i * 0.5, SPRING.gentle), () => text(ctx, l, 80, 820 + i * 64, UI(48, i ? 400 : 700), C.bone)));
  pop(ctx, springU(u, T3 + 1.8, SPRING.bouncy), () => {
    const f = MONO(50), tw = layout(ctx, V.url, f, 1).width;
    rrect(ctx, 70, 930, tw + 70, 106, 22); ctx.fillStyle = C.coral; ctx.fill();
    text(ctx, V.url, 105, 1001, f, C.ink, 'left', 1);
  });
}
function cierre(ctx, u) {
  fill(ctx, C.coral);
  const h = 300, w = h * ARCH_VB[2] / ARCH_VB[3], Cc = K.cierre;
  pop(ctx, springU(u, T4 + 0.1, SPRING.gentle), () => drawArch(ctx, (W - w) / 2, 380, h, C.ink));
  pop(ctx, springU(u, T4 + 0.6, SPRING.snappy), () => {
    const sz = Math.min(140, 140 * (W - 140) / layout(ctx, Cc.grande, D(140)).width);
    text(ctx, Cc.grande, W / 2, 860, D(sz), C.ink, 'center', -2);
  });
  pop(ctx, springU(u, T4 + 1.2, SPRING.gentle), () => Cc.sub.forEach((l, i) => text(ctx, l, W / 2, 960 + i * 58, UI(44, 600), C.ink, 'center')));
  pop(ctx, springU(u, T4 + 1.8, SPRING.gentle), () => { text(ctx, 'Bahiga.', W / 2, 1220, D(96), C.ink, 'center', -1.5); text(ctx, 'BAHIGA.ES', W / 2, 1300, MONO(28), C.ink, 'center', 3); });
}

const HITS = [[0, 'gancho', 'impact'], [0.55, 'línea 2', 'pop', { pitch: 'E5' }], [T1, 'llamada', 'whoosh', { len: 0.25, from: 1200, to: 3000 }]];
K.llamada.mensajes.forEach((_, i) => HITS.push([T1 + 0.9 + i * MS, 'mensaje', i === 3 ? 'blip' : 'pop', { pitch: ['A5', 'C6', 'E6', 'A6'][i] }]));
HITS.push([T2 - 3, 'sello', 'thud'], [T2, 'giro', 'impact'], [T3, 'valor', 'impact'], [T3 + 1.8, 'url', 'blip', { pitch: 'A6' }], [T4, 'cierre', 'impact']);

M.film({
  fonts: [D(100), DI(100), UI(40), UI(40, 600), UI(40, 700), MONO(26)],
  images: { g1: K.portada.img, g2: K.giro.img },
  hits: HITS,
  draw(ctx, u, t, IMG) {
    if (u < T1) return portada(ctx, u, IMG);
    if (u < T2) return llamada(ctx, u);
    if (u < T3) return giro(ctx, u, IMG);
    if (u < T4) return valor(ctx, u);
    cierre(ctx, u);
  },
});
