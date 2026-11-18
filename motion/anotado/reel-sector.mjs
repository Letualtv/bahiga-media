// Reel de la serie «Una web para tu …»: la muestra real del sector desplazándose en el móvil, tres detalles y el precio.
// Uso: node motion/anotado/reel-sector.mjs [sector] [--hoja]  →  media/1125-reel-barberia.mp4 (barbería por defecto)
import { movil } from './piezas.mjs';
import { real, barra, CSS_REAL } from './real.mjs';
import { CSS_REEL, JS, ficha, marca, fin, grabar } from './reelbase.mjs';
const SECTORES = {
  barberia: { id: '1125-reel-barberia', que: 'tu barbería.', chips: ['Reserva por WhatsApp', 'Servicios y precios, claros', 'También en inglés'] },
  estetica: { id: 'reel-estetica', que: 'tu centro de estética.', chips: ['Cita por WhatsApp', 'Tus trabajos, a la vista', 'También en inglés'] },
  taller: { id: 'reel-taller', que: 'tu taller.', chips: ['Cita por WhatsApp', 'Qué arreglas, claro', 'Llamar a un toque'] },
};
const S = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'barberia', C = SECTORES[S], DUR = 17.6;
const html = `<html><head><style>${CSS_REEL}${CSS_REAL}
#g1{top:600px;font-size:140px}#g2{top:770px;font-size:${C.que.length > 14 ? 150 : 210}px}#tb{top:290px;font-size:104px}
.pr{position:absolute;left:80px;right:80px;z-index:20;border-radius:44px;padding:44px 50px 48px;box-shadow:0 40px 80px rgba(0,0,0,.55)}.pr b{display:block;font-family:D;font-weight:400;line-height:.9;letter-spacing:-6px}.pr span{display:block;font-size:36px;line-height:1.3;margin-top:22px}.pr small{font-family:M;font-size:26px;letter-spacing:3px;text-transform:uppercase}
#pa{top:520px;background:#FAF8F5;color:#0F1C24}#pa b{font-size:270px;color:#E8683C}#pa small{color:#8A8F93}
#pb{top:1080px;left:180px;background:#E8683C;color:#0F1C24}#pb b{font-size:130px;letter-spacing:-3px}
#nota{position:absolute;left:80px;top:1570px;font-family:M;font-size:24px;color:#A9B4BA;z-index:20}
</style></head><body>
${marca()}<div class=eti id=eti>WEB DE MUESTRA</div><div class=fan id=fan>1</div>
<div class=h id=g1>Una web para</div><div class=h id=g2><i>${C.que}</i></div>
<div class=h id=tb>Así se ve<br><i>en el móvil.</i></div>
<div id=A>${movil(real(S, { larga: true }), { cls: 'real', extra: barra(S) })}</div>
${C.chips.map((x, i) => ficha('c' + i, x)).join('')}
<div class=pr id=pa><small>Desde</small><b>390 €</b><span>Con tu nombre, tus fotos y tus precios.<br>Dominio un año incluido.</span></div>
<div class=pr id=pb><small>Black Friday</small><b>3 meses gratis</b><span>de mantenimiento, contratando hasta el 30 de noviembre.</span></div>
<div id=nota>Precios sin IVA. Mantenimiento opcional, 30 €/mes.</div>
${fin('¿La quieres <i>para ti?</i>', 'Pruébala en bahiga.es/webs. Hay catorce sectores.', 'Comenta WEB')}
<script>${JS}
const PAUSAS=[[1.6,.5],[8.6,.7],[11.8,1.3]];
const Y=[900,1090,1280],R=[-3,2,-2],CE=[3.2,5.0,6.8];
window.seek=(o)=>{const t=reloj(o);
  const g=1-P(t,1.7,.3);sube($('g1'),t,-.3,.45);$('g1').style.opacity*=g;const z=P(t,-.2,.5);$('g2').style.opacity=cl(z*3)*g;$('g2').style.transform='translateY('+(1-out(z))*60+'px)';
  $('fan').style.opacity=.9*(1-P(t,8.8,.3));$('fan').style.transform='translateX('+(-t*12)+'px)';$('eti').style.opacity=P(t,2,.4)*(1-P(t,8.8,.2));
  sube($('tb'),t,1.9,.5);$('tb').style.opacity*=1-P(t,8.8,.25);
  const m=$('A').firstElementChild,pa=out(P(t,1.9,.7)),sa=io(P(t,8.8,.6));
  m.style.transform='translate('+(sa*900)+'px,'+((1-pa)*1300)+'px) rotate('+(3+sa*14)+'deg)';m.style.opacity=t<9.6?1:0;
  // la página baja de forma continua, con una parada en cada detalle
  m.querySelector('.esc').style.top=-((io(P(t,2.6,2.0))*520+io(P(t,4.6,2.0))*900+io(P(t,6.6,1.8))*900)*1.431)+'px';
  CE.forEach((a,i)=>chip($('c'+i),Y[i],R[i],t,a,8.75+i*.03,'si',a+.5));
  const a1=P(t,9.2,.5),a2=P(t,9.8,.5),sal=1-P(t,12.2,.2);
  $('pa').style.opacity=cl(a1*2)*sal;$('pa').style.transform='translateY('+(1-out(a1))*200+'px) rotate(-3deg)';
  $('pb').style.opacity=cl(a2*2)*sal;$('pb').style.transform='translateY('+(1-out(a2))*200+'px) rotate(2deg)';
  $('nota').style.opacity=P(t,10.4,.3)*sal;
  cierre(t,12.2);
};</script></body></html>`;
await grabar(C.id, html, DUR, [0.3, 1.9, 3.0, 4.2, 5.4, 6.6, 7.8, 9.0, 10.0, 11.4, 13.6, 15.4, 17.3]);
