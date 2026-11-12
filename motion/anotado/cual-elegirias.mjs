// Carrusel «¿Cuál elegirías?»: tres decisiones de una web, cada una con dos opciones. Pensado para que se comente con tres letras.
// Uso: node motion/anotado/cual-elegirias.mjs  →  media/1207-cual-elegirias-1.jpg … -6.jpg
import { render } from './piezas.mjs';
import { NEGOCIOS, con, CSS_NEG } from './negocios.mjs';
const NEG = 'barberia', N = NEGOCIOS[NEG];
const ab = (a, b) => `<div class="op oa"><em>A</em>${a}</div><div class="op ob"><em>B</em>${b}</div>`;
const hero = (titulo, sub) => con(NEG, `<div class="hero"><b>${titulo}</b>${sub ? `<span>${sub}</span>` : ''}</div>`);
const L = [
  { cls: 'portada', fantasma: '?', t: '¿Cuál *elegirías?*', n: 'Tres decisiones de la web de una barbería. Elige A o B en cada una.',
    cuerpo: `<div class="letra la">A</div><div class="letra lb">B</div><div class="aviso">Negocio inventado.</div><div class="dz">Desliza →</div>` },
  { fantasma: '1', num: 'Decisión 1', t: 'La *primera pantalla.*',
    cuerpo: ab(hero('Bienvenidos a nuestra web', ''), hero(N.lema, N.sub)) },
  { fantasma: '2', num: 'Decisión 2', t: 'Para *pedir cita.*',
    cuerpo: ab(`<div class="form"><i></i><i></i><i class="l"></i><u>Enviar</u></div>`, `<div class="bots"><a style="background:${N.c.acento};color:${N.c.sobre}">Llamar</a><a>WhatsApp</a></div>`) },
  { fantasma: '3', num: 'Decisión 3', t: 'El *menú.*',
    cuerpo: ab(`<div class="menu">${['Inicio', 'Quiénes somos', 'Misión', 'Servicios', 'Galería', 'Noticias', 'Enlaces', 'Contacto'].map((x) => `<a>${x}</a>`).join('')}</div>`, `<div class="menu corto">${['Servicios', 'Dónde', 'Reservar'].map((x) => `<a>${x}</a>`).join('')}</div>`) },
  { fantasma: 'B', num: 'Lo que haríamos', t: 'Nosotros, *B, B y B.*', n: 'Quien entra quiere saber qué haces, pedir cita y no perderse.',
    cuerpo: `<div class="lista"><div><b>1</b>Que se sepa qué haces sin bajar</div><div><b>2</b>Que pedir cita sea un toque</div><div><b>3</b>Que no haya dónde perderse</div></div>` },
  { cls: 'coral', fantasma: '?', t: '¿Y *tú?*',
    cuerpo: `<div class="gs">Escribe tus tres letras en comentarios (por ejemplo, B B A) y dinos por qué. No hay respuesta única.</div><div class="cta">Comenta tus 3 letras</div>` },
];
const EXTRA = `
.num{font-size:44px!important;letter-spacing:0}
.letra{position:absolute;z-index:10;font:normal 420px/.8 DI;width:400px;height:480px;border-radius:50px;display:grid;place-items:center;box-shadow:0 40px 80px rgba(0,0,0,.5)}.la{left:90px;top:640px;background:#FAF8F5;color:#0F1C24;transform:rotate(-5deg)}.lb{left:560px;top:700px;background:#E8683C;color:#0F1C24;transform:rotate(4deg)}
.op{position:absolute;left:80px;right:80px;height:330px;border-radius:34px;background:#FAF8F5;color:#0F1C24;padding:30px 36px 30px 150px;z-index:10;box-shadow:0 30px 64px rgba(0,0,0,.5);display:grid;align-items:center}
.op em{position:absolute;left:28px;top:50%;margin-top:-50px;width:100px;height:100px;border-radius:50%;background:#0F1C24;color:#FAF8F5;font:normal 60px DI;display:grid;place-items:center}.ob em{background:#E8683C;color:#0F1C24}
.oa{top:480px;transform:rotate(-2deg)}.ob{top:860px;transform:rotate(1.5deg)}
.hero{height:250px;border-radius:22px;padding:26px 30px;display:grid;align-content:end;color:#fff;background:linear-gradient(180deg,rgba(10,12,14,.25),rgba(10,12,14,.85)),var(--foto) center/cover}.hero b{font:normal 46px/1.05 D;letter-spacing:-1px}.hero span{font-size:25px;margin-top:8px;opacity:.9}
.form{display:grid;gap:12px}.form i{height:46px;border:2px solid #C9CDD1;border-radius:8px}.form i.l{height:80px}.form u{justify-self:start;text-decoration:none;font:normal 26px U6;padding:10px 30px;border-radius:8px;background:#C9CDD1;color:#4A5560}
.bots{display:grid;grid-template-columns:1fr 1fr;gap:18px}.bots a{font:normal 44px U6;text-align:center;padding:36px 0;border-radius:24px;border:3px solid #0F1C24}
.menu{display:flex;flex-wrap:wrap;gap:12px}.menu a{font:normal 27px U6;padding:12px 20px;border-radius:999px;border:2px solid #C9CDD1;color:#4A5560}.menu.corto a{font-size:40px;padding:20px 34px;border-color:#0F1C24;color:#0F1C24}
.lista{position:absolute;left:80px;right:80px;top:720px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:16px 40px;z-index:10;transform:rotate(-2deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}.lista div{display:flex;gap:24px;align-items:center;font-size:38px;padding:28px 0;border-bottom:2px solid #E6E0D6}.lista div:last-child{border:0}.lista b{width:60px;height:60px;border-radius:50%;background:#E8683C;color:#0F1C24;font:normal 30px DI;display:grid;place-items:center;flex:none}
`;
await render('1207-cual-elegirias', L, CSS_NEG + EXTRA);
