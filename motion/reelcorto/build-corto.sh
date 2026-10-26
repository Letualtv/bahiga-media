#!/bin/bash
# Reel corto (unos 14 s) con la plantilla reelcorto/ y el contenido de reelsnov/<nombre>.json.
cd /home/claude/reels-mr && source env.sh && export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
mkdir -p /home/claude/subidas/v5
i=0; TON=(F A D G C); MODE=(dorian minor dorian minor dorian)
for k in "$@"; do
  F=rc-$k; rm -rf $F; cp -r reelcorto $F; cp reelsnov/$k.json $F/reel.json
  DUR=$(python3 -c "print(round(26*60/110,2))")
  python3 -c "import json;j=json.load(open('$F/film.json'));j.update(title='$k',duration=$DUR,poster=$DUR-2);json.dump(j,open('$F/film.json','w'))"
  uv run $S/scripts/beats.py $F --synth --flavor house --bpm 110 --tonic ${TON[$((i%5))]} --mode ${MODE[$((i%5))]} --drop 2 --duration $DUR --seed $((80+i)) >/dev/null 2>&1
  node $S/scripts/render.mjs --film $F --contact --format 9x16 >/dev/null 2>&1
  node $S/scripts/render.mjs --film $F --format 9x16 --video-only >/dev/null 2>&1
  node $S/scripts/sfx.mjs $F >/dev/null 2>&1; node $S/scripts/mix.mjs $F >/dev/null 2>&1
  ffmpeg -y -loglevel error -i out/$F/final.mp4 -c:v libx264 -b:v 1650k -preset medium -c:a aac -b:a 160k -af "afade=t=out:st=$(python3 -c "print($DUR-0.8)"):d=0.8" -movflags +faststart /home/claude/subidas/v5/reel-corto-$k.mp4
  echo "$k $DUR s $(du -k /home/claude/subidas/v5/reel-corto-$k.mp4 | cut -f1)KB"
  i=$((i+1))
done
