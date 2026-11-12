// Reel «Arreglamos esta web en 3 pasos»: la web descuidada se convierte en la arreglada de arriba abajo, un cambio cada vez.
// El negocio es inventado y va etiquetado. Uso: node motion/anotado/reel-arreglo.mjs [--hoja]  →  media/1204-reel-arreglo.mp4
import { movil } from './piezas.mjs';
import { web, webMala, CSS_NEG, CSS_EXTRA_NEG } from './negocios.mjs';
import { CSS_REEL, JS, ficha, marca, fin, grabar } from './reelbase.mjs';
const NEG = 'taller', DUR = 17.6;
const html = `<html><head><style>${CSS_REEL}${CSS_NEG}${CSS_EXTRA_NEG}
#g1{top:620px;font-size:104px}#g2{top:770px;font-size:230px}#tb{top:290px;font-size:104px}
#linea{position:absolute;left:0;right:0;height:6px;background:#E8683C;box-shadow:0 0 30px 8px rgba(232,104,60,.6);z-index:9;top:0}
.est{position:absolute;left:60px;top:560px;z-index:18;font:normal 38px U6;padding:14px 34px;border-radius:999px;box-shadow:0 18px 40px rgba(0,0,0,.5)}#ea{background:#14242E;color:#A9B4BA;border:2px solid #3A5362}#ed{background:#E8683C;color:#0F1C24}
</style></head><body>
${marca()}<div class=eti id=eti>WEB DE EJEMPLO</div><div class=fan id=fan>3</div>
<div class=h id=g1>Arreglamos esta web</div><div class=h id=g2><i>en 3 pasos.</i></div>
<div class=h id=tb>Un cambio<br><i>cada vez.</i></div>
<div class=est id=ea>Antes</div><div class=est id=ed>Después</div>
<div id=A>${movil(webMala(NEG), { url: 'tallerruta12.example' })}</div>
<div id=B>${movil(web(NEG), { url: 'tallerruta12.example', extra: '<div id=linea></div>' })}</div>
${['Qué haces, arriba del todo', 'Llamar, a un toque', 'Horario y dónde, sin buscar'].map((x, i) => ficha('c' + i, x)).join('')}
${fin('¿Arreglamos <i>la tuya?</i>', 'Te decimos qué cambiaríamos, sin compromiso.', 'Comenta WEB')}
<script>${JS}
const PAUSAS=[[1.6,.5],[5.5,.5],[7.5,.5],[9.9,1.1],[12.5,1.2]];
const Y=[900,1090,1280],R=[-3,2,-2],CE=[4.0,6.0,8.0],CORTE=[0,47,58,100];
window.seek=(o)=>{const t=reloj(o);
  const g=1-P(t,1.7,.3);sube($('g1'),t,-.3,.45);$('g1').style.opacity*=g;const z=P(t,-.2,.5);$('g2').style.opacity=cl(z*3)*g;$('g2').style.transform='translateY('+(1-out(z))*60+'px)';
  $('fan').style.opacity=.9*(1-P(t,10.3,.3));$('fan').style.transform='translateX('+(-t*12)+'px)';$('eti').style.opacity=P(t,2,.4)*(1-P(t,10.3,.2));
  sube($('tb'),t,1.9,.5);$('tb').style.opacity*=1-P(t,10.3,.25);
  const pa=out(P(t,1.9,.7)),sa=io(P(t,10.3,.6)),tr='translate(0,'+((1-pa)*1300+sa*1500)+'px) rotate(3deg)';
  const a=$('A').firstElementChild,b=$('B').firstElementChild;a.style.transform=tr;b.style.transform=tr;
  // el corte baja en tres tramos: por encima ya es la web arreglada
  let c=0;CE.forEach((e,i)=>{c+=io(P(t,e,.9))*(CORTE[i+1]-CORTE[i])});
  const p=b.querySelector('.pant');p.style.clipPath='inset(0 0 '+(100-c)+'% 0)';b.style.filter='none';
  b.style.clipPath='inset(0 0 '+(c>=99.5?0:100-c)+'% 0)';
  const l=$('linea');l.style.top=c+'%';l.style.opacity=c>0.5&&c<99?1:0;
  CE.forEach((e,i)=>chip($('c'+i),Y[i],R[i],t,e+.2,10.25+i*.03,'si',e+.7));
  const ant=P(t,2.4,.3)*(1-P(t,8.9,.25)),des=P(t,9.0,.35)*(1-P(t,10.3,.2));
  $('ea').style.opacity=ant;$('ed').style.opacity=des;$('ed').style.transform='scale('+(des?back(P(t,9.0,.4)):0)+')';$('ed').style.transformOrigin='0 50%';
  cierre(t,10.6);
};</script></body></html>`;
await grabar('1204-reel-arreglo', html, DUR, [0.3, 1.9, 3.4, 5.2, 6.0, 7.6, 8.4, 10.2, 11.2, 12.4, 14.4, 16.0, 17.3]);
