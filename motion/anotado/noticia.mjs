// Noticia en carrusel con el estilo «pantalla anotada»: se enseña cómo llega el aviso o el mensaje
// dentro de un móvil y se señala qué mirar. Sustituye a motion/noticia/render.mjs para las noticias nuevas.
//
// Uso: node motion/anotado/noticia.mjs <fichero.json>
// Genera media/noticias/<id>-1.jpg … -N.jpg (carrusel, de 4 a 5 láminas) y media/noticias/<id>-historia-1.jpg.
//
// Campos del JSON:
//   id         «n-MMDD-tema»
//   etiqueta   dos partes: «Aviso · WhatsApp»
//   titular    de 4 a 9 palabras, la parte clave entre asteriscos
//   fuente     nombre corto de la fuente oficial
//   pantalla   lo que se ve en el móvil. Uno de estos tipos:
//              { "tipo": "chat", "de": "Un contacto tuyo", "mensajes": [ { "texto": "…", "enlace": "Votar aquí" }, { "yo": true, "texto": "…" } ] }
//              { "tipo": "aviso", "app": "Navegador", "titulo": "Actualización disponible", "texto": "…", "boton": "Actualizar" }
//              { "tipo": "web", "negocio": "taller" }      (una web del banco de negocios inventados)
//              { "tipo": "ficha", "negocio": "barberia", "mala": true }   (ficha en el buscador de mapas)
//              Nunca dominios, enlaces ni nombres reales: todo es un ejemplo y la portada lo dice.
//   senales    de 2 a 4 etiquetas cortas que se señalan sobre la pantalla («Enlace raro», «Te mete prisa»)
//   que_pasa   una o dos frases, sin tecnicismos, 120 caracteres como mucho (va en una columna estrecha)
//   que_hacer  de 2 a 4 pasos cortos
//   comprobar  OPCIONAL: { "ruta": ["Abre WhatsApp", "Ajustes", "Dispositivos vinculados"], "texto": "qué mirar" }
//   cierre     pregunta corta con la parte final entre asteriscos
//   cierre_sub una frase con lo que hace Bahiga en este caso
//   cta        «Comenta WEB»
import { readFileSync } from 'node:fs';
import { movil, render, ESTADO, OK, NO } from './piezas.mjs';
import { web, CSS_NEG } from './negocios.mjs';
import { ficha, CSS_FICHA } from './ficha.mjs';

const d = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const P = d.pantalla || { tipo: 'aviso', app: 'Aviso', titulo: d.etiqueta, texto: d.que_pasa };
const chat = () => `<div class="w nc">${ESTADO('#111')}<div class="nc-cab"><i>${(P.de || '?')[0]}</i><span><b>${P.de || 'Número desconocido'}</b>en línea</span></div>
  <div class="nc-cu">${(P.mensajes || []).map((m) => `<div class="nc-b ${m.yo ? 'yo' : ''}">${m.texto}${m.enlace ? `<u>${m.enlace}</u>` : ''}</div>`).join('')}</div><div class="nc-esc">Mensaje</div></div>`;
const aviso = () => `<div class="w na">${ESTADO('#111')}<div class="na-barra"><i></i><i></i><i></i><span>${P.app || 'Aplicación'}</span></div>
  <div class="na-fondo"><s></s><s></s><s class="c"></s><div class="na-caja"><em>!</em><b>${P.titulo}</b><p>${P.texto}</p><a>${P.boton || 'Aceptar'}</a></div><s></s><s class="c"></s></div></div>`;
const pantalla = P.tipo === 'chat' ? chat() : P.tipo === 'web' ? web(P.negocio) : P.tipo === 'ficha' ? ficha(P.negocio, { mala: !!P.mala }) : aviso();
const pm = (o = {}) => movil(pantalla, { url: 'Ejemplo', ...o });
const senales = (d.senales || []).slice(0, 4);

const L = [
  { cls: 'portada', fantasma: '!', t: d.titular,
    cuerpo: `<div class="eti">${d.etiqueta}</div>${pm({ cls: 'm-portada' })}<div class="aviso">Pantalla de ejemplo.<br>Fuente: ${d.fuente}.</div><div class="dz">Desliza →</div>` },
  { fantasma: '?', num: '01', t: 'Qué *pasa.*', n: d.que_pasa,
    cuerpo: `${pm({ cls: 'm-der', y: -10 })}${senales.map((s, i) => `<div class="chip mal x${i + 1}"><b>${NO}</b>${s}</div>`).join('')}` },
  { fantasma: String((d.que_hacer || []).length), num: '02', t: 'Qué *hacer.*',
    cuerpo: `<div class="lista">${(d.que_hacer || []).map((x, i) => `<div><b>${i + 1}</b>${x}</div>`).join('')}</div>` },
  ...(d.comprobar ? [{ fantasma: '✓', num: '03', t: 'Compruébalo *ahora.*', n: d.comprobar.texto,
    cuerpo: `<div class="ruta">${d.comprobar.ruta.map((x, i) => `<div class="chip pt"><b>${i + 1}</b>${x}</div>`).join('')}</div>` }] : []),
  { cls: 'coral', fantasma: '?', t: d.cierre,
    cuerpo: `<div class="gs">${d.cierre_sub}</div><div class="gu">Guárdalo y pásaselo a quien le sirva.</div><div class="cta">${d.cta || 'Comenta WEB'}</div>` },
];

const EXTRA = `
.eti{position:absolute;left:80px;top:170px;font-family:M;font-size:22px;letter-spacing:3px;text-transform:uppercase;color:#F0A07E;z-index:12}
.portada .t{top:230px}.m-portada{left:500px;top:520px;transform:rotate(-7deg)}
.chip svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.chip.mal{font-size:30px;padding:12px 30px 12px 12px;z-index:14}.chip.mal b{background:#E8683C}.x1{left:70px;top:830px;transform:rotate(-3deg)}.x2{left:130px;top:945px;transform:rotate(2deg)}.x3{left:60px;top:1060px;transform:rotate(-2deg)}.x4{left:100px;top:1175px;transform:rotate(3deg)}
.lista{position:absolute;left:80px;right:80px;top:470px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:16px 40px;z-index:10;transform:rotate(-2deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}.lista div{display:flex;gap:24px;align-items:center;font-size:38px;line-height:1.25;padding:28px 0;border-bottom:2px solid #E6E0D6}.lista div:last-child{border:0}.lista b{width:60px;height:60px;border-radius:50%;background:#0F1C24;color:#FAF8F5;font:normal 30px DI;display:grid;place-items:center;flex:none}
.ruta{position:absolute;left:80px;top:760px;display:grid;gap:22px;z-index:14;justify-items:start}.chip.pt{position:static;font-size:36px;padding:14px 36px 14px 14px}.chip.pt b{color:#FAF8F5;font-family:U6;font-size:24px;width:52px;height:52px}.chip.pt:nth-child(2){transform:translateX(70px)}.chip.pt:nth-child(3){transform:translateX(140px)}.chip.pt:nth-child(4){transform:translateX(210px)}
/* pantalla: conversación */
.nc{font-family:U,system-ui,sans-serif;background:#ECE5DB;color:#111;min-height:800px;display:flex;flex-direction:column}
.nc-cab{display:flex;gap:10px;align-items:center;padding:8px 14px 10px;background:#F7F4EF;border-bottom:1px solid #DED6C9}.nc-cab i{width:36px;height:36px;border-radius:50%;background:#C9CDD1;font:normal 15px U6;display:grid;place-items:center;color:#fff}.nc-cab span{font-size:11px;color:#6B747C}.nc-cab b{display:block;font-family:U6;font-weight:400;font-size:15px;color:#111}
.nc-cu{padding:16px 12px;display:grid;gap:8px;align-content:start;flex:1}.nc-b{max-width:82%;background:#fff;border-radius:4px 16px 16px 16px;padding:10px 12px;font-size:14.5px;line-height:1.35;box-shadow:0 1px 1px rgba(0,0,0,.08)}.nc-b.yo{justify-self:end;background:#DCF2D0;border-radius:16px 4px 16px 16px}
.nc-b u{display:block;margin-top:8px;padding:9px 10px;border-radius:10px;background:#EEF1F4;color:#1A4FA0;font-family:U6;text-decoration:none;font-size:13.5px}
.nc-esc{margin:0 12px 60px;padding:11px 16px;border-radius:999px;background:#fff;color:#9AA0A6;font-size:13.5px}
/* pantalla: aviso de una aplicación */
.na{font-family:U,system-ui,sans-serif;background:#F1F3F4;color:#1B1F23;min-height:800px}.na-barra{display:flex;gap:6px;align-items:center;padding:10px 14px;background:#fff;border-bottom:1px solid #E0E3E6}.na-barra i{width:9px;height:9px;border-radius:50%;background:#D5D9DD}.na-barra span{margin-left:10px;font-family:U6;font-size:12.5px;color:#5B6670}
.na-fondo{padding:18px 16px}.na-fondo s{display:block;height:12px;border-radius:6px;background:#DDE1E5;margin:0 0 12px}.na-fondo s.c{width:60%}
.na-caja{margin:22px 0;background:#fff;border-radius:18px;padding:22px 20px;box-shadow:0 14px 34px rgba(0,0,0,.16);text-align:center}.na-caja em{display:grid;place-items:center;width:48px;height:48px;margin:0 auto 12px;border-radius:50%;background:#FBE4DA;color:#B4532E;font:normal 24px U6}.na-caja b{display:block;font-family:U6;font-weight:400;font-size:18px}.na-caja p{margin:8px 0 16px;font-size:13.5px;line-height:1.4;color:#5B6670}.na-caja a{display:block;padding:12px;border-radius:12px;background:#1B1F23;color:#fff;font-family:U6;font-size:14.5px}
`;
const CSSN = CSS_NEG + CSS_FICHA + EXTRA;
await render(`noticias/${d.id}`, L, CSSN);
await render(`noticias/${d.id}-historia`, [{ fantasma: '!', t: d.titular, cuerpo: `<div class="eti">${d.etiqueta}</div>${pm({ cls: 'h1' })}<div class="aviso">Pantalla de ejemplo. Fuente: ${d.fuente}.</div>` }],
  CSSN + `body{height:1920px;background:radial-gradient(1000px 900px at 76% 66%,#1B3340 0%,#0F1C24 62%)}.m{top:150px}.pie{bottom:120px}.pg{display:none}.eti{top:290px}.t{top:350px!important;font-size:112px;right:80px}.fan{top:300px;right:-40px;font-size:1300px}.h1{left:400px;top:860px;transform:rotate(-7deg) scale(1.1);transform-origin:0 0}.aviso{bottom:auto;top:760px;left:80px;width:300px;z-index:16}`, { ancho: 1080, alto: 1920 });
console.log(`media/noticias/${d.id}-1.jpg … -${L.length}.jpg y media/noticias/${d.id}-historia-1.jpg`);
