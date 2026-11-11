// Carrusel del área de clientes con el estilo «pantalla anotada».
// Uso: node motion/anotado/area-clientes.mjs  →  media/1116-area-clientes-v2-1.jpg … -7.jpg
import { mkdirSync } from 'node:fs';
import { chromium, RAIZ, arco, co, CSS, movil } from './piezas.mjs';
import { PANEL, CSS_PANEL, FUENTES, CONTACTOS, GRAFICA } from './panel.mjs';
const ID = '1116-area-clientes-v2';
const pm = (o = {}) => movil(PANEL, { url: 'panel.bahiga.es/area', ...o });

const L = [
  { cls: 'portada', fantasma: '?', t: '¿Cuánta gente entró en tu web *este mes?*',
    cuerpo: `${pm({ cls: 'm-portada' })}
      <div class="chips"><div class="chip dato d1"><b>842</b>visitas</div><div class="chip dato d2"><b>37</b>te contactaron</div><div class="chip dato d3"><b>61 %</b>llegó por Google</div></div>
      <div class="aviso">Pantalla de ejemplo,<br>datos inventados.</div><div class="dz">Desliza →</div>` },
  { fantasma: '0', t: 'Lo normal es *no saberlo.*', n: 'Te hicieron la web, la pagaste y nadie volvió a mirar qué hace.',
    cuerpo: `<div class="vacios"><div><small>Visitas</small><b>—</b></div><div><small>Llamadas</small><b>—</b></div><div><small>WhatsApp</small><b>—</b></div></div>
      <div class="chip suelto s2">Una web sin datos es un cartel apagado</div>` },
  { fantasma: '01', num: '01', t: 'Cuántos *entran.*', n: 'Las visitas de tu web, día a día, y si suben o bajan.',
    cuerpo: `${pm({ cls: 'm-der', y: -40 })}
      <div class="crono"><b>842</b><span>visitas<br>en octubre</span></div>
      <div class="recorte graf"><small>Visitas por día</small>${GRAFICA(420, 150)}<em>+12 % que el mes pasado</em></div>` },
  { fantasma: '02', num: '02', t: 'De dónde *llegan.*', n: 'Si te encuentran en Google, por Instagram o escribiendo tu nombre.',
    cuerpo: `<div class="recorte fuentes"><small>De dónde llegan</small>${FUENTES.map(([n, p], i) => `<div class="ff ${i ? '' : 'top'}"><span>${n}</span><u><i style="width:${p}%"></i></u><b>${p} %</b></div>`).join('')}</div>
      <div class="chip suelto s4"><b>6</b>de cada 10 llegan por Google</div>` },
  { fantasma: '03', num: '03', t: 'Cuántos te *contactan.*', n: 'Lo que cuenta: quién pasó de mirar a escribirte o llamarte.',
    cuerpo: `<div class="total"><b>37</b><span>contactos<br>en octubre</span></div>
      <div class="trio">${CONTACTOS.map(([n, c], i) => `<div class="tc t${i}"><b>${c}</b><span>${n}</span></div>`).join('')}</div>` },
  { fantasma: '04', num: '04', t: 'Y lo demás, *en el mismo sitio.*', n: 'El informe de cada mes, tus facturas y los documentos del proyecto.',
    cuerpo: `${pm({ cls: 'm-der', y: -300 })}
      <div class="docs"><div class="dc"><i>PDF</i><span><b>Informe de octubre</b>Listo el día 1</span></div><div class="dc"><i>€</i><span><b>Factura 2026-041</b>Pagada</span></div><div class="dc"><i>✎</i><span><b>Presupuesto</b>Pendiente de firma</span></div></div>` },
  { cls: 'coral', fantasma: '?', t: '¿Sabes qué hace *tu web?*',
    cuerpo: `<div class="gs">Cada negocio que trabaja con Bahiga tiene su panel. Entra con su correo, también desde el móvil.</div><div class="gu">Pantalla de ejemplo con datos inventados.</div><div class="cta">Escribe WEB y te lo enseñamos</div>` },
];

const EXTRA = `
.m-portada{left:520px;top:500px;transform:rotate(-7deg)}
.chip.dato{font-size:28px;padding:12px 26px 12px 14px;gap:14px}.chip.dato b{width:auto;height:auto;min-width:0;background:none;font-family:D;font-size:46px;color:#E8683C;padding:0 4px 0 10px;letter-spacing:-1px}
.d1{left:400px;top:720px;transform:rotate(3deg)}.d2{left:640px;top:900px;transform:rotate(-3deg)}.d3{left:380px;top:1080px;transform:rotate(2deg)}
.vacios{position:absolute;left:80px;right:80px;top:720px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px;z-index:6}
.vacios div{background:#14242E;border:2px dashed #2F4553;border-radius:28px;padding:34px 28px 30px}.vacios div:nth-child(2){transform:translateY(46px) rotate(2deg)}.vacios div:nth-child(1){transform:rotate(-3deg)}.vacios div:nth-child(3){transform:translateY(-10px) rotate(-1deg)}
.vacios small{font-family:M;font-size:20px;letter-spacing:2px;text-transform:uppercase;color:#7F8C95}.vacios b{display:block;font-family:D;font-weight:400;font-size:150px;line-height:1;color:#5C7381;margin-top:10px}
.chip.suelto.s2{left:80px;top:1120px;bottom:auto;transform:rotate(-2deg)}
.crono b{font-size:210px}
.recorte.graf{left:80px;top:1010px;width:500px;padding:30px 40px 34px;background:#fff;color:#0F1C24;transform:rotate(-3deg);z-index:14}
.recorte small{display:block;font-family:M;font-size:19px;letter-spacing:2px;text-transform:uppercase;color:#8A8F93;margin-bottom:14px}.recorte.graf em{display:block;margin-top:14px;font:normal 24px U6;color:#2E7D4F}
.recorte.fuentes{left:80px;right:80px;top:700px;padding:44px 48px 40px;background:#fff;color:#0F1C24;transform:rotate(-2deg)}
.ff{display:grid;grid-template-columns:220px 1fr 130px;gap:22px;align-items:center;font-size:40px;margin-top:26px}.ff u{height:22px;border-radius:11px;background:#EFEAE2;display:block}.ff u i{display:block;height:22px;border-radius:11px;background:#0F1C24}.ff.top u i{background:#E8683C}.ff b{font-family:D;font-weight:400;font-size:52px;text-align:right;letter-spacing:-1px}.ff.top b{color:#E8683C}
.chip.suelto.s4{left:auto;right:70px;top:1150px;bottom:auto;transform:rotate(3deg);font-size:30px;padding:14px 28px 14px 14px}
.total{position:absolute;left:76px;top:690px;z-index:10;display:flex;align-items:flex-end;gap:26px}.total b{font-family:DI;font-weight:400;font-size:300px;line-height:.8;color:#E8683C;letter-spacing:-10px}.total span{font-family:M;font-size:24px;letter-spacing:2px;text-transform:uppercase;line-height:1.4;color:#A9B4BA;padding-bottom:14px}
.trio{position:absolute;left:80px;right:80px;top:980px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;z-index:8}
.tc{background:#FAF8F5;color:#0F1C24;border-radius:28px;padding:30px 28px;box-shadow:0 30px 60px rgba(0,0,0,.45)}.tc b{display:block;font-family:D;font-weight:400;font-size:110px;line-height:1;letter-spacing:-3px}.tc span{font-size:28px;color:#4A5560}
.t0{transform:rotate(-3deg)}.t1{transform:translateY(34px) rotate(2deg)}.t2{transform:rotate(-1deg)}.t0 b{color:#E8683C}
.docs{position:absolute;left:70px;top:820px;width:470px;display:grid;gap:18px;z-index:14}
.dc{display:flex;gap:20px;align-items:center;background:#FAF8F5;color:#0F1C24;border-radius:24px;padding:22px 26px;box-shadow:0 26px 56px rgba(0,0,0,.5)}.dc:nth-child(1){transform:rotate(-3deg)}.dc:nth-child(2){transform:translateX(30px) rotate(2deg)}.dc:nth-child(3){transform:rotate(-1deg)}
.dc i{width:70px;height:70px;border-radius:18px;background:#FBE4DA;color:#B4532E;font:normal 21px U6;display:grid;place-items:center;flex:none}.dc span{font-size:22px;color:#6B747C}.dc b{display:block;font-family:U6;font-weight:400;font-size:28px;color:#0F1C24}
`;
const total = L.length;
const html = (s, i) => `<html><head><style>${CSS}${CSS_PANEL}${EXTRA}</style></head><body class="${s.cls || ''}">
  <div class=m>${arco(56, s.cls === 'coral' ? '#0F1C24' : '#FAF8F5')}Bahiga.</div><div class=pg>0${i + 1} / 0${total}</div>
  ${s.fantasma ? `<div class=fan>${s.fantasma}</div>` : ''}${s.num ? `<div class=num>${s.num}</div>` : ''}
  <div class=t>${co(s.t)}</div>${s.n ? `<div class=n>${s.n}</div>` : ''}${s.cuerpo}
  <div class=pie>BAHIGA.ES</div></body></html>`;

mkdirSync(`${RAIZ}media`, { recursive: true });
const b = await chromium.launch();
for (const [i, s] of L.entries()) {
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await pg.setContent(html(s, i)); await pg.evaluate(() => document.fonts.ready);
  // El titular manda: si ocupa tres líneas, la nota baja.
  await pg.evaluate(() => { const t = document.querySelector('.t'), n = document.querySelector('.n'); if (t && n) n.style.top = Math.max(470, t.getBoundingClientRect().bottom + 44) + 'px'; });
  const ruta = `${RAIZ}media/${ID}-${i + 1}.jpg`;
  await pg.screenshot({ path: ruta, type: 'jpeg', quality: 93 });
  console.log(ruta.replace(RAIZ, ''));
}
await b.close();
