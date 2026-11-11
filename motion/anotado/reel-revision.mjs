// Reel «Revisamos tu web gratis»: se repasa una web de ejemplo punto por punto y sale la hoja.
// Uso: node motion/anotado/reel-revision.mjs [--hoja]  →  media/1127-reel-revision.mp4
import { movil } from './piezas.mjs';
import { web, CSS_NEG } from './negocios.mjs';
import { CSS_REEL, JS, ficha, marca, fin, grabar } from './reelbase.mjs';
const NEG = 'ropa', DUR = 17.4;
const html = `<html><head><style>${CSS_REEL}${CSS_NEG}
#g1{top:600px;font-size:140px}#g2{top:780px;font-size:300px}#tb{top:290px;font-size:104px}
#luz{position:absolute;left:0;right:0;height:140px;top:0;background:linear-gradient(180deg,rgba(232,104,60,0),rgba(232,104,60,.38) 80%,#E8683C);z-index:5;pointer-events:none}
#hoja{position:absolute;left:110px;top:560px;width:860px;background:#FAF8F5;color:#0F1C24;border-radius:14px;padding:54px 60px 46px;z-index:22;box-shadow:0 50px 100px rgba(0,0,0,.6)}
#hoja small{font-family:M;font-size:24px;letter-spacing:3px;text-transform:uppercase;color:#8A8F93}#hoja h4{margin:30px 0 8px;font:400 58px D;letter-spacing:-1.5px}
#hoja p{margin:0;padding:18px 0 18px 36px;font-size:38px;border-bottom:2px solid #E6E0D6;position:relative}#hoja p:before{content:"";position:absolute;left:0;top:36px;width:16px;height:16px;border-radius:50%;background:#C9CDD1}#hoja p.u:before{background:#E8683C}
#hoja em{display:block;margin-top:24px;font:normal 22px M;color:#8A8F93}
</style></head><body>
${marca()}<div class=eti id=eti>WEB DE EJEMPLO</div><div class=fan id=fan>5</div>
<div class=h id=g1>Revisamos tu web.</div><div class=h id=g2><i>Gratis.</i></div>
<div class=h id=tb>Miramos<br><i>cinco cosas.</i></div>
<div id=A>${movil(web(NEG), { url: 'linoysal.example', extra: '<div id=luz></div>' })}</div>
${[['Velocidad', 'si'], ['Primera pantalla', 'si'], ['Teléfono y WhatsApp', 'no'], ['Cómo sales en Google', 'no'], ['Copias y seguridad', 'si']].map(([x, c], i) => ficha('c' + i, x, `data-c="${c}"`)).join('')}
<div id=hoja><small>Revisión de tu web</small><h4>Lo urgente</h4><p class=u>El botón de WhatsApp no abre el chat</p><p class=u>No sales al buscar tu tipo de negocio</p><h4>Puede esperar</h4><p>Faltan fotos en dos productos</p><p>El horario no coincide con tu ficha</p><em>Ejemplo de informe</em></div>
${fin('Hasta el <i>30 de noviembre.</i>', 'Sin contratar nada. Si luego quieres arreglarlo, te damos precio.', 'Comenta WEB')}
<script>${JS}
const PAUSAS=[[1.6,.5],[8.4,.8],[11.4,1.3]];
const Y=[820,990,1160,1330,1500],R=[-3,2,-2,3,-2],CE=[2.6,3.7,4.8,5.9,7.0];
window.seek=(o)=>{const t=reloj(o);
  const g=1-P(t,1.7,.3);sube($('g1'),t,-.3,.45);$('g1').style.opacity*=g;const z=P(t,-.2,.5);$('g2').style.opacity=cl(z*3)*g;$('g2').style.transform='translateY('+(1-out(z))*60+'px)';
  $('fan').style.opacity=.9*(1-P(t,8.5,.3));$('fan').style.transform='translateX('+(-t*12)+'px)';$('eti').style.opacity=P(t,2,.4)*(1-P(t,11.6,.2));
  sube($('tb'),t,1.9,.5);$('tb').style.opacity*=1-P(t,8.5,.25);
  const m=$('A').firstElementChild,pa=out(P(t,1.9,.7)),sa=io(P(t,8.5,.6));
  m.style.transform='translate('+(sa*260)+'px,'+((1-pa)*1300+sa*120)+'px) rotate('+(3+sa*5)+'deg) scale('+(1-sa*.08)+')';m.style.opacity=(t<11.9?1:0)*(1-sa*.45);
  m.querySelector('.esc').style.top=-(io(P(t,2.6,5.4))*470*1.431)+'px';
  const lz=(t-2.4)%1.1/1.1;$('luz').style.top=(lz*1150-140)+'px';$('luz').style.opacity=(t>2.4&&t<8.2)?1:0;
  CE.forEach((a,i)=>{const e=$('c'+i);chip(e,Y[i],R[i],t,a,8.45+i*.03,e.dataset.c,a+.6)});
  const h=P(t,8.9,.6),hs=1-P(t,11.8,.2);$('hoja').style.opacity=cl(h*2)*hs;$('hoja').style.transform='translateY('+(1-out(h))*500+'px) rotate('+(-8+out(h)*5)+'deg)';
  cierre(t,11.8);
};</script></body></html>`;
await grabar('1127-reel-revision', html, DUR, [0.3, 1.8, 3.2, 4.4, 5.6, 6.8, 8.0, 9.0, 10.2, 11.6, 13.4, 15.4, 17.0]);
