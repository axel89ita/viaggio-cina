/* ============================================================
   ITINERARIO DEL VIAGGIO
   ⚠️ Questi sono DATI DI PROVA (Pechino, 2 giorni) per testare l'app.
   Verranno sostituiti con l'itinerario reale di Flavia.

   Regole per i dati:
   - Coordinate in sistema GCJ-02 (quello di Amap): copiare lat/lon da Amap.
   - durata = minuti di visita stimati
   - spostamento = come si arriva a questa tappa dalla precedente
   - timbro = 2-4 caratteri cinesi che compaiono nel timbro del Passaporto
   - img = percorso immagine in /img (facoltativa)
   - ristoranti: daFlavia: true = locale trovato da Flavia → sempre in cima,
     con l'etichetta "Dalla vostra lista". Quelli aggiunti da Claude solo come
     complemento, dove la sua lista non copre una zona o una città.
   ============================================================ */

const VIAGGIO = {
  demo: true,
  titolo: "Il viaggio in Cina di Flavia e Giuseppe",
  partenza: "2026-10-20",

  hotel: {
    "pechino-hotel": {
      nome: "Hotel di prova (Wangfujing)",
      nomeCn: "王府井酒店",
      indirizzoCn: "北京市东城区王府井大街",
      lat: 39.9139, lon: 116.4108,
      telefono: "",
    },
  },

  giorni: [
    {
      data: "2026-10-20",
      citta: "Pechino",
      titolo: "Il cuore imperiale",
      hotel: "pechino-hotel",
      note: "Prenotazione Città Proibita obbligatoria online, portare il passaporto.",
      tappe: [
        {
          id: "tiananmen", nome: "Piazza Tian'anmen", nomeCn: "天安门广场",
          indirizzoCn: "北京市东城区东长安街", lat: 39.9055, lon: 116.3976,
          orario: "08:30", durata: 45, timbro: "天安门",
          spostamento: { mezzo: "metro", minuti: 20 },
          descrizione: "La piazza più grande del mondo, davanti alla porta della Città Proibita. Ingresso con controllo passaporto.",
          consiglio: "Arrivate presto: la coda ai controlli cresce in fretta.",
        },
        {
          id: "citta-proibita", nome: "Città Proibita", nomeCn: "故宫博物院",
          indirizzoCn: "北京市东城区景山前街4号", lat: 39.9163, lon: 116.3972,
          orario: "09:30", durata: 180, timbro: "故宫",
          spostamento: { mezzo: "a piedi", minuti: 10 },
          descrizione: "Il palazzo degli imperatori Ming e Qing: 980 edifici, cortili immensi e tetti dorati.",
          consiglio: "Si entra dalla Porta Meridiana (sud) e si esce a nord, proprio davanti a Jingshan.",
        },
        {
          id: "jingshan", nome: "Parco Jingshan", nomeCn: "景山公园",
          indirizzoCn: "北京市西城区景山西街44号", lat: 39.9255, lon: 116.3966,
          orario: "13:00", durata: 60, timbro: "景山",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "La collina artificiale con la vista migliore sui tetti della Città Proibita.",
          consiglio: "Salite al padiglione in cima per la foto panoramica.",
        },
        {
          id: "wangfujing", nome: "Via Wangfujing", nomeCn: "王府井步行街",
          indirizzoCn: "北京市东城区王府井大街", lat: 39.9149, lon: 116.4110,
          orario: "16:00", durata: 120, timbro: "王府井",
          spostamento: { mezzo: "taxi", minuti: 15 },
          descrizione: "La via pedonale dello shopping, con il vicolo degli snack per lo street food.",
          consiglio: "Buon posto per la missione «street food» della Sfida.",
        },
      ],
    },
    {
      data: "2026-10-21",
      citta: "Pechino",
      titolo: "Tempio e hutong",
      hotel: "pechino-hotel",
      tappe: [
        {
          id: "tempio-cielo", nome: "Tempio del Cielo", nomeCn: "天坛公园",
          indirizzoCn: "北京市东城区天坛东里甲1号", lat: 39.8822, lon: 116.4066,
          orario: "08:00", durata: 150, timbro: "天坛",
          spostamento: { mezzo: "metro", minuti: 25 },
          descrizione: "Il complesso dove l'imperatore pregava per il raccolto. Al mattino il parco è pieno di gente che balla e fa tai chi.",
          consiglio: "Perfetto per la missione del parco: unitevi al tai chi!",
        },
        {
          id: "nanluoguxiang", nome: "Hutong di Nanluoguxiang", nomeCn: "南锣鼓巷",
          indirizzoCn: "北京市东城区南锣鼓巷", lat: 39.9370, lon: 116.4033,
          orario: "14:00", durata: 120, timbro: "胡同",
          spostamento: { mezzo: "taxi", minuti: 30 },
          descrizione: "I vicoli tradizionali della vecchia Pechino, con cortili, botteghe e piccoli locali.",
          consiglio: "Perdetevi nei vicoli laterali, più tranquilli di quello principale.",
        },
      ],
    },
  ],

  ristoranti: [
    {
      daFlavia: true,
      nome: "Siji Minfu (anatra laccata)", nomeCn: "四季民福烤鸭店(故宫店)",
      indirizzoCn: "北京市东城区南池子大街11号", citta: "Pechino",
      lat: 39.9118, lon: 116.4031, tipo: "Anatra alla pechinese", prezzo: "€€",
      descrizione: "Una delle anatre laccate più amate dai pechinesi, con vista sulla Città Proibita da alcune sale.",
      consiglio: "C'è sempre coda: prendete il numero e intanto fate un giro.",
    },
    {
      nome: "Vicolo degli snack di Wangfujing", nomeCn: "王府井小吃街",
      indirizzoCn: "北京市东城区王府井大街", citta: "Pechino",
      lat: 39.9136, lon: 116.4105, tipo: "Street food", prezzo: "€",
      descrizione: "Bancarelle di spiedini, dolci e frittelle: ideale per assaggiare un po' di tutto.",
    },
    {
      nome: "Jin Ding Xuan (dim sum)", nomeCn: "金鼎轩(地坛店)",
      indirizzoCn: "北京市东城区和平里西街77号", citta: "Pechino",
      lat: 39.9473, lon: 116.4116, tipo: "Dim sum", prezzo: "€",
      descrizione: "Dim sum aperto quasi sempre, comodo dopo una giornata negli hutong.",
    },
  ],
};
