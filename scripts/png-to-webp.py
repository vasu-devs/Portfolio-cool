"""Convert freshly rendered cover PNGs to WebP and delete the PNGs. Usage: png-to-webp.py <dir> <name-filter>"""
import sys, os
from PIL import Image
d, key = sys.argv[1], sys.argv[2]
n = 0
for f in sorted(os.listdir(d)):
    if f.endswith('.png') and key in f:
        src = os.path.join(d, f)
        Image.open(src).convert('RGB').save(src[:-4] + '.webp', 'WEBP', quality=84, method=6)
        os.remove(src); n += 1
print(f'Converted {n} covers to WebP.')
