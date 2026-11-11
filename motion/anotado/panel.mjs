// Pantalla de ejemplo del área de clientes (datos inventados) para meter dentro del móvil.
import { ESTADO, arco } from './piezas.mjs';

const grafica = (w = 316, h = 92) => {
  const v = [18, 22, 20, 27, 25, 31, 28, 35, 33, 30, 38, 42, 39, 46];
  const mx = 50, px = (i) => (i / (v.length - 1)) * w, py = (y) => h - (y / mx) * h;
  const d = v.map((y, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(y).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><path d="${d} L${w} ${h} L0 ${h} Z" fill="rgba(232,104,60,.14)"/><path d="${d}" fill="none" stroke="#E8683C" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${px(13)}" cy="${py(46)}" r="4.5" fill="#E8683C" stroke="#fff" stroke-width="2"/></svg>`;
};
export const FUENTES = [['Google', 61], ['Directo', 22], ['Instagram', 11], ['Otros', 6]];
export const CONTACTOS = [['WhatsApp', 21], ['Llamadas', 11], ['Formularios', 5]];
export const GRAFICA = grafica;

export const PANEL = `
<div class="w pn">${ESTADO('#0F1C24')}
  <div class="pn-cab"><span>${arco(20, '#0F1C24')}Bahiga<i>.</i></span><em>TE</em></div>
  <div class="pn-hola"><small>Octubre</small><b>Hola, Taller Ejemplo</b><span><i></i>3 personas en tu web ahora</span></div>
  <div class="pn-kpis">
    <div data-m="visitas"><small>Visitas</small><b>842</b><span class="sube">+12 % que el mes pasado</span></div>
    <div data-m="contactos"><small>Contactos</small><b>37</b><span>WhatsApp, llamadas y formularios</span></div>
  </div>
  <div class="pn-caja" data-m="grafica"><small>Visitas por día</small>${grafica()}</div>
  <div class="pn-caja" data-m="fuentes"><small>De dónde llegan</small>${FUENTES.map(([n, p]) => `<div class="pn-f"><span>${n}</span><u><i style="width:${p}%"></i></u><b>${p} %</b></div>`).join('')}</div>
  <div class="pn-caja" data-m="docs"><small>Tus documentos</small>
    <div class="pn-d"><i>PDF</i><span><b>Informe de octubre</b>Listo el día 1</span></div>
    <div class="pn-d"><i>€</i><span><b>Factura 2026-041</b>Pagada</span></div>
    <div class="pn-d"><i>✎</i><span><b>Presupuesto tienda online</b>Pendiente de firma</span></div>
  </div>
</div>`;

export const CSS_PANEL = `
.pn{font-family:U,system-ui,sans-serif;background:#F4F1EC;color:#0F1C24;min-height:1180px;padding-bottom:30px}
.pn-cab{display:flex;justify-content:space-between;align-items:center;padding:6px 18px 10px}.pn-cab span{font-family:D;font-size:19px}.pn-cab span i{color:#E8683C;font-style:normal}.pn-cab svg{height:20px!important;vertical-align:-3px!important;margin-right:6px!important}
.pn-cab em{width:30px;height:30px;border-radius:50%;background:#0F1C24;color:#FAF8F5;font:normal 11px U6;display:grid;place-items:center}
.pn-hola{padding:6px 18px 14px}.pn-hola small{font-family:M;font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;color:#8A8F93}.pn-hola b{display:block;font-family:D;font-weight:400;font-size:29px;letter-spacing:-.6px;margin:2px 0 6px}
.pn-hola span{font-size:11.5px;color:#4A5560;display:flex;align-items:center;gap:6px}.pn-hola span i{width:8px;height:8px;border-radius:50%;background:#2E9E5B;box-shadow:0 0 0 4px rgba(46,158,91,.18)}
.pn-kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px}.pn-kpis div,.pn-caja{background:#fff;border-radius:16px;padding:14px;box-shadow:0 1px 0 #E6E0D6,0 8px 20px rgba(15,28,36,.05)}
.pn small{display:block;font-family:M;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;color:#8A8F93}
.pn-kpis b{display:block;font-family:D;font-weight:400;font-size:44px;line-height:1.05;letter-spacing:-1px;margin:4px 0 2px}.pn-kpis span{font-size:10.5px;color:#6B747C;line-height:1.3;display:block}.pn-kpis .sube{color:#2E7D4F}
.pn-caja{margin:10px 16px 0}.pn-caja svg{display:block;margin-top:10px}
.pn-f{display:grid;grid-template-columns:74px 1fr 40px;gap:8px;align-items:center;font-size:12.5px;margin-top:10px}.pn-f u{height:8px;border-radius:4px;background:#EFEAE2;display:block}.pn-f u i{display:block;height:8px;border-radius:4px;background:#0F1C24}.pn-f:first-of-type u i{background:#E8683C}.pn-f b{font-family:U6;font-weight:400;text-align:right}
.pn-d{display:flex;gap:11px;align-items:center;padding:10px 0;border-bottom:1px solid #EFEAE2}.pn-d:last-child{border:0;padding-bottom:0}.pn-d i{width:38px;height:38px;border-radius:10px;background:#FBE4DA;color:#B4532E;font:normal 11px U6;display:grid;place-items:center}.pn-d span{font-size:11px;color:#6B747C}.pn-d b{display:block;font-family:U6;font-weight:400;font-size:13.5px;color:#0F1C24}
`;
