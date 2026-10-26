# Reel en viñetas de cómic

1. Las cuatro ilustraciones se generan en Canva (generate-image), con la primera como referencia para que el personaje sea el mismo en todas, en los colores de la marca, en vertical 4:5, sin texto y con espacio arriba para el bocadillo.
2. Se colocan en páginas de 1136x1408 de un diseño de Canva y se exportan en JPG. El workflow «Descargar ficheros a medios» las baja a descargas/.
3. comic.json: por viñeta, caja de narración, titular, bocadillo (con «|» para marcar los saltos de línea) y bx (posición horizontal del rabo del bocadillo, de 0 a 1); y el cierre con la oferta y el botón.
4. Duración: 6,5 beats por viñeta y 5 de cierre, a 110 bpm (unos 17 s con cuatro viñetas). Se renderiza sin música: la pone Instagram al publicar.
