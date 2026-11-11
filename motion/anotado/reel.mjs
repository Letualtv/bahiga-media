// Reel de ejemplo «8 segundos» con el estilo «pantalla anotada» (1080x1920, 30 fps, 17,5 s).
// Cada fotograma es función pura del tiempo: window.seek(t). Sin música: se añade del catálogo al publicar.
// Uso: node motion/anotado/reel.mjs [--hoja]   →  media/ejemplo-reel-8-segundos.mp4
import { mkdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { chromium, RAIZ, arco, CSS, MAL, BIEN, movil } from './piezas.mjs';
const FPS = 30, DUR = 17.5, ID = 'ejemplo-reel-8-segundos';
const chip = (id, txt) => `<div class="rc" id="${id}"><b><svg viewBox="0 0 24 24"><path class="q" d="M8.5 9a3.5 3.5 0 1 1 5 3.2c-1 .6-1.5 1.2-1.5 2.3M12 18.2v.3"/><path class="x" d="M7 7l10 10M17 7L7 17"/><path class="v" d="M5.5 12.5l4.2 4.2L18.5 8"/></svg></b><span>${txt}</span></div>`;
const html = `<html><head><style>${CSS}
body{height:1920px;background:radial-gradient(1000px 900px at 74% 62%,#1B3340 0%,#0F1C24 62%)}
.m{top:150px}.eti{position:absolute;right:80px;top:166px;font-family:M;font-size:20px;letter-spacing:3px;color:#F0A07E;z-index:20}
.h{position:absolute;left:76px;right:70px;font-family:D;letter-spacing:-3px;line-height:.96;z-index:12;will-change:transform}.h i{font-family:DI;font-style:normal;color:#E8683C}
#g1{top:560px;font-size:150px}#g2{top:860px;font-size:330px;letter-spacing:-12px}#g2 i{font-size:330px}
#fan{position:absolute;right:-60px;top:380px;font-family:DI;font-size:1500px;line-height:.8;color:transparent;-webkit-text-stroke:3px rgba(232,104,60,.34);z-index:0}
#tb,#td{top:290px;font-size:104px}
.cr{position:absolute;left:76px;top:520px;z-index:14;display:flex;align-items:flex-end;gap:18px}.cr b{font-family:DI;font-weight:400;font-size:250px;line-height:.82;color:#E8683C;letter-spacing:-8px;font-variant-numeric:tabular-nums;min-width:330px}.cr span{font-family:M;font-size:24px;letter-spacing:3px;text-transform:uppercase;color:#A9B4BA;padding-bottom:16px}
.bar{position:absolute;left:80px;top:790px;width:330px;height:8px;border-radius:4px;background:#22343F;z-index:14}.bar i{display:block;height:8px;border-radius:4px;background:#E8683C;width:0}
.movil{left:440px;top:700px;z-index:6}
.rc{position:absolute;left:60px;display:flex;align-items:center;gap:16px;background:#FAF8F5;color:#0F1C24;font:normal 38px U6;padding:14px 32px 14px 14px;border-radius:999px;box-shadow:0 22px 46px rgba(0,0,0,.5);white-space:nowrap;z-index:16;transform-origin:0 50%}
.rc b{width:62px;height:62px;border-radius:50%;background:#0F1C24;display:grid;place-items:center;flex:none}.rc svg{width:36px;height:36px;fill:none;stroke:#FAF8F5;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.rc path{opacity:0}.rc.pre .q,.rc.no .x,.rc.si .v{opacity:1}.rc.no b{background:#E8683C}.rc.no span{text-decoration:line-through;text-decoration-thickness:3px;color:#8A8F93}.rc.si b{background:#2E7D4F}
#sv{top:760px;font-size:260px;letter-spacing:-8px}#sv2{position:absolute;left:80px;top:1060px;font-size:52px;line-height:1.2;z-index:12}
#fin{position:absolute;inset:0;z-index:40;background:radial-gradient(1000px 900px at 85% 20%,#F08A5E,#E8683C 60%);color:#0F1C24}
#fin .m{color:#0F1C24}#fin .h{top:560px;font-size:200px}#fin .h i{color:#0F1C24}
#fin p{position:absolute;left:80px;right:140px;top:1010px;font-size:50px;line-height:1.25;margin:0}
#fin u{position:absolute;left:80px;top:1260px;text-decoration:none;background:#0F1C24;color:#FAF8F5;font-size:50px;padding:30px 50px;border-radius:999px;box-shadow:0 18px 40px rgba(15,28,36,.35)}
</style></head><body>
<div class=m>${arco(56, '#FAF8F5')}Bahiga.</div><div class=eti id=eti>WEB DE EJEMPLO</div><div id=fan>8</div>
<div class=h id=g1>Tu cliente<br>decide en</div><div class=h id=g2><i>8 s.</i></div>
<div class=h id=tb>Entra y busca<br><i>cuatro cosas.</i></div><div class=h id=td>Con la web<br><i>clara.</i></div>
<div class=cr id=cr><b id=cn>0,0</b><span>segundos</span></div><div class=bar id=bar><i id=bi></i></div>
<div id=A>${movil(MAL, {})}</div><div id=B>${movil(BIEN, {})}</div>
${chip('c1', '¿Qué venden?')}${chip('c2', '¿Dónde están?')}${chip('c3', '¿El teléfono?')}${chip('c4', '¿Abren hoy?')}
${chip('d1', 'Pan artesano')}${chip('d2', 'Priego de Córdoba')}${chip('d3', 'Llamar, arriba')}${chip('d4', 'Abierto hoy')}
<div class=h id=sv><i>Se va.</i></div><div id=sv2>A la siguiente web<br>de la lista.</div>
<div id=fin><div class=m>${arco(56, '#0F1C24')}Bahiga.</div><div class=h id=fh>¿Y <i>la tuya?</i></div><p id=fp>Abre tu web en el móvil y cuenta. Si no lo ves claro, te la miramos.</p><u id=fu>Comenta WEB</u></div>
<script>
const $=(i)=>document.getElementById(i),cl=(x)=>Math.max(0,Math.min(1,x)),P=(t,a,d)=>cl((t-a)/d);
const out=(x)=>1-Math.pow(1-x,3),io=(x)=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,back=(x)=>{const c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const Y=[820,990,1160,1330],R=[-3,2,-2,3];
const mA=()=>$('A').firstElementChild,mB=()=>$('B').firstElementChild;
function sube(el,t,a,d=.5,dy=90){const p=out(P(t,a,d));el.style.opacity=P(t,a,d*.5);el.style.transform='translateY('+(1-p)*dy+'px)'}
function ficha(el,i,t,a,fin,clase,b){ // entra con rebote, cambia de estado en «b», sale en «fin»
  const p=P(t,a,.42),s=p?back(p):0,q=P(t,fin,.3);
  el.style.top=Y[i]+'px';el.style.opacity=p&&q<1?1:0;
  const tic=P(t,b,.25),golpe=tic>0&&tic<1?1+.09*Math.sin(tic*Math.PI):1;
  el.style.transform='translateX('+(-q*q*700)+'px) rotate('+R[i]+'deg) scale('+s*golpe+')';
  el.className='rc '+(t>=b?clase:'pre');
}
window.seek=(t)=>{
  // 0–2: gancho
  const g=1-P(t,1.75,.3);
  sube($('g1'),t,-.3,.45);$('g1').style.opacity*=g;
  const z=P(t,-.4,.5);$('g2').style.opacity=cl(z*3)*g;$('g2').style.transform='scale('+(.6+.4*back(z))+')';$('g2').style.transformOrigin='0 60%';
  $('fan').style.opacity=cl(P(t,.3,.6))*(1-P(t,9.9,.3))*.9;$('fan').style.transform='translateX('+(-t*14)+'px)';
  $('eti').style.opacity=P(t,2.2,.4)*(1-P(t,15,.2));
  // 2–10: la web confusa, 8 segundos de reloj
  const enB=t>=2&&t<10.2;
  sube($('tb'),t,2.0,.5);$('tb').style.opacity*=1-P(t,9.9,.25);
  const enD=t>=11.3;
  sube($('td'),t,11.4,.45);$('td').style.opacity*=1-P(t,15,.2);
  const seg=enD?Math.min(3,Math.max(0,t-11.8)):Math.min(8,Math.max(0,t-2.2)),tope=enD?3:8;
  $('cn').textContent=seg.toFixed(1).replace('.',',');$('bi').style.width=seg/tope*100+'%';
  const vis=(P(t,2.1,.3)*(1-P(t,9.9,.2)))+(enD?P(t,11.5,.3)*(1-P(t,15,.2)):0);
  $('cr').style.opacity=vis;$('bar').style.opacity=vis;
  $('cn').style.color=enD?'#F0A07E':'#E8683C';
  const pa=out(P(t,2.0,.7)),sa=io(P(t,9.9,.6));
  mA().style.transform='translate('+(sa*-900)+'px,'+((1-pa)*1300+sa*500)+'px) rotate('+(3-sa*22)+'deg)';
  mA().style.opacity=t<10.6?1:0;
  mA().querySelector('.esc').style.top=-(io(P(t,3,6.5))*95*1.431)+'px';
  ['c1','c2','c3','c4'].forEach((id,i)=>ficha($(id),i,t,2.9+i*1.55,9.85+i*.04,'no',3.9+i*1.55));
  // 10–11.4: se va
  const s1=P(t,10.3,.35),s2=1-P(t,11.2,.2);
  $('sv').style.opacity=cl(s1*2)*s2;$('sv').style.transform='translateY('+(1-out(s1))*120+'px)';
  $('sv2').style.opacity=P(t,10.5,.3)*s2;
  // 11.4–15: la web clara, 3 segundos
  const pb=out(P(t,11.4,.6)),sb=P(t,15,.25);
  mB().style.transform='translate('+((1-pb)*800)+'px,0) rotate('+(-3+pb*0)+'deg)';mB().style.opacity=enD&&sb<1?1:0;
  mB().querySelector('.esc').style.top=-(io(P(t,12.2,2.4))*60*1.431)+'px';
  ['d1','d2','d3','d4'].forEach((id,i)=>ficha($(id),i,t,12.0+i*.62,15.0+i*.03,'si',12.25+i*.62));
  // 15–17.5: cierre
  const f=io(P(t,15.0,.5));$('fin').style.transform='translateY('+(1-f)*100+'%)';
  sube($('fh'),t,15.25,.5,120);sube($('fp'),t,15.6,.45,60);
  const u=P(t,15.95,.45);$('fu').style.opacity=cl(u*2);$('fu').style.transform='scale('+(u?back(u):0)+')';$('fu').style.transformOrigin='0 50%';
};
</script></body></html>`;

const HOJA = process.argv.includes('--hoja');
const tmp = `${RAIZ}motion/anotado/.fotogramas`;
rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true }); mkdirSync(`${RAIZ}media`, { recursive: true });
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.setContent(html); await pg.evaluate(() => document.fonts.ready);
if (HOJA) {
  const ts = [0.3, 1.2, 2.6, 4.2, 6.0, 8.2, 9.6, 10.2, 10.8, 11.8, 12.6, 13.6, 14.8, 15.3, 16.2, 17.2];
  for (const [i, t] of ts.entries()) { await pg.evaluate((t) => window.seek(t), t); await pg.screenshot({ path: `${tmp}/h${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
} else {
  for (let i = 0; i < Math.round(DUR * FPS); i++) { await pg.evaluate((t) => window.seek(t), i / FPS); await pg.screenshot({ path: `${tmp}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 }); }
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${tmp}/f%04d.jpg -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow -c:a aac -b:a 128k -movflags +faststart ${RAIZ}media/${ID}.mp4`);
  rmSync(tmp, { recursive: true, force: true });
}
await b.close();
