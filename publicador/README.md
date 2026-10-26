# Publicador de Bahiga

Publica en Instagram (@bahiga.estudio) y en la página de Facebook bahiga.es con la API oficial de Meta, sin depender de ningún ordenador encendido.

## Cómo funciona

1. Cada pieza (vídeo o imagen) se sube a este repositorio.
2. Se añade una entrada a `cola.json` con su fecha y hora.
3. GitHub Actions (`.github/workflows/publicar.yml`) ejecuta `publicar.mjs` cada 10 minutos y cada vez que cambia la cola. Lo que ya ha llegado a su hora se publica y la entrada se marca como `publicada`, con el enlace.

## Entrada de la cola

```json
{
 "id": "1102-facturas",
 "fecha": "2026-11-02T18:30:00+01:00",
 "redes": ["instagram", "facebook"],
 "tipo": "reel",
 "media": "reel-facturas.mp4",
 "texto": "Texto de la publicación",
 "estado": "pendiente"
}
```

- `fecha`: siempre con zona horaria (`+01:00` en invierno, `+02:00` en verano).
- `tipo`: `reel`, `historia` o `foto`. Las historias no llevan texto: va dentro del vídeo o la imagen.
- `media`: ruta dentro del repositorio o URL pública. En Instagram las imágenes tienen que ser JPEG.
- `ensayo: true`: sube el fichero a Meta y comprueba que lo acepta, pero no publica.
- Estados: `pendiente`, `publicada`, `error` (se reintenta hasta 3 veces) y `ensayo-ok`.
- Si una red ya se publicó y la otra falló, el reintento solo repite la que falló.

## Credenciales

- `META_TOKEN`: secreto del repositorio. Es el token del usuario del sistema «Bahiga Publicador», sin caducidad, en el portfolio de Bahiga. Nunca se imprime ni se guarda en el repositorio.
- Instagram `17841430450985904`, página `1371169526080229`.
- Para revocarlo: Configuración del negocio → Usuarios del sistema → Bahiga Publicador → «Revocar identificadores».
- `meta-comprobar.yml` comprueba el token y guarda en `cuentas.json` los permisos y las cuentas (sin el token).

## Límites de Meta

- Instagram: 100 publicaciones por API cada 24 horas. No se puede editar el texto de algo ya publicado (sí borrarlo). Las historias no admiten stickers ni enlaces.
- Facebook: las historias de vídeo duran como máximo 60 segundos y los reels entre 3 y 90.
- WhatsApp (estados y canal) no tiene API: sigue siendo a mano.
