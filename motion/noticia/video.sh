#!/bin/bash
# Reel de noticia: las 4 láminas del carrusel en vertical (1080x1920), 4,5 s cada una con fundido.
# La música no va en el vídeo: la pone Instagram del catálogo al publicar (campo «musica» de la cola).
# Uso: bash motion/noticia/video.sh <id>   → media/noticias/<id>-reel.mp4
set -e
ID="$1"; D="$(cd "$(dirname "$0")/../.." && pwd)/media/noticias"
T=4.5; F=0.4
in=(); for n in feed 2 3 4; do in+=(-loop 1 -t $T -i "$D/$ID-$n.jpg"); done
# Cada lámina 4:5 centrada en 9:16 dentro de la zona segura de Instagram, sobre el fondo de marca.
pre=""; for i in 0 1 2 3; do pre+="[$i:v]scale=1080:1350,pad=1080:1920:0:250:color=0x0F1C24,setsar=1,fps=30[v$i];"; done
o1=$(echo "$T - $F" | bc); o2=$(echo "2*($T - $F)" | bc); o3=$(echo "3*($T - $F)" | bc)
ffmpeg -y -loglevel error "${in[@]}" -f lavfi -t $(echo "4*$T-3*$F" | bc) -i anullsrc=r=48000:cl=stereo \
  -filter_complex "${pre}[v0][v1]xfade=transition=fade:duration=$F:offset=$o1[a];[a][v2]xfade=transition=fade:duration=$F:offset=$o2[b];[b][v3]xfade=transition=fade:duration=$F:offset=$o3,format=yuv420p[v]" \
  -map "[v]" -map 4:a -c:v libx264 -preset medium -crf 18 -c:a aac -b:a 128k -shortest -movflags +faststart "$D/$ID-reel.mp4"
echo "media/noticias/$ID-reel.mp4"
