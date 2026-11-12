// Reel «Así se monta una landing»: la landing se monta bloque a bloque y al final sale el precio.
// Uso: node motion/anotado/reel-landing.mjs [--hoja]  →  media/1125-reel-landing.mp4
import { movil } from './piezas.mjs';
import { web, CSS_NEG } from './negocios.mjs';
import { CSS_REEL, JS, ficha, marca, fin, grabar } from './reelbase.mjs';
const NEG = 'taller', DUR = 18.6;
const html = `<html><head><style>${CSS_REEL}${CSS_NEG}
#g1{top:600px;font-size:150px}#g2{top:780px;font-size:210px}#tb{top:290px;font-size:104px}
.pr{position:absolute;left:80px;right:80px;z-index:20;border-radius:44px;padding:44px 50px 48px;box-shadow:0 40px 80px rgba(0,0,0,.55)}.pr b{display:block;font-family:D;font-weight:400;line-height:.9;letter-spacing:-6px}.pr span{display:block;font-size:36px;line-height:1.3;margin-top:22px}.pr small{font-family:M;font-size:26px;letter-spacing:3px;text-transform:uppercase}
#pa{top:520px;background:#FAF8F5;color:#0F1C24}#pa b{font-size:270px;color:#E8683C}#pa small{color:#8A8F93}
#pb{top:1060px;left:200px;background:#14242E;border:2px solid #2F4553;color:#FAF8F5}#pb b{font-size:170px;letter-spacing:-4px}#pb b i{font-family:DI;font-style:normal;font-size:80px;color:#F0A07E;letter-spacing:-1px}
#nota{position:absolute;left:80px;top:1560px;font-family:M;font-size:24px;color:#A9B4BA;z-index:20}
</style></head><body>
${marca()}<div class=eti id=eti>WEB DE EJEMPLO</div><div class=fan id=fan>1</div>
<div class=h id=g1>Así se monta</div><div class=h id=g2><i>una landing.</i></div>
<div class=h id=tb>Todo lo tuyo,<br><i>en orden.</i></div>
<div id=A>${movil(web(NEG), { url: 'tallerruta12.example' })}</div>
${['Portada', 'Escaparate', 'Opiniones', 'Dónde y horario', 'Contacto'].map((x, i) => ficha('c' + i, x)).join('')}
<div class=pr id=pa><small>Desde</small><b>390 €</b><span>La landing, hecha y publicada.<br>Con el dominio del primer año.</span></div>
<div class=pr id=pb><b>30 €<i>/mes</i></b><span>Alojamiento y mantenimiento.<br>Dos meses gratis, sin permanencia.</span></div>
<div id=nota>Precios sin IVA.</div>
${fin('¿Te la <i>enseñamos?</i>', 'Te mandamos un ejemplo pensado para tu tipo de negocio.', 'Comenta LANDING')}
<script>${JS}
const PAUSAS=[[1.6,.5],[9.6,.8],[12.6,1.2]];
const BL=['.b-hero','.b-fila','#escaparate','#resenas','#donde','#contacto'],EN=[2.2,3.0,3.8,5.2,6.6,8.0];let els=[],tops=[];
window.listo=()=>{const m=$('A');els=BL.map((s)=>m.querySelector(s));tops=els.map((e)=>e.offsetTop)};
const Y=[820,990,1160,1330,1500],R=[-3,2,-2,3,-2],CE=[2.2,3.8,5.2,6.6,8.0];
window.seek=(o)=>{const t=reloj(o);
  const g=1-P(t,1.7,.3);sube($('g1'),t,-.3,.45);$('g1').style.opacity*=g;const z=P(t,-.2,.5);$('g2').style.opacity=cl(z*3)*g;$('g2').style.transform='translateY('+(1-out(z))*60+'px)';
  $('fan').style.opacity=.9*(1-P(t,9.7,.3));$('fan').style.transform='translateX('+(-t*12)+'px)';$('eti').style.opacity=P(t,2,.4)*(1-P(t,9.7,.2));
  sube($('tb'),t,1.9,.5);$('tb').style.opacity*=1-P(t,9.7,.25);
  const m=$('A').firstElementChild,pa=out(P(t,1.9,.7)),sa=io(P(t,9.7,.6));
  m.style.transform='translate('+(sa*900)+'px,'+((1-pa)*1300)+'px) rotate('+(3+sa*14)+'deg)';m.style.opacity=t<10.4?1:0;
  els.forEach((e,i)=>{const p=out(P(t,EN[i],.5));e.style.opacity=P(t,EN[i],.3);e.style.transform='translateY('+(1-p)*40+'px)'});
  // la pantalla baja hasta el bloque que acaba de entrar
  let y=0;for(let i=2;i<tops.length;i++){y+=io(P(t,EN[i]-.15,.7))*(tops[i]-tops[i-1])}
  m.querySelector('.esc').style.top=-(Math.max(0,y-(tops[2]-tops[1])*.0)*1.431*.86)+'px';
  CE.forEach((a,i)=>chip($('c'+i),Y[i],R[i],t,a+.25,9.65+i*.03,'si',a+.55));
  const a1=P(t,10.0,.5),a2=P(t,10.6,.5),sal=1-P(t,13.0,.2);
  $('pa').style.opacity=cl(a1*2)*sal;$('pa').style.transform='translateY('+(1-out(a1))*200+'px) rotate(-3deg)';
  $('pb').style.opacity=cl(a2*2)*sal;$('pb').style.transform='translateY('+(1-out(a2))*200+'px) rotate(2deg)';
  $('nota').style.opacity=P(t,11.2,.3)*sal;
  cierre(t,13.0);
};</script></body></html>`;
await grabar('1125-reel-landing', html, DUR, [0.3, 1.8, 3.2, 4.8, 6.4, 8.2, 9.4, 10.2, 11.4, 12.8, 14.6, 16.5, 18.2]);
