// Muestra del formato «antes y después»: la misma web, descuidada y arreglada.
// El negocio es inventado y se dice en portada y en el cierre: no es un caso de cliente ni promete resultados.
// Uso: node motion/anotado/muestra-antes-despues.mjs [negocio]  →  media/muestra-antes-despues-1.jpg … -7.jpg
import { movil, render, OK, NO } from './piezas.mjs';
import { NEGOCIOS, web, webMala, con, mapa, CSS_NEG, CSS_EXTRA_NEG } from './negocios.mjs';
const NEG = process.argv[2] || 'fisio', N = NEGOCIOS[NEG];
const mal = (o = {}) => movil(webMala(NEG), { url: N.dominio, ...o });
const bien = (o = {}) => movil(web(NEG), { url: N.dominio, ...o });
const par = (no, si) => `<div class="par no"><small>${NO}Así no</small>${no}</div><div class="par si"><small>${OK}Así sí</small>${si}</div>`;

const L = [
  { cls: 'portada', fantasma: '2', t: 'La misma clínica. *Dos webs.*',
    cuerpo: `${mal({ cls: 'pa' })}${bien({ cls: 'pb' })}<div class="rot ra">Antes</div><div class="rot rb">Después</div><div class="aviso">Ejemplo inventado.<br>No es un cliente.</div><div class="dz">Desliza →</div>` },
  { fantasma: '?', num: 'Antes', t: 'Entras y *no sabes qué hacen.*', n: 'Ocho opciones de menú y ningún teléfono.',
    cuerpo: `${mal({ cls: 'm-der', y: -10 })}<div class="chip mal x1"><b>${NO}</b>No dice qué hace</div><div class="chip mal x2"><b>${NO}</b>Sin teléfono</div><div class="chip mal x3"><b>${NO}</b>«Horario: consultar»</div>` },
  { fantasma: '01', num: 'Cambio 01', t: 'Qué haces, *arriba del todo.*',
    cuerpo: par(`<q>Bienvenidos a nuestra página web</q>`, `<q class="b">${N.lema}.</q><span>${N.sub}</span>`) },
  { fantasma: '02', num: 'Cambio 02', t: 'Llamar, *a un toque.*',
    cuerpo: par(`<div class="form"><i></i><i></i><i></i><i class="l"></i><em>Enviar formulario</em></div>`, `<div class="bots"><a style="background:${N.c.acento};color:${N.c.sobre}">Llamar</a><a>WhatsApp</a></div>`) },
  { fantasma: '03', num: 'Cambio 03', t: 'Horario y dónde, *sin buscar.*',
    cuerpo: par(`<q>Horario: consultar</q>`, `<div class="hd"><div><b>${N.horario.split(' · ').slice(0, 2).join(' · ')}</b><span>${N.dir} · ${N.ciudad}</span></div>${mapa}</div>`) },
  { fantasma: '✓', num: 'Después', t: 'Entras y *ya sabes a qué.*', n: 'Mismo negocio. Cambia lo que se ve primero.',
    cuerpo: `${bien({ cls: 'm-der', y: -10 })}<div class="chip bien x1"><b>${OK}</b>Qué hace</div><div class="chip bien x2"><b>${OK}</b>Llamar y WhatsApp</div><div class="chip bien x3"><b>${OK}</b>Horario y mapa</div>` },
  { cls: 'coral', fantasma: '?', t: '¿A cuál se parece *la tuya?*',
    cuerpo: `<div class="gs">No prometemos más llamadas. Quitamos los motivos para irse. Escribe WEB y te decimos qué cambiaríamos en la tuya.</div><div class="gu">Ejemplo con un negocio inventado.</div><div class="cta">Comenta WEB</div>` },
];
const EXTRA = `
.chip svg,.par small svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.pa{left:70px;top:520px;transform:rotate(-6deg) scale(.86);transform-origin:0 0;filter:saturate(.75)}.pb{left:530px;top:470px;transform:rotate(5deg) scale(.92);transform-origin:0 0;z-index:8}
.rot{position:absolute;z-index:20;font:normal 34px U6;padding:12px 30px;border-radius:999px;box-shadow:0 18px 40px rgba(0,0,0,.5)}.ra{left:120px;top:960px;background:#14242E;color:#A9B4BA;border:2px solid #3A5362;transform:rotate(-5deg)}.rb{left:740px;top:1150px;background:#E8683C;color:#0F1C24;transform:rotate(4deg)}
.aviso,.dz{z-index:30}.aviso{background:#0F1C24;padding:10px 14px;border-radius:10px;margin-left:-14px}
.num{font-size:44px!important;letter-spacing:0}
.chip.mal,.chip.bien{font-size:30px;padding:12px 30px 12px 12px;z-index:14}.chip.mal b{background:#E8683C}.chip.bien b{background:#2E7D4F}.x1{left:70px;top:800px;transform:rotate(-3deg)}.x2{left:130px;top:925px;transform:rotate(2deg)}.x3{left:60px;top:1050px;transform:rotate(-2deg)}
.par{position:absolute;left:80px;right:80px;border-radius:34px;padding:30px 40px 36px;z-index:10;box-shadow:0 30px 64px rgba(0,0,0,.5)}.par small{display:flex;gap:12px;align-items:center;font-family:M;font-size:22px;letter-spacing:2px;text-transform:uppercase;margin-bottom:18px}.par small svg{padding:4px;border-radius:50%;width:22px;height:22px}
.par.no{top:520px;background:#14242E;border:2px dashed #3A5362;color:#A9B4BA;transform:rotate(-2deg)}.par.no small{color:#F0A07E}.par.no small svg{background:#E8683C}
.par.si{top:860px;background:#FAF8F5;color:#0F1C24;transform:rotate(1.5deg)}.par.si small{color:#2E7D4F}.par.si small svg{background:#2E7D4F}
.par q{display:block;quotes:none;font:italic 46px Georgia,serif;line-height:1.2}.par q.b{font:normal 62px/1.05 D;letter-spacing:-1.5px}.par span{display:block;font-size:30px;color:#4A5560;margin-top:12px}
.form{display:grid;gap:12px}.form i{height:44px;border:2px solid #3A5362;border-radius:6px}.form i.l{height:90px}.form em{font:normal 26px Georgia,serif;justify-self:start;padding:8px 22px;border:2px solid #3A5362;border-radius:6px}
.par.no:has(.form){top:500px}.par.si:has(.bots){top:1010px}
.bots{display:grid;grid-template-columns:1fr 1fr;gap:18px}.bots a{font:normal 46px U6;text-align:center;padding:34px 0;border-radius:24px;border:3px solid #0F1C24}
.hd{display:grid;grid-template-columns:1.2fr 1fr;gap:26px;align-items:center}.hd b{display:block;font:normal 46px/1.1 D;letter-spacing:-1px}.hd span{font-size:27px;margin-top:10px}.hd .l-mapa{height:170px;margin:0;border-radius:20px}
`;
await render('muestra-antes-despues', L, CSS_NEG + CSS_EXTRA_NEG + EXTRA);
