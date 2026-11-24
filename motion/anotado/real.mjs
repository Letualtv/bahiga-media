// Muestras reales de bahiga.es/webs (capturas del móvil) para meterlas en el marco del teléfono.
// Las capturas están en motion/anotado/capturas/ y se rehacen con la web montada en local cuando cambien las muestras.
import { readFileSync } from 'node:fs';
import { ESTADO } from './piezas.mjs';
const DIR = new URL('./capturas/', import.meta.url);
export const SECTORES = [['barberia', 'Barbería'], ['estetica', 'Estética y uñas'], ['taller', 'Taller'], ['reformas', 'Reformas'], ['bar', 'Bar y restaurante'], ['rural', 'Casa rural'], ['floristeria', 'Floristería'], ['autoescuela', 'Autoescuela'], ['entreno', 'Entrenamiento'], ['merceria', 'Mercería'], ['fisio', 'Fisioterapia'], ['panaderia', 'Panadería'], ['electricista', 'Electricista'], ['moda', 'Moda'], ['peluqueria', 'Peluquería']];
export const img = (nombre) => `data:image/jpeg;base64,${readFileSync(new URL(`${nombre}.jpg`, DIR)).toString('base64')}`;
// Pantalla para movil(): la primera vista de la muestra, o la página entera (larga) para desplazarla.
export const real = (s, { larga = false } = {}) => `<div class="w rl"><div class="rl-st">${ESTADO('#fff')}</div><img src="${img(larga ? `${s}-larga` : s)}"></div>`;
export const barra = (s) => `<img class="rl-barra" src="${img(`${s}-barra`)}">`;
export const CSS_REAL = `
.rl{background:#fff;min-height:0}.rl-st{background:#0F1C24}.rl img{display:block;width:372px}
.movil.real .url{display:none}
.rl-barra{position:absolute;left:0;bottom:0;width:100%;z-index:7;display:block}
`;
