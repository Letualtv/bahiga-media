// Piezas comunes del estilo «pantalla anotada» de Bahiga: tipografías, móvil realista,
// las webs de ejemplo (mal y bien) y la hoja de estilos base de las láminas.
// Las usan los carruseles, las historias y los reels de motion/anotado.
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(execSync('npm root -g').toString().trim() + '/playwright')); }
export { chromium };

export const AQUI = new URL('./', import.meta.url).pathname;
export const NOT = new URL('../noticia/', import.meta.url).pathname;
export const RAIZ = new URL('../../', import.meta.url).pathname;
export const f = (n) => `data:font/woff2;base64,${readFileSync(`${NOT}fuentes/${n}.woff2`).toString('base64')}`;
export const foto = (n, alt) => existsSync(`${AQUI}img/${n}`) ? `url(data:image/jpeg;base64,${readFileSync(`${AQUI}img/${n}`).toString('base64')})` : alt;
export const PAN = foto('pan.jpg', 'linear-gradient(160deg,#D9B98A,#8A5A2B)');
export const VIEJA = foto('fachada.jpg', 'linear-gradient(135deg,#C9A227,#8B5E1A 60%,#5B3A12)');
const A = readFileSync(`${NOT}arch.js`, 'utf8');
const VB = JSON.parse(A.match(/ARCH_VB=(\[[^\]]*\])/)[1]);
const PATHS = JSON.parse(A.match(/ARCH=(\[[\s\S]*?\]);?\s*$/m)[1]);
export const arco = (h, c) => `<svg viewBox="${VB.join(' ')}" style="height:${h}px;vertical-align:-8px;margin-right:14px">${PATHS.map((d) => `<path fill="${c}" d="${d}"/>`).join('')}</svg>`;
export const co = (s) => s.replace(/\*(.+?)\*/g, '<i>$1</i>');

/* ── Piezas de la web de ejemplo ── */
export const ESTADO = (c = '#111') => `<div class="st" style="color:${c}"><b>9:41</b><span><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5" width="3" height="7" rx="1" fill="currentColor"/><rect x="10" y="2.5" width="3" height="9.5" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="15" height="9" rx="2" fill="currentColor"/><rect x="24" y="4" width="2.5" height="5" rx="1" fill="currentColor" opacity=".5"/></svg></span></div>`;
export const BARRA = (u, cls = '') => `<div class="url ${cls}"><span>🔒</span>${u}</div>`;
export const MAL_HERO = `<div class="w-hero" data-m="hero"><b>Bienvenidos a nuestra página web</b><span>Desde 1987 trabajando para usted con la mejor calidad y el mejor servicio</span><em><i class="on"></i><i></i><i></i><i></i></em></div>`;
export const MAL = `
<div class="w mal">${ESTADO()}
  <div class="w-top">Atención al cliente: lunes a viernes · info@panaderialamiga.example</div>
  <div class="w-cab"><span class="w-logo">Panadería <b>La Miga</b></span></div>
  <div class="w-nav">Inicio | La empresa | Productos | Galería | Noticias | Dónde estamos | Contacto</div>
  ${MAL_HERO}
  <div class="w-txt" data-m="letra"><h4>Quiénes somos</h4><p>Somos una empresa familiar con más de treinta años de experiencia en el sector, comprometida con la excelencia y la satisfacción de nuestros clientes. Nuestra misión es ofrecer productos de primera calidad elaborados con los mejores ingredientes y el máximo cuidado en cada proceso de elaboración artesanal.</p><p>Disponemos de una amplia gama de productos para todos los gustos. Para más información no dude en ponerse en contacto con nosotros a través del formulario de contacto.</p></div>
  <div class="w-fotos"><i></i><i></i><i></i></div>
  <div class="w-pie"><p data-m="tel">Tlf: 957 00 00 00 · Fax: 957 00 00 01</p><p data-m="horario">Horario: de lunes a viernes de 9:00 a 14:00</p><p>Usted es el visitante nº 004.512 · © 2012 Todos los derechos reservados</p></div>
</div>`;
export const CARGA = `<div class="w carga">${ESTADO()}<div class="prog"></div><div class="sk a"></div><div class="sk b"></div><div class="sk c"></div><div class="sk d"></div><div class="giro" data-m="giro"></div></div>`;
export const MINI = `<div class="w mini">${ESTADO()}<div class="mini-in" data-m="mini">${MAL.replace(/data-m="[^"]*"/g, '').replace(ESTADO(), '')}</div></div>`;
export const BIEN = `
<div class="w bien">
  <div class="b-hero">${ESTADO('#fff')}
    <div class="b-cab"><span>La Miga</span><em>● Abierto · cierra 14:00</em></div>
    <b>Pan de horno de leña en Priego</b><p>Abrimos a las 7:00. Encargos por WhatsApp.</p>
    <div class="b-bot"><a class="pri">Llamar</a><a>WhatsApp</a></div>
  </div>
  <div class="b-fila"><div><b>Horario</b><span>L–S · 7:00–14:00</span></div><div><b>Dónde</b><span>C/ Ejemplo, 12</span></div></div>
  <div class="b-res"><b>4,8</b><span><u>★★★★★</u>132 reseñas en Google</span></div>
  <div class="b-lista"><div><i></i><span><b>Hogaza de masa madre</b>Cada día desde las 7:00</span></div><div><i></i><span><b>Roscos y dulces</b>Viernes y sábado</span></div></div>
</div>`;
export const movil = (web, { url = 'panaderialamiga.example', y = 0, extra = '', cls = '', estilo = '' } = {}) => `
<div class="movil ${cls}" style="${estilo}"><i class="bt b1"></i><i class="bt b2"></i><i class="bt b3"></i>
  <div class="pant"><div class="isla"></div><div class="esc" style="top:${y * 1.431}px">${web}</div>${extra}${BARRA(url)}</div></div>`;

export const CSS = `
@font-face{font-family:D;src:url(${f('display')})}@font-face{font-family:DI;src:url(${f('display-italic')})}
@font-face{font-family:U6;src:url(${f('ui-600')})}@font-face{font-family:U;src:url(${f('ui')})}@font-face{font-family:M;src:url(${f('mono')})}
*{box-sizing:border-box}
body{margin:0;width:1080px;height:1350px;color:#FAF8F5;position:relative;overflow:hidden;font-family:U6;
  background:radial-gradient(900px 700px at 78% 62%,#1B3340 0%,#0F1C24 62%)}
body:after{content:"";position:absolute;inset:0;opacity:.22;mix-blend-mode:overlay;pointer-events:none;z-index:30;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>")}
body.coral{background:radial-gradient(900px 800px at 85% 20%,#F08A5E,#E8683C 60%);color:#0F1C24}
.m{position:absolute;left:80px;top:70px;font-family:D;font-size:40px;z-index:20}
.pg{position:absolute;right:80px;top:84px;font-family:M;font-size:22px;letter-spacing:3px;color:#F0A07E;z-index:20}.coral .pg{color:#0F1C24}
.pie{position:absolute;left:80px;bottom:56px;font-family:M;font-size:20px;letter-spacing:3px;opacity:.5;z-index:20}
.fan{position:absolute;right:-30px;top:60px;font-family:DI;font-size:760px;line-height:.8;color:transparent;-webkit-text-stroke:2px rgba(232,104,60,.34);z-index:0;letter-spacing:-30px}
.portada .fan{right:20px;top:330px;font-size:1100px;-webkit-text-stroke:3px rgba(232,104,60,.4)}
.coral .fan{-webkit-text-stroke:3px rgba(15,28,36,.16);right:40px;top:520px;font-size:1000px}
.num{position:absolute;left:80px;top:176px;font-family:DI;font-size:60px;color:#E8683C;line-height:1;z-index:10}
.t{position:absolute;left:76px;right:70px;top:246px;font-family:D;font-size:108px;line-height:.98;letter-spacing:-2.5px;z-index:10}.t i{font-family:DI;font-style:normal;color:#E8683C}
.portada .t{top:176px;font-size:118px;right:120px}.partida .t{top:176px;font-size:96px;right:60px}.partida .n{top:392px;width:auto;right:80px;font-size:30px;position:absolute;left:80px;display:none}
.coral .t{top:300px;font-size:132px;letter-spacing:-3px}.coral .t i{color:#0F1C24}
.n{position:absolute;left:80px;width:330px;top:470px;font-size:34px;line-height:1.3;z-index:10}
/* móvil */
.movil{position:absolute;width:560px;height:1160px;border-radius:78px;padding:14px;z-index:5;
  background:linear-gradient(145deg,#6B7078,#2A2D32 30%,#16181B 70%,#4A4E55);box-shadow:0 60px 110px rgba(0,0,0,.6),0 12px 28px rgba(0,0,0,.4),inset 0 0 0 2px rgba(255,255,255,.14)}
.movil:before{content:"";position:absolute;inset:6px;border-radius:72px;background:#05070A}
.bt{position:absolute;width:5px;border-radius:3px;background:linear-gradient(90deg,#2A2D32,#5B6068)}.b1{left:-4px;top:210px;height:54px}.b2{left:-4px;top:290px;height:96px}.b3{right:-4px;top:300px;height:140px;transform:scaleX(-1)}
.pant{position:relative;width:100%;height:100%;border-radius:64px;overflow:hidden;background:#fff}
.pant:after{content:"";position:absolute;inset:0;border-radius:64px;pointer-events:none;z-index:9;background:linear-gradient(115deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 28%)}
.isla{position:absolute;top:16px;left:50%;width:132px;height:36px;margin-left:-66px;border-radius:20px;background:#05070A;z-index:8}
.esc{width:372px;transform-origin:0 0;transform:scale(1.431);position:absolute;left:0;top:0}
.url{position:absolute;left:22px;right:22px;bottom:22px;height:58px;border-radius:29px;background:rgba(245,246,247,.94);backdrop-filter:blur(8px);color:#3B4046;font-family:U;font-size:21px;display:flex;align-items:center;justify-content:center;gap:8px;z-index:7;box-shadow:0 6px 18px rgba(0,0,0,.18)}.url span{font-size:15px;filter:grayscale(1)}
.st{display:flex;justify-content:space-between;align-items:center;height:44px;padding:8px 26px 0 30px;font-family:U6;font-size:13px;position:relative;z-index:6}.st span{display:flex;gap:5px;align-items:center}
.m-der{left:468px;top:520px;transform:rotate(3deg)}
.m-portada{left:450px;top:480px;transform:rotate(-7deg)}
.m-antes{left:-40px;top:560px;transform:scale(.8) rotate(-7deg);transform-origin:50% 0;filter:saturate(.75) brightness(.82);z-index:4}
.m-desp{left:452px;top:470px;transform:rotate(3deg);z-index:6}
/* web mal */
.w{width:372px;min-height:880px;color:#222;font-family:Georgia,"Times New Roman",serif;background:#fff}
.w-top{background:#3B0D0D;color:#E9C9A0;font:7.5px Arial,sans-serif;padding:3px 10px;text-align:right}
.w-cab{padding:9px 12px;background:linear-gradient(#8E2424,#6E1717);color:#FFE9A8;font-size:17px;font-style:italic;text-shadow:1px 1px 0 #0007}.w-logo b{font-size:20px}
.w-nav{background:#E8DCC0;border-bottom:2px solid #B89B5E;color:#6E1717;font:8.5px Verdana,Arial,sans-serif;padding:5px 10px;line-height:1.7;text-decoration:underline}
.w-hero{height:186px;position:relative;color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 20px;gap:7px;background:linear-gradient(rgba(60,30,5,.45),rgba(60,30,5,.6)),${VIEJA} center/cover}
.w-hero b{font-family:"Comic Sans MS","Comic Neue","Trebuchet MS",cursive;font-size:23px;line-height:1.15;color:#FFF3B0;text-shadow:2px 2px 0 #000a}.w-hero span{font-size:10px;font-style:italic}
.w-hero em{position:absolute;bottom:8px;display:flex;gap:4px}.w-hero em i{width:7px;height:7px;border-radius:50%;background:#fff6}.w-hero em i.on{background:#fff}
.w-txt{padding:12px 12px 2px}.w-txt h4{margin:0 0 5px;font:bold 12px Verdana,sans-serif;color:#6E1717;border-bottom:1px dotted #B89B5E;padding-bottom:3px}.w-txt p{margin:0 0 7px;font-size:9px;line-height:1.5;text-align:justify;color:#444}
.w-fotos{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:4px 12px}.w-fotos i{height:58px;border:3px solid #fff;outline:1px solid #C9BFA6;background:${VIEJA} 20% 70%/260%;filter:sepia(.5) contrast(.9)}.w-fotos i:nth-child(2){background-position:70% 40%}.w-fotos i:nth-child(3){background-position:45% 90%;background-size:340%}
.w-pie{background:#2B2B2B;color:#BDBDBD;padding:12px;margin-top:10px;font-family:Arial,sans-serif}.w-pie p{margin:0 0 6px;font-size:9px;width:max-content}
/* cargando */
.carga{background:#fff;height:880px;position:relative}.prog{height:3px;width:34%;background:#2F6FED;margin-top:2px}
.sk{margin:14px 14px 0;border-radius:8px;background:linear-gradient(90deg,#EEF0F2,#F7F8F9,#EEF0F2)}.sk.a{height:34px;width:52%}.sk.b{height:170px}.sk.c{height:14px;width:80%}.sk.d{height:14px;width:60%}
.giro{position:absolute;left:50%;top:330px;width:70px;height:70px;margin-left:-35px;border-radius:50%;border:7px solid #E3E6E9;border-top-color:#7C8691;background:#fff;box-shadow:0 0 0 14px #fff}
.mini{background:#EDEEF0;height:880px}.mini-in{width:372px;transform:scale(.46);transform-origin:50% 0;margin-top:26px;box-shadow:0 1px 0 #CCC,0 10px 24px rgba(0,0,0,.12)}.mini-in .w{min-height:0}
/* web bien */
.bien{font-family:U,system-ui,sans-serif;background:#FBF6EE;color:#2B1D12}
.b-hero{height:420px;padding:0 20px 20px;color:#fff;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(24,14,6,.5) 0%,rgba(24,14,6,.12) 34%,rgba(24,14,6,.86) 100%),${PAN} center/cover}
.b-hero .st{margin:0 -20px}.b-cab{display:flex;justify-content:space-between;align-items:center;margin-top:6px}.b-cab span{font-family:D;font-size:23px}.b-cab em{font-style:normal;font-size:10.5px;font-family:U6;background:rgba(255,255,255,.92);color:#1F6B3F;padding:5px 9px;border-radius:20px}
.b-hero>b{margin-top:auto;font-family:D;font-size:40px;line-height:1;letter-spacing:-.9px;font-weight:400}.b-hero>p{margin:9px 0 0;font-size:13.5px;opacity:.92}
.b-bot{display:flex;gap:8px;margin-top:14px}.b-bot a{flex:1;text-align:center;padding:12px 0;border-radius:12px;border:1.5px solid rgba(255,255,255,.75);font-family:U6;font-size:15px}.b-bot a.pri{background:#E9B872;color:#2B1D12;border-color:#E9B872}
.b-fila{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:14px 16px 0}.b-fila div,.b-res{background:#fff;border-radius:14px;padding:11px 13px;box-shadow:0 1px 0 #EADFCF}.b-fila b{display:block;font-family:U6;font-size:10.5px;color:#9A866F;text-transform:uppercase;letter-spacing:.6px}.b-fila span{font-size:14px}
.b-res{margin:8px 16px 0;display:flex;gap:12px;align-items:center}.b-res b{font-family:D;font-size:30px;font-weight:400}.b-res span{font-size:11.5px;color:#6B5A4A}.b-res u{display:block;text-decoration:none;color:#E0A23A;font-size:14px;letter-spacing:1px}
.b-lista{padding:8px 16px}.b-lista div{display:flex;gap:11px;align-items:center;padding:8px 0;border-bottom:1px solid #EADFCF}.b-lista i{width:46px;height:46px;border-radius:10px;background:${PAN} 30% 60%/300%}.b-lista div:nth-child(2) i{background-position:75% 50%}.b-lista span{font-size:11.5px;color:#6B5A4A}.b-lista b{display:block;font-family:U6;font-size:13.5px;color:#2B1D12}
/* portada */
.chips{position:absolute;inset:0;z-index:12}
.chip{position:absolute;display:flex;align-items:center;gap:14px;background:#FAF8F5;color:#0F1C24;font-size:27px;padding:12px 22px 12px 12px;border-radius:999px;box-shadow:0 16px 34px rgba(0,0,0,.45);white-space:nowrap}
.chip b{width:44px;height:44px;border-radius:50%;background:#E8683C;display:grid;place-items:center;font-family:DI;font-size:27px;font-weight:400}
.c1{left:600px;top:530px;transform:rotate(-4deg)}.c2{left:330px;top:690px;transform:rotate(3deg)}.c3{left:640px;top:830px;transform:rotate(-2deg)}.c4{left:370px;top:960px;transform:rotate(2deg)}.c5{left:600px;top:1090px;transform:rotate(-3deg)}
.aviso{position:absolute;left:80px;bottom:150px;font-family:M;font-size:21px;line-height:1.5;color:#A9B4BA;z-index:12}.dz{position:absolute;left:80px;bottom:100px;font-size:26px;color:#E8683C;z-index:12}
/* carga */
.crono{position:absolute;left:76px;top:700px;z-index:10}.crono b{display:block;font-family:DI;font-weight:400;font-size:230px;line-height:.9;color:#E8683C;letter-spacing:-8px}.crono span{display:block;font-family:M;font-size:24px;letter-spacing:2px;text-transform:uppercase;line-height:1.4;margin-top:14px;color:#A9B4BA}
.linea{position:absolute;left:84px;width:330px;bottom:170px;height:4px;background:#2A3A45;border-radius:2px;z-index:10}.linea u{position:absolute;left:0;top:0;height:4px;width:100%;border-radius:2px;background:linear-gradient(90deg,#FAF8F5 0,#E8683C 48%,#E8683C)}
.linea i{position:absolute;top:-52px;transform:translateX(-50%);font:normal 22px M;color:#A9B4BA;white-space:nowrap}.linea i:first-child{transform:none}.linea i:last-of-type{transform:translateX(-100%)}
.linea i:after{content:"";position:absolute;left:50%;top:40px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#FAF8F5}.linea i:first-child:after{left:8px}.linea i:last-of-type:after{left:auto;right:-8px;background:#E8683C}
.linea .hito{color:#FAF8F5}.linea .hito:after{background:#E8683C;box-shadow:0 0 0 6px rgba(232,104,60,.3)}.linea small{position:absolute;left:50%;top:76px;transform:translateX(-50%);font:22px/1.25 U6;color:#F0A07E;white-space:normal;width:200px;text-align:center}
/* recortes */
.recorte{position:absolute;border-radius:28px;overflow:hidden;z-index:6;box-shadow:0 40px 80px rgba(0,0,0,.5)}
.mal-r{left:300px;top:690px;width:700px;height:330px;transform:rotate(3deg)}.esc2{transform:scale(1.88);transform-origin:0 0;width:372px}.esc2 .w-hero{height:176px}
.tacha{position:absolute;left:60px;top:80px;width:580px;height:110px}.tacha path{fill:none;stroke:#E8683C;stroke-width:9;stroke-linecap:round}
.bien-r{left:80px;top:960px;width:640px;padding:54px 40px 40px;background:#FBF6EE;color:#2B1D12;transform:rotate(-3deg);overflow:visible}.bien-r b{display:block;font-family:D;font-weight:400;font-size:64px;line-height:1;letter-spacing:-1.4px}.bien-r p{margin:14px 0 0;font-family:U;font-size:26px;color:#6B5A4A}
.tag{position:absolute;z-index:3;font-family:M;font-size:20px;letter-spacing:2px;text-transform:uppercase;padding:8px 16px;border-radius:999px}.tag.malo{left:20px;top:18px;background:#0F1C24;color:#F0A07E}.tag.bueno{left:34px;top:-20px;background:#E8683C;color:#0F1C24}
/* lupa */
.lupa{position:absolute;left:70px;top:770px;width:460px;height:460px;z-index:14}
.lupa-in{width:460px;height:460px;border-radius:50%;overflow:hidden;background:#2B2B2B;border:12px solid #E8683C;box-shadow:0 30px 70px rgba(0,0,0,.6),inset 0 0 40px rgba(0,0,0,.5);display:flex;align-items:center}
.lupa-in span{font:44px Arial,sans-serif;color:#BDBDBD;white-space:nowrap;margin-left:-22px}.lupa-in b{color:#fff;font-weight:400}
.mango{position:absolute;right:-70px;bottom:-40px;width:150px;height:30px;border-radius:15px;background:#E8683C;transform:rotate(45deg);transform-origin:0 50%;left:380px;top:400px;box-shadow:0 14px 30px rgba(0,0,0,.4)}
.toque{position:absolute;left:250px;top:1076px;z-index:15;display:flex;align-items:center;gap:14px}.toque i{position:absolute;left:-52px;top:-22px;width:64px;height:64px;border-radius:50%;border:4px solid #FAF8F5;opacity:.9}.toque i+i{left:-66px;top:-36px;width:92px;height:92px;opacity:.4}.toque span{margin-left:40px;font-family:M;font-size:20px;letter-spacing:1px;background:#0F1C24;color:#FAF8F5;padding:8px 14px;border-radius:999px;border:1px solid #2A3A45}
.llamar{position:absolute;right:70px;bottom:120px;z-index:16;text-align:right;transform:rotate(-3deg)}.llamar small{display:block;font-family:M;font-size:19px;letter-spacing:2px;text-transform:uppercase;color:#F0A07E;margin-bottom:12px}
.llamar a{display:inline-block;background:#FAF8F5;color:#0F1C24;font-size:44px;padding:22px 60px;border-radius:999px;box-shadow:0 22px 50px rgba(0,0,0,.5)}
/* pellizco */
.pellizco{position:absolute;left:560px;top:800px;width:400px;height:400px;z-index:14;filter:drop-shadow(0 14px 22px rgba(0,0,0,.35))}.pellizco circle{fill:rgba(250,248,245,.92);stroke:#E8683C;stroke-width:6}.pellizco path{fill:none;stroke:#E8683C;stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.chip.suelto{left:80px;top:1020px;bottom:auto;z-index:15;padding:14px 26px;font-size:26px;transform:rotate(-2deg)}
/* horario */
.tarj{position:absolute;border-radius:30px;padding:38px 40px;z-index:6;box-shadow:0 40px 80px rgba(0,0,0,.5)}.tarj small{display:flex;align-items:center;gap:10px;font-family:M;font-size:21px;letter-spacing:2px;text-transform:uppercase;margin-bottom:18px}
.t-web{left:70px;top:740px;width:520px;background:#2B2B2B;color:#BDBDBD;transform:rotate(-4deg)}.t-web small{color:#8A8A8A}.t-web p{margin:0;font:40px/1.3 Arial,sans-serif}.t-web b{color:#fff;font-weight:400;background:rgba(232,104,60,.35);box-shadow:0 0 0 6px rgba(232,104,60,.35);border-radius:6px}
.t-google{right:70px;top:960px;width:540px;background:#fff;color:#202124;transform:rotate(3deg);font-family:Arial,sans-serif}.t-google small{color:#70757A}.t-google small i{width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#EA4335}
.t-google strong{display:block;font-size:40px;font-weight:400}.t-google p{margin:12px 0 10px;font-size:33px}.t-google em{font-style:normal;color:#C5221F}.t-google p b{background:rgba(232,104,60,.28);box-shadow:0 0 0 6px rgba(232,104,60,.28);border-radius:6px}.t-google span{font-size:24px;color:#70757A}
.distinto{position:absolute;left:560px;top:690px;font-family:DI;font-size:330px;line-height:1;color:#E8683C;z-index:7;text-shadow:0 20px 50px rgba(0,0,0,.5)}
/* antes y después */
.mitad{position:absolute;left:500px;top:430px;width:700px;height:1100px;background:#FAF8F5;z-index:1;transform:rotate(3deg);transform-origin:0 0;border-radius:40px 0 0 0}
.partida .t{z-index:10;mix-blend-mode:normal}.partida .t span.cl{color:#0F1C24}
.despues{clip-path:inset(0 0 0 50%);z-index:4}.corte{position:absolute;left:50%;top:0;bottom:0;width:6px;margin-left:-3px;background:#E8683C;z-index:6}
.corte b{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px;border-radius:50%;background:#E8683C;color:#0F1C24;display:grid;place-items:center;font:400 34px U6;letter-spacing:4px;box-shadow:0 10px 26px rgba(0,0,0,.35)}
.partida .url{display:none}
.etq{position:absolute;top:470px;z-index:12;font-family:M;font-size:22px;letter-spacing:3px;text-transform:uppercase;padding:10px 20px;border-radius:999px}.antes{left:80px;top:500px;background:#1B2B35;color:#F0A07E;border:1px solid #2F4553}.desp{right:70px;top:1180px;background:#E8683C;color:#0F1C24;z-index:14;transform:rotate(3deg);box-shadow:0 14px 30px rgba(0,0,0,.3)}
.n-centro{left:80px;top:auto;bottom:110px;width:400px;font-size:30px}

/* cierre */
.gs{position:absolute;left:80px;right:140px;top:650px;font-size:44px;line-height:1.34;z-index:10}
.gu{position:absolute;left:80px;right:120px;bottom:290px;font-family:M;font-size:30px;line-height:1.4;letter-spacing:1px;z-index:10}
.cta{position:absolute;left:80px;bottom:150px;background:#0F1C24;color:#FAF8F5;font-size:36px;padding:24px 38px;border-radius:999px;z-index:10;box-shadow:0 18px 40px rgba(15,28,36,.35)}
`;
