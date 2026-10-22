import sys
from playwright.sync_api import sync_playwright
jobs=sys.argv[1:]
with sync_playwright() as p:
    b=p.chromium.launch()
    for j in jobs:
        h=1920 if j.startswith(('story-','hl-')) else 1350
        pg=b.new_page(viewport={'width':1080,'height':h})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(f'file:///home/claude/bahiga-ig/carr3.html?{j}');pg.evaluate('document.fonts.ready');pg.wait_for_timeout(350)
        pg.screenshot(path=f'out/v3/{j}.png'); pg.close()
        if errs: print(j,errs)
    b.close()
