// Carrusel «web anotada»: 5 señales de que tu web te cuesta clientes.
// Uso: node motion/anotado/render.mjs  →  media/1118-senales-web-1.jpg … -8.jpg
import { mkdirSync } from 'node:fs';
import { chromium, RAIZ, arco, co, CSS, MAL, MAL_HERO, CARGA, MINI, BIEN, movil } from './piezas.mjs';
const ID = '1118-senales-web';

/* ── Láminas: cada una con su composición ── */
const L = [
  { cls: 'portada', fantasma: '5', t: '5 señales de que tu web te *cuesta clientes.*',
    cuerpo: `${movil(MAL, { cls: 'm-portada', y: -40 })}
      <div class="chips">${['Tarda en cargar', 'No dice qué haces', 'El teléfono no se pulsa', 'Se lee con lupa', 'El horario no coincide'].map((x, i) => `<div class="chip c${i + 1}"><b>${i + 1}</b>${x}</div>`).join('')}</div>
      <div class="aviso">Web de ejemplo,<br>inventada. Los fallos<br>son los de verdad.</div><div class="dz">Desliza →</div>` },
  { fantasma: '01', num: '01', t: 'Tarda en *cargar.*', n: 'Pruébala con datos, no con wifi. Si tú esperas, tu cliente se va.',
    cuerpo: `${movil(CARGA, { cls: 'm-der' })}
      <div class="crono"><b>6,2</b><span>segundos<br>en blanco</span></div>
      <div class="linea"><i style="left:0">0 s</i><i style="left:48%" class="hito">3 s<small>Aquí muchos ya se han ido</small></i><i style="left:100%">6 s</i><u></u></div>` },
  { fantasma: '02', num: '02', t: 'No dice *qué haces.*', n: '«Bienvenidos» no vende pan. Di qué haces y dónde, en la primera pantalla.',
    cuerpo: `<div class="recorte mal-r"><span class="tag malo">Así no</span><div class="esc2">${MAL_HERO}</div><svg class="tacha" viewBox="0 0 600 120" preserveAspectRatio="none"><path d="M10 70 C 150 30, 300 100, 590 46" /></svg></div>
      <div class="recorte bien-r"><span class="tag bueno">Así sí</span><b>Pan de horno de leña en Priego</b><p>Abrimos a las 7:00. Encargos por WhatsApp.</p></div>` },
  { fantasma: '03', num: '03', t: 'El teléfono *no se pulsa.*', n: 'Escondido al final y sin enlace. Nadie lo copia a mano.',
    cuerpo: `${movil(MAL, { cls: 'm-der', y: -250 })}
      <div class="lupa"><div class="lupa-in"><span>Tlf: <b>957 00 00 00</b> · Fax: 957 00 0</span></div><i class="mango"></i></div>
      <div class="toque"><i></i><i></i><span>No pasa nada</span></div>
      <div class="llamar"><small>Así sí · un toque</small><a>Llamar</a></div>` },
  { fantasma: '04', num: '04', t: 'Se lee *con lupa.*', n: 'Está hecha para ordenador. Tus clientes la abren en el móvil.',
    cuerpo: `${movil(MINI, { cls: 'm-der' })}
      <svg class="pellizco" viewBox="0 0 420 420"><path d="M150 270 L52 368 M52 368 l56 -8 M52 368 l8 -56"/><path d="M270 150 L368 52 M368 52 l-56 8 M368 52 l-8 56"/><circle cx="150" cy="270" r="34"/><circle cx="270" cy="150" r="34"/></svg>
      <div class="chip suelto">Hay que ampliar con dos dedos</div>` },
  { fantasma: '05', num: '05', t: 'El horario *no coincide.*', n: 'La web dice una cosa y Google otra. El cliente no se fía de ninguna.',
    cuerpo: `<div class="tarj t-web"><small>Tu web</small><p>Horario: de lunes a viernes de <b>9:00</b> a 14:00</p></div>
      <div class="distinto">≠</div>
      <div class="tarj t-google"><small><i></i>Ficha de Google</small><strong>Panadería La Miga</strong><p><em>Cerrado</em> · Abre a las <b>7:00</b></p><span>★★★★★ 4,8 (132)</span></div>` },
  { cls: 'partida', t: 'La misma panadería, *arreglada.*',
    n: 'Qué hace, dónde está y un botón para llamar. Nada más.',
    cuerpo: `<div class="mitad"></div>
      ${movil(MAL, { cls: 'm-antes' })}${movil(BIEN, { cls: 'm-desp' })}
      <span class="etq antes">Antes</span><span class="etq desp">Después</span>` },
  { cls: 'coral', fantasma: '?', t: '¿Cuántas tiene *la tuya?*',
    cuerpo: `<div class="gs">Cuenta con Bahiga. La miramos contigo y te decimos qué arreglar primero, sin compromiso.</div><div class="gu">Guárdalo y repásalo con tu web abierta.</div><div class="cta">Escríbenos WEB en comentarios</div>` },
];

const total = L.length;
const html = (s, i) => `<html><head><style>${CSS}</style></head><body class="${s.cls || ''}">
  <div class=m>${arco(56, s.cls === 'coral' ? '#0F1C24' : '#FAF8F5')}Bahiga.</div><div class=pg>0${i + 1} / 0${total}</div>
  ${s.fantasma ? `<div class=fan>${s.fantasma}</div>` : ''}${s.num ? `<div class=num>${s.num}</div>` : ''}
  <div class=t>${co(s.t)}</div>${s.n ? `<div class=n>${s.n}</div>` : ''}${s.cuerpo}
  <div class=pie>BAHIGA.ES</div></body></html>`;

mkdirSync(`${RAIZ}media`, { recursive: true });
const b = await chromium.launch();
for (const [i, s] of L.entries()) {
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await pg.setContent(html(s, i)); await pg.evaluate(() => document.fonts.ready);
  const ruta = `${RAIZ}media/${ID}-${i + 1}.jpg`;
  await pg.screenshot({ path: ruta, type: 'jpeg', quality: 93 });
  console.log(ruta.replace(RAIZ, ''));
}
await b.close();
