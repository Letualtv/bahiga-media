// Historia de las webs por sector (3 pantallas, 1080x1920) con muestras reales.
// Uso: node motion/anotado/historia-webs.mjs  →  media/1124-historia-webs-1.jpg … -3.jpg
import { movil, render } from './piezas.mjs';
import { real, CSS_REAL } from './real.mjs';
const BASE = `${CSS_REAL}
body{height:1920px;background:radial-gradient(1000px 900px at 76% 66%,#1B3340 0%,#0F1C24 62%)}
.m{top:150px}.pie{bottom:120px}.pg{display:none}
.t{top:290px;font-size:116px;right:80px}.coral .t{top:520px;font-size:150px}
.fan{top:300px;right:-40px;font-size:1300px}.coral .fan{top:700px}
.h1{left:260px;top:820px;transform:rotate(-4deg) scale(1.12);transform-origin:50% 0}
.aviso{bottom:auto;top:700px;left:80px;z-index:16}
.gs{position:absolute;left:80px;right:120px;top:980px;font-size:50px;line-height:1.25;z-index:10}.cta{bottom:420px;font-size:46px;padding:30px 48px}
.pr{position:absolute;left:80px;right:80px;z-index:20;border-radius:44px;padding:44px 50px 48px;box-shadow:0 40px 80px rgba(0,0,0,.55)}.pr b{display:block;font-family:D;font-weight:400;line-height:.9;letter-spacing:-6px}.pr span{display:block;font-size:36px;line-height:1.3;margin-top:22px}.pr small{font-family:M;font-size:26px;letter-spacing:3px;text-transform:uppercase}
#pa{top:640px;background:#FAF8F5;color:#0F1C24;transform:rotate(-3deg)}#pa b{font-size:270px;color:#E8683C}#pa small{color:#8A8F93}
#pb{top:1200px;left:160px;background:#E8683C;color:#0F1C24;transform:rotate(2deg)}#pb b{font-size:120px;letter-spacing:-3px}
`;
await render('1124-historia-webs', [
  { fantasma: '14', t: 'Catorce webs de muestra. *¿Está tu sector?*', cuerpo: `${movil(real('estetica'), { cls: 'real h1' })}<div class="aviso">Web de muestra hecha por Bahiga.</div>` },
  { fantasma: '€', t: 'Lo que *cuesta.*', cuerpo: `<div class=pr id=pa><small>Desde</small><b>390 €</b><span>Con tu nombre, tus fotos y tus precios.<br>Dominio un año. Precio sin IVA.</span></div><div class=pr id=pb><small>Black Friday</small><b>3 meses gratis</b><span>de mantenimiento, contratando hasta el 30 de noviembre.</span></div>` },
  { cls: 'coral', fantasma: '?', t: 'Míralas en *bahiga.es/webs*', cuerpo: `<div class="gs">Entra desde el móvil y prueba la de tu sector. Si la quieres para ti, responde WEB a esta historia.</div><div class="cta">Responde WEB</div>` },
], BASE, { ancho: 1080, alto: 1920 });
