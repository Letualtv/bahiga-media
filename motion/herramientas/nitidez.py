import sys, torch, numpy as np
from PIL import Image
from spandrel import ModelLoader
m = ModelLoader().load_from_file(sys.argv[1]).eval()
torch.set_num_threads(8)
for src, dst in zip(sys.argv[2::2], sys.argv[3::2]):
    im = Image.open(src).convert('RGB').resize((540, 960), Image.LANCZOS)
    x = torch.from_numpy(np.array(im)).permute(2,0,1).float().div(255).unsqueeze(0)
    T, O = 192, 16
    _, _, h, w = x.shape
    y = torch.zeros(1, 3, h*4, w*4)
    with torch.no_grad():
        for ty in range(0, h, T):
            for tx in range(0, w, T):
                y0, x0 = max(ty-O, 0), max(tx-O, 0)
                y1, x1 = min(ty+T+O, h), min(tx+T+O, w)
                t = m(x[:, :, y0:y1, x0:x1])
                cy, cx = (ty-y0)*4, (tx-x0)*4
                hh, ww = (min(ty+T, h)-ty)*4, (min(tx+T, w)-tx)*4
                y[:, :, ty*4:ty*4+hh, tx*4:tx*4+ww] = t[:, :, cy:cy+hh, cx:cx+ww]
    out = Image.fromarray((y[0].clamp(0,1).permute(1,2,0).numpy()*255).round().astype('uint8'))
    out.resize((1134, 2016), Image.LANCZOS).save(dst, quality=97, subsampling=0)
    print(dst, out.size)
