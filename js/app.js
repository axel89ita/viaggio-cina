/* =========================================================
   App Viaggio in Cina — logica principale
   ========================================================= */
(() => {
"use strict";

/* ---------------- Utilità ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const testoPuro = (s) => String(s ?? "").replace(/<[^>]+>/g, "");
const pad = (n) => String(n).padStart(2, "0");
const isoLocale = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const GIORNI_SETT = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const dataBreve = (s) => { const d = daISO(s); return `${GIORNI_SETT[d.getDay()]} ${d.getDate()} ${MESI[d.getMonth()]}`; };
const fmtDurata = (min) => { min = Math.round(min); const h = Math.floor(min / 60), m = min % 60; return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`; };
const sommaOrario = (hhmm, min) => { const [h, m] = hhmm.split(":").map(Number); const t = h * 60 + m + min; return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`; };
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rnd = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const ICONA_MEZZO = { "a piedi": "🚶", "metro": "🚇", "taxi": "🚕", "bus": "🚌", "treno": "🚄", "aereo": "✈️", "barca": "⛴️", "bici": "🚲" };

/* ---------------- Coordinate (WGS-84 ⇄ GCJ-02) ----------------
   Il GPS dell'iPhone dà WGS-84; Amap usa GCJ-02 (in Cina differiscono di ~300-600 m). */
const GEO = (() => {
  const a = 6378245.0, ee = 0.00669342162296594323, PI = Math.PI;
  const fuori = (lat, lon) => lon < 72.004 || lon > 137.8347 || lat < 0.8293 || lat > 55.8271;
  const tLat = (x, y) => { let r = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x)); r += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3; r += (20 * Math.sin(y * PI) + 40 * Math.sin(y / 3 * PI)) * 2 / 3; r += (160 * Math.sin(y / 12 * PI) + 320 * Math.sin(y * PI / 30)) * 2 / 3; return r; };
  const tLon = (x, y) => { let r = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x)); r += (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3; r += (20 * Math.sin(x * PI) + 40 * Math.sin(x / 3 * PI)) * 2 / 3; r += (150 * Math.sin(x / 12 * PI) + 300 * Math.sin(x / 30 * PI)) * 2 / 3; return r; };
  const delta = (lat, lon) => {
    let dLat = tLat(lon - 105, lat - 35), dLon = tLon(lon - 105, lat - 35);
    const radLat = lat / 180 * PI; let magic = Math.sin(radLat); magic = 1 - ee * magic * magic; const sq = Math.sqrt(magic);
    dLat = (dLat * 180) / ((a * (1 - ee)) / (magic * sq) * PI); dLon = (dLon * 180) / (a / sq * Math.cos(radLat) * PI);
    return [dLat, dLon];
  };
  return {
    wgs2gcj(lat, lon) { if (fuori(lat, lon)) return [lat, lon]; const [a1, b1] = delta(lat, lon); return [lat + a1, lon + b1]; },
    gcj2wgs(lat, lon) { if (fuori(lat, lon)) return [lat, lon]; const [a1, b1] = delta(lat, lon); return [lat - a1, lon - b1]; },
    dist(lat1, lon1, lat2, lon2) { const R = 6371000, r = Math.PI / 180; const dLa = (lat2 - lat1) * r, dLo = (lon2 - lon1) * r; const h = Math.sin(dLa / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); },
  };
})();
const fmtDist = (m) => m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace(".", ",")} km`;

/* ---------------- Stato salvato ---------------- */
const CHIAVE = "viaggio-cina-stato-v1";
const statoBase = () => ({ sbloccato: false, visti: {}, selfie: [], timbroSu: {}, frasarioComicoVisto: false, sfida: { usate: [], giorni: {} }, giornoTest: null, posizione: null, avvisiChiusi: {} });
let S;
try { S = Object.assign(statoBase(), JSON.parse(localStorage.getItem(CHIAVE) || "{}")); } catch { S = statoBase(); }
const salva = () => { try { localStorage.setItem(CHIAVE, JSON.stringify(S)); } catch {} };

/* IndexedDB per il selfie (troppo grande per localStorage) */
const DB = {
  apri() { return new Promise((ok, ko) => { const r = indexedDB.open("viaggio-cina", 1); r.onupgradeneeded = () => r.result.createObjectStore("file"); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); }); },
  async leggi(k) { const db = await this.apri(); return new Promise((ok, ko) => { const r = db.transaction("file").objectStore("file").get(k); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); }); },
  async scrivi(k, v) { const db = await this.apri(); return new Promise((ok, ko) => { const t = db.transaction("file", "readwrite"); t.objectStore("file").put(v, k); t.oncomplete = () => ok(); t.onerror = () => ko(t.error); }); },
  async svuota() { const db = await this.apri(); return new Promise((ok) => { const t = db.transaction("file", "readwrite"); t.objectStore("file").clear(); t.oncomplete = () => ok(); t.onerror = () => ok(); }); },
};

/* ---------------- Dati derivati ---------------- */
const GIORNI = VIAGGIO.giorni;
const TUTTE_TAPPE = [];
GIORNI.forEach((g, gi) => g.tappe.forEach((t, ti) => TUTTE_TAPPE.push(Object.assign(t, { _giorno: gi, _indice: ti, _citta: g.citta }))));
const tappaPerId = (id) => TUTTE_TAPPE.find(t => t.id === id);
const CITTA = [...new Set([...GIORNI.map(g => g.citta), ...VIAGGIO.ristoranti.map(r => r.citta)])];

VIAGGIO.ristoranti.forEach(r => {
  r._vicine = TUTTE_TAPPE
    .map(t => ({ t, d: GEO.dist(r.lat, r.lon, t.lat, t.lon) }))
    .filter(x => x.d <= CONFIG.RAGGIO_RISTORANTI_M)
    .sort((a, b) => a.d - b.d);
});
const ristorantiVicini = (tappa) => VIAGGIO.ristoranti.filter(r => r._vicine.some(x => x.t === tappa));

/** Indice del giorno di viaggio di oggi; -1 = prima della partenza; GIORNI.length = dopo il rientro */
function indiceOggi() {
  if (CONFIG.MODALITA_TEST && S.giornoTest !== null && S.giornoTest !== undefined) return S.giornoTest;
  const oggi = isoLocale();
  const i = GIORNI.findIndex(g => g.data === oggi);
  if (i >= 0) return i;
  if (oggi < GIORNI[0].data) return -1;
  return GIORNI.length;
}
const giornoSfidaChiave = () => { const i = indiceOggi(); return i < 0 ? "pre" : (GIORNI[Math.min(i, GIORNI.length - 1)].data); };

/* ---------------- Interfaccia: elementi comuni ---------------- */
const NUVOLA = `<svg class="nuvola" viewBox="0 0 300 22" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M0 11H110"/><path d="M190 11H300"/><path d="M118 15c-4 0-6-6-1-7 1-5 8-6 10-2 2-4 9-3 9 2 4-1 7 2 5 6"/><path d="M150 11c0-5 6-8 10-5 3-4 10-3 11 2 5-1 8 4 4 7h-21"/><circle cx="150" cy="11" r="2.4" fill="currentColor"/></g></svg>`;

function toast(testo, azioni = [], durata = 5000) {
  const t = $("#toast"); $("#toast-t").innerHTML = testo;
  const az = $("#toast-az"); az.innerHTML = "";
  azioni.forEach(a => { const b = document.createElement("button"); b.className = "btn oro"; b.style.padding = "8px 12px"; b.textContent = a.t; b.onclick = () => { chiudiToast(); a.f(); }; az.appendChild(b); });
  t.classList.add("aperto");
  clearTimeout(toast._t); if (durata) toast._t = setTimeout(chiudiToast, durata);
}
const chiudiToast = () => $("#toast").classList.remove("aperto");

function foglio(html) { $("#foglio").innerHTML = html; $("#velo").classList.add("aperto"); }
const chiudiFoglio = () => $("#velo").classList.remove("aperto");
$("#velo").addEventListener("click", e => { if (e.target.id === "velo" || e.target.closest("[data-chiudi]")) chiudiFoglio(); });

function mostraAiuto() {
  const mappa = { home: ["itinerario", "hotel", "tassista"], itinerario: ["itinerario", "portami", "tassista", "hotel"], mangiare: ["mangiare", "portami"], frasario: ["frasario"], passaporto: ["passaporto"], sfida: ["sfida"] };
  const voci = mappa[vistaCorrente].map(k => AIUTI[k]);
  foglio(voci.map(v => `<h3>${esc(v.t)}</h3><p>${esc(v.d)}</p>`).join("") + `<button class="btn rosso pieno" data-chiudi>Ho capito</button>`);
}
$("#btn-aiuto").onclick = mostraAiuto;

/* ---------------- Schermo intero: tassista e frasi ---------------- */
function schermoIntero(html) {
  const s = $("#schermo-intero"); $("#si-centro").innerHTML = html; s.classList.remove("orizzontale"); s.classList.add("aperto");
  $("#si-ruota").textContent = "↻ Gira in orizzontale";
  adatta();
}
/** Ingrandisce il testo cinese il più possibile senza farlo uscire dallo schermo */
function adatta() {
  const si = $("#schermo-intero");
  const telefonoDiLato = matchMedia("(orientation: landscape)").matches; // telefono girato fisicamente
  const c = $("#si-centro"), oriz = telefonoDiLato || si.classList.contains("orizzontale");
  const grandi = c.querySelectorAll(".grande-cn"), medi = c.querySelectorAll(".medio-cn");
  const corto = Math.min(innerWidth, innerHeight);
  let px = oriz ? corto * 0.30 : Math.min(64, innerWidth * 0.11);
  const prova = () => { grandi.forEach(e => e.style.fontSize = px + "px"); medi.forEach(e => e.style.fontSize = Math.max(16, px * 0.42) + "px"); };
  prova();
  while (px > 22 && (c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1)) { px -= 3; prova(); }
}
$("#si-chiudi").onclick = () => $("#schermo-intero").classList.remove("aperto");
$("#si-ruota").onclick = () => {
  const s = $("#schermo-intero"); const o = s.classList.toggle("orizzontale");
  $("#si-ruota").textContent = o ? "↺ Torna verticale" : "↻ Gira in orizzontale";
  requestAnimationFrame(adatta);
};
// Al cambio di orientamento le misure arrivano con un attimo di ritardo: si riadatta più volte
function riadatta() { if (!$("#schermo-intero").classList.contains("aperto")) return; adatta(); setTimeout(adatta, 250); setTimeout(adatta, 700); }
addEventListener("resize", riadatta);
addEventListener("orientationchange", riadatta);
matchMedia("(orientation: landscape)").addEventListener?.("change", riadatta);

function mostraTassista(luogo) {
  schermoIntero(`
    <div class="richiesta">您好！请带我们去这里：</div>
    <div class="grande-cn">${esc(luogo.nomeCn || luogo.nome)}</div>
    ${luogo.indirizzoCn ? `<div class="medio-cn">${esc(luogo.indirizzoCn)}</div>` : ""}
    ${luogo.telefono ? `<div class="medio-cn">☎ ${esc(luogo.telefono)}</div>` : ""}
    <div class="richiesta">谢谢！</div>
    <div class="sotto">${esc(luogo.nome)}<br>«Buongiorno! Per favore ci porti qui. Grazie!»</div>`);
}

/* ---------------- Navigazione: Amap e Apple Maps ---------------- */
function modoAmap(mezzo) {
  if (mezzo === "a piedi") return { t: 2, web: "walk", apple: "w" };
  if (mezzo === "taxi") return { t: 0, web: "car", apple: "d" };
  if (mezzo === "bici") return { t: 3, web: "ride", apple: "w" };
  return { t: 1, web: "bus", apple: "r" };
}
function apriAmap(luogo, mezzo) {
  const m = modoAmap(mezzo);
  const nome = encodeURIComponent(luogo.nomeCn || luogo.nome);
  const web = `https://uri.amap.com/navigation?to=${luogo.lon},${luogo.lat},${nome}&mode=${m.web}&coordinate=gaode&callnative=1&src=viaggiocina`;
  if (isIOS) {
    const app = `iosamap://path?sourceApplication=viaggiocina&dlat=${luogo.lat}&dlon=${luogo.lon}&dname=${nome}&dev=0&t=${m.t}`;
    let uscito = false;
    const segna = () => { if (document.hidden) uscito = true; };
    document.addEventListener("visibilitychange", segna, { once: true });
    location.href = app;
    setTimeout(() => { if (!uscito && !document.hidden) location.href = web; }, 1600);
  } else {
    window.open(web, "_blank");
  }
}
function apriApple(luogo, mezzo) {
  const m = modoAmap(mezzo);
  const [la, lo] = GEO.gcj2wgs(luogo.lat, luogo.lon);
  const url = `https://maps.apple.com/?daddr=${la.toFixed(6)},${lo.toFixed(6)}&dirflg=${m.apple}&q=${encodeURIComponent(luogo.nome)}`;
  if (isIOS) location.href = url; else window.open(url, "_blank");
}
function bottoniNav(tipo, id, mezzo = "") {
  return `<button class="btn amap" data-nav="amap" data-tipo="${tipo}" data-id="${esc(id)}" data-mezzo="${esc(mezzo)}">🧭 Portami qui · Amap</button>
          <button class="btn apple" data-nav="apple" data-tipo="${tipo}" data-id="${esc(id)}" data-mezzo="${esc(mezzo)}"> Apple Maps</button>`;
}
function luogoDa(tipo, id) {
  if (tipo === "tappa") return tappaPerId(id);
  if (tipo === "hotel") return VIAGGIO.hotel[id];
  if (tipo === "rist") return VIAGGIO.ristoranti[+id];
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-nav]"); if (!b) return;
  const luogo = luogoDa(b.dataset.tipo, b.dataset.id); if (!luogo) return;
  if (b.dataset.nav === "amap") apriAmap(luogo, b.dataset.mezzo);
  else if (b.dataset.nav === "apple") apriApple(luogo, b.dataset.mezzo);
  else if (b.dataset.nav === "taxi") mostraTassista(luogo);
});

function hotelDelGiorno(i) {
  const g = GIORNI[Math.max(0, Math.min(i, GIORNI.length - 1))];
  return g && g.hotel ? { id: g.hotel, ...VIAGGIO.hotel[g.hotel] } : null;
}
function apriHotel(i) {
  const h = hotelDelGiorno(i);
  if (!h) { toast("Per questo giorno non è indicato un hotel."); return; }
  foglio(`<h3>🏨 Torna in hotel</h3>
    <p><b>${esc(h.nome)}</b><br><span class="cn">${esc(h.nomeCn)}</span><br><span class="cn" style="color:var(--inchiostro-2)">${esc(h.indirizzoCn)}</span></p>
    <div style="display:grid;gap:8px">
      ${bottoniNav("hotel", h.id, "taxi")}
      <button class="btn rosso" data-nav="taxi" data-tipo="hotel" data-id="${esc(h.id)}">🚕 Mostra al tassista</button>
      <button class="btn contorno" data-chiudi>Chiudi</button>
    </div>`);
}

/* ---------------- Navigazione tra viste ---------------- */
let vistaCorrente = "home";
let giornoSelezionato = null;
let filtroCibo = null;
const TITOLI = { home: "Viaggio in Cina", itinerario: "Itinerario", mangiare: "Dove mangiare", frasario: "Frasario", passaporto: "Passaporto del Dragone", sfida: "Giuseppe vs Flavia" };

function disegnaBarra() {
  const voci = [["home", "🏮", "Oggi"], ["itinerario", "🗺️", "Viaggio"], ["mangiare", "🥢", "Cibo"], ["frasario", "💬", "Frasi"]];
  if (S.sbloccato) voci.push(["passaporto", "🛂", "Timbri"], ["sfida", "🏆", "Sfida"]);
  $("#barra").innerHTML = voci.map(([v, i, t]) => `<button data-vista="${v}" class="${v === vistaCorrente ? "sel" : ""}"><span class="i">${i}</span>${t}${v === "frasario" && S.sbloccato && !S.frasarioComicoVisto ? `<span class="pallino"></span>` : ""}</button>`).join("");
}
$("#barra").addEventListener("click", e => { const b = e.target.closest("[data-vista]"); if (b) vai(b.dataset.vista); });
document.addEventListener("click", e => { const b = e.target.closest("[data-vai]"); if (b) { chiudiFoglio(); vai(b.dataset.vai, b.dataset.arg); } });

function vai(vista, arg) {
  if ((vista === "passaporto" || vista === "sfida") && !S.sbloccato) vista = "home";
  vistaCorrente = vista;
  if (vista === "itinerario" && arg !== undefined) giornoSelezionato = +arg;
  if (vista === "mangiare") filtroCibo = arg ?? filtroCibo;
  document.querySelectorAll(".vista").forEach(v => v.classList.toggle("attiva", v.id === "v-" + vista));
  $("#titolo-testata").textContent = TITOLI[vista];
  RENDER[vista]();
  disegnaBarra();
  window.scrollTo(0, 0);
}

/* ---------------- HOME ---------------- */
function renderHome() {
  const i = indiceOggi();
  let card;
  if (i < 0) {
    const giorni = Math.ceil((daISO(GIORNI[0].data) - daISO(isoLocale())) / 86400000);
    card = `<div class="oggi"><div class="etichetta">Si parte tra</div>
      <div class="titolo">${giorni} ${giorni === 1 ? "giorno" : "giorni"}</div>
      <div class="info">Primo giorno: ${dataBreve(GIORNI[0].data)} · ${esc(GIORNI[0].citta)}</div>
      <div class="azioni"><button class="btn oro" data-vai="itinerario" data-arg="0">Guarda il programma</button></div></div>`;
  } else if (i >= GIORNI.length) {
    card = `<div class="oggi"><div class="etichetta">Bentornati!</div>
      <div class="titolo">Viaggio concluso</div>
      <div class="info">Speriamo vi siate divertiti. Il programma resta qui per i ricordi.</div>
      <div class="azioni"><button class="btn oro" data-vai="itinerario" data-arg="0">Rivedi il viaggio</button></div></div>`;
  } else {
    const g = GIORNI[i];
    const prossima = g.tappe.find(t => !S.visti[t.id]);
    card = `<div class="oggi"><div class="etichetta">Oggi · Giorno ${i + 1} di ${GIORNI.length} · ${dataBreve(g.data)}</div>
      <div class="titolo">${esc(g.citta)}${g.titolo ? " · " + esc(g.titolo) : ""}</div>
      <div class="info">${prossima ? `Prossima tappa: <b>${esc(prossima.nome)}</b>${prossima.orario ? " alle " + esc(prossima.orario) : ""}` : "Tutte le tappe di oggi sono fatte! 🎉"}</div>
      <div class="azioni">
        <button class="btn oro" data-vai="itinerario" data-arg="${i}">📜 Programma di oggi</button>
        ${prossima ? `<button class="btn chiaro" data-nav="amap" data-tipo="tappa" data-id="${esc(prossima.id)}" data-mezzo="${esc(prossima.spostamento?.mezzo || "")}">🧭 Vai alla prossima</button>` : ""}
      </div></div>`;
  }
  const hi = Math.max(0, Math.min(i, GIORNI.length - 1));
  const sorpresa = S.sbloccato ? `
    <h2 class="sezione">Le vostre sorprese</h2>
    <div class="sorprese">
      <button class="sorpresa-tile" data-vai="passaporto"><div class="ico">🛂</div><div class="n">Passaporto</div></button>
      <button class="sorpresa-tile" data-vai="sfida"><div class="ico">🏆</div><div class="n">La Sfida</div></button>
      <button class="sorpresa-tile" data-vai="frasario"><div class="ico">😂</div><div class="n">Frasi segrete</div></button>
      <button class="sorpresa-tile" id="riascolta"><div class="ico">🎧</div><div class="n">Messaggio colleghi</div></button>
    </div>` : `
    <div class="mistero" id="mistero">
      <div class="lucchetto">🔒</div>
      <div class="t">Sorpresa</div>
      <div class="s">Chiedi ad Alessandro la parola segreta</div>
      <div class="avviso-audio">🔊 <b>Prima di sbloccare:</b> togli il silenzioso e alza il volume, c'è un messaggio da ascoltare!</div>
      <form id="form-segreta" autocomplete="off">
        <input id="parola" type="text" placeholder="Parola segreta…" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="go">
        <button class="btn oro" type="submit">Sblocca</button>
      </form>
      <div class="errore" id="errore-segreta"></div>
    </div>`;
  $("#v-home").innerHTML = `
    <div class="saluto"><div class="grande">Ciao Flavia e Giuseppe!</div><div class="piccolo">一路顺风 · Buon viaggio</div></div>
    ${NUVOLA}
    ${card}
    ${i < 0 ? `<div class="scheda cornice" style="margin-top:14px">
      <b>🧳 Prima di partire: Amap in inglese</b>
      <p style="margin:6px 0 0;font-size:14px">Installate <b>Amap</b> (高德地图) e mettetela in inglese: icona del profilo in basso a destra → ingranaggio in alto a destra → <span class="cn">通用设置</span> (Impostazioni generali) → <span class="cn">语言</span> (Lingua) → <b>English</b>. L'italiano non c'è. Se il telefono è già in inglese, a volte parte in inglese da sola.</p>
    </div>` : ""}
    <h2 class="sezione">Sempre a portata</h2>
    <div class="griglia-2">
      <button class="btn rosso" id="home-hotel">🏨 Torna in hotel</button>
      <button class="btn contorno" id="home-taxi">🚕 Hotel al tassista</button>
      <button class="btn contorno" data-vai="mangiare">🥢 Dove mangiare</button>
      <button class="btn contorno" data-vai="frasario">💬 Frasario</button>
    </div>
    ${sorpresa}
    <div class="pie">Fatta con affetto dai colleghi · v${CONFIG.VERSIONE}</div>`;
  $("#home-hotel").onclick = () => apriHotel(hi);
  $("#home-taxi").onclick = () => { const h = hotelDelGiorno(hi); if (h) mostraTassista(h); };
  const f = $("#form-segreta"); if (f) f.onsubmit = provaSblocco;
  const r = $("#riascolta"); if (r) r.onclick = () => suonaMessaggio(true);
}

/* ---------------- ITINERARIO ---------------- */
function miniMappa(g, gi) {
  const punti = g.tappe.map(t => ({ lat: t.lat, lon: t.lon, n: t._indice + 1, fatto: !!S.visti[t.id], nome: t.nome }));
  const h = g.hotel && VIAGGIO.hotel[g.hotel];
  const tutti = [...punti]; if (h) tutti.push({ lat: h.lat, lon: h.lon });
  let io = null;
  if (S.posizione && gi === indiceOggi()) { const d = GEO.dist(S.posizione.lat, S.posizione.lon, punti[0]?.lat, punti[0]?.lon); if (d < 30000) { io = S.posizione; tutti.push(io); } }
  if (!tutti.length) return "";
  const W = 340, H = 210, P = 26;
  let minLa = Math.min(...tutti.map(p => p.lat)), maxLa = Math.max(...tutti.map(p => p.lat));
  let minLo = Math.min(...tutti.map(p => p.lon)), maxLo = Math.max(...tutti.map(p => p.lon));
  const kx = Math.cos((minLa + maxLa) / 2 * Math.PI / 180);
  let spanX = Math.max((maxLo - minLo) * kx, 0.004), spanY = Math.max(maxLa - minLa, 0.004);
  const scala = Math.min((W - 2 * P) / spanX, (H - 2 * P) / spanY);
  const cx = (minLo + maxLo) / 2, cy = (minLa + maxLa) / 2;
  const X = (lon) => W / 2 + (lon - cx) * kx * scala, Y = (lat) => H / 2 - (lat - cy) * scala;
  const metri = 1000 * scala / 111320; // pixel per 1 km
  const kmBarra = metri > 120 ? 0.5 : metri > 50 ? 1 : metri > 20 ? 2 : metri > 8 ? 5 : 10;
  const linea = punti.map(p => `${X(p.lon).toFixed(1)},${Y(p.lat).toFixed(1)}`).join(" ");
  return `<svg class="mappa-mini" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mappa schematica delle tappe">
    <defs><pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(199,154,44,.18)" stroke-width="1"/></pattern></defs>
    <rect width="${W}" height="${H}" fill="url(#gr)"/>
    <polyline points="${linea}" fill="none" stroke="#c79a2c" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
    ${h ? `<g transform="translate(${X(h.lon)},${Y(h.lat)})"><circle r="11" fill="#1f1a17"/><text y="5" text-anchor="middle" font-size="13">🏨</text></g>` : ""}
    ${punti.map(p => `<g transform="translate(${X(p.lon).toFixed(1)},${Y(p.lat).toFixed(1)})"><rect x="-11" y="-11" width="22" height="22" rx="5" fill="${p.fatto ? "#2f6b5a" : "#b3261e"}" stroke="#fffaf0" stroke-width="2"/><text y="4.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="-apple-system,sans-serif">${p.n}</text></g>`).join("")}
    ${io ? `<g transform="translate(${X(io.lon)},${Y(io.lat)})"><circle r="12" fill="rgba(0,122,255,.2)"/><circle r="6" fill="#007aff" stroke="#fff" stroke-width="2"/></g>` : ""}
    <g transform="translate(${W - 12 - kmBarra * metri},${H - 12})"><rect width="${kmBarra * metri}" height="3" fill="#1f1a17"/><text y="-4" font-size="10" fill="#1f1a17" font-family="-apple-system,sans-serif">${String(kmBarra).replace(".", ",")} km</text></g>
    <text x="10" y="${H - 10}" font-size="10" fill="#5a4f47" font-family="-apple-system,sans-serif">N ↑ · schema indicativo</text>
  </svg>`;
}

function renderItinerario() {
  const oggi = indiceOggi();
  if (giornoSelezionato === null) giornoSelezionato = Math.max(0, Math.min(oggi, GIORNI.length - 1));
  const gi = giornoSelezionato, g = GIORNI[gi];
  const visite = g.tappe.reduce((s, t) => s + (t.durata || 0), 0);
  const spost = g.tappe.reduce((s, t) => s + (t.spostamento?.minuti || 0), 0);
  const inizio = g.tappe.find(t => t.orario)?.orario;
  const chips = GIORNI.map((d, i) => `<button class="chip-giorno ${i === gi ? "sel" : ""} ${i === oggi ? "oggi-chip" : ""}" data-giorno="${i}"><div class="g">G${i + 1}</div><div class="d">${dataBreve(d.data)}</div></button>`).join("");
  const unl = S.sbloccato;
  const tappe = g.tappe.map((t, k) => {
    const fatto = !!S.visti[t.id];
    const vicini = ristorantiVicini(t).length;
    const foto = t.img ? `<div class="foto" style="background-image:url('${esc(t.img)}')">` : `<div class="foto segnaposto"><span>${esc(t.timbro || t.nomeCn?.slice(0, 2) || "")}</span>`;
    return `
      ${t.spostamento ? `<div class="spostamento">${ICONA_MEZZO[t.spostamento.mezzo] || "➜"} ${esc(t.spostamento.mezzo)} · circa ${fmtDurata(t.spostamento.minuti)}${k === 0 ? " dall'hotel" : ""}</div>` : ""}
      <div class="tappa">
        <div class="linea"><div class="num ${fatto ? "fatta" : ""}">${fatto ? "✓" : k + 1}</div>${k < g.tappe.length - 1 ? `<div class="asta"></div>` : ""}</div>
        <div class="corpo"><div class="scheda card-tappa">
          ${foto}${t.orario ? `<div class="orario">🕘 ${esc(t.orario)}</div>` : ""}${fatto ? `<div class="timbrato">${unl ? "TIMBRATO" : "VISITATO"}</div>` : ""}</div>
          <div class="testo">
            <h3>${esc(t.nome)}</h3><div class="nomecn">${esc(t.nomeCn)}</div>
            <div class="meta">⏱ Visita: ${fmtDurata(t.durata || 0)}</div>
            ${t.descrizione ? `<p>${esc(t.descrizione)}</p>` : ""}
            ${t.consiglio ? `<div class="consiglio">💡 ${esc(t.consiglio)}</div>` : ""}
            <div class="azioni-tappa">
              ${bottoniNav("tappa", t.id, t.spostamento?.mezzo)}
              <button class="btn contorno" data-nav="taxi" data-tipo="tappa" data-id="${esc(t.id)}">🚕 Al tassista</button>
              <button class="btn ${fatto ? "giada" : "rosso"}" data-timbra="${esc(t.id)}">${fatto ? "✓ Fatto" : unl ? "🔴 Timbra" : "✅ Visitato"}</button>
            </div>
            ${vicini ? `<button class="mini-link" data-vai="mangiare" data-arg="tappa:${esc(t.id)}">🍜 ${vicini} ${vicini === 1 ? "locale consigliato" : "locali consigliati"} qui vicino</button>` : ""}
          </div>
        </div></div>
      </div>`;
  }).join("");
  const h = g.hotel && VIAGGIO.hotel[g.hotel];
  $("#v-itinerario").innerHTML = `
    <div class="giorni-scroll" id="giorni-scroll">${chips}</div>
    <div class="scheda cornice">
      <div style="font-family:var(--pennello);font-size:26px;color:var(--rosso-scuro);line-height:1.15">Giorno ${gi + 1} · ${esc(g.citta)}</div>
      <div style="color:var(--inchiostro-2);margin-bottom:8px">${dataBreve(g.data)}${g.titolo ? " · " + esc(g.titolo) : ""}</div>
      <div class="riepilogo-giorno">
        <span>📍 <b>${g.tappe.length}</b> tappe</span>
        <span>🏛 Visite <b>${fmtDurata(visite)}</b></span>
        <span>🚶 Spostamenti <b>${fmtDurata(spost)}</b></span>
        <span>⏳ Totale <b>${fmtDurata(visite + spost)}</b>${inizio ? ` (${inizio} → ~${sommaOrario(inizio, visite + spost)})` : ""}</span>
      </div>
      ${g.note ? `<div class="nota-giorno">📌 ${esc(g.note)}</div>` : ""}
      ${miniMappa(g, gi)}
    </div>
    ${tappe}
    ${h ? `<div class="spostamento">🌙 fine giornata</div>
      <div class="scheda"><b>🏨 ${esc(h.nome)}</b><div class="cn" style="color:var(--inchiostro-2)">${esc(h.nomeCn)}</div>
        <button class="btn rosso pieno" style="margin-top:10px" id="itin-hotel">Torna in hotel</button></div>` : ""}`;
  document.querySelectorAll("[data-giorno]").forEach(b => b.onclick = () => { giornoSelezionato = +b.dataset.giorno; renderItinerario(); window.scrollTo(0, 0); });
  const ih = $("#itin-hotel"); if (ih) ih.onclick = () => apriHotel(gi);
  const sel = $(".chip-giorno.sel"); if (sel) sel.scrollIntoView({ inline: "center", block: "nearest" });
}

/* ---------------- Visitato / Timbra ---------------- */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-timbra]"); if (!b) return;
  const t = tappaPerId(b.dataset.timbra);
  if (S.visti[t.id]) {
    foglio(`<h3>${esc(t.nome)}</h3><p>${S.sbloccato ? "Volete togliere il timbro da questa tappa?" : "Volete segnarla come non ancora visitata?"}</p>
      <div style="display:grid;gap:8px"><button class="btn rosso" id="annulla-timbro">${S.sbloccato ? "Togli il timbro" : "Segna come da visitare"}</button><button class="btn contorno" data-chiudi>Lascia così</button></div>`);
    $("#annulla-timbro").onclick = () => { delete S.visti[t.id]; if (S.timbroSu) delete S.timbroSu[t.id]; salva(); PASSAPORTO.invalida(); chiudiFoglio(); RENDER[vistaCorrente](); };
  } else timbra(t);
});

async function timbra(t) {
  let su = null;
  if (S.sbloccato) {
    su = await PASSAPORTO.scegliSelfie(`🔴 Timbro: ${esc(t.nome)}`, PASSAPORTO.selfieRecente());
    if (su === undefined) return; // annullato
  }
  S.visti[t.id] = Date.now();
  if (su) (S.timbroSu ||= {})[t.id] = su;
  salva();
  if (S.sbloccato) {
    const a = document.createElement("div"); a.className = "timbro-anim";
    a.innerHTML = `<div class="s">${esc(t.timbro || "游")}</div>`;
    document.body.appendChild(a);
    if (navigator.vibrate) navigator.vibrate([30, 40, 80]);
    setTimeout(() => a.remove(), 1300);
    PASSAPORTO.invalida();
  }
  RENDER[vistaCorrente]();
  toast(S.sbloccato ? `Timbro di <b>${esc(t.nome)}</b> aggiunto al passaporto!` : `<b>${esc(t.nome)}</b> segnata come visitata ✓`,
    [{ t: "Annulla", f: () => { delete S.visti[t.id]; if (S.timbroSu) delete S.timbroSu[t.id]; salva(); PASSAPORTO.invalida(); RENDER[vistaCorrente](); } }]);
}

/* ---------------- DOVE MANGIARE ---------------- */
function renderMangiare() {
  const oggi = indiceOggi();
  let lista = VIAGGIO.ristoranti.map((r, i) => ({ r, i }));
  let titoloFiltro = "";
  const f = filtroCibo;
  if (f && f.startsWith("tappa:")) {
    const t = tappaPerId(f.slice(6));
    lista = lista.filter(x => x.r._vicine.some(v => v.t === t));
    titoloFiltro = `Vicino a ${t.nome}`;
  } else if (f === "oggi" && oggi >= 0 && oggi < GIORNI.length) {
    const tappeOggi = GIORNI[oggi].tappe;
    lista = lista.filter(x => x.r._vicine.some(v => tappeOggi.includes(v.t)));
  } else if (f && f.startsWith("citta:")) {
    lista = lista.filter(x => x.r.citta === f.slice(6));
  }
  const filtri = [["", "Tutti"]];
  if (oggi >= 0 && oggi < GIORNI.length) filtri.push(["oggi", "📍 Vicini a oggi"]);
  CITTA.forEach(c => filtri.push(["citta:" + c, c]));
  if (titoloFiltro) filtri.push([f, titoloFiltro]);
  // Raggruppa per città
  // I locali scelti da Flavia vengono sempre per primi
  lista.sort((a, b) => (b.r.daFlavia ? 1 : 0) - (a.r.daFlavia ? 1 : 0));
  const perCitta = {};
  lista.forEach(x => (perCitta[x.r.citta] ||= []).push(x));
  $("#v-mangiare").innerHTML = `
    <div class="filtri">${filtri.map(([k, n]) => `<button class="filtro ${(f || "") === k ? "sel" : ""}" data-filtro="${esc(k)}">${esc(n)}</button>`).join("")}</div>
    ${lista.length ? Object.entries(perCitta).map(([c, xs]) => `
      <h2 class="sezione">${esc(c)}</h2>
      ${xs.map(({ r, i }) => `
        <div class="scheda ristorante ${r.daFlavia ? "da-flavia" : ""}">
          <span class="prezzo">${esc(r.prezzo || "")}</span>
          ${r.daFlavia ? `<div class="etichetta-flavia">⭐ Dalla vostra lista</div>` : ""}
          <div class="tipo">${esc(r.tipo || "")}</div>
          <h3>${esc(r.nome)}</h3>
          <div class="cn" style="color:var(--inchiostro-2)">${esc(r.nomeCn)}</div>
          <p style="margin:8px 0">${esc(r.descrizione || "")}</p>
          ${r.consiglio ? `<div class="consiglio">💡 ${esc(r.consiglio)}</div>` : ""}
          ${r._vicine.length ? `<div class="vicino">📍 Vicino a: ${r._vicine.slice(0, 2).map(v => `${esc(v.t.nome)} (G${v.t._giorno + 1}, ${fmtDist(v.d)})`).join(" · ")}</div>` : ""}
          <div class="azioni-tappa">${bottoniNav("rist", i, "a piedi")}<button class="btn contorno largo" data-nav="taxi" data-tipo="rist" data-id="${i}">🚕 Mostra al tassista</button></div>
        </div>`).join("")}`).join("") : `<div class="vuoto">Nessun locale per questo filtro.</div>`}`;
  document.querySelectorAll("[data-filtro]").forEach(b => b.onclick = () => { filtroCibo = b.dataset.filtro || null; renderMangiare(); });
}

/* ---------------- FRASARIO ---------------- */
let voceCinese = null;
function trovaVoce() {
  const v = speechSynthesis.getVoices();
  voceCinese = v.find(x => /zh[-_]CN/i.test(x.lang)) || v.find(x => /^zh/i.test(x.lang)) || null;
}
if ("speechSynthesis" in window) { trovaVoce(); speechSynthesis.onvoiceschanged = trovaVoce; }
function avvisoVoce() {
  toast(isIOS
    ? "Non si sente? 1) Togli il silenzioso e alza il volume. 2) Se ancora niente: Impostazioni → Accessibilità → Contenuti letti → Voci → Cinese, e scarica una voce."
    : "Non si sente? Alza il volume e controlla di avere una voce cinese in Impostazioni → Sintesi vocale.", [], 9000);
}
function parla(testo) {
  if (!("speechSynthesis" in window)) { toast("Questo telefono non supporta la lettura ad alta voce."); return; }
  // iOS: tratta l'audio come "riproduzione", così prova a suonare anche col silenzioso
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}
  const synth = speechSynthesis;
  // Safari a volte perde la frase se si annulla e si riparla nello stesso istante: si annulla solo se serve
  if (synth.speaking || synth.pending) synth.cancel();
  if (!voceCinese) trovaVoce();
  const u = new SpeechSynthesisUtterance(testoPuro(testo).replace(/Cenesi/g, "切内西"));
  u.lang = "zh-CN"; u.rate = 0.85; u.volume = 1; if (voceCinese) u.voice = voceCinese;
  parla.ultima = u; // tiene viva la frase (Safari la può scartare prima di leggerla)
  let partita = false;
  u.onstart = () => { partita = true; };
  u.onerror = (e) => { if (!partita && e.error !== "interrupted" && e.error !== "canceled") avvisoVoce(); };
  synth.speak(u);
  if (synth.paused) synth.resume();
  setTimeout(() => { if (!partita && parla.ultima === u && !synth.speaking) avvisoVoce(); }, 2000);
}
/** Frasi registrate (audio/frasi/N.mp3): suonano anche col silenzioso e su ogni telefono.
    Se il file non c'è si usa la voce sintetica del telefono. */
let audioFrase = null;
function suonaFrase(f) {
  if (typeof AUDIO_FRASI !== "undefined" && AUDIO_FRASI.includes(f.n)) {
    try {
      if (audioFrase) audioFrase.pause();
      audioFrase = new Audio(`audio/frasi/${f.n}.mp3`);
      const p = audioFrase.play();
      if (p && p.catch) p.catch(() => parla(f.cn));
      return;
    } catch {}
  }
  parla(f.cn);
}
function rigaFrase(f) {
  return `<div class="frase" data-frase="${f.n}">
    <div class="txt"><div class="it">${f.it}</div><div class="zh">${f.cn}</div><div class="py">${esc(f.py)}</div>${f.nota ? `<div class="nota-frase">${esc(f.nota)}</div>` : ""}</div>
    <button class="btn-voce" data-parla="${f.n}" aria-label="Ascolta">🔊</button></div>`;
}
function renderFrasario() {
  const sopr = FRASARIO.filter(f => !f.comica), com = FRASARIO.filter(f => f.comica);
  const nuovo = !S.frasarioComicoVisto;
  $("#v-frasario").innerHTML = `
    ${S.sbloccato ? `<div class="blocco-comico"><div class="titolo-comico">😂 Frasario segreto ${nuovo ? `<span class="badge-nuovo">NUOVO</span>` : ""}</div>
      <div style="font-size:13px;color:var(--comico);margin:0 4px 8px">Frasi "di sopravvivenza" da usare con cautela…</div>
      ${com.map(rigaFrase).join("")}</div>` : ""}
    <h2 class="sezione">Sopravvivenza</h2>
    ${sopr.map(rigaFrase).join("")}`;
  if (S.sbloccato && nuovo) { S.frasarioComicoVisto = true; salva(); }
}
document.addEventListener("click", e => {
  const p = e.target.closest("[data-parla]");
  if (p) { e.stopPropagation(); const f = FRASARIO.find(x => x.n === +p.dataset.parla); suonaFrase(f); return; }
  const r = e.target.closest("[data-frase]");
  if (r) {
    const f = FRASARIO.find(x => x.n === +r.dataset.frase);
    schermoIntero(`<div class="grande-cn">${f.cn}</div><div class="sotto" style="font-size:18px">${esc(f.py)}</div><div class="sotto">${f.it}</div>
      <div><button class="btn rosso" data-parla="${f.n}">🔊 Ascolta</button></div>`);
  }
});

/* ---------------- SBLOCCO SORPRESA ---------------- */
let audioColleghi = null;
function suonaMessaggio(daCapo) {
  try {
    // Safari 16.4+: tratta l'audio come "riproduzione" così suona anche con l'interruttore silenzioso
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}
    if (!audioColleghi) audioColleghi = new Audio(CONFIG.AUDIO_COLLEGHI);
    if (daCapo) audioColleghi.currentTime = 0;
    const p = audioColleghi.play(); if (p && p.catch) p.catch(() => toast("Tocca 🎧 per ascoltare il messaggio dei colleghi."));
  } catch {}
}
function provaSblocco(e) {
  e.preventDefault();
  const v = $("#parola").value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  if (v === CONFIG.PAROLA_SEGRETA) {
    suonaMessaggio(true); // il tocco su "Sblocca" vale come permesso audio
    $("#parola").blur();
    S.sbloccato = true; salva();
    mostraFesta();
  } else {
    $("#errore-segreta").textContent = v ? "Parola sbagliata… chiedi ad Alessandro! 😉" : "Scrivi la parola segreta";
    const m = $("#mistero"); m.classList.remove("scuoti"); void m.offsetWidth; m.classList.add("scuoti");
  }
}
function mostraFesta() {
  const f = $("#festa");
  f.innerHTML = `
    <div class="lanterne">🏮🏮🏮</div>
    <div class="t">Sorpresa sbloccata!</div>
    <div style="text-align:center;opacity:.9;max-width:420px">Un regalo dei vostri colleghi per rendere il viaggio ancora più speciale</div>
    <button class="voce" data-vai-festa="passaporto"><span class="ico">🛂</span><span><b>Passaporto del Dragone</b><br>Fatevi un selfie e collezionate i timbri delle attrazioni</span></button>
    <button class="voce" data-vai-festa="sfida"><span class="ico">🏆</span><span><b>Sfida Giuseppe vs Flavia</b><br>Ogni giorno 5 missioni, chi fa più punti vince</span></button>
    <button class="voce" data-vai-festa="frasario"><span class="ico">😂</span><span><b>Frasario segreto</b><br>Nuove frasi "di sopravvivenza" da usare con cautela</span></button>
    <div style="font-size:13px;opacity:.85;margin-top:14px;text-align:center">Non avete sentito niente? Togliete il silenzioso, alzate il volume e premete qui sotto</div>
    <button class="btn oro" id="festa-riascolta" style="margin-top:6px">▶️ Riascolta il messaggio dei colleghi</button>
    <button class="btn chiaro" id="festa-chiudi">Andiamo! 🐉</button>`;
  f.classList.add("aperto");
  coriandoli();
  f.querySelectorAll("[data-vai-festa]").forEach(b => b.onclick = () => { chiudiFesta(); vai(b.dataset.vaiFesta); });
  $("#festa-riascolta").onclick = () => suonaMessaggio(true);
  $("#festa-chiudi").onclick = () => { chiudiFesta(); vai("home"); };
}
const chiudiFesta = () => { $("#festa").classList.remove("aperto"); disegnaBarra(); };

function coriandoli() {
  const c = $("#coriandoli"); c.hidden = false;
  const dpr = window.devicePixelRatio || 1; c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  const x = c.getContext("2d"); x.scale(dpr, dpr);
  const col = ["#c79a2c", "#e9cf85", "#b3261e", "#ff5a4a", "#fff3c4"];
  const P = Array.from({ length: 160 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .35, vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 4, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3, w: 6 + Math.random() * 6, h: 4 + Math.random() * 8, c: col[Math.floor(Math.random() * col.length)] }));
  const t0 = performance.now();
  (function passo(t) {
    x.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => { p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); });
    if (t - t0 < 4500) requestAnimationFrame(passo); else { x.clearRect(0, 0, innerWidth, innerHeight); c.hidden = true; }
  })(t0);
}

/* ---------------- PASSAPORTO DEL DRAGONE ----------------
   Si possono fare più selfie; ogni timbro sta su un selfie scelto. */
const PASSAPORTO = (() => {
  const urls = {}; const tele = {}; let sel = null;
  S.selfie ||= []; S.timbroSu ||= {};
  const caricaImg = (src) => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });
  const nomeSelfie = (s) => `Selfie ${S.selfie.indexOf(s) + 1}`;
  const dataSelfie = (s) => new Date(s.t).toLocaleDateString("it-IT", { day: "numeric", month: "short" });

  // conversione dal vecchio formato (un solo selfie)
  async function migra() {
    if (S.selfie.length) return;
    const vecchio = await DB.leggi("selfie").catch(() => null);
    if (vecchio) { const id = "s" + Date.now(); await DB.scrivi("selfie:" + id, vecchio); S.selfie.push({ id, t: Date.now() }); salva(); }
  }
  /** selfie su cui sta il timbro di una tappa (quelli senza scelta vanno sul primo) */
  function selfieDi(tid) {
    const id = S.timbroSu[tid];
    return S.selfie.find(s => s.id === id) || S.selfie[0] || null;
  }
  const timbriSu = (s) => TUTTE_TAPPE.filter(t => S.visti[t.id] && selfieDi(t.id) === s);

  async function url(s) {
    if (urls[s.id]) return urls[s.id];
    const blob = await DB.leggi("selfie:" + s.id).catch(() => null);
    return (urls[s.id] = blob ? URL.createObjectURL(blob) : null);
  }

  function posizioni(n, W, H, lato) {
    const m = lato * 0.55, perc = [];
    const w = W - 2 * m, h = H - 2 * m, P = 2 * (w + h);
    for (let k = 0; k < n; k++) {
      let d = ((k * 0.618034) % 1) * P, x, y;
      if (d < w) { x = m + d; y = m; } else if ((d -= w) < h) { x = W - m; y = m + d; } else if ((d -= h) < w) { x = W - m - d; y = H - m; } else { d -= w; x = m; y = H - m - d; }
      perc.push([x, y]);
    }
    return perc;
  }
  function disegnaTimbro(ctx, t, x, y, lato, data) {
    const r = rnd(hash(t.id));
    const stile = Math.floor(r() * 3);
    const colore = r() < 0.72 ? "179,38,30" : "35,64,140";
    const ang = (r() - 0.5) * 0.6;
    const chars = [...(t.timbro || t.nomeCn || "游").slice(0, 4)];
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = 0.8;
    const fill = `rgba(${colore},1)`;
    const font = (px) => `${px}px Pennello, "Kaiti SC", STKaiti, serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (stile === 2) {
      const R = lato * 0.5;
      ctx.lineWidth = lato * 0.05; ctx.strokeStyle = fill;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = lato * 0.02; ctx.beginPath(); ctx.arc(0, 0, R * 0.82, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = fill; ctx.font = font(lato * (chars.length > 2 ? 0.24 : 0.32));
      ctx.fillText(chars.join(""), 0, -lato * 0.04);
      ctx.font = `600 ${lato * 0.085}px -apple-system, sans-serif`;
      ctx.fillText(data, 0, lato * 0.25);
      ctx.fillText(String(t._citta || "").toUpperCase(), 0, -lato * 0.28);
    } else {
      const s = lato * 0.86;
      ctx.beginPath();
      for (let k = 0; k < 4; k++) {
        const cx = [-1, 1, 1, -1][k] * s / 2, cy = [-1, -1, 1, 1][k] * s / 2;
        k ? ctx.lineTo(cx + (r() - .5) * 3, cy + (r() - .5) * 3) : ctx.moveTo(cx, cy);
      }
      ctx.closePath();
      if (stile === 0) { ctx.fillStyle = fill; ctx.fill(); } else { ctx.lineWidth = lato * 0.07; ctx.strokeStyle = fill; ctx.stroke(); }
      ctx.fillStyle = stile === 0 ? "rgba(255,248,235,0.95)" : fill;
      const n = chars.length;
      if (n === 4) {
        ctx.font = font(s * 0.4);
        [[1, 0], [1, 1], [0, 0], [0, 1]].forEach(([c, rr], k) => ctx.fillText(chars[k], (c - 0.5) * s * 0.44, (rr - 0.5) * s * 0.44));
      } else if (n === 1) {
        ctx.font = font(s * 0.7); ctx.fillText(chars[0], 0, 0);
      } else {
        ctx.font = font(s * (n === 2 ? 0.42 : 0.29));
        chars.forEach((ch, k) => ctx.fillText(ch, 0, (k - (n - 1) / 2) * s * (n === 2 ? 0.44 : 0.3)));
      }
      ctx.globalCompositeOperation = "destination-out";
      for (let k = 0; k < 40; k++) { ctx.beginPath(); ctx.arc((r() - .5) * s, (r() - .5) * s, r() * lato * 0.02, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }
  async function componi(s) {
    if (tele[s.id]) return tele[s.id];
    const src = await url(s); if (!src) return null;
    await document.fonts.load("40px Pennello").catch(() => {});
    const img = await caricaImg(src);
    const MAX = 1440, k = Math.min(1, MAX / Math.max(img.width, img.height));
    const W = Math.round(img.width * k), H = Math.round(img.height * k);
    const tela = document.createElement("canvas"); tela.width = W; tela.height = H;
    const ctx = tela.getContext("2d");
    ctx.drawImage(img, 0, 0, W, H);
    ctx.strokeStyle = "rgba(199,154,44,.9)"; ctx.lineWidth = W * 0.012; ctx.strokeRect(W * 0.012, W * 0.012, W - W * 0.024, H - W * 0.024);
    const sue = timbriSu(s);
    const n = Math.max(sue.length, 8);
    const lato = Math.max(Math.min(W, H) * 0.15, Math.min(Math.min(W, H) * 0.24, (2 * (W + H)) / n * 0.75));
    const pos = posizioni(sue.length, W, H, lato);
    sue.forEach((t, i) => {
      const d = new Date(S.visti[t.id]);
      disegnaTimbro(ctx, t, pos[i][0], pos[i][1], lato, `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`);
    });
    return (tele[s.id] = tela);
  }

  /** Chiede su quale selfie mettere il timbro (solo se ce n'è più di uno) */
  async function scegliSelfie(titolo, corrente) {
    await migra();
    if (S.selfie.length <= 1) return S.selfie[0]?.id || null;
    const miniature = await Promise.all(S.selfie.map(async s => ({ s, u: await url(s) })));
    return new Promise(ok => {
      foglio(`<h3>${titolo}</h3><p>Su quale selfie volete metterlo?</p>
        <div class="scelta-selfie">${miniature.slice().reverse().map(({ s, u }) => `
          <button data-sceglie="${s.id}" class="${corrente === s.id ? "sel" : ""}">
            <img src="${u}" alt=""><span>${nomeSelfie(s)}<small>${dataSelfie(s)} · ${timbriSu(s).length} timbri</small></span>
          </button>`).join("")}</div>
        <button class="btn contorno pieno" data-chiudi style="margin-top:10px">Annulla</button>`);
      let scelto = null;
      $("#foglio").querySelectorAll("[data-sceglie]").forEach(b => b.onclick = () => { scelto = b.dataset.sceglie; chiudiFoglio(); ok(scelto); });
      const velo = $("#velo");
      const guarda = new MutationObserver(() => { if (!velo.classList.contains("aperto")) { guarda.disconnect(); if (!scelto) ok(undefined); } });
      guarda.observe(velo, { attributes: true, attributeFilter: ["class"] });
    });
  }

  async function render() {
    await migra();
    const el = $("#v-passaporto");
    const timbrati = TUTTE_TAPPE.filter(t => S.visti[t.id]).length, tot = TUTTE_TAPPE.length;
    if (!sel || !S.selfie.find(s => s.id === sel)) sel = S.selfie[S.selfie.length - 1]?.id || null;
    const corrente = S.selfie.find(s => s.id === sel);
    const multi = S.selfie.length > 1;
    const lista = GIORNI.map((g, gi) => `
      <h2 class="sezione">Giorno ${gi + 1} · ${esc(g.citta)}</h2>
      <div class="lista-timbri">${g.tappe.map(t => {
        const su = S.visti[t.id] ? selfieDi(t.id) : null;
        return `
        <div class="riga-timbro ${S.visti[t.id] ? "ok" : ""}">
          <div class="sig">${esc((t.timbro || "").slice(0, 4))}</div>
          <div class="n">${esc(t.nome)}<small>${S.visti[t.id] ? "Timbrato il " + new Date(S.visti[t.id]).toLocaleDateString("it-IT") + (multi && su ? ` · su ${nomeSelfie(su)}` : "") : "Da timbrare"}</small>
            ${S.visti[t.id] && multi ? `<button class="mini-link" data-sposta="${esc(t.id)}">↪ Sposta su un altro selfie</button>` : ""}</div>
          <button class="btn ${S.visti[t.id] ? "giada" : "rosso"}" style="padding:8px 11px" data-timbra="${esc(t.id)}">${S.visti[t.id] ? "✓" : "Timbra"}</button>
        </div>`;
      }).join("")}</div>`).join("");
    const finale = tot && timbrati === tot ? `<div class="titolo-finale"><div style="font-size:40px">👑🐉👑</div><div class="t">Imperatori del Viaggio</div><div>Avete collezionato tutti i ${tot} timbri!</div></div>` : "";
    const galleria = multi ? `<div class="galleria-selfie">${(await Promise.all(S.selfie.map(async s => `
        <button data-selfie="${s.id}" class="${s.id === sel ? "sel" : ""}"><img src="${await url(s)}" alt=""><span>${nomeSelfie(s)}</span></button>`))).join("")}</div>` : "";
    el.innerHTML = corrente ? `
      ${galleria}
      <canvas class="tela-passaporto" id="tela-pass"></canvas>
      <div class="contatore-timbri">${multi ? `${nomeSelfie(corrente)}: ${timbriSu(corrente).length} timbri · ` : ""}${timbrati} / ${tot} in totale</div>
      <div class="griglia-2">
        <button class="btn rosso" id="pass-condividi">📤 Salva / Condividi</button>
        <button class="btn contorno" id="pass-nuovo">📷 Nuovo selfie</button>
      </div>
      ${multi ? `<button class="mini-link" id="pass-elimina" style="display:block;margin:8px auto 0">🗑 Elimina questo selfie</button>` : ""}
      ${finale}
      ${lista}` : `
      <div class="passaporto-copertina">
        <div class="drago">🐉</div><div class="t">Passaporto del Dragone</div>
        <div style="color:var(--oro-chiaro);margin:6px 0 14px">龙之护照</div>
        <p style="color:var(--bianco);font-size:15px">Fatevi un selfie a inizio viaggio (o quando ci sono troppi timbri): a ogni attrazione visitata ci comparirà sopra un timbro, come su un vero passaporto.</p>
        <button class="btn oro pieno" id="pass-selfie">📷 Scatta il selfie</button>
        <div style="color:var(--oro-chiaro);font-size:12px;margin-top:10px">Le foto restano solo su questo telefono.</div>
      </div>
      ${timbrati ? `<p style="text-align:center">Avete già ${timbrati} ${timbrati === 1 ? "timbro" : "timbri"} che aspettano il vostro selfie!</p>` : ""}
      ${lista}`;
    const scatta = () => $("#input-selfie").click();
    const b1 = $("#pass-selfie"); if (b1) b1.onclick = scatta;
    const b2 = $("#pass-nuovo"); if (b2) b2.onclick = () => {
      foglio(`<h3>Nuovo selfie</h3><p>Il selfie attuale resta salvato con i suoi timbri. Sul nuovo potrete mettere i prossimi: quando timbrate vi chiederò su quale selfie metterli.</p>
        <div style="display:grid;gap:8px"><button class="btn rosso" id="conf-nuovo">📷 Scatta</button><button class="btn contorno" data-chiudi>Annulla</button></div>`);
      $("#conf-nuovo").onclick = () => { chiudiFoglio(); scatta(); };
    };
    const b3 = $("#pass-condividi"); if (b3) b3.onclick = () => condividi(corrente);
    const b4 = $("#pass-elimina"); if (b4) b4.onclick = () => {
      foglio(`<h3>Eliminare ${nomeSelfie(corrente)}?</h3><p>La foto verrà cancellata. I suoi timbri non si perdono: passano sul primo selfie rimasto.</p>
        <div style="display:grid;gap:8px"><button class="btn rosso" id="conf-elimina">Elimina</button><button class="btn contorno" data-chiudi>Annulla</button></div>`);
      $("#conf-elimina").onclick = async () => {
        S.selfie = S.selfie.filter(s => s.id !== corrente.id);
        Object.keys(S.timbroSu).forEach(k => { if (S.timbroSu[k] === corrente.id) delete S.timbroSu[k]; });
        salva(); await DB.scrivi("selfie:" + corrente.id, null);
        Object.keys(tele).forEach(k => delete tele[k]); sel = null;
        chiudiFoglio(); render();
      };
    };
    el.querySelectorAll("[data-selfie]").forEach(b => b.onclick = () => { sel = b.dataset.selfie; render(); });
    el.querySelectorAll("[data-sposta]").forEach(b => b.onclick = async () => {
      const t = tappaPerId(b.dataset.sposta);
      const id = await scegliSelfie(`Sposta il timbro di ${esc(t.nome)}`, selfieDi(t.id)?.id);
      if (!id) return;
      S.timbroSu[t.id] = id; salva(); invalida(); sel = id; render();
    });
    if (corrente) {
      const tela = await componi(corrente);
      const c = $("#tela-pass"); if (c && tela) { c.width = tela.width; c.height = tela.height; c.getContext("2d").drawImage(tela, 0, 0); }
    }
  }
  async function condividi(s) {
    const tela = s && await componi(s); if (!tela) return;
    const blob = await new Promise(ok => tela.toBlob(ok, "image/jpeg", 0.9));
    const file = new File([blob], `passaporto-del-dragone-${S.selfie.indexOf(s) + 1}.jpg`, { type: "image/jpeg" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "Passaporto del Dragone" }); } catch {}
    } else {
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
  }
  $("#input-selfie").addEventListener("change", async (e) => {
    const f = e.target.files[0]; if (!f) return;
    await migra();
    let blob = f;
    try {
      const bmp = await createImageBitmap(f, { imageOrientation: "from-image" }).catch(() => createImageBitmap(f));
      const MAX = 1440, k = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
      blob = await new Promise(ok => c.toBlob(ok, "image/jpeg", 0.9));
    } catch {}
    const id = "s" + Date.now();
    await DB.scrivi("selfie:" + id, blob);
    S.selfie.push({ id, t: Date.now() }); salva();
    e.target.value = ""; sel = id;
    render();
    toast(S.selfie.length === 1 ? "Selfie salvato! Ora collezionate i timbri 🐉" : `Nuovo selfie salvato! Quando timbrate potrete scegliere su quale metterlo.`);
  });
  function invalida() { Object.keys(tele).forEach(k => delete tele[k]); }
  return { render, invalida, scegliSelfie, selfieRecente: () => S.selfie[S.selfie.length - 1]?.id || null };
})();

/* ---------------- SFIDA GIUSEPPE vs FLAVIA ---------------- */
function punteggi() {
  const tot = [0, 0];
  const chiave = giornoSfidaChiave();
  let oggi = [0, 0];
  Object.entries(S.sfida.giorni).forEach(([k, g]) => {
    Object.values(g.fatte || {}).forEach(f => { f.forEach((v, i) => { if (v) { tot[i]++; if (k === chiave) oggi[i]++; } }); });
  });
  return { tot, oggi };
}
function estraiMissioni() {
  let libere = MISSIONI.map(m => m.n).filter(n => !S.sfida.usate.includes(n));
  if (libere.length < CONFIG.MISSIONI_AL_GIORNO) { S.sfida.usate = []; libere = MISSIONI.map(m => m.n); }
  const scelte = [];
  while (scelte.length < CONFIG.MISSIONI_AL_GIORNO) { const k = Math.floor(Math.random() * libere.length); scelte.push(libere.splice(k, 1)[0]); }
  S.sfida.usate.push(...scelte);
  return scelte;
}
function titoloVincitore(tot) {
  const [G, F] = CONFIG.GIOCATORI;
  const pt = (n) => `${n} ${n === 1 ? "punto" : "punti"}`;
  if (tot[0] === tot[1]) return ["🤝", "Pareggio!", `${pt(tot[0])} a testa: regnate insieme come Coppia Imperiale`];
  return tot[0] > tot[1] ? ["👑", `Vince ${G}!`, `${pt(tot[0])} contro ${tot[1]}: Imperatore del Viaggio`]
                         : ["👑", `Vince ${F}!`, `${pt(tot[1])} contro ${tot[0]}: Imperatrice del Viaggio`];
}
function svelaVincitore() {
  if (indiceOggi() < GIORNI.length - 1) return;
  const [G, F] = CONFIG.GIOCATORI;
  const { tot } = punteggi();
  const f = $("#festa");
  if (!tot[0] && !tot[1]) { toast("Ancora nessun punto: completate qualche missione prima di svelare il vincitore!"); return; }
  f.innerHTML = `<div class="t" style="margin-top:20vh">Il vincitore è…</div><div class="conta" id="conta">3</div>`;
  f.classList.add("aperto");
  let n = 3;
  const passo = setInterval(() => {
    n--;
    if (n > 0) { $("#conta").textContent = n; $("#conta").style.animation = "none"; void $("#conta").offsetWidth; $("#conta").style.animation = ""; return; }
    clearInterval(passo);
    const tit = titoloVincitore(tot);
    const pari = tot[0] === tot[1];
    S.sfida.svelato = true; salva();
    f.innerHTML = `
      <div class="lanterne">🏮${tit[0]}🏮</div>
      <div class="t">${esc(tit[1])}</div>
      <div class="punteggio-finale">
        <div class="${tot[0] > tot[1] ? "vince" : ""}"><span>${esc(G)}</span><b>${tot[0]}</b></div>
        <div class="vs">对</div>
        <div class="${tot[1] > tot[0] ? "vince" : ""}"><span>${esc(F)}</span><b>${tot[1]}</b></div>
      </div>
      <div style="text-align:center;opacity:.9">${esc(tit[2])}</div>
      <div class="voce" style="display:block;text-align:center"><div style="font-size:32px">😈</div>
        <b>La ricompensa</b><br>${pari ? "Pareggio: ognuno sceglie una penitenza da far fare all'altro! (tipo fare le lavatrici per un mese per entrambi)"
          : `<b>${esc(tot[0] > tot[1] ? G : F)}</b> sceglie una penitenza da far fare a <b>${esc(tot[0] > tot[1] ? F : G)}</b> (tipo fare le lavatrici per un mese per entrambi)`}</div>
      <button class="btn chiaro" id="svela-chiudi" style="margin-top:16px">Chiudi</button>`;
    coriandoli();
    if (navigator.vibrate) navigator.vibrate([60, 60, 120]);
    $("#svela-chiudi").onclick = () => { f.classList.remove("aperto"); renderSfida(); };
  }, 900);
}
function renderSfida() {
  const [G, F] = CONFIG.GIOCATORI;
  const chiave = giornoSfidaChiave();
  const { tot, oggi } = punteggi();
  const g = S.sfida.giorni[chiave];
  const io = indiceOggi();
  const finito = io >= GIORNI.length || (io === GIORNI.length - 1 && new Date().getHours() >= 20);
  const pt = (n) => `${n} ${n === 1 ? "punto" : "punti"}`;
  const corona = (i) => tot[i] > tot[1 - i] ? "👑" : "";
  const etichettaGiorno = chiave === "pre" ? "Prova prima della partenza" : `Giorno ${GIORNI.findIndex(x => x.data === chiave) + 1} · ${dataBreve(chiave)}`;
  let corpo;
  if (!g) {
    corpo = `<div class="scheda sfida-vuota"><div class="ico">🎲</div>
      <p><b>${etichettaGiorno}</b><br>Pronti per le missioni di oggi?</p>
      <button class="btn rosso pieno" id="comincia">🐉 Comincia la sfida</button></div>`;
  } else {
    corpo = `<h2 class="sezione">Missioni di oggi</h2><div style="color:var(--inchiostro-2);margin:-6px 4px 10px;font-size:14px">${etichettaGiorno}</div>` +
      g.missioni.map(n => {
        const m = MISSIONI.find(x => x.n === n), f = g.fatte[n] || [false, false];
        return `<div class="missione"><div class="cat">${ICONE_CATEGORIA[m.cat]} ${esc(m.cat)}</div><div class="t">${esc(m.t)}</div>
          <div class="spunte">${[G, F].map((nome, i) => `<button class="spunta ${f[i] ? "fatta" : ""}" data-spunta="${n}:${i}">${f[i] ? "✓ " : "○ "}${esc(nome)}</button>`).join("")}</div></div>`;
      }).join("") +
      `<div class="nota-giorno" style="margin-top:4px">🌅 Domani qui troverete di nuovo il pulsante "Comincia la sfida" per estrarre 5 missioni nuove. Le missioni di oggi resteranno sotto, nei giorni precedenti, con il loro punteggio.</div>`;
  }
  if (CONFIG.MODALITA_TEST) corpo += `<button class="btn contorno pieno" id="test-dopo" style="margin-top:10px">🧪 Test: passa al giorno successivo</button>`;
  const passati = Object.entries(S.sfida.giorni).filter(([k]) => k !== chiave).sort(([a], [b]) => a < b ? 1 : -1);
  const storico = passati.length ? `<h2 class="sezione">Giorni precedenti</h2>` + passati.map(([k, gg]) => {
    const p = [0, 0]; Object.values(gg.fatte || {}).forEach(f => f.forEach((v, i) => v && p[i]++));
    return `<div class="scheda" style="display:flex;justify-content:space-between;align-items:center"><span>${k === "pre" ? "Prova" : dataBreve(k)}</span><b>${G} ${p[0]} – ${p[1]} ${F}</b></div>`;
  }).join("") : "";
  const PENITENZA = "Il vincitore sceglie una penitenza da far fare al perdente (tipo fare le lavatrici per un mese per entrambi) 😈";
  let finale = "";
  if (S.sfida.svelato && (tot[0] || tot[1])) {
    const tit = titoloVincitore(tot);
    finale = `<div class="titolo-finale"><div style="font-size:40px">${tit[0]}</div><div class="t">${esc(tit[1])}</div><div>${esc(tit[2])}</div>
      <div class="penitenza">${esc(tot[0] === tot[1] ? "Pareggio: ognuno sceglie una penitenza per l'altro! (tipo fare le lavatrici per un mese per entrambi) 😈" : PENITENZA)}</div></div>`;
  }
  const ultimo = GIORNI[GIORNI.length - 1];
  const svelabile = indiceOggi() >= GIORNI.length - 1; // solo dall'ultimo giorno del viaggio
  const svela = svelabile
    ? `<button class="btn-svela" id="svela">🥁 Svela il vincitore</button>`
    : `<button class="btn-svela chiuso" id="svela">🔒 Svela il vincitore<small>Si sblocca l'ultimo giorno del viaggio, ${dataBreve(ultimo.data)}</small></button>`;
  $("#v-sfida").innerHTML = `
    <div class="tabellone">
      <div class="gioc"><div class="corona">${corona(0)}</div><div class="nome">${esc(G)}</div><div class="punti">${tot[0]}</div><div class="oggi-p">oggi +${oggi[0]}</div></div>
      <div class="vs">对</div>
      <div class="gioc"><div class="corona">${corona(1)}</div><div class="nome">${esc(F)}</div><div class="punti">${tot[1]}</div><div class="oggi-p">oggi +${oggi[1]}</div></div>
    </div>
    ${svela}
    ${finale}
    ${corpo}
    ${storico}`;
  $("#svela").onclick = svelabile ? svelaVincitore : () => toast(`Pazienza! Il vincitore si svela l'ultimo giorno del viaggio (${dataBreve(ultimo.data)}) 🐉`);
  const td = $("#test-dopo"); if (td) td.onclick = () => {
    const i = indiceOggi(); S.giornoTest = Math.min((i < 0 ? -1 : i) + 1, GIORNI.length - 1); giornoSelezionato = null; salva(); bannerTest(); renderSfida();
    toast(`Ora è il Giorno ${S.giornoTest + 1}: premete "Comincia la sfida"`);
  };
  const c = $("#comincia"); if (c) c.onclick = () => {
    S.sfida.giorni[chiave] = { missioni: estraiMissioni(), fatte: {} }; salva(); renderSfida();
    toast("5 missioni estratte! Che vinca il migliore 🐉");
  };
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-spunta]"); if (!b) return;
  const [n, i] = b.dataset.spunta.split(":").map(Number);
  const g = S.sfida.giorni[giornoSfidaChiave()];
  const f = g.fatte[n] || [false, false]; f[i] = !f[i]; g.fatte[n] = f; salva();
  if (f[i] && navigator.vibrate) navigator.vibrate(25);
  renderSfida();
});

/* ---------------- Posizione: avviso di arrivo ---------------- */
function controllaArrivo(posGcj) {
  const i = indiceOggi(); if (i < 0 || i >= GIORNI.length) return;
  const chiaveAvv = GIORNI[i].data;
  const vicine = GIORNI[i].tappe
    .filter(t => !S.visti[t.id] && !(S.avvisiChiusi[chiaveAvv] || []).includes(t.id))
    .map(t => ({ t, d: GEO.dist(posGcj.lat, posGcj.lon, t.lat, t.lon) }))
    .filter(x => x.d <= CONFIG.RAGGIO_ARRIVO_M).sort((a, b) => a.d - b.d);
  if (!vicine.length) return;
  const t = vicine[0].t;
  const chiudi = () => { (S.avvisiChiusi[chiaveAvv] ||= []).push(t.id); salva(); };
  toast(S.sbloccato ? `📍 Sei a <b>${esc(t.nome)}</b>! Timbra il passaporto` : `📍 Sei a <b>${esc(t.nome)}</b>!`,
    [{ t: S.sbloccato ? "🔴 Timbra" : "✅ Visitato", f: () => timbra(t) }, { t: "Dopo", f: chiudi }], 12000);
}
function leggiPosizione() {
  const i = indiceOggi();
  if (!("geolocation" in navigator) || i < 0 || i >= GIORNI.length) return;
  navigator.geolocation.getCurrentPosition(p => {
    const [la, lo] = GEO.wgs2gcj(p.coords.latitude, p.coords.longitude);
    S.posizione = { lat: la, lon: lo, t: Date.now() }; salva();
    controllaArrivo(S.posizione);
    if (vistaCorrente === "itinerario") renderItinerario();
  }, () => {}, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) leggiPosizione(); });

/* ---------------- MODALITÀ TEST ---------------- */
function bannerTest() {
  if (!CONFIG.MODALITA_TEST) return;
  const i = indiceOggi();
  const desc = S.giornoTest === null || S.giornoTest === undefined ? "giorno reale" : i < 0 ? "prima della partenza" : i >= GIORNI.length ? "dopo il rientro" : `Giorno ${i + 1}`;
  $("#banner-test").innerHTML = `<div class="banner-test">🧪 MODALITÀ TEST · ${desc}${VIAGGIO.demo ? " · itinerario di prova" : ""}<button id="apri-test">Pannello</button></div>`;
  $("#apri-test").onclick = pannelloTest;
}
function pannelloTest() {
  const opzGiorni = [`<option value="">Data reale di oggi</option>`, `<option value="-1">Prima della partenza</option>`, ...GIORNI.map((g, i) => `<option value="${i}">Giorno ${i + 1} · ${dataBreve(g.data)} · ${esc(g.citta)}</option>`), `<option value="${GIORNI.length}">Dopo il rientro</option>`];
  foglio(`<h3>🧪 Pannello test</h3>
    <p style="font-size:14px">Solo per Alessandro. Prima di mandare il link a Flavia si disattiva in <code>js/config.js</code>.</p>
    <b>Giorno corrente</b>
    <div class="test-riga"><select id="t-giorno">${opzGiorni.join("")}</select></div>
    <b>Simula arrivo a un'attrazione</b>
    <div class="test-riga"><select id="t-tappa">${TUTTE_TAPPE.map(t => `<option value="${esc(t.id)}">G${t._giorno + 1} · ${esc(t.nome)}</option>`).join("")}</select><button class="btn oro" id="t-arriva">Simula</button></div>
    <b>Sorpresa</b>
    <div class="test-riga"><button class="btn contorno" id="t-sblocca">${S.sbloccato ? "Richiudi la sorpresa" : "Sblocca senza password"}</button><button class="btn contorno" id="t-audio">▶️ Prova audio</button></div>
    <b>Dati</b>
    <div class="test-riga"><button class="btn rosso" id="t-azzera">🗑 Azzera tutto (password, selfie, timbri, punteggi)</button></div>
    <button class="btn contorno pieno" data-chiudi>Chiudi</button>`);
  $("#t-giorno").value = S.giornoTest ?? "";
  $("#t-giorno").onchange = (e) => { S.giornoTest = e.target.value === "" ? null : +e.target.value; giornoSelezionato = null; salva(); bannerTest(); vai(vistaCorrente); };
  $("#t-arriva").onclick = () => {
    const t = tappaPerId($("#t-tappa").value);
    S.giornoTest = t._giorno; giornoSelezionato = null;
    if (S.avvisiChiusi[GIORNI[t._giorno].data]) S.avvisiChiusi[GIORNI[t._giorno].data] = [];
    salva(); chiudiFoglio(); bannerTest(); vai(vistaCorrente);
    if (S.visti[t.id]) toast("Questa tappa è già timbrata: toglila prima per riprovare.");
    else controllaArrivo({ lat: t.lat + 0.0005, lon: t.lon });
  };
  $("#t-sblocca").onclick = () => { S.sbloccato = !S.sbloccato; salva(); chiudiFoglio(); if (S.sbloccato) mostraFesta(); vai("home"); };
  $("#t-audio").onclick = () => suonaMessaggio(true);
  $("#t-azzera").onclick = async () => {
    if (!confirm("Azzerare tutto? L'app tornerà come la vedrà Flavia al primo avvio.")) return;
    localStorage.removeItem(CHIAVE); await DB.svuota(); location.reload();
  };
}

/* ---------------- Avvio ---------------- */
const RENDER = { home: renderHome, itinerario: renderItinerario, mangiare: renderMangiare, frasario: renderFrasario, passaporto: () => PASSAPORTO.render(), sfida: renderSfida };

if ("serviceWorker" in navigator) {
  // Quando arriva una versione nuova dell'app, si ricarica da sola (non al primo avvio)
  const giaControllata = !!navigator.serviceWorker.controller;
  let ricaricata = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (giaControllata && !ricaricata) { ricaricata = true; location.reload(); } });
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").then(reg => {
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => {}));
}
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

bannerTest();
vai("home");
leggiPosizione();
})();
