// Carrusel «Revisamos tu web gratis hasta el 30 de noviembre» con el estilo «pantalla anotada».
// Uso: node motion/anotado/revision-gratis.mjs  →  media/1123-revision-gratis-1.jpg … -5.jpg
import { movil, render, OK } from './piezas.mjs';
import { web, CSS_NEG } from './negocios.mjs';
const NEG = 'flores';
const L = [
  { cls: 'portada', fantasma: '0', t: 'Hasta el 30 de noviembre revisamos tu web. *Gratis.*',
    cuerpo: `${movil(web(NEG), { url: 'floresazahar.example', cls: 'm-portada' })}<div class="chip rv r1"><b>${OK}</b>Velocidad</div><div class="chip rv r2"><b>?</b>Google</div><div class="chip rv r3"><b>${OK}</b>Contacto</div>
      <div class="aviso">Web de ejemplo,<br>negocio inventado.</div><div class="dz">Desliza →</div>` },
  { fantasma: '5', num: '01', t: 'Cinco cosas *que miramos.*', n: 'Las que más clientes hacen perder.',
    cuerpo: `<div class="lista">${['Cuánto tarda en cargar en el móvil', 'Si se entiende qué haces en la primera pantalla', 'Si el teléfono y WhatsApp funcionan', 'Cómo sales en Google', 'Si está actualizada y con copias'].map((x, i) => `<div><b>${i + 1}</b>${x}</div>`).join('')}</div>` },
  { fantasma: '1', num: '02', t: 'Te llevas *una hoja.*', n: 'Lo urgente arriba, lo que puede esperar abajo. Sin tecnicismos.',
    cuerpo: `<div class="hoja"><small>Revisión de tu web</small><h4>Lo urgente</h4><p class="u">El botón de llamar no funciona en el móvil</p><p class="u">Tarda 7 segundos en abrir</p><h4>Puede esperar</h4><p>Faltan fotos en dos servicios</p><p>El horario no coincide con tu ficha</p><em>Ejemplo de informe</em></div>` },
  { fantasma: '0', num: '03', t: 'Y *no hay que contratar nada.*', n: 'Si luego quieres que lo arreglemos, te damos precio. Si no, la hoja es tuya.',
    cuerpo: `<div class="cero"><b>0 €</b><span>la revisión<br>hasta el 30 de noviembre</span></div>` },
  { cls: 'coral', fantasma: '?', t: '¿Revisamos *la tuya?*',
    cuerpo: `<div class="gs">Escribe WEB en comentarios o mándanos la dirección por privado. Te contestamos con la hoja esta misma semana.</div><div class="gu">Hasta el 30 de noviembre.</div><div class="cta">Comenta WEB</div>` },
];
const EXTRA = `
.portada .t{font-size:104px}.m-portada{left:520px;top:560px;transform:rotate(-7deg)}
.chip svg,.lista svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.chip.rv{font-size:30px;padding:12px 30px 12px 12px;z-index:14}.chip.rv b{background:#2E7D4F;color:#fff;font-family:U6;font-size:24px}.chip.r2 b{background:#E8683C}.r1{left:330px;top:760px;transform:rotate(3deg)}.r2{left:600px;top:980px;transform:rotate(-3deg)}.r3{left:300px;top:1140px;transform:rotate(2deg)}
.lista{position:absolute;left:80px;right:80px;top:620px;background:#FAF8F5;color:#0F1C24;border-radius:34px;padding:16px 40px;z-index:10;transform:rotate(-2deg);box-shadow:0 34px 70px rgba(0,0,0,.5)}.lista div{display:flex;gap:22px;align-items:center;font-size:33px;padding:21px 0;border-bottom:2px solid #E6E0D6}.lista div:last-child{border:0}.lista b{width:52px;height:52px;border-radius:50%;background:#0F1C24;color:#FAF8F5;font:normal 26px DI;display:grid;place-items:center;flex:none}
.hoja{position:absolute;left:150px;top:640px;width:700px;background:#FAF8F5;color:#0F1C24;border-radius:10px;padding:40px 48px 34px;z-index:10;transform:rotate(-3deg);box-shadow:0 40px 80px rgba(0,0,0,.55)}.hoja small{font-family:M;font-size:19px;letter-spacing:2px;text-transform:uppercase;color:#8A8F93}
.hoja h4{margin:22px 0 6px;font:400 40px D;letter-spacing:-1px}.hoja p{margin:0;padding:12px 0 12px 26px;font-size:28px;border-bottom:2px solid #E6E0D6;position:relative}.hoja p:before{content:"";position:absolute;left:0;top:24px;width:12px;height:12px;border-radius:50%;background:#C9CDD1}.hoja p.u:before{background:#E8683C}.hoja em{display:block;margin-top:18px;font:normal 18px M;color:#8A8F93}
.cero{position:absolute;left:76px;top:760px;z-index:10}.cero b{display:block;font-family:DI;font-weight:400;font-size:400px;line-height:.8;color:#E8683C;letter-spacing:-12px}.cero span{display:block;font-family:M;font-size:26px;letter-spacing:3px;text-transform:uppercase;line-height:1.5;color:#A9B4BA;margin-top:36px}
`;
await render('1123-revision-gratis', L, CSS_NEG + EXTRA);
