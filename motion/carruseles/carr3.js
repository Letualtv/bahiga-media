// Carruseles e historias v3
const A=v=>v;
const lab=(t,top,c)=>`<div class="mono" style="position:absolute;left:72px;top:${top}px;color:${c||'var(--acc)'}">${t}</div>`;
const H=(t,top,fs,extra='')=>`<div class="H" style="position:absolute;left:66px;right:60px;top:${top}px;font-size:${fs}px;${extra}">${t}</div>`;
const P=(t,top,fs=34,extra='')=>`<div style="position:absolute;left:72px;right:90px;top:${top}px;font-size:${fs}px;line-height:1.38;opacity:.78;${extra}">${t}</div>`;
const S={
 cover:(o)=>({th:o.th||'light',tag:o.tag,body:lab(o.label,o.labT||520)+H(o.title,(o.labT||520)+50,o.fs||150)+(o.sub?P(o.sub,o.subT||1080,36):'')}),
 rows:(o)=>({th:o.th,tag:o.tag,body:lab(o.label,220)+H(o.title,262,o.fs||96)+`<div class="rows" style="top:${o.top||(o.items.length>3?440:480)}px">${o.items.map((it,j)=>`<div class="rw" style="${o.items.length>3?'padding:28px 0 30px':''}"><div class="n">${String((o.start||1)+j).padStart(2,'0')}</div><div><div class="tx" style="${o.items.length>3?'font-size:56px':''}">${it[0]}</div>${it[1]?`<div class="sm">${it[1]}</div>`:''}</div></div>`).join('')}</div>`}),
 win:(o)=>({th:'dark',tag:o.tag||'Caso real',body:lab(o.label,220)+H(o.title,262,96)+`<div class="win" style="top:450px"><div class="bar"><i></i><i></i><i></i><div class="url">${o.url}</div></div><img src="${o.img}" style="${o.imgs||''}"></div>`+P(o.cap,o.capT||1060,32)}),
 price:(o)=>({th:'coral',tag:o.tag||'Precio',body:lab(o.label,330)+`<div class="H" style="position:absolute;left:52px;top:360px;font-size:${o.fs||330}px;letter-spacing:-.05em;font-weight:400">${o.value}<span style="font-size:.5em">${o.unit||'€'}</span></div>
  <div style="position:absolute;left:72px;right:72px;top:750px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">${o.cols.map(c=>`<div><div class="hair" style="opacity:.4"></div><div class="mono" style="margin-top:20px;font-size:19px;opacity:.7">${c[0]}</div><div style="font-size:38px;margin-top:8px;font-weight:600">${c[1]}</div></div>`).join('')}</div>`+P(o.sub||'Sabes lo que pagas antes de empezar.',990,40,'opacity:1')+`<div style="position:absolute;left:72px;top:1110px"><span class="cta">${o.cta||'Escríbenos por WhatsApp'}</span></div>`}),
 stmt:(o)=>({th:o.th||'dark',tag:o.tag,body:lab(o.label,o.labT||420)+H(o.title,(o.labT||420)+50,o.fs||120)+(o.sub?P(o.sub,o.subT||960,38):'')}),
 cta:(o)=>({th:'dark',tag:o.tag||'Contacto',body:lab(o.label||'Siguiente paso',420)+H(o.title,470,o.fs||120)+(o.sub?P(o.sub,o.subT||830,38):'')+`<div style="position:absolute;left:72px;top:${o.ctaT||1040}px;color:var(--m)"><span class="pill">${o.cta||'Escríbenos por WhatsApp'}</span></div>`}),
 menu:(o)=>({th:o.th||'light',tag:o.tag,body:lab(o.label,220)+H(o.title,262,96)+`<div class="rows" style="top:430px">${o.items.map((it,j)=>`<div class="rw" style="grid-template-columns:110px 1fr auto;align-items:baseline;padding:24px 0 26px"><div class="n">${String(j+1).padStart(2,'0')}</div><div><div class="tx" style="font-size:58px">${it[0]}</div><div class="sm">${it[1]}</div></div><div class="mono" style="font-size:26px;color:var(--acc);white-space:nowrap;padding-left:20px">${it[2]||''}</div></div>`).join('')}</div>`}),
};
const C={
// FIJOS
que:[
 S.cover({tag:'Qué hacemos',label:'Bahiga · Priego de Córdoba',labT:400,title:'Webs, tiendas online y automatización con <em>IA.</em>',fs:122,sub:'Para comercios y pymes que quieren vender más y perder menos tiempo.',subT:1090}),
 S.menu({th:'dark',tag:'Servicios',label:'Lo que hacemos · precios desde',title:'Cuatro <em>cosas.</em>',items:[['Webs a medida','Que traen clientes.','900 €'],['Tiendas online','Pagos y envíos conectados.','1.000 €'],['Agentes y chatbots','Llamadas y WhatsApp a cualquier hora.','550 €'],['Automatizaciones','Facturas, pedidos y tareas que se repiten.','A medida']]}),
 S.win({label:'Trabajo real · Priego de Córdoba',title:'Pulido <em>Inmobiliaria.</em>',url:'pulidoinmobiliaria.es',img:'caps/pulido-hero.jpg',cap:'Web nueva con catálogo de inmuebles que actualizan ellos mismos y valoración online.'}),
 S.win({label:'Trabajo real · Priego de Córdoba',title:'Reparo<em>Novo.</em>',url:'reparonovo.com',img:'caps/reparonovo-hero.jpg',cap:'Tienda de móviles reacondicionados y reparaciones, con pagos y envíos conectados.'}),
 S.cta({title:'Cuéntanos qué necesitas.',sub:'Te respondemos nosotros, no un formulario. Precios en el post fijado.',fs:120})],
como:[
 S.cover({tag:'Proceso',label:'Cómo trabajamos',title:'Sin sorpresas a mitad de <em>proyecto.</em>',fs:146}),
 S.rows({th:'dark',tag:'Proceso',label:'Paso a paso',title:'Cuatro <em>pasos.</em>',items:[['Una llamada corta','Nos cuentas tu negocio y qué tiene que conseguir.'],['Presupuesto cerrado','Por escrito, con lo que incluye y el plazo.'],['Lo hacemos contigo','Ves avances y opinas antes de que esté terminado.'],['Entrega y formación','Te enseñamos a manejarlo.']]}),
 S.stmt({th:'light',tag:'Proceso',label:'Lo que no cambia',title:'Hablas siempre con quien lo <em>hace.</em>',sub:'Sin comerciales ni intermediarios. Desde Priego de Córdoba, para comercios de Córdoba y del resto de España.'}),
 S.rows({th:'light',tag:'Después',label:'Y después',title:'No te <em>dejamos solo.</em>',items:[['Mantenimiento','Actualizaciones, copias y seguridad cada mes.'],['Cambios','Pequeños ajustes cuando los necesites.'],['Un teléfono','Al que contesta una persona.']]}),
 S.cta({title:'¿Empezamos por la <em>llamada?</em>',sub:'Veinte minutos para entender qué necesitas. Sin compromiso.'})],
precios:[
 S.cover({tag:'Precios',label:'Precios orientativos',title:'Lo que cuesta, <em>sin rodeos.</em>',fs:150,sub:'Todos los precios sin IVA. Cada proyecto lleva presupuesto cerrado.',subT:1060}),
 S.menu({th:'dark',tag:'Precios',label:'Desde',title:'Precios de <em>partida.</em>',items:[['Web a medida','Lista en 3 a 6 semanas.','900 €'],['Tienda online','Pagos, envíos y correos.','1.000 €'],['Agente de voz o chatbot','Funcionando en 2 a 4 semanas.','550 €'],['Habitual','Tarjeta de sellos en el móvil. Pago anual.','19 €/mes']]}),
 S.rows({th:'light',tag:'Precios',label:'Qué significa cerrado',title:'Lo que firmas es lo que <em>pagas.</em>',fs:90,items:[['Precio por escrito','Antes de empezar, con todo lo que incluye.'],['Plazo por escrito','Y lo cumplimos.'],['Sin horas sorpresa','Si algo cambia, lo hablamos antes.']]}),
 S.cta({title:'Pide tu presupuesto.',sub:'Cuéntanos qué necesitas y te decimos cuánto cuesta en un día.',fs:130})],
// FEED
errorweb:[
 S.cover({tag:'Webs',label:'Antes de pedir una web',title:'El error que comete casi todo el mundo al pedir una <em>web.</em>',fs:128}),
 S.stmt({tag:'El error',label:'El error',title:'Empezar por el <em>diseño.</em>',sub:'«Algo moderno, con estos colores, como la web de tal.» Es lo primero que se dice y lo último que importa.'}),
 S.rows({th:'light',tag:'Antes',label:'Antes, tres preguntas',title:'Lo que decide la <em>web.</em>',items:[['¿Qué tiene que pasar?','Una llamada, una reserva, una compra.'],['¿Desde dónde entran?','Casi siempre desde el móvil, y con prisa.'],['¿Quién la actualiza?','Cuando nosotros no estemos.']]}),
 S.stmt({th:'dark',tag:'Después',label:'Con eso claro',title:'El diseño sale casi <em>solo.</em>',sub:'Sin eso, tienes una web bonita que no hace nada.'}),
 S.price({label:'Webs desde',value:'900',cols:[['Precio','+ IVA'],['Presupuesto','Cerrado'],['Plazo','3–6 semanas']],sub:'Empezamos siempre por esas tres preguntas.'})],
tienda:[
 S.cover({tag:'Black Friday',label:'Black Friday · 27 de noviembre',title:'¿Tu tienda online está lista para el Black <em>Friday?</em>',fs:132,sub:'Quedan cuatro semanas. Si ya tienes tienda, aún hay tiempo de revisarla. Si no, la Navidad también cuenta.',subT:1060}),
 S.rows({th:'dark',tag:'Conectado',label:'Lo dejamos conectado',title:'Que el pedido llegue <em>solo.</em>',fs:90,items:[['Pagos con tarjeta','El dinero entra sin que hagas nada.'],['Envíos','Con tu transportista, etiqueta incluida.'],['Correos de cada pedido','Confirmación, envío y entrega.'],['Cuentas de cliente','Historial y repetir compra.']]}),
 S.win({label:'Trabajo real · Priego de Córdoba',title:'Reparo<em>Novo.</em>',url:'reparonovo.com',img:'caps/reparonovo-hero.jpg',cap:'Móviles reacondicionados con garantía, reparaciones y protectores. Todo vendido desde su web.'}),
 S.rows({th:'light',tag:'Black Friday',label:'Antes del 27 de noviembre',title:'Lo que tiene que <em>aguantar.</em>',fs:90,items:[['Picos de visitas','Sin caerse ni ir lenta.'],['Cupones y precios','Programados, sin tocar nada ese día.'],['Pagos y envíos','Probados antes, no durante.']]}),
 S.price({label:'Tiendas desde',value:'1.000',fs:300,cols:[['Precio','+ IVA'],['Presupuesto','Cerrado'],['Incluye','Pagos y envíos']],cta:'Cuéntanos qué vendes'})],
auto:[
 S.cover({tag:'Automatización',label:'Automatización con IA',title:'Tareas que ya no hace nadie a <em>mano.</em>',fs:146}),
 S.rows({th:'dark',tag:'Ejemplos',label:'Lo que ya hemos montado',title:'Tres <em>ejemplos.</em>',items:[['Facturas','Un agente lee cada PDF y deja la tabla lista para la gestoría.'],['Pedidos','De la tienda al envío sin copiar nada.'],['Atención','Llamadas y WhatsApp respondidos fuera de horario.']]}),
 S.stmt({th:'light',tag:'Regla',label:'Una regla sencilla',title:'Si se repite cada semana, se puede <em>automatizar.</em>',fs:110}),
 S.rows({th:'light',tag:'Cómo',label:'Cómo lo hacemos',title:'Primero <em>miramos.</em>',items:[['Vemos cómo trabajas','Una llamada o una visita.'],['Te decimos qué merece la pena','Y qué no.'],['Presupuesto cerrado','Antes de tocar nada.']]}),
 S.cta({title:'¿Qué tarea te quita más <em>tiempo?</em>',sub:'Cuéntanosla y te decimos si se puede automatizar y cuánto costaría.'})],
geo:[
 S.cover({tag:'GEO',label:'Cómo se busca ahora',title:'Pregúntale a ChatGPT por un negocio como el tuyo. ¿<em>Sales?</em>',fs:122}),
 S.stmt({tag:'GEO',label:'Lo que ha cambiado',title:'Una pregunta. Una <em>respuesta.</em>',sub:'Cada vez más gente no compara diez enlaces. Pregunta a la IA y se queda con lo que le dice.'}),
 S.rows({th:'light',tag:'GEO',label:'Para que te recomiende',title:'Tres <em>pasos.</em>',items:[['Que tu web diga qué haces','Qué, dónde y para quién. En texto, no solo en imágenes.'],['Tu ficha de Google, completa','Horarios, fotos, servicios y reseñas recientes.'],['Que otros hablen de ti','Directorios, prensa local, asociaciones.']]}),
 S.stmt({th:'dark',tag:'GEO',label:'Tiene nombre',title:'A esto se le llama <em>GEO.</em>',sub:'Es el SEO de las respuestas de la inteligencia artificial.'}),
 S.cta({title:'¿Vemos si te <em>encuentran?</em>',sub:'Lo comprobamos con tu negocio y tu zona, sin compromiso.'})],
mant:[
 S.cover({th:'dark',tag:'Seguridad',label:'Qué pasa si nadie mira tu web',title:'57.000 intentos de entrar en un <em>WordPress.</em> En 30 días.',fs:120}),
 S.stmt({th:'light',tag:'Seguridad',label:'No iba a por nadie',title:'Era un bot probando <em>contraseñas.</em>',sub:'Como cada día, en miles de webs que nadie está mirando.'}),
 S.rows({th:'dark',tag:'Solución',label:'Lo que lo paró',title:'Nada <em>exótico.</em>',items:[['Reglas en Cloudflare','Que bloquean ese patrón.'],['Límite de intentos','En las entradas expuestas.'],['Alertas','Si el volumen se dispara.']]}),
 S.rows({th:'light',tag:'Mantenimiento',label:'Qué incluye el mantenimiento',title:'Cada <em>mes.</em>',items:[['Actualizaciones','De WordPress, tema y plugins.'],['Copias de seguridad','Para volver atrás si algo falla.'],['Vigilancia','Seguridad y caídas, con avisos.']]}),
 S.cta({title:'¿Alguien vigila tu <em>web?</em>',sub:'La revisamos y te decimos qué falta. Sin compromiso.',cta:'Pide una revisión'})],
faqia:[
 S.cover({tag:'Preguntas',label:'Agentes de voz y chatbots',title:'Lo que nos preguntan antes de poner un agente con <em>IA.</em>',fs:122}),
 S.rows({th:'dark',tag:'Preguntas',label:'Pregunta 01',title:'¿Suena a <em>robot?</em>',fs:96,items:[['Habla con naturalidad','Voz y frases cuidadas.'],['Donde no puede fallar, no improvisa','Precios y condiciones con textos fijos.']]}),
 S.rows({th:'light',tag:'Preguntas',label:'Pregunta 02',title:'¿Y si no sabe <em>algo?</em>',items:[['Lo dice','Sin inventarse la respuesta.'],['Toma nota','Nombre, teléfono y motivo.'],['Te avisa','Para que llames tú.']]}),
 S.rows({th:'dark',tag:'Preguntas',label:'Pregunta 03',title:'¿Cuánto cuesta y <em>tarda?</em>',items:[['Desde 550 € + IVA','Presupuesto cerrado.'],['De 2 a 4 semanas','Con uno o dos canales.'],['Voz, WhatsApp o web','Tú eliges dónde atiende.']]}),
 S.cta({title:'¿Lo vemos para tu <em>negocio?</em>',sub:'Te enseñamos uno funcionando en una llamada.'})],
};
const ST={
 php:{th:'coral',label:'Aviso de seguridad · 21 de octubre',title:'Fallo crítico en PHP. ¿Tu web está <em>al día?</em>',sub:'Afecta a casi todas las webs con WordPress, WooCommerce o PrestaShop. Hay que actualizar a PHP 8.2.35, 8.3.36, 8.4.27 u 8.5.12. Te lo revisamos gratis.',pill:'Escríbenos por WhatsApp'},

 p1:{th:'dark',type:'poll',label:'Pregunta rápida',title:'¿Qué te cuesta más en tu <em>negocio?</em>'},
 p2:{th:'light',type:'poll',label:'Sé sincero',title:'¿Tu web te ha traído algún cliente este <em>mes?</em>'},
 p3:{th:'coral',type:'poll',label:'Pregunta rápida',title:'¿Quién actualiza tu <em>web?</em>'},
 p4:{th:'dark',type:'poll',label:'Pregunta rápida',title:'¿Vendes ya por <em>internet?</em>'},
 p5:{th:'light',type:'poll',label:'Black Friday · 27 de noviembre',title:'¿Vas a hacer algo este Black <em>Friday?</em>'},
 p6:{th:'dark',type:'poll',label:'Fin de trimestre',title:'¿Cuánto tardas en preparar las <em>facturas?</em>'},
 p7:{th:'coral',type:'poll',label:'Haz la prueba',title:'¿Le has preguntado a ChatGPT por tu <em>negocio?</em>'},
 p8:{th:'light',type:'poll',label:'Pregúntanos',title:'Lo que quieras sobre webs, tiendas o <em>IA.</em>',sub:'Respondemos todas, en historias.',subT:820},
 reel:{th:'dark',label:'Nuevo reel',title:'¿Cuántos clientes te trajo tu web este <em>mes?</em>',sub:'Te lo contamos con un caso real. Webs desde 900 € + IVA.',pill:'Míralo en el perfil'},
};
Object.assign(ST,{
 bienvenida:{th:'light',label:'Estrenamos cuenta',title:'La nueva casa de <em>Bahiga.</em>',sub:'Webs, tiendas online e IA para pymes. Es nuestra cuenta nueva: la anterior deja de usarse.',pill:'Echa un vistazo al perfil'},
 webs:{th:'dark',label:'Nuevo reel',title:'¿Cuántos clientes te trajo tu web este <em>mes?</em>',sub:'Te lo contamos con un caso real. Webs desde 900 € + IVA.',pill:'Míralo en el perfil'},
 incluye:{th:'light',label:'Carrusel nuevo',title:'Qué te llevas cuando nos encargas una <em>web.</em>',sub:'Seis cosas, un caso real y el precio.',pill:'Míralo en el perfil'},
 pulido:{th:'dark',type:'case',label:'Trabajo real · Priego de Córdoba',title:'Pulido <em>Inmobiliaria.</em>',img:'caps/pulido-hero.jpg',url:'pulidoinmobiliaria.es',sub:'Web con catálogo de inmuebles que actualizan ellos mismos.',pill:'Pide la tuya por WhatsApp'},
 tienda:{th:'dark',label:'Nuevo reel',title:'Vender online no es subir <em>productos.</em>',sub:'Es que el pedido llegue solo. Tiendas desde 1.000 € + IVA.',pill:'Míralo en el perfil'},
 errorweb:{th:'light',label:'Pregunta rápida',title:'¿Por dónde empezarías tu web <em>nueva?</em>',sub:'Casi todo el mundo dice «por el diseño». Hoy te contamos por qué no.',pill:'Míralo en el perfil'},
 llamadas:{th:'dark',label:'28 de diciembre',title:'La ley de atención al cliente ya tiene <em>fecha.</em>',sub:'Qué significa para tu negocio y cómo no perder llamadas, en el reel de hoy.',pill:'Míralo en el perfil'},
 bf:{th:'coral',label:'Black Friday · 27 de noviembre',title:'Quedan cuatro semanas para el Black <em>Friday.</em>',sub:'¿Tu tienda online aguanta? En el carrusel de hoy, lo que tiene que estar listo.',pill:'Míralo en el perfil'},
 facturas:{th:'light',label:'Verifactu',title:'Verifactu, camino de octubre de <em>2028.</em>',sub:'Hacienda quiere retrasarlo. Te contamos qué hacer mientras tanto en el reel de hoy.',pill:'Míralo en el perfil'},
 reparonovo:{th:'dark',type:'case',label:'Trabajo real · Priego de Córdoba',title:'Reparo<em>Novo.</em>',img:'caps/reparonovo-hero.jpg',url:'reparonovo.com',sub:'Tienda de móviles reacondicionados y reparaciones, con pagos y envíos conectados.',pill:'Pide la tuya por WhatsApp'},
 auto:{th:'light',label:'Carrusel nuevo',title:'Si se repite cada semana, se puede <em>automatizar.</em>',sub:'Tres ejemplos que ya funcionan.',pill:'Míralo en el perfil'},
 geo:{th:'dark',label:'Haz la prueba',title:'Pregunta a ChatGPT por tu sector. ¿<em>Sales?</em>',sub:'Te contamos qué hacer si no apareces.',pill:'Míralo en el perfil'},
 faqia:{th:'light',label:'Preguntas frecuentes',title:'¿Un agente con IA suena a <em>robot?</em>',sub:'Respondemos esa y dos más en el carrusel de hoy.',pill:'Míralo en el perfil'},
 seguridad:{th:'dark',label:'Un dato',title:'57.000 intentos de entrar en un WordPress en 30 <em>días.</em>',sub:'Qué lo paró, en el reel de hoy.',pill:'Míralo en el perfil'},
 geo2:{th:'light',label:'Carrusel nuevo',title:'GEO: el SEO de las respuestas de la <em>IA.</em>',sub:'Tres pasos para que te recomiende.',pill:'Míralo en el perfil'},
 precios:{th:'coral',label:'Precios',title:'Sin rodeos.',sub:'Webs desde 900 €. Tiendas desde 1.000 €. Agentes y chatbots desde 550 €. Todo + IVA, con presupuesto cerrado.',pill:'Escríbenos por WhatsApp'},
 proceso:{th:'light',label:'Nuevo reel',title:'Tu web, en cuatro <em>pasos.</em>',sub:'Y hablando siempre con quien la hace.',pill:'Míralo en el perfil'},
 mant:{th:'dark',label:'Mantenimiento',title:'¿Alguien vigila tu <em>web?</em>',sub:'La revisamos y te decimos qué falta, sin compromiso.',pill:'Pide una revisión'},
 habitual:{th:'light',label:'Lo hemos hecho nosotros',title:'Habitual: la tarjeta de sellos en el <em>móvil.</em>',sub:'Para bares, peluquerías y tiendas. Gratis hasta el 1 de enero para los cinco primeros comercios. Más en @somos.habitual.',pill:'Míralo en el perfil'},
 mudanza:{th:'light',label:'Nos mudamos',title:'Ahora estamos en <em>@bahiga.estudio</em>',sub:'Esta cuenta deja de usarse. Síguenos allí: webs, tiendas online e IA para pymes.',pill:'@bahiga.estudio',handle:'@bahiga.es.old'},
});
const HL={webs:'Webs',tiendas:'Tiendas',ia:'IA',precios:'Precios'};
C.mudanza=[S.stmt({th:'light',tag:'Aviso',label:'Nos mudamos',title:'Ahora estamos en <em>@bahiga.estudio</em>',fs:120,labT:470,sub:'Esta cuenta deja de usarse. Síguenos allí para ver webs, tiendas online e IA para pymes.',subT:900})];
