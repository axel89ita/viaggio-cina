/* Impostazioni generali.
   ⚠️ Prima di mandare il link a Flavia: MODALITA_TEST = false */
const CONFIG = {
  MODALITA_TEST: false,
  PAROLA_SEGRETA: "allodole",
  GIOCATORI: ["Giuseppe", "Flavia"],
  RAGGIO_ARRIVO_M: 300,        // distanza per l'avviso "Sei arrivati a..."
  RAGGIO_RISTORANTI_M: 1500,   // ristoranti considerati "vicini" a una tappa
  MISSIONI_AL_GIORNO: 3,
  GIORNI_SENZA_SFIDA: ["2026-10-16", "2026-11-01"], // giorni dei voli: niente missioni
  SVELA: { data: "2026-10-31", ora: "18:00" }, // "Svela il vincitore": l'ultima sera a Pechino
  AUDIO_COLLEGHI: "audio/messaggio_colleghi.mp3",
  VERSIONE: "1.0.0",
};
