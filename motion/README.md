# Bahiga · motor de reels e historias

- `webs/`, `php/`, `reparonovo/`: películas Motion Reel (film.js, lib/, fonts/, assets/, beats.json, docs/). Copiar una como plantilla para un reel nuevo.
- Render: desde `motion/`, `npm i` y luego con el skill motion-reel: `node <skill>/scripts/render.mjs --film <dir> --format 9x16 --video-only`, `sfx.mjs`, `mix.mjs`. Música: `uv run <skill>/scripts/beats.py <dir> --synth --flavor house --bpm 110 ...`.
- Límite de subida en Business Suite: <10 MB (recomprimir con ffmpeg 2 pasadas si hace falta).
- `carruseles/`: plantilla de carruseles e historias (carr3.js + render_carr3.py, Playwright Python). Fuentes en node_modules (@fontsource-variable/fraunces, @fontsource/instrument-sans, @fontsource/jetbrains-mono).
- Paleta: tinta #0F1C24, hueso #FAF8F5, coral #E8683C, coral claro #F0A07E. Fraunces + Instrument Sans + JetBrains Mono.
- Historias: Business Suite no permite añadir música; subir como vídeo MP4 de 8–10 s con la música ya incrustada.
- Historias, reglas de diseño: imagen fija, sin zoom ni movimiento de cámara (nada de zoompan). Como mucho una idea: titular de 8 palabras máximo y una línea de apoyo de 12 palabras máximo, sin listas de versiones ni datos técnicos (eso va en el reel). Una llamada a la acción.
- Receta ffmpeg (imagen fija + música): `ffmpeg -loop 1 -framerate 30 -i story.png -ss <inicio> -i music.wav -filter_complex "[0:v]scale=1080:1920,format=yuv420p[v];[1:a]afade=t=in:d=0.3,afade=t=out:st=9.2:d=0.8,loudnorm=I=-16:TP=-1.5[a]" -map "[v]" -map "[a]" -t 10 -c:v libx264 -tune stillimage -c:a aac -b:a 160k story.mp4`
