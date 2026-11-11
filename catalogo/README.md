# Catálogo desde redes

Enseña en la web de un negocio lo que publica en Instagram (y, si se quiere, en su página de Facebook), sin que tenga que subirlo dos veces.

- `sincronizar.mjs` lee las publicaciones con la API de Meta, copia las fotos (las direcciones de Meta caducan) y escribe `catalogo.json`.
- `demo.html` es una página de muestra que pinta ese `catalogo.json` con botón «Pedir por WhatsApp».

Del texto de cada publicación sale la ficha: la primera línea es el nombre, «25 €» el precio y «agotado» o «vendido» la retira de la venta. Con `ETIQUETA=catalogo` solo entran las publicaciones que lleven `#catalogo`.

Requisitos: cuenta de Instagram profesional (empresa o creador) que haya autorizado la aplicación, y un identificador de acceso guardado como secreto, nunca en el repositorio. Se programa cada hora en el servidor de la web.
