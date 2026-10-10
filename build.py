"""Prepara l'app per la pubblicazione.
Da rilanciare ogni volta che cambiano itinerario, immagini o testi:
  pip install fonttools brotli pillow   (una volta sola)
  python build.py
- riduce il font a pennello ai soli caratteri usati (resta leggero)
- genera le icone dell'app
- riscrive sw.js con l'elenco di tutti i file da salvare offline
"""
import hashlib, os, re, sys
from pathlib import Path

RADICE = Path(__file__).parent
FONT_SORGENTE = Path(sys.argv[1]) if len(sys.argv) > 1 else RADICE / "_sorgenti" / "MaShanZheng-Regular.ttf"


URL_FONT = "https://raw.githubusercontent.com/google/fonts/main/ofl/mashanzheng/MaShanZheng-Regular.ttf"


def assicura_font():
    """Scarica il font a pennello (Ma Shan Zheng, licenza OFL) se non c'è ancora."""
    if FONT_SORGENTE.exists():
        return
    import urllib.request
    FONT_SORGENTE.parent.mkdir(parents=True, exist_ok=True)
    print("scarico il font…")
    urllib.request.urlretrieve(URL_FONT, FONT_SORGENTE)


def caratteri_usati():
    testo = ""
    for p in list((RADICE / "js").glob("*.js")) + [RADICE / "index.html", RADICE / "css" / "style.css"]:
        testo += p.read_text(encoding="utf-8")
    base = {chr(c) for c in range(0x20, 0x7F)} | set("àèéìòùÀÈÉÌÒÙ·’‘“”«»–—…°€")
    return "".join(sorted(base | {c for c in testo if ord(c) > 0x2E7F}))


def font():
    from fontTools import subset
    out = RADICE / "fonts" / "pennello.woff2"
    opz = subset.Options(); opz.flavor = "woff2"; opz.layout_features = ["*"]
    f = subset.load_font(str(FONT_SORGENTE), opz)
    s = subset.Subsetter(opz); s.populate(text=caratteri_usati()); s.subset(f)
    subset.save_font(f, str(out), opz)
    print(f"font: {out.stat().st_size // 1024} KB")


def icone():
    from PIL import Image, ImageDraw, ImageFont
    for lato in (180, 192, 512):
        img = Image.new("RGB", (lato, lato), "#7f1d17")
        d = ImageDraw.Draw(img)
        m = lato * 0.12
        d.rounded_rectangle([m, m, lato - m, lato - m], radius=lato * 0.08, fill="#b3261e", outline="#c79a2c", width=max(2, int(lato * 0.025)))
        d.rounded_rectangle([m * 1.55, m * 1.55, lato - m * 1.55, lato - m * 1.55], radius=lato * 0.05, outline="#e9cf85", width=max(1, int(lato * 0.01)))
        f = ImageFont.truetype(str(FONT_SORGENTE), int(lato * 0.52))
        d.text((lato / 2, lato / 2 + lato * 0.02), "旅", font=f, fill="#f6d77a", anchor="mm")
        img.save(RADICE / "icons" / f"icon-{lato}.png")
    print("icone: ok")


def elenco_audio_frasi():
    cartella = RADICE / "audio" / "frasi"
    numeri = sorted(int(p.stem) for p in cartella.glob("*.mp3") if p.stem.isdigit()) if cartella.exists() else []
    (RADICE / "js" / "audio-frasi.js").write_text(
        "/* Generato da build.py: frasi con audio registrato in audio/frasi/ */\nconst AUDIO_FRASI = " + str(numeri) + ";\n", encoding="utf-8")
    print(f"frasi registrate: {len(numeri)}")


def service_worker():
    esclusi = {"build.py", "sw.js", "LEGGIMI.md"}
    file = []
    for p in sorted(RADICE.rglob("*")):
        rel = p.relative_to(RADICE).as_posix()
        if p.is_dir() or rel in esclusi or rel.startswith(("_", ".")):
            continue
        file.append(rel)
    impronta = hashlib.sha1()
    for rel in file:
        impronta.update((RADICE / rel).read_bytes())
    impronta.update(Path(__file__).read_bytes())  # cambia versione anche se cambia solo il service worker
    versione = impronta.hexdigest()[:10]
    elenco = ",\n  ".join(f'"./{f}"' for f in ["", *file] if True).replace('"./"', '"./"')
    sw = f'''/* Generato da build.py — non modificare a mano */
const CACHE = "viaggio-cina-{versione}";
const FILE = [
  {elenco}
];
self.addEventListener("install", e => {{
  // cache: "reload" = scarica sempre dal server, mai dalla memoria temporanea del browser
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILE.map(u => new Request(u, {{ cache: "reload" }})))).then(() => self.skipWaiting()));
}});
self.addEventListener("activate", e => {{
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
}});
self.addEventListener("fetch", e => {{
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {{ ignoreSearch: true }}).then(r => r || fetch(e.request).catch(() => caches.match("./index.html"))));
}});
'''
    (RADICE / "sw.js").write_text(sw, encoding="utf-8")
    dim = sum((RADICE / f).stat().st_size for f in file)
    print(f"service worker: {len(file)} file, {dim / 1024 / 1024:.1f} MB, versione {versione}")


if __name__ == "__main__":
    assicura_font(); elenco_audio_frasi(); font(); icone(); service_worker()
