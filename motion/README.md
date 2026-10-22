# Bahiga · motor de reels e historias

- `webs/`, `php/`, `reparonovo/`: películas Motion Reel (film.js, lib/, fonts/, assets/, beats.json, docs/). Copiar una como plantilla para un reel nuevo.
- Render: desde `motion/`, `npm i` y luego con el skill motion-reel: `node <skill>/scripts/render.mjs --film <dir> --format 9x16 --video-only`, `sfx.mjs`, `mix.mjs`. Música: `uv run <skill>/scripts/beats.py <dir> --synth --flavor house --bpm 110 ...`.
- Límite de subida en Business Suite: <10 MB (recomprimir con ffmpeg 2 pasadas si hace falta).
- `carruseles/`: plantilla de carruseles e historias (carr3.js + render_carr3.py, Playwright Python). Fuentes en node_modules (@fontsource-variable/fraunces, @fontsource/instrument-sans, @fontsource/jetbrains-mono).
- Paleta: tinta #0F1C24, hueso #FAF8F5, coral #E8683C, coral claro #F0A07E. Fraunces + Instrument Sans + JetBrains Mono.
- Historias: Business Suite no permite añadir música; subir como vídeo MP4 de 8–10 s con la música ya incrustada.
