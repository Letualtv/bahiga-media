// Base común de los reels del estilo «pantalla anotada» (1080x1920, 30 fps).
// Cada fotograma es función pura del tiempo: window.seek(t). Las pausas paran el reloj cuando una
// escena ya lo tiene todo en pantalla, para que dé tiempo a leer. Sin música: se pone al publicar.
import { mkdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { chromium, RAIZ, arco, CSS } from './piezas.mjs';
export const FPS = 30;
export const ficha = (id, txt, extra = '') => `<div class="rc" id="${id}" ${extra}><b><svg viewBox="0 0 24 24"><path class="q" d="M8.5 9a3.5 3.5 0 1 1 5 3.2c-1 .6-1.5 1.2-1.5 2.3M12 18.2v.3"/><path class="x" d="M7 7l10 10M17 7L7 17"/><path class="v" d="M5.5 12.5l4.2 4.2L18.5 8"/></svg></b><span>${txt}</span></div>`;
export const marca = (c = '#FAF8F5') => `<div class=m>${arco(56, c)}Bahiga.</div>`;
export const CSS_REEL = `${CSS}
body{height:1920px;background:radial-gradient(1000px 900px at 74% 62%,#1B3340 0%,#0F1C24 62%)}
.m{top:150px}.eti{position:absolute;right:80px;top:166px;font-family:M;font-size:20px;letter-spacing:3px;color:#F0A07E;z-index:20}
.h{position:absolute;left:76px;right:70px;font-family:D;letter-spacing:-3px;line-height:.96;z-index:12}.h i{font-family:DI;font-style:normal;color:#E8683C}
.fan{position:absolute;right:-60px;top:380px;font-family:DI;font-size:1500px;line-height:.8;color:transparent;-webkit-text-stroke:3px rgba(232,104,60,.34);z-index:0}
.movil{left:440px;top:700px;z-index:6}
.rc{position:absolute;left:60px;display:flex;align-items:center;gap:16px;background:#FAF8F5;color:#0F1C24;font:normal 38px U6;padding:14px 32px 14px 14px;border-radius:999px;box-shadow:0 22px 46px rgba(0,0,0,.5);white-space:nowrap;z-index:16;transform-origin:0 50%;opacity:0}
.rc b{width:62px;height:62px;border-radius:50%;background:#0F1C24;display:grid;place-items:center;flex:none}.rc svg{width:36px;height:36px;fill:none;stroke:#FAF8F5;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.rc path{opacity:0}.rc.pre .q,.rc.no .x,.rc.si .v{opacity:1}.rc.no b{background:#E8683C}.rc.si b{background:#2E7D4F}
#fin{position:absolute;inset:0;z-index:40;background:radial-gradient(1000px 900px at 85% 20%,#F08A5E,#E8683C 60%);color:#0F1C24}
#fin .h{top:560px;font-size:190px}#fin .h i{color:#0F1C24}
#fin p{position:absolute;left:80px;right:140px;top:1010px;font-size:50px;line-height:1.25;margin:0}
#fin u{position:absolute;left:80px;top:1290px;text-decoration:none;background:#0F1C24;color:#FAF8F5;font-size:50px;padding:30px 50px;border-radius:999px;box-shadow:0 18px 40px rgba(15,28,36,.35);transform-origin:0 50%}`;
// Utilidades que viajan dentro de la página.
export const JS = `
const $=(i)=>document.getElementById(i),cl=(x)=>Math.max(0,Math.min(1,x)),P=(t,a,d)=>cl((t-a)/d);
const out=(x)=>1-Math.pow(1-x,3),io=(x)=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,back=(x)=>{const c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
function sube(el,t,a,d=.5,dy=90){const p=out(P(t,a,d));el.style.opacity=P(t,a,d*.5);el.style.transform='translateY('+(1-p)*dy+'px)'}
function chip(el,y,rot,t,a,fin,clase,b){const p=P(t,a,.42),s=p?back(p):0,q=P(t,fin,.3),tic=P(t,b,.25),g=tic>0&&tic<1?1+.09*Math.sin(tic*Math.PI):1;
  el.style.top=y+'px';el.style.opacity=p&&q<1?1:0;el.style.transform='translateX('+(-q*q*700)+'px) rotate('+rot+'deg) scale('+s*g+')';el.className='rc '+(t>=b?clase:'pre')}
function cierre(t,a){const f=io(P(t,a,.5));$('fin').style.transform='translateY('+(1-f)*100+'%)';sube($('fh'),t,a+.25,.5,120);sube($('fp'),t,a+.6,.45,60);const u=P(t,a+.95,.45);$('fu').style.opacity=cl(u*2);$('fu').style.transform='scale('+(u?back(u):0)+')'}
const reloj=(o)=>{let t=o;for(const [en,d] of PAUSAS){if(t<=en)break;t=Math.max(en,t-d)}return t};`;
export const fin = (titulo, texto, boton) => `<div id=fin>${marca('#0F1C24')}<div class=h id=fh>${titulo}</div><p id=fp>${texto}</p><u id=fu>${boton}</u></div>`;

// html: documento completo con window.seek. tiempos: instantes para la hoja de contactos (con --hoja).
export async function grabar(ID, html, DUR, tiempos = []) {
  const HOJA = process.argv.includes('--hoja');
  const tmp = `${RAIZ}motion/anotado/.fotogramas`;
  rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true }); mkdirSync(`${RAIZ}media`, { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.setContent(html); await pg.evaluate(() => document.fonts.ready); await pg.evaluate(() => window.listo && window.listo());
  if (HOJA) for (const [i, t] of tiempos.entries()) { await pg.evaluate((t) => window.seek(t), t); await pg.screenshot({ path: `${tmp}/h${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
  else {
    for (let i = 0; i < Math.round(DUR * FPS); i++) { await pg.evaluate((t) => window.seek(t), i / FPS); await pg.screenshot({ path: `${tmp}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 }); }
    execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${tmp}/f%04d.jpg -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow -c:a aac -b:a 128k -movflags +faststart ${RAIZ}media/${ID}.mp4`);
    rmSync(tmp, { recursive: true, force: true });
  }
  await b.close();
}
