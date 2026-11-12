// Muestra del formato «mito o verdad»: una frase que se oye mucho, veredicto y por qué. Pensado para que se comente.
// Uso: node motion/anotado/muestra-mito.mjs  →  media/muestra-mito-1.jpg … -5.jpg
import { movil, render, OK, NO } from './piezas.mjs';
import { NEGOCIOS, web, perfil, CSS_NEG, CSS_EXTRA_NEG } from './negocios.mjs';
const NEG = 'ropa', N = NEGOCIOS[NEG];
const L = [
  { cls: 'portada', fantasma: '?', t: '',
    cuerpo: `<div class="sello">¿Mito o verdad?</div><div class="frase">«Con Instagram <i>no necesito web.</i>»</div>${movil(perfil(NEG), { url: 'Perfil de ejemplo', cls: 'pp' })}<div class="voto v1">Mito</div><div class="voto v2">Verdad</div><div class="aviso">Perfil de ejemplo,<br>negocio inventado.</div><div class="dz">Desliza →</div>` },
  { fantasma: '½', num: 'Veredicto', t: 'Verdad *a medias.*', n: 'Instagram hace muy bien una parte. La otra no la hace.',
    cuerpo: `<div class="mitad a"><small>${OK}Lo que hace bien</small><b>Enseñar tu trabajo</b><b>Hablar con quien ya te sigue</b></div><div class="mitad b"><small>${NO}Lo que no hace</small><b>Que te encuentre quien no te conoce</b></div>` },
  { fantasma: '01', num: '01', t: 'Quien no te conoce *busca en Google.*', n: 'Ahí suelen salir antes las fichas y las webs.',
    cuerpo: `<div class="busca"><div class="caja"><i></i>${N.busca}</div><div class="resu"><small>${N.dominio}</small><b>${N.nombre} · ${N.lema}</b><span>${N.sub}</span></div><div class="resu vacio"><small>Tu perfil, más abajo o no sale</small></div></div>` },
  { fantasma: '02', num: '02', t: 'Y la cuenta *no es tuya.*', n: 'Si un día la bloquean o cambia el alcance, te quedas sin escaparate.',
    cuerpo: `${movil(perfil(NEG), { url: 'Perfil de ejemplo', cls: 'pj' })}${movil(web(NEG), { url: N.dominio, cls: 'pw' })}<div class="rot ra">Prestado</div><div class="rot rb">Tuyo</div>` },
  { cls: 'coral', fantasma: '?', t: '¿Tú qué *dices?*',
    cuerpo: `<div class="gs">Instagram enseña y la web recoge. ¿Mito o verdad? Escríbelo en comentarios y cuéntanos cómo te va solo con redes.</div><div class="cta">Comenta MITO o VERDAD</div>` },
];
const EXTRA = `
.chip svg,.mitad small svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;padding:4px;border-radius:50%}
.sello{position:absolute;left:80px;top:190px;font-family:M;font-size:26px;letter-spacing:4px;text-transform:uppercase;color:#0F1C24;background:#E8683C;padding:10px 22px;border-radius:8px;transform:rotate(-3deg);z-index:14}
.frase{position:absolute;left:76px;right:70px;top:290px;font:normal 118px/.98 D;letter-spacing:-3px;z-index:12}.frase i{font-family:DI;font-style:normal;color:#E8683C}
.pp{left:520px;top:640px;transform:rotate(7deg)}
.voto{position:absolute;z-index:20;font:normal 44px U6;padding:22px 0;width:300px;text-align:center;border-radius:26px;box-shadow:0 24px 50px rgba(0,0,0,.5)}.v1{left:80px;top:760px;background:#FAF8F5;color:#0F1C24;transform:rotate(-4deg)}.v2{left:130px;top:900px;background:#14242E;color:#FAF8F5;border:2px solid #3A5362;transform:rotate(3deg)}
.num{font-size:44px!important;letter-spacing:0}
.mitad{position:absolute;left:80px;right:80px;border-radius:34px;padding:32px 40px 34px;z-index:10;box-shadow:0 30px 64px rgba(0,0,0,.5)}.mitad small{display:flex;gap:12px;align-items:center;font-family:M;font-size:22px;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
.mitad b{display:block;font:normal 50px/1.1 D;letter-spacing:-1px;padding:14px 0}.mitad b+b{border-top:2px solid #E6E0D6}
.mitad.a{top:640px;background:#FAF8F5;color:#0F1C24;transform:rotate(-2deg)}.mitad.a small{color:#2E7D4F}.mitad.a svg{background:#2E7D4F}
.mitad.b{top:1010px;left:160px;background:#14242E;border:2px solid #3A5362;color:#FAF8F5;transform:rotate(2deg)}.mitad.b small{color:#F0A07E}.mitad.b svg{background:#E8683C}
.busca{position:absolute;left:80px;right:80px;top:680px;z-index:10;transform:rotate(-2deg)}.caja{background:#FAF8F5;color:#0F1C24;border-radius:999px;padding:22px 34px;font-size:34px;display:flex;gap:18px;align-items:center;box-shadow:0 20px 44px rgba(0,0,0,.45)}.caja i{width:30px;height:30px;border:4px solid #8A8F93;border-radius:50%;flex:none}
.resu{margin-top:22px;background:#fff;color:#0F1C24;border-radius:30px;padding:30px 38px;box-shadow:0 30px 60px rgba(0,0,0,.5)}.resu small{font-family:M;font-size:20px;color:#6B747C}.resu b{display:block;font-family:U6;font-weight:400;font-size:38px;line-height:1.15;color:#1A4FA0;margin:8px 0}.resu span{font-size:25px;color:#4A5560}
.resu.vacio{background:none;border:3px dashed #3A5362;box-shadow:none;text-align:center;padding:38px}.resu.vacio small{font-size:24px;letter-spacing:2px;text-transform:uppercase;color:#F0A07E}
.pj{left:60px;top:720px;transform:rotate(-6deg) scale(.84);transform-origin:0 0;filter:saturate(.8)}.pw{left:540px;top:690px;transform:rotate(5deg) scale(.9);transform-origin:0 0;z-index:8}
.rot{position:absolute;z-index:20;font:normal 34px U6;padding:12px 30px;border-radius:999px;box-shadow:0 18px 40px rgba(0,0,0,.5)}.ra{left:110px;top:1150px;background:#14242E;color:#A9B4BA;border:2px solid #3A5362;transform:rotate(-5deg)}.rb{left:680px;top:1180px;background:#E8683C;color:#0F1C24;transform:rotate(4deg)}
.coral .gs{font-size:40px}
`;
await render('muestra-mito', L, CSS_NEG + CSS_EXTRA_NEG + EXTRA);
