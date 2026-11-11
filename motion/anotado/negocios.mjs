// Banco de negocios inventados para las piezas: cada uno con su web de ejemplo (una landing completa),
// sus colores y su foto. Son ficticios y van siempre etiquetados como ejemplo. Las fotos son generadas.
// Tipos elegidos por lo que más se ve sin web propia en Priego, Cabra y Lucena.
import { ESTADO, foto } from './piezas.mjs';

export const NEGOCIOS = {
  taller: { nombre: 'Taller Ruta 12', ciudad: 'Cabra', lema: 'Mecánica y revisiones en Cabra', sub: 'Te damos precio antes de tocar el coche.', estado: '● Abierto · cierra 19:30', horario: 'L–V · 8:30–19:30', dir: 'Pol. Ejemplo, 4',
    seccion: 'Servicios', titulo: 'Lo que hacemos en el taller', prods: [['Revisión y pre-ITV', 'En el día', '15% 30%'], ['Frenos y neumáticos', 'Con cita', '80% 30%'], ['Aceite y filtros', 'Sin esperas', '20% 85%'], ['Diagnosis', 'Te explicamos el fallo', '75% 80%']],
    opinion: '«Me dijeron el precio antes y fue ese. El coche, listo por la tarde.»', nota: '4,7', resenas: '86', encargo: '¿Pedimos cita?', busca: 'taller mecánico en cabra', dominio: 'tallerruta12.example',
    c: { fondo: '#F3F4F6', tinta: '#141A20', suave: '#5B6670', linea: '#DDE1E6', acento: '#E0B020', sobre: '#141A20', oscuro: '#141A20', tit: 'U6' }, alt: 'linear-gradient(160deg,#5B6670,#141A20)' },
  barberia: { nombre: 'Barbería Navaja', ciudad: 'Priego de Córdoba', lema: 'Corte y barba en Priego', sub: 'Con cita, sin colas. Reserva por WhatsApp.', estado: '● Abierto · cierra 20:30', horario: 'M–S · 9:30–20:30', dir: 'C/ Ejemplo, 7',
    seccion: 'Servicios', titulo: 'Corte, barba y poco más', prods: [['Corte', '25 min', '20% 40%'], ['Barba a navaja', '20 min', '70% 35%'], ['Corte y barba', '45 min', '30% 85%'], ['Niños', 'Hasta 12 años', '80% 80%']],
    opinion: '«Reservo desde el móvil y entro a mi hora. No vuelvo a esperar.»', nota: '4,9', resenas: '109', encargo: '¿Te guardamos hora?', busca: 'barbería en priego', dominio: 'barberianavaja.example',
    c: { fondo: '#F4F1EA', tinta: '#1C2A22', suave: '#5E6B62', linea: '#E2DCCF', acento: '#C89B5A', sobre: '#1C2A22', oscuro: '#1C2A22', tit: 'D' }, alt: 'linear-gradient(160deg,#3B5244,#1C2A22)' },
  ropa: { nombre: 'Lino & Sal', ciudad: 'Lucena', lema: 'Ropa de mujer en Lucena', sub: 'Lo nuevo de la semana, cada jueves.', estado: '● Abierto · cierra 20:30', horario: 'L–S · 10:00–14:00 · 17:30–20:30', dir: 'C/ Ejemplo, 21',
    seccion: 'Novedades', titulo: 'Lo que ha llegado esta semana', prods: [['Vestido de lino', 'Tallas S a L', '75% 55%'], ['Camisa oversize', 'Tres colores', '60% 30%'], ['Punto fino', 'Talla única', '10% 70%'], ['Pantalón recto', 'Tallas 36 a 44', '85% 80%']],
    opinion: '«Veo la ropa en la web, pregunto por WhatsApp y me la guardan.»', nota: '4,8', resenas: '64', encargo: '¿Te lo guardamos?', busca: 'tienda de ropa en lucena', dominio: 'linoysal.example',
    c: { fondo: '#FAF6F0', tinta: '#2A2420', suave: '#7A6C60', linea: '#EADFD2', acento: '#B5654A', sobre: '#FFFFFF', oscuro: '#2A2420', tit: 'DI' }, alt: 'linear-gradient(160deg,#D9C4AE,#8A6A55)' },
  fisio: { nombre: 'Fisio Avanza', ciudad: 'Priego de Córdoba', lema: 'Fisioterapia en Priego', sub: 'Cita en 48 horas. Mañanas y tardes.', estado: '● Abierto · cierra 21:00', horario: 'L–V · 9:00–14:00 · 16:00–21:00', dir: 'Avda. Ejemplo, 15',
    seccion: 'Tratamientos', titulo: 'En qué te podemos ayudar', prods: [['Espalda y cuello', 'Sesión de 50 min', '55% 60%'], ['Lesiones deportivas', 'Valoración inicial', '75% 30%'], ['Suelo pélvico', 'Con cita previa', '15% 40%'], ['Punción seca', 'Según valoración', '60% 85%']],
    opinion: '«Me dieron cita esa misma semana y me explicaron qué tenía.»', nota: '4,9', resenas: '51', encargo: '¿Pedimos cita?', busca: 'fisioterapeuta en priego', dominio: 'fisioavanza.example',
    c: { fondo: '#F2F7F8', tinta: '#12303A', suave: '#56707A', linea: '#D8E6EA', acento: '#1F8A8A', sobre: '#FFFFFF', oscuro: '#12303A', tit: 'U6' }, alt: 'linear-gradient(160deg,#9CC7CF,#12303A)' },
  flores: { nombre: 'Flores Azahar', ciudad: 'Cabra', lema: 'Flores y ramos en Cabra', sub: 'Reparto en el día si pides antes de las 12.', estado: '● Abierto · cierra 14:00', horario: 'L–S · 9:30–14:00 · 17:00–20:00', dir: 'Pza. Ejemplo, 3',
    seccion: 'Ramos', titulo: 'Para cada ocasión', prods: [['Ramo de temporada', 'Hecho en el día', '45% 65%'], ['Centros y coronas', 'Por encargo', '70% 25%'], ['Plantas', 'De interior y terraza', '15% 30%'], ['Bodas y eventos', 'Pide presupuesto', '85% 70%']],
    opinion: '«Pedí por WhatsApp a las once y a la una lo tenía mi madre.»', nota: '4,8', resenas: '73', encargo: '¿Un ramo para hoy?', busca: 'floristería en cabra', dominio: 'floresazahar.example',
    c: { fondo: '#F8F5EF', tinta: '#23301F', suave: '#657060', linea: '#E5E0D2', acento: '#C4577A', sobre: '#FFFFFF', oscuro: '#23301F', tit: 'D' }, alt: 'linear-gradient(160deg,#C9D8B6,#4C6B3C)' },
  panaderia: { nombre: 'La Miga', ciudad: 'Priego de Córdoba', lema: 'Pan de horno de leña en Priego', sub: 'Abrimos a las 7:00. Encargos por WhatsApp.', estado: '● Abierto · cierra 14:00', horario: 'L–S · 7:00–14:00', dir: 'C/ Ejemplo, 12',
    seccion: 'Nuestro pan', titulo: 'Lo que sale del horno cada día', prods: [['Hogaza de masa madre', 'Cada día', '20% 60%'], ['Pan de pueblo', 'Cada día', '70% 40%'], ['Roscos y dulces', 'Viernes y sábado', '45% 85%'], ['Encargos', 'Con un día de antelación', '85% 75%']],
    opinion: '«El mejor pan de la zona. Encargo por WhatsApp y lo tengo listo.»', nota: '4,8', resenas: '132', encargo: '¿Un encargo?', busca: 'panadería en priego', dominio: 'panaderialamiga.example',
    c: { fondo: '#FBF6EE', tinta: '#2B1D12', suave: '#6B5A4A', linea: '#EADFCF', acento: '#E9B872', sobre: '#2B1D12', oscuro: '#2B1D12', tit: 'D' }, alt: 'linear-gradient(160deg,#D9B98A,#8A5A2B)' },
};

export const prod = ([n, d, pos]) => `<div class="l-p"><i style="background-position:${pos}"></i><b>${n}</b><span>${d}</span></div>`;
export const mapa = `<div class="l-mapa"><i></i><i></i><i></i><i></i><u></u></div>`;
const vars = (id) => { const n = NEGOCIOS[id], c = n.c; return `--foto:${foto(`${id}.jpg`, n.alt)};--fondo:${c.fondo};--tinta:${c.tinta};--suave:${c.suave};--linea:${c.linea};--acento:${c.acento};--sobre:${c.sobre};--oscuro:${c.oscuro};--tit:${c.tit}`; };
// Envuelve cualquier trozo (un recorte ampliado, una tarjeta) con los colores y la foto del negocio.
export const con = (id, dentro, cls = '') => `<div class="ng ${cls}" style="${vars(id)}">${dentro}</div>`;

export const web = (id) => { const n = NEGOCIOS[id]; return `
<div class="w bien ng" style="${vars(id)}">
  <div class="b-hero">${ESTADO('#fff')}
    <div class="b-cab"><span>${n.nombre}</span><em>${n.estado}</em></div>
    <b>${n.lema}</b><p>${n.sub}</p>
    <div class="b-bot"><a class="pri">Llamar</a><a>WhatsApp</a></div>
  </div>
  <div class="b-fila"><div><b>Horario</b><span>${n.horario.split(' · ').slice(0, 2).join(' · ')}</span></div><div><b>Dónde</b><span>${n.dir}</span></div></div>
  <div class="l-sec" id="escaparate"><small>${n.seccion}</small><h3>${n.titulo}</h3><div class="l-grid">${n.prods.map(prod).join('')}</div></div>
  <div class="l-sec" id="resenas"><small>Opiniones</small><div class="b-res" style="margin:8px 0 0"><b>${n.nota}</b><span><u>★★★★★</u>${n.resenas} reseñas en Google</span></div>
    <div class="l-op">${n.opinion}<em>Reseña de ejemplo</em></div></div>
  <div class="l-sec" id="donde"><small>Dónde estamos</small>${mapa}<p class="l-dir">${n.dir} · ${n.ciudad}<br>${n.horario}</p></div>
  <div class="l-sec l-cont" id="contacto"><h3>${n.encargo}</h3><a class="pri">Llamar ahora</a><a>Escribir por WhatsApp</a><p>Aviso legal · Privacidad · Cookies</p></div>
</div>`; };

export const CSS_NEG = `
.ng{--tit:D}.bien.ng{background:var(--fondo);color:var(--tinta)}
.ng .b-hero{background:linear-gradient(180deg,rgba(10,12,14,.55) 0%,rgba(10,12,14,.15) 34%,rgba(10,12,14,.88) 100%),var(--foto) center/cover}
.ng .b-cab span,.ng .b-hero>b,.ng .l-sec h3,.ng .b-res b{font-family:var(--tit)}.ng .b-hero>b{font-size:38px}
.ng .b-bot a.pri,.ng .l-cont a.pri{background:var(--acento);color:var(--sobre);border-color:var(--acento)}
.ng .b-fila div,.ng .b-res,.ng .l-p,.ng .l-op{box-shadow:0 1px 0 var(--linea)}.ng .b-fila b,.ng .l-sec small,.ng .l-op em{color:var(--suave)}.ng .b-fila span{font-size:12.5px}
.ng .b-res span,.ng .l-p span,.ng .l-dir{color:var(--suave)}.ng .b-res u{color:var(--acento)}
.l-sec{padding:22px 16px 0}.l-sec small{display:block;font-family:U6;font-size:10.5px;text-transform:uppercase;letter-spacing:.8px}.l-sec h3{margin:4px 0 12px;font-weight:400;font-size:25px;line-height:1.05;letter-spacing:-.5px}
.l-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.l-p{background:#fff;border-radius:14px;overflow:hidden;padding-bottom:10px}.l-p i{display:block;height:96px;background:var(--foto) center/260%}.l-p b{display:block;font-family:U6;font-weight:400;font-size:13px;padding:9px 11px 0;color:var(--tinta)}.l-p span{display:block;font-size:11px;padding:1px 11px 0}
.l-op{margin-top:8px;background:#fff;border-radius:14px;padding:13px;font-size:13px;line-height:1.4}.l-op em{display:block;font-style:normal;font-size:10.5px;margin-top:6px}
.l-mapa{position:relative;height:150px;margin-top:8px;border-radius:14px;overflow:hidden;background:#E9E2D3}.l-mapa i{position:absolute;background:#fff;height:9px;width:140%;left:-20%}.l-mapa i:nth-child(1){top:34px;transform:rotate(-8deg)}.l-mapa i:nth-child(2){top:98px;transform:rotate(5deg)}.l-mapa i:nth-child(3){top:60px;transform:rotate(72deg);height:7px}.l-mapa i:nth-child(4){top:70px;transform:rotate(-58deg);height:7px;left:10%}
.l-mapa u{position:absolute;left:54%;top:36px;width:30px;height:30px;border-radius:50% 50% 50% 0;background:#E8683C;transform:rotate(-45deg);box-shadow:0 6px 12px rgba(0,0,0,.25)}.l-mapa u:after{content:"";position:absolute;inset:9px;border-radius:50%;background:#fff}
.l-dir{font-size:12.5px;line-height:1.5;margin:10px 0 0}
.l-cont{background:var(--oscuro);color:#fff;margin-top:24px;padding:24px 16px 26px}.l-cont h3{font-size:30px;margin:0 0 14px}.l-cont a{display:block;text-align:center;padding:13px 0;border-radius:12px;border:1.5px solid rgba(255,255,255,.6);font-family:U6;font-size:15px;margin-top:8px}.l-cont p{font-size:10px;opacity:.6;text-align:center;margin:16px 0 0}
`;
