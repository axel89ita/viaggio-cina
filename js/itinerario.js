/* ============================================================
   ITINERARIO DEL VIAGGIO — 16 ottobre / 1 novembre 2026
   Dall'itinerario di Flavia; Claude ha aggiunto nomi e indirizzi in cinese,
   coordinate, durate, spostamenti, descrizioni e timbri.

   Regole per i dati:
   - Coordinate in sistema GCJ-02 (quello di Amap), prese da Amap.
   - durata = minuti di visita stimati
   - spostamento = come si arriva a questa tappa dalla precedente
     (dalla prima: dall'hotel; "da" sostituisce la scritta "dall'hotel")
   - battutaTassista (facoltativa) = frase in italiano in cima alla schermata "Mostra al tassista"
   - citta (facoltativa) = città della tappa sul timbro, se diversa da quella del giorno
   - timbro = 1-4 caratteri cinesi che compaiono nel timbro del Passaporto
   - ristoranti: daFlavia: true = locale trovato da Flavia → sempre in cima,
     con l'etichetta "Dalla vostra lista". Gli altri li ha aggiunti Claude
     solo dove la sua lista non copre una zona o una città.
   ============================================================ */

const VIAGGIO = {
  demo: false,
  titolo: "Il viaggio in Cina di Flavia e Giuseppe",
  partenza: "2026-10-16",

  hotel: {
    "shanghai": {
      nome: "Campanile Shanghai Natural History Museum",
      nomeCn: "康铂酒店（上海自然博物馆店）",
      indirizzoCn: "上海市静安区南苏州路1455号",
      lat: 31.240083, lon: 121.461599, telefono: "",
    },
    "yangshuo": {
      nome: "The Floral Dreamscape Retreat (Yulong)",
      nomeCn: "The Floral Dreamscape Retreat 民宿",
      indirizzoCn: "广西壮族自治区桂林市阳朔县阳朔镇骥马村92号",
      lat: 24.765810, lon: 110.455520, telefono: "",
    },
    "dreamweaver": {
      nome: "Zhangjiajie Xiangxi Dream Weaver Inn",
      nomeCn: "Xiangxi Dream Weaver Inn 客栈",
      indirizzoCn: "湖南省张家界市永定区官黎坪街道官黎坪社区彭家铺小区A7号",
      lat: 29.106661, lon: 110.478288, telefono: "",
    },
    "wulingyuan": {
      nome: "Easy House Gaoyun Branch",
      nomeCn: "Easy House 民宿（高云店）",
      indirizzoCn: "湖南省张家界市武陵源区画卷路高云小区2组",
      lat: 29.341540, lon: 110.537050, telefono: "",
    },
    "chengdu": {
      nome: "Jiali Hotel Select (Chunxi Road / Taikoo Li)",
      nomeCn: "嘉立精选酒店（成都春熙路太古里店）",
      indirizzoCn: "四川省成都市锦江区三圣街34号",
      lat: 30.649973, lon: 104.080040, telefono: "",
    },
    "xian": {
      nome: "Campanile Xi'an Bell Tower Huimin Street",
      nomeCn: "康铂酒店（西安钟楼店）",
      indirizzoCn: "陕西省西安市碑林区西大街正学街8号",
      lat: 34.257695, lon: 108.942270, telefono: "",
    },
    "pechino": {
      nome: "base-Beijing Sanlitun Serviced Apartment",
      nomeCn: "base 三里屯服务式公寓",
      indirizzoCn: "北京市朝阳区工体北路幸福一村10巷2号",
      lat: 39.935190, lon: 116.445890, telefono: "",
    },
  },

  giorni: [
    /* ---------------- 16 ottobre · Roma → Pechino ---------------- */
    {
      data: "2026-10-16", citta: "Roma → Pechino", titolo: "Si parte!",
      note: "Volo Air China CA 940 · Fiumicino Terminal 3 alle 20:30 → Pechino Capital T3 alle 12:45 del 17. Codici di prenotazione nella mail di conferma. Al check-in chiedete se il bagaglio arriva direttamente a Shanghai: in Cina spesso va ritirato al primo aeroporto per la dogana e riconsegnato.",
      tappe: [
        {
          id: "fiumicino", citta: "Roma", nome: "Aeroporto di Fiumicino, Terminal 3", nomeCn: "罗马菲乌米奇诺机场",
          indirizzoCn: "罗马菲乌米奇诺机场 3号航站楼", lat: 41.8004, lon: 12.2387,
          battutaTassista: "Nel caso beccaste un tassista cinese, raro ma non impossibile… ormai sono ovunque! 😄",
          orario: "18:00", durata: 150, timbro: "出发",
          descrizione: "Volo Air China CA 940 per Pechino, partenza alle 20:30. Il viaggio comincia!",
          consiglio: "Arrivate 2 ore e mezza prima. Prima di decollare: Amap installata e messa in inglese.",
        },
      ],
    },

    /* ---------------- 17 ottobre · arrivo a Shanghai ---------------- */
    {
      data: "2026-10-17", citta: "Shanghai", titolo: "Benvenuti a Shanghai",
      hotel: "shanghai",
      note: "Scalo a Pechino: arrivo 12:45 (T3), poi volo CA 1515 alle 15:45 → Shanghai Hongqiao T2 alle 18:10. Dall'aeroporto all'hotel: Didi oppure metro (linea 2 verde verso Pudong, cambio a West Nanjing Road sulla linea 13, scendete a Natural History Museum, uscita 3, poi 8 minuti a piedi · 40–50 minuti in tutto).",
      tappe: [
        {
          id: "hongqiao", nome: "Aeroporto di Shanghai Hongqiao T2", nomeCn: "上海虹桥国际机场T2航站楼",
          indirizzoCn: "上海市闵行区申达一路 虹桥机场2号航站楼", lat: 31.193496, lon: 121.324181,
          orario: "18:10", durata: 30, timbro: "上海",
          spostamento: { mezzo: "aereo", minuti: 145, da: "da Pechino (volo CA 1515)" },
          descrizione: "Arrivo a Shanghai. Da qui all'hotel: Didi (circa 30–40 minuti) oppure metro.",
          consiglio: "Metro: linea 2 (verde) direzione Pudong → West Nanjing Road (南京西路) → linea 13 → Natural History Museum (自然博物馆), uscita 3. Se arrivate al Terminal 1 invece passa la linea 10.",
        },
        {
          id: "nanjing-road", nome: "Nanjing Road", nomeCn: "南京路步行街",
          indirizzoCn: "上海市黄浦区南京东路558号", lat: 31.235983, lon: 121.479494,
          orario: "20:00", durata: 45, timbro: "南京路",
          spostamento: { mezzo: "taxi", minuti: 50, da: "dall'aeroporto, passando per l'hotel" },
          descrizione: "La via pedonale dello shopping più famosa della Cina, tutta insegne al neon.",
          consiglio: "Percorretela verso est: finisce proprio sul Bund.",
        },
        {
          id: "bund-sera", nome: "Bund illuminato", nomeCn: "外滩观景平台",
          indirizzoCn: "上海市黄浦区中山东一路", lat: 31.240821, lon: 121.490926,
          orario: "21:00", durata: 45, timbro: "外滩",
          spostamento: { mezzo: "a piedi", minuti: 15 },
          descrizione: "Il lungofiume con i palazzi coloniali illuminati, davanti ai grattacieli di Pudong.",
          consiglio: "Le luci dei palazzi si spengono verso le 22:00–23:00: meglio non arrivare troppo tardi.",
        },
        {
          id: "skyline-sera", nome: "Skyline di Pudong", nomeCn: "外滩（看陆家嘴夜景）",
          indirizzoCn: "上海市黄浦区中山东一路 外滩", lat: 31.234028, lon: 121.492960,
          orario: "21:45", durata: 30, timbro: "浦东",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "La Oriental Pearl Tower, la Shanghai Tower e gli altri grattacieli di Lujiazui riflessi nel fiume Huangpu.",
          consiglio: "La vista più famosa è proprio da qui, dal Bund. Per andare sull'altra sponda: metro linea 2 fino a Lujiazui, oppure il traghetto.",
        },
      ],
    },

    /* ---------------- 18 ottobre · Shanghai ---------------- */
    {
      data: "2026-10-18", citta: "Shanghai", titolo: "Dalla Concessione Francese alla Città Vecchia",
      hotel: "shanghai",
      tappe: [
        {
          id: "concessione-francese", nome: "Ex Concessione Francese", nomeCn: "武康大楼",
          indirizzoCn: "上海市徐汇区淮海中路1850号", lat: 31.204430, lon: 121.438278,
          orario: "09:30", durata: 150, timbro: "法租界",
          spostamento: { mezzo: "metro", minuti: 30 },
          descrizione: "Viali alberati di platani, ville anni '30, caffè e boutique. Il punto di partenza più fotografato è il Wukang Mansion, il palazzo a forma di prua.",
          consiglio: "Passeggiate su Wukang Road e Anfu Road: è la Shanghai più rilassata.",
        },
        {
          id: "xintiandi", nome: "Xintiandi", nomeCn: "上海新天地",
          indirizzoCn: "上海市黄浦区太仓路181弄", lat: 31.220484, lon: 121.474465,
          orario: "12:30", durata: 90, timbro: "新天地",
          spostamento: { mezzo: "taxi", minuti: 20 },
          descrizione: "Case tradizionali shikumen in mattoni grigi trasformate in ristoranti, bar e negozi.",
          consiglio: "Buon posto per pranzo; la vicina Wei Xiang Zhai di Yandang Road è nella vostra lista.",
        },
        {
          id: "bund-giorno", nome: "Bund", nomeCn: "外滩",
          indirizzoCn: "上海市黄浦区中山东一路", lat: 31.240821, lon: 121.490926,
          orario: "14:30", durata: 60, timbro: "黄浦江",
          spostamento: { mezzo: "metro", minuti: 20 },
          descrizione: "Di giorno si apprezzano meglio le facciate dei palazzi storici delle banche e degli hotel degli anni '20.",
          consiglio: "Da qui a Pudong: metro linea 2 (East Nanjing Road → Lujiazui), una fermata.",
        },
        {
          id: "pudong", nome: "Pudong skyline", nomeCn: "东方明珠广播电视塔",
          indirizzoCn: "上海市浦东新区世纪大道1号", lat: 31.239703, lon: 121.499718,
          orario: "16:00", durata: 90, timbro: "陆家嘴",
          spostamento: { mezzo: "metro", minuti: 15 },
          descrizione: "Lujiazui visto da sotto: la Oriental Pearl Tower, la Shanghai Tower (632 m) e il \"cavatappi\" dello Shanghai World Financial Center.",
          consiglio: "Il percorso sopraelevato pedonale collega tutte le torri. Al tramonto la vista sul Bund è bellissima.",
        },
        {
          id: "yuyuan", nome: "Yu Garden", nomeCn: "上海豫园",
          indirizzoCn: "上海市黄浦区福佑路168号", lat: 31.227714, lon: 121.492497,
          orario: "18:30", durata: 90, timbro: "豫园",
          spostamento: { mezzo: "taxi", minuti: 20 },
          descrizione: "Il giardino classico dei Ming e, tutto intorno, il bazar con tetti a pagoda e lanterne.",
          consiglio: "Il giardino interno chiude verso le 16:30–17:00: la sera si visita il bazar illuminato, bellissimo da fuori. Il ponte a zig-zag e la casa da tè sul laghetto sono il punto per la foto.",
        },
        {
          id: "old-town", nome: "Old Town e Tempio del Dio della Città", nomeCn: "上海城隍庙",
          indirizzoCn: "上海市黄浦区方浜中路249号", lat: 31.225879, lon: 121.492466,
          orario: "20:00", durata: 60, timbro: "城隍庙",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "Il cuore della vecchia Shanghai: vicoli, botteghe di snack e il tempio taoista del protettore della città.",
          consiglio: "Lo xiaolongbao di Nanxiang è qui accanto: c'è sempre coda, ma scorre.",
        },
      ],
    },

    /* ---------------- 19 ottobre · Suzhou ---------------- */
    {
      data: "2026-10-19", citta: "Suzhou", titolo: "Giardini e canali di Suzhou",
      hotel: "shanghai",
      note: "Treni: andata G7004 Shanghai 08:00 → Suzhou 08:25 · ritorno G7235 Suzhou 19:25 → Shanghai 19:50. Serve il passaporto. L'Humble Administrator's Garden va prenotato online in anticipo (con il passaporto): i posti finiscono.",
      tappe: [
        {
          id: "stazione-shanghai", citta: "Shanghai", nome: "Stazione di Shanghai", nomeCn: "上海站",
          indirizzoCn: "上海市静安区秣陵路303号", lat: 31.249650, lon: 121.455768,
          orario: "07:15", durata: 45, timbro: "上海站",
          spostamento: { mezzo: "taxi", minuti: 15 },
          descrizione: "Treno G7004 delle 08:00 per Suzhou (25 minuti).",
          consiglio: "Contate 30–40 minuti per controllo passaporto, sicurezza e ricerca del binario.",
        },
        {
          id: "zhuozheng", nome: "Humble Administrator's Garden", nomeCn: "拙政园",
          indirizzoCn: "江苏省苏州市姑苏区东北街178号", lat: 31.324194, lon: 120.629211,
          orario: "09:00", durata: 120, timbro: "拙政园",
          spostamento: { mezzo: "treno", minuti: 40, da: "da Shanghai (treno + 15 minuti di taxi dalla stazione di Suzhou)" },
          descrizione: "Il più grande e famoso giardino classico di Suzhou, patrimonio UNESCO: laghetti, padiglioni, ponti e finestre che incorniciano il paesaggio.",
          consiglio: "Arrivate all'apertura, prima dei gruppi. Dalla stazione: taxi 15 minuti oppure metro linea 4 fino a Beisita.",
        },
        {
          id: "pingjiang", nome: "Pingjiang Road", nomeCn: "平江路",
          indirizzoCn: "江苏省苏州市姑苏区平江路", lat: 31.313969, lon: 120.634556,
          orario: "11:30", durata: 120, timbro: "平江路",
          spostamento: { mezzo: "a piedi", minuti: 20 },
          descrizione: "Una strada pedonale lungo il canale, con case bianche, ponticelli di pietra, sale da tè e botteghe.",
          consiglio: "Pranzo: lo Yaba Shengjian della vostra lista (sede di Lindun Road) è a pochi passi.",
        },
        {
          id: "canali-suzhou", nome: "Canali in barca", nomeCn: "平江路手摇船码头",
          indirizzoCn: "江苏省苏州市姑苏区平江路 平江历史文化街区手摇船码头", lat: 31.318665, lon: 120.632590,
          orario: "13:30", durata: 45, timbro: "水乡",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "La \"Venezia d'Oriente\" vista dall'acqua, su una barca a remi tradizionale.",
          consiglio: "Il molo con la biglietteria è lungo Pingjiang Road. Qualche barcaiolo canta durante il giro.",
        },
        {
          id: "shantang", nome: "Shantang Street", nomeCn: "七里山塘",
          indirizzoCn: "江苏省苏州市姑苏区山塘街177号", lat: 31.317059, lon: 120.602105,
          orario: "15:00", durata: 120, timbro: "山塘",
          spostamento: { mezzo: "taxi", minuti: 20 },
          descrizione: "La strada lungo il canale che portava alla collina della Tigre: lanterne rosse, snack e case sull'acqua.",
          consiglio: "Il tratto più bello è il primo, vicino a Shantang Bridge. Al tramonto si accendono le lanterne.",
        },
        {
          id: "centro-suzhou", nome: "Centro storico di Suzhou", nomeCn: "观前街",
          indirizzoCn: "江苏省苏州市姑苏区观前街", lat: 31.310624, lon: 120.625637,
          orario: "17:15", durata: 75, timbro: "姑苏",
          spostamento: { mezzo: "taxi", minuti: 15 },
          descrizione: "Guanqian Street, la via pedonale del centro antico, con il tempio taoista Xuanmiao Guan.",
          consiglio: "Qui c'è Song He Lou, famoso per il pesce \"scoiattolo\" in agrodolce: buona cena prima del treno.",
        },
        {
          id: "stazione-suzhou", nome: "Stazione di Suzhou", nomeCn: "苏州站",
          indirizzoCn: "江苏省苏州市姑苏区苏站路27号", lat: 31.329683, lon: 120.610870,
          orario: "18:45", durata: 40, timbro: "苏州",
          spostamento: { mezzo: "taxi", minuti: 20 },
          descrizione: "Treno G7235 delle 19:25 per Shanghai (arrivo 19:50).",
          consiglio: "Arrivate almeno 30 minuti prima per i controlli.",
        },
      ],
    },

    /* ---------------- 20 ottobre · Shanghai → Yangshuo ---------------- */
    {
      data: "2026-10-20", citta: "Shanghai → Yangshuo", titolo: "Verso le montagne carsiche",
      hotel: "yangshuo",
      note: "Volo Shanghai Airlines FM9367 · Pudong T1 11:10 → Guilin Liangjiang T2 13:40. Impression Liu Sanjie alle 19:30, area B2 (2 biglietti): ritirateli all'\"online ticket collection office\" di fronte all'ingresso del teatro, 60 minuti prima, con il numero di telefono o il numero d'ordine (è nella mail di conferma).",
      tappe: [
        {
          id: "pudong-aeroporto", citta: "Shanghai", nome: "Aeroporto di Shanghai Pudong T1", nomeCn: "上海浦东国际机场1号航站楼",
          indirizzoCn: "上海市浦东新区机场镇纬一路100号", lat: 31.149217, lon: 121.802352,
          orario: "09:00", durata: 120, timbro: "启程",
          spostamento: { mezzo: "taxi", minuti: 60 },
          descrizione: "Volo FM9367 delle 11:10 per Guilin.",
          consiglio: "Dall'hotel partite verso le 8:00: con il traffico il taxi può metterci più di un'ora.",
        },
        {
          id: "guilin-aeroporto", citta: "Guilin", nome: "Aeroporto di Guilin Liangjiang T2", nomeCn: "桂林两江国际机场T2航站楼",
          indirizzoCn: "广西壮族自治区桂林市临桂区两江镇", lat: 25.210097, lon: 110.049933,
          orario: "13:40", durata: 30, timbro: "桂林",
          spostamento: { mezzo: "aereo", minuti: 150, da: "da Shanghai (volo FM9367)" },
          descrizione: "Arrivo a Guilin. Da qui Didi fino all'hotel di Yangshuo (circa 1 ora e mezza).",
          consiglio: "Mostrate al tassista l'indirizzo dell'hotel (pulsante qui sotto o \"Hotel al tassista\").",
        },
        {
          id: "hotel-yangshuo", nome: "Check-in all'hotel di Yangshuo", nomeCn: "The Floral Dreamscape Retreat 民宿",
          indirizzoCn: "广西壮族自治区桂林市阳朔县阳朔镇骥马村92号", lat: 24.765810, lon: 110.455520,
          orario: "15:30", durata: 30, timbro: "阳朔",
          spostamento: { mezzo: "taxi", minuti: 90, da: "dall'aeroporto" },
          descrizione: "The Floral Dreamscape Retreat, nella campagna lungo il fiume Yulong.",
          consiglio: "L'hotel è fuori città: per West Street serve un taxi di circa 20 minuti.",
        },
        {
          id: "west-street", nome: "Yangshuo e West Street", nomeCn: "阳朔西街",
          indirizzoCn: "广西壮族自治区桂林市阳朔县西街", lat: 24.773869, lon: 110.493986,
          orario: "16:15", durata: 120, timbro: "西街",
          spostamento: { mezzo: "taxi", minuti: 20 },
          descrizione: "La via più vivace di Yangshuo: lastricato di pietra, negozi, bar e la vista sui pinnacoli carsici in fondo alla strada.",
          consiglio: "Assaggiate il pesce alla birra, piatto tipico di Yangshuo.",
        },
        {
          id: "liu-sanjie", nome: "Impression Liu Sanjie", nomeCn: "印象·刘三姐",
          indirizzoCn: "广西壮族自治区桂林市阳朔县 印象·刘三姐网络取票处（阳朔画中游酒店东北门旁）", lat: 24.765432, lon: 110.506111,
          orario: "18:30", durata: 130, timbro: "刘三姐",
          spostamento: { mezzo: "taxi", minuti: 10 },
          descrizione: "Lo spettacolo all'aperto di Zhang Yimou sul fiume Li: 600 attori, barche e luci con le montagne come scenografia. Inizia alle 19:30.",
          consiglio: "Alle 18:30 ritirate i biglietti all'ufficio \"online ticket collection\" davanti all'ingresso (la tappa porta lì). Portate una giacca: sul fiume la sera fa fresco.",
        },
      ],
    },

    /* ---------------- 21 ottobre · Yangshuo ---------------- */
    {
      data: "2026-10-21", citta: "Yangshuo", titolo: "Paesaggi carsici",
      hotel: "yangshuo",
      note: "Mattina in auto (Xianggong Shan e Xingping), pomeriggio bamboo rafting sul fiume Yulong, poi scooter tra le campagne.",
      tappe: [
        {
          id: "xianggongshan", nome: "Xianggong Shan", nomeCn: "相公山观景台",
          indirizzoCn: "广西壮族自治区桂林市阳朔县兴坪镇荷包山村", lat: 24.923009, lon: 110.483707,
          orario: "08:00", durata: 60, timbro: "相公山",
          spostamento: { mezzo: "taxi", minuti: 60 },
          descrizione: "Il belvedere più famoso sul fiume Li: un'ansa del fiume circondata da decine di picchi carsici.",
          consiglio: "Si sale per una scalinata di circa 15 minuti. La luce migliore è al mattino presto, con la foschia.",
        },
        {
          id: "xingping", nome: "Xingping Ancient Town", nomeCn: "兴坪古镇",
          indirizzoCn: "广西壮族自治区桂林市阳朔县兴坪镇新街", lat: 24.916611, lon: 110.530606,
          orario: "09:30", durata: 75, timbro: "兴坪",
          spostamento: { mezzo: "taxi", minuti: 20 },
          descrizione: "Un borgo antico sul fiume Li, con case in legno, il vecchio palcoscenico e i pescatori con i cormorani.",
          consiglio: "In tutto 1h30–2h tra borgo, fiume e il punto della banconota (la tappa successiva).",
        },
        {
          id: "banconota-20", nome: "Il panorama della banconota da 20 yuan", nomeCn: "20元人民币背景观景台",
          indirizzoCn: "广西壮族自治区桂林市阳朔县兴坪镇 20元人民币背景", lat: 24.922099, lon: 110.521367,
          orario: "10:45", durata: 30, timbro: "廿元",
          spostamento: { mezzo: "a piedi", minuti: 15 },
          descrizione: "Il punto del fiume Li disegnato sul retro della banconota da 20 yuan.",
          consiglio: "Tirate fuori una banconota da 20 yuan e fate la foto con la banconota davanti al paesaggio vero!",
        },
        {
          id: "bamboo-rafting", nome: "Bamboo rafting sul fiume Yulong", nomeCn: "遇龙河骥马码头",
          indirizzoCn: "广西壮族自治区桂林市阳朔县 遇龙河景区骥马码头", lat: 24.757932, lon: 110.449705,
          orario: "12:30", durata: 120, timbro: "遇龙河",
          spostamento: { mezzo: "taxi", minuti: 60 },
          descrizione: "Una zattera di bambù spinta a pertica da un barcaiolo, lungo il fiume Yulong tra risaie e montagne. Si scende da Jima Wharf a Gongnong Bridge (Comprehensive Wharf).",
          consiglio: "La biglietteria è a Jima Wharf (Jima Wharf Ticket Office), a pochi minuti dall'hotel. Pranzate nella zona prima di salire. Ai piccoli sbarramenti la zattera fa un mini salto: tenete i telefoni al sicuro!",
        },
        {
          id: "ten-mile-gallery", nome: "Ten-Mile Gallery in scooter", nomeCn: "十里画廊",
          indirizzoCn: "广西壮族自治区桂林市阳朔县抗战路 十里画廊", lat: 24.749369, lon: 110.476517,
          orario: "15:30", durata: 90, timbro: "十里画廊",
          spostamento: { mezzo: "2 ruote", minuti: 20, da: "dall'hotel, dopo aver preso lo scooter" },
          descrizione: "La strada tra le campagne di Yangshuo, con risaie, villaggi e la Moon Hill (la montagna con l'arco).",
          consiglio: "Finita la zattera tornate in hotel e prendete lo scooter. Le stradine laterali tra le risaie sono le più belle.",
        },
        {
          id: "tianqingse", nome: "Pausa caffè a Tianqingse", nomeCn: "阳朔天青色咖啡",
          indirizzoCn: "广西壮族自治区桂林市阳朔县高田镇竹兜寨村", lat: 24.739512, lon: 110.478527,
          orario: "17:00", durata: 60, timbro: "天青",
          spostamento: { mezzo: "2 ruote", minuti: 10 },
          descrizione: "Il caffè della vostra lista: una grande vasca d'acqua che riflette le montagne carsiche.",
          consiglio: "Andateci per la foto con il riflesso, più che per il caffè.",
        },
        {
          id: "yangshuo-sera", nome: "Centro di Yangshuo la sera", nomeCn: "阳朔西街",
          indirizzoCn: "广西壮族自治区桂林市阳朔县西街", lat: 24.775200, lon: 110.495400,
          orario: "18:30", durata: 120, timbro: "漓江",
          spostamento: { mezzo: "2 ruote", minuti: 20 },
          descrizione: "Yangshuo si accende la sera: West Street, il lungofiume del Li e i locali con musica dal vivo.",
          consiglio: "Il Xie Dajie della lista \"Dove mangiare\" è famoso per il pesce alla birra.",
        },
      ],
    },

    /* ---------------- 22 ottobre · Yangshuo → Zhangjiajie ---------------- */
    {
      data: "2026-10-22", citta: "Yangshuo → Zhangjiajie", titolo: "Il lungo treno verso Zhangjiajie",
      hotel: "dreamweaver",
      note: "Mattina libera. Alle 10:45 tornate in hotel per i bagagli e partite alle 11:00 (non più tardi delle 11:15) in auto o Didi: il trasferimento richiede 1h30–2h. Treno D3968 Guilin North 14:55 → Zhangjiajie West 22:07. A Zhangjiajie c'è il transfer dell'hotel, con un cartello con i vostri nomi. I biglietti per Tianmen Mountain li gestisce l'hotel Dream Weaver Inn.",
      tappe: [
        {
          id: "guilin-nord", citta: "Guilin", nome: "Stazione di Guilin North", nomeCn: "桂林北站",
          indirizzoCn: "广西壮族自治区桂林市叠彩区北辰路", lat: 25.329019, lon: 110.301731,
          orario: "12:45", durata: 130, timbro: "桂林北",
          spostamento: { mezzo: "taxi", minuti: 105 },
          descrizione: "Treno D3968 delle 14:55 per Zhangjiajie West (7 ore e 12 minuti).",
          consiglio: "Dalle 13:00 alle 14:15: controlli, sala d'attesa e binario. Prendete qualcosa da mangiare per il viaggio: si arriva alle 22:07.",
        },
        {
          id: "zhangjiajie-ovest-arrivo", citta: "Zhangjiajie", nome: "Stazione di Zhangjiajie West", nomeCn: "张家界西站",
          indirizzoCn: "湖南省张家界市永定区 张家界西站", lat: 29.168723, lon: 110.463001,
          orario: "22:07", durata: 15, timbro: "张家界",
          spostamento: { mezzo: "treno", minuti: 432, da: "da Guilin North (treno D3968)" },
          descrizione: "Arrivo a Zhangjiajie: vi aspetta il transfer dell'hotel con un cartello con i vostri nomi.",
          consiglio: "Se non trovate l'autista, mostrate l'indirizzo con \"Hotel al tassista\".",
        },
      ],
    },

    /* ---------------- 23 ottobre · Tianmen Mountain → Wulingyuan ---------------- */
    {
      data: "2026-10-23", citta: "Zhangjiajie → Wulingyuan", titolo: "La Porta del Cielo",
      hotel: "wulingyuan",
      note: "Tianmen Mountain, Route C: biglietti prenotati tramite il Dream Weaver Inn. Partenza presto dall'hotel; in montagna indicativamente 07:30/08:00 → 13:30/14:00. Ricordatevi i bagagli prima di partire per Wulingyuan.",
      tappe: [
        {
          id: "tianmen-funivia", citta: "Zhangjiajie", nome: "Funivia di Tianmen Mountain", nomeCn: "天门山索道下站",
          indirizzoCn: "湖南省张家界市永定区大庸路 天门山索道下站", lat: 29.111698, lon: 110.483437,
          orario: "07:30", durata: 40, timbro: "索道",
          spostamento: { mezzo: "taxi", minuti: 10 },
          descrizione: "Una delle funivie più lunghe del mondo: parte dal centro città e sale per oltre 7 km sopra villaggi e montagne.",
          consiglio: "Seguite il percorso indicato dalla vostra Route C. Il passaporto serve per entrare.",
        },
        {
          id: "tianmen-vetta", citta: "Zhangjiajie", nome: "Tianmen Mountain: passerelle e panorami", nomeCn: "天门山玻璃栈道",
          indirizzoCn: "湖南省张家界市永定区 天门山国家森林公园", lat: 29.046777, lon: 110.478675,
          orario: "08:30", durata: 180, timbro: "天门山",
          spostamento: { mezzo: "funivia", minuti: 30 },
          descrizione: "Sulla cima: sentieri e passerelle a strapiombo sulla parete, punti panoramici e il tempio di Tianmen.",
          consiglio: "Le passerelle di vetro sono facoltative: c'è sempre un sentiero normale accanto. Se c'è nebbia aspettate un po', spesso si apre.",
        },
        {
          id: "porta-del-cielo", citta: "Zhangjiajie", nome: "Heaven's Gate · Porta del Paradiso", nomeCn: "天门洞",
          indirizzoCn: "湖南省张家界市永定区 天门山国家森林公园 天门洞", lat: 29.048270, lon: 110.487589,
          orario: "11:30", durata: 90, timbro: "天门洞",
          spostamento: { mezzo: "bus", minuti: 15 },
          descrizione: "Il gigantesco arco naturale nella roccia, alto 130 metri, in cima alla scalinata dei 999 gradini.",
          consiglio: "Ci sono anche le scale mobili nella montagna se le gambe chiedono pietà.",
        },
        {
          id: "zhangjiajie-citta", citta: "Zhangjiajie", nome: "Pranzo a Zhangjiajie città", nomeCn: "大庸府城",
          indirizzoCn: "湖南省张家界市永定区解放路 大庸府城", lat: 29.126463, lon: 110.484692,
          orario: "14:00", durata: 75, timbro: "大庸",
          spostamento: { mezzo: "funivia", minuti: 40 },
          descrizione: "Dayong Fucheng, il quartiere in stile antico vicino alla funivia, con ristoranti e cucina Tujia.",
          consiglio: "Provate il san xia guo (三下锅), lo stufato piccante tipico della zona.",
        },
        {
          id: "hotel-wulingyuan", nome: "Check-in a Wulingyuan", nomeCn: "Easy House 民宿（高云店）",
          indirizzoCn: "湖南省张家界市武陵源区画卷路高云小区2组", lat: 29.341540, lon: 110.537050,
          orario: "16:30", durata: 30, timbro: "武陵源",
          spostamento: { mezzo: "taxi", minuti: 60, da: "dalla città (45–60 minuti, passando per i bagagli)" },
          descrizione: "Easy House Gaoyun Branch, a Wulingyuan: la base per i prossimi 3 giorni, vicino all'ingresso del parco.",
          consiglio: "La sera Xibu Street (溪布老街) è la via dei ristoranti a pochi minuti di taxi.",
        },
      ],
    },

    /* ---------------- 24 ottobre · Avatar Mountains ---------------- */
    {
      data: "2026-10-24", citta: "Wulingyuan", titolo: "Le montagne di Avatar",
      hotel: "wulingyuan",
      note: "Giornata tutta dedicata al Zhangjiajie National Forest Park. Ingresso presto, idealmente 07:00–07:30; fine indicativa 17:00–18:00. Serve il passaporto. Dentro il parco ci si sposta con le navette gratuite; il Bailong Elevator si paga a parte.",
      tappe: [
        {
          id: "ingresso-wulingyuan", nome: "Ingresso del parco (Wulingyuan)", nomeCn: "武陵源标志门门票站",
          indirizzoCn: "湖南省张家界市武陵源区武陵路 武陵源风景名胜区东门（标志门）", lat: 29.351095, lon: 110.535785,
          orario: "07:00", durata: 20, timbro: "森林公园",
          spostamento: { mezzo: "taxi", minuti: 10 },
          descrizione: "La porta d'ingresso al Zhangjiajie National Forest Park dal lato di Wulingyuan.",
          consiglio: "Conservate biglietto e passaporto a portata di mano: si mostrano a ogni navetta e ascensore.",
        },
        {
          id: "yuanjiajie", nome: "Yuanjiajie", nomeCn: "袁家界",
          indirizzoCn: "湖南省张家界市武陵源区 张家界国家森林公园 袁家界", lat: 29.344570, lon: 110.448512,
          orario: "08:00", durata: 120, timbro: "袁家界",
          spostamento: { mezzo: "bus", minuti: 40 },
          descrizione: "L'altopiano con le colonne di arenaria che hanno ispirato le montagne fluttuanti di Avatar.",
          consiglio: "Il percorso ad anello è ben segnalato. Attenzione alle scimmie: non date cibo e tenete chiuse le borse.",
        },
        {
          id: "avatar", nome: "Avatar Mountains", nomeCn: "乾坤柱（阿凡达悬浮山）",
          indirizzoCn: "湖南省张家界市武陵源区 张家界国家森林公园 袁家界 乾坤柱", lat: 29.343373, lon: 110.441856,
          orario: "10:00", durata: 45, timbro: "乾坤柱",
          spostamento: { mezzo: "a piedi", minuti: 15 },
          descrizione: "Il pilastro di Qiankun, ribattezzato \"Avatar Hallelujah Mountain\": il simbolo del parco.",
          consiglio: "Il belvedere è affollato: aspettate qualche minuto e si libera il posto in prima fila.",
        },
        {
          id: "bailong", nome: "Bailong Elevator", nomeCn: "百龙天梯",
          indirizzoCn: "湖南省张家界市武陵源区 张家界国家森林公园 百龙天梯", lat: 29.349406, lon: 110.467411,
          orario: "11:00", durata: 30, timbro: "天梯",
          spostamento: { mezzo: "bus", minuti: 15 },
          descrizione: "L'ascensore all'aperto più alto del mondo: 326 metri sulla parete di roccia, in meno di 2 minuti.",
          consiglio: "Si paga a parte. Nelle ore di punta la coda può essere lunga.",
        },
        {
          id: "tianzi", nome: "Tianzi Mountain e punti panoramici", nomeCn: "天子山",
          indirizzoCn: "湖南省张家界市武陵源区 张家界国家森林公园 天子山", lat: 29.401558, lon: 110.443813,
          orario: "13:00", durata: 180, timbro: "天子山",
          spostamento: { mezzo: "bus", minuti: 40 },
          descrizione: "La \"Montagna del Figlio del Cielo\": un mare di pinnacoli che si perde all'orizzonte. Belvedere da non perdere: Imperial Brush Peak e Helong Park.",
          consiglio: "Per tornare verso Wulingyuan c'è anche la funivia di Tianzi.",
        },
      ],
    },

    /* ---------------- 25 ottobre · Grand Canyon + Yellow Dragon ---------------- */
    {
      data: "2026-10-25", citta: "Wulingyuan", titolo: "Ponte di vetro e Grotta del Drago Giallo",
      hotel: "wulingyuan",
      note: "La giornata più piena. Glass Bridge: Route A, prenotata con il passaporto. Si torna a dormire all'Easy House (terza notte a Wulingyuan).",
      tappe: [
        {
          id: "glass-bridge", nome: "Glass Bridge", nomeCn: "张家界大峡谷玻璃桥",
          indirizzoCn: "湖南省张家界市慈利县三官寺乡 张家界大峡谷景区", lat: 29.395616, lon: 110.701244,
          orario: "08:30", durata: 60, timbro: "玻璃桥",
          spostamento: { mezzo: "taxi", minuti: 60 },
          descrizione: "Il ponte di vetro sospeso a 300 metri sopra il canyon: 430 metri di lunghezza.",
          consiglio: "Route A, scelta pensando a chi soffre di vertigini. Sul ponte si mettono i copriscarpe: guardate l'orizzonte, non sotto!",
        },
        {
          id: "grand-canyon", nome: "Zhangjiajie Grand Canyon", nomeCn: "张家界大峡谷",
          indirizzoCn: "湖南省张家界市慈利县三官寺乡 张家界大峡谷", lat: 29.396389, lon: 110.698238,
          orario: "09:30", durata: 180, timbro: "大峡谷",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "Il canyon sotto il ponte: sentieri tra cascate e pareti verticali, la parte bassa lungo il torrente e un giro in barca sul laghetto.",
          consiglio: "Scarpe con buona suola: i sentieri vicino alle cascate sono umidi.",
        },
        {
          id: "yellow-dragon", nome: "Huanglong · Yellow Dragon Cave", nomeCn: "黄龙洞",
          indirizzoCn: "湖南省张家界市武陵源区索溪峪镇河口村 黄龙洞景区", lat: 29.361874, lon: 110.614919,
          orario: "14:30", durata: 150, timbro: "黄龙洞",
          spostamento: { mezzo: "taxi", minuti: 60 },
          descrizione: "Una delle grotte più grandi della Cina: sale enormi di stalattiti illuminate e un fiume sotterraneo da percorrere in barca.",
          consiglio: "Visita di circa 2–3 ore. Dentro è fresco: portate una felpa.",
        },
      ],
    },

    /* ---------------- 26 ottobre · Zhangjiajie → Chengdu ---------------- */
    {
      data: "2026-10-26", citta: "Zhangjiajie → Chengdu", titolo: "Benvenuti nel Sichuan",
      hotel: "chengdu",
      note: "Treno Zhangjiajie West 09:55 → Chengdu East 14:19 (4 ore e 24 minuti). Da Wulingyuan alla stazione ci vogliono circa 50–60 minuti: partite verso le 08:00.",
      tappe: [
        {
          id: "zhangjiajie-ovest-partenza", citta: "Zhangjiajie", nome: "Stazione di Zhangjiajie West", nomeCn: "张家界西站",
          indirizzoCn: "湖南省张家界市永定区 张家界西站", lat: 29.168723, lon: 110.463001,
          orario: "09:00", durata: 55, timbro: "湘西",
          spostamento: { mezzo: "taxi", minuti: 55 },
          descrizione: "Treno delle 09:55 per Chengdu East.",
          consiglio: "Arrivate almeno 45 minuti prima per i controlli.",
        },
        {
          id: "chengdu-est-arrivo", nome: "Stazione di Chengdu East", nomeCn: "成都东站",
          indirizzoCn: "四川省成都市成华区邛崃山路333号", lat: 30.628779, lon: 104.140947,
          orario: "14:19", durata: 20, timbro: "成都",
          spostamento: { mezzo: "treno", minuti: 264, da: "da Zhangjiajie West" },
          descrizione: "Arrivo a Chengdu, la città dei panda e del piccante.",
          consiglio: "Dalla stazione all'hotel: Didi (25–30 minuti) o metro linea 2 fino a Chunxi Road.",
        },
        {
          id: "hotel-chengdu", nome: "Check-in al Jiali Hotel", nomeCn: "嘉立精选酒店（成都春熙路太古里店）",
          indirizzoCn: "四川省成都市锦江区三圣街34号", lat: 30.649973, lon: 104.080040,
          orario: "15:15", durata: 45, timbro: "蓉城",
          spostamento: { mezzo: "taxi", minuti: 30 },
          descrizione: "Jiali Hotel Select, in pieno centro tra Chunxi Road e Taikoo Li.",
          consiglio: "Tutto il resto della giornata si fa a piedi.",
        },
        {
          id: "chunxi", nome: "Chunxi Road", nomeCn: "春熙路步行街",
          indirizzoCn: "四川省成都市锦江区 春熙路", lat: 30.654685, lon: 104.078817,
          orario: "16:15", durata: 75, timbro: "春熙路",
          spostamento: { mezzo: "a piedi", minuti: 10 },
          descrizione: "La via pedonale dello shopping nel centro di Chengdu: insegne, grandi magazzini e street food.",
          consiglio: "Cercate il panda gigante che si arrampica sul centro commerciale IFS: è la foto obbligata.",
        },
        {
          id: "taikoo-li", nome: "Taikoo Li e centro", nomeCn: "成都远洋太古里",
          indirizzoCn: "四川省成都市锦江区中纱帽街8号", lat: 30.653358, lon: 104.083809,
          orario: "17:30", durata: 120, timbro: "太古里",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "Un quartiere di edifici in stile tradizionale con negozi moderni, intorno all'antico tempio buddhista Daci.",
          consiglio: "Per cena: cucina del Sichuan o hot pot (guardate \"Dove mangiare\"). Chiedete \"微辣\" (wēi là) per il piccante leggero!",
        },
      ],
    },

    /* ---------------- 27 ottobre · Chengdu ---------------- */
    {
      data: "2026-10-27", citta: "Chengdu", titolo: "Panda, tè e vicoli",
      hotel: "chengdu",
      note: "Partenza presto: i panda sono attivi al mattino e dopo le 11 dormono quasi tutti.",
      tappe: [
        {
          id: "panda", nome: "Chengdu Panda Base", nomeCn: "成都大熊猫繁育研究基地",
          indirizzoCn: "四川省成都市成华区熊猫大道1375号", lat: 30.740573, lon: 104.138176,
          orario: "07:30", durata: 180, timbro: "熊猫",
          spostamento: { mezzo: "taxi", minuti: 35 },
          descrizione: "Il centro di ricerca e allevamento dei panda giganti: adulti, cuccioli e panda rossi in grandi recinti nel bambù.",
          consiglio: "Il controllo dei biglietti è al numero 1375 di Panda Avenue (熊猫大道1375号), distretto di Chenghua. Andate subito ai recinti dei cuccioli.",
        },
        {
          id: "peoples-park", nome: "People's Park", nomeCn: "人民公园",
          indirizzoCn: "四川省成都市青羊区小南街8号", lat: 30.656990, lon: 104.057641,
          orario: "11:00", durata: 75, timbro: "人民公园",
          spostamento: { mezzo: "taxi", minuti: 40 },
          descrizione: "Il parco dove la Chengdu vera passa le giornate: balli, mahjong, karaoke e il famoso \"angolo dei matrimoni\".",
          consiglio: "All'angolo dei matrimoni i genitori appendono i \"curriculum\" dei figli single in cerca di moglie o marito!",
        },
        {
          id: "kuanzhai", nome: "Kuanzhai Alley", nomeCn: "宽窄巷子",
          indirizzoCn: "四川省成都市青羊区 宽窄巷子", lat: 30.663869, lon: 104.053307,
          orario: "12:30", durata: 120, timbro: "宽窄",
          spostamento: { mezzo: "a piedi", minuti: 15 },
          descrizione: "Tre vicoli paralleli (largo, stretto e del pozzo) con case a corte dell'epoca Qing, botteghe, sale da tè e snack.",
          consiglio: "Lo hot pot \"The Way of the Dragon\" (小龙翻大江) è proprio qui, al n. 28 di Zhai Alley.",
        },
        {
          id: "te-chengdu", nome: "Il tè alla maniera di Chengdu", nomeCn: "鹤鸣茶社",
          indirizzoCn: "四川省成都市青羊区祠堂街9号 人民公园内", lat: 30.656882, lon: 104.058603,
          orario: "14:45", durata: 60, timbro: "茶",
          spostamento: { mezzo: "a piedi", minuti: 15 },
          descrizione: "Heming Teahouse, la casa da tè storica del People's Park: tè in tazza con coperchio, sedie di bambù e, se volete, la pulizia delle orecchie!",
          consiglio: "Il cameriere riempie l'acqua calda da un bollitore dal beccuccio lunghissimo. Si paga il tè, l'acqua è infinita.",
        },
        {
          id: "jinli", nome: "Jinli", nomeCn: "锦里古街",
          indirizzoCn: "四川省成都市武侯区武侯祠大街231号", lat: 30.645994, lon: 104.049828,
          orario: "16:30", durata: 120, timbro: "锦里",
          spostamento: { mezzo: "taxi", minuti: 20 },
          descrizione: "La via antica accanto al tempio Wuhou: lanterne rosse, snack del Sichuan, artigiani e teatrini.",
          consiglio: "Al tramonto si accendono le lanterne: è il momento migliore. Poi il centro di Chengdu è a 15 minuti di taxi.",
        },
      ],
    },

    /* ---------------- 28 ottobre · Chengdu → Xi'an ---------------- */
    {
      data: "2026-10-28", citta: "Chengdu → Xi'an", titolo: "L'antica capitale",
      hotel: "xian",
      note: "Treno Chengdu East 09:34 → Xi'an North 13:44 (4 ore e 10 minuti). Hotel: check-in 14:00–24:00, check-out entro le 12:00.",
      tappe: [
        {
          id: "chengdu-est-partenza", citta: "Chengdu", nome: "Stazione di Chengdu East", nomeCn: "成都东站",
          indirizzoCn: "四川省成都市成华区邛崃山路333号", lat: 30.628779, lon: 104.140947,
          orario: "08:45", durata: 50, timbro: "天府",
          spostamento: { mezzo: "taxi", minuti: 30 },
          descrizione: "Treno delle 09:34 per Xi'an North.",
          consiglio: "Partite dall'hotel verso le 08:00.",
        },
        {
          id: "xian-nord-arrivo", nome: "Stazione di Xi'an North", nomeCn: "西安北站",
          indirizzoCn: "陕西省西安市未央区元朔大道 西安北站", lat: 34.376660, lon: 108.938757,
          orario: "13:44", durata: 20, timbro: "西安",
          spostamento: { mezzo: "treno", minuti: 250, da: "da Chengdu East" },
          descrizione: "Arrivo a Xi'an, capitale di 13 dinastie e punto di partenza della Via della Seta.",
          consiglio: "Dalla stazione all'hotel: Didi (circa 40 minuti) o metro linea 2 fino a Bell Tower.",
        },
        {
          id: "hotel-xian", nome: "Check-in al Campanile Xi'an", nomeCn: "康铂酒店（西安钟楼店）",
          indirizzoCn: "陕西省西安市碑林区西大街正学街8号", lat: 34.257695, lon: 108.942270,
          orario: "14:45", durata: 30, timbro: "长安",
          spostamento: { mezzo: "taxi", minuti: 40 },
          descrizione: "Campanile Xi'an Bell Tower Huimin Street, a due passi dalla Torre della Campana.",
          consiglio: "Tutto il centro storico si gira a piedi.",
        },
        {
          id: "bell-tower", nome: "Bell Tower", nomeCn: "西安钟楼",
          indirizzoCn: "陕西省西安市莲湖区 钟楼", lat: 34.259430, lon: 108.947030,
          orario: "15:30", durata: 45, timbro: "钟楼",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "La Torre della Campana dei Ming, al centro esatto della città murata.",
          consiglio: "Si entra dal sottopassaggio. C'è un biglietto combinato con la Drum Tower.",
        },
        {
          id: "drum-tower", nome: "Drum Tower", nomeCn: "西安鼓楼",
          indirizzoCn: "陕西省西安市莲湖区北院门74号", lat: 34.260206, lon: 108.943512,
          orario: "16:30", durata: 30, timbro: "鼓楼",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "La Torre del Tamburo, che una volta segnava il tramonto. Dentro, una collezione di tamburi giganti.",
          consiglio: "Alcune volte al giorno c'è una breve esibizione di tamburi.",
        },
        {
          id: "muslim-quarter", nome: "Muslim Quarter e street food", nomeCn: "回民街（北院门）",
          indirizzoCn: "陕西省西安市莲湖区北院门 回民街", lat: 34.262300, lon: 108.943600,
          orario: "17:00", durata: 120, timbro: "回民街",
          spostamento: { mezzo: "a piedi", minuti: 2 },
          descrizione: "Il quartiere della comunità musulmana Hui, dietro la Drum Tower: una serata di assaggi tra roujiamo, biang biang noodles e spiedini di agnello.",
          consiglio: "Fate piccoli assaggi qua e là invece di un pasto unico. Il De Fa Chang della vostra lista (ravioli) è vicino alla Bell Tower.",
        },
        {
          id: "wild-goose", nome: "Giant Wild Goose Pagoda", nomeCn: "大雁塔",
          indirizzoCn: "陕西省西安市雁塔区慈恩路1号 大慈恩寺内", lat: 34.218229, lon: 108.964176,
          orario: "19:30", durata: 45, timbro: "大雁塔",
          spostamento: { mezzo: "taxi", minuti: 25 },
          descrizione: "La pagoda del VII secolo costruita per i testi buddhisti portati dall'India dal monaco Xuanzang.",
          consiglio: "La sera è illuminata; nella piazza nord c'è lo spettacolo di fontane musicali.",
        },
        {
          id: "datang", nome: "Datang Everbright City", nomeCn: "大唐不夜城",
          indirizzoCn: "陕西省西安市雁塔区雁塔南路 大唐不夜城", lat: 34.213866, lon: 108.964046,
          orario: "20:15", durata: 90, timbro: "不夜城",
          spostamento: { mezzo: "a piedi", minuti: 10 },
          descrizione: "Il viale illuminato in stile dinastia Tang, con artisti di strada e ragazze in costume d'epoca.",
          consiglio: "Il momento migliore è dopo le 20: è tutto acceso e pieno di spettacoli.",
        },
      ],
    },

    /* ---------------- 29 ottobre · Terracotta → Pechino ---------------- */
    {
      data: "2026-10-29", citta: "Xi'an → Pechino", titolo: "L'Esercito di Terracotta",
      hotel: "pechino",
      note: "Check-out entro le 12:00: lasciate i bagagli in hotel. Treno Xi'an North 16:10 → Beijing West 20:45 (4 ore e 35 minuti). Hotel a Pechino: check-in 14:00–22:00, host già avvisato dell'arrivo.",
      tappe: [
        {
          id: "terracotta", citta: "Xi'an", nome: "Esercito di Terracotta", nomeCn: "秦始皇帝陵博物院（兵马俑）",
          indirizzoCn: "陕西省西安市临潼区秦陵北路 秦始皇兵马俑博物馆", lat: 34.386214, lon: 109.281960,
          orario: "08:30", durata: 180, timbro: "兵马俑",
          spostamento: { mezzo: "taxi", minuti: 60 },
          descrizione: "Oltre 8.000 guerrieri di terracotta a grandezza naturale, ognuno con un volto diverso, a guardia della tomba del primo imperatore.",
          consiglio: "Iniziate dalla Fossa 1, la più grande e spettacolare. Partenza presto: alle 13 dovete essere di ritorno.",
        },
        {
          id: "bagagli-xian", citta: "Xi'an", nome: "Ritorno in hotel per i bagagli", nomeCn: "康铂酒店（西安钟楼店）",
          indirizzoCn: "陕西省西安市碑林区西大街正学街8号", lat: 34.257695, lon: 108.942270,
          orario: "12:45", durata: 20, timbro: "行李",
          spostamento: { mezzo: "taxi", minuti: 60 },
          descrizione: "Si recuperano i bagagli e si va in stazione.",
          consiglio: "Se avanza tempo, pranzo veloce nel Muslim Quarter.",
        },
        {
          id: "xian-nord-partenza", citta: "Xi'an", nome: "Stazione di Xi'an North", nomeCn: "西安北站",
          indirizzoCn: "陕西省西安市未央区元朔大道 西安北站", lat: 34.376660, lon: 108.938757,
          orario: "15:00", durata: 70, timbro: "秦",
          spostamento: { mezzo: "taxi", minuti: 45 },
          descrizione: "Treno delle 16:10 per Beijing West.",
          consiglio: "Arrivate almeno 45 minuti prima: la stazione è enorme.",
        },
        {
          id: "pechino-ovest", nome: "Stazione di Beijing West", nomeCn: "北京西站",
          indirizzoCn: "北京市丰台区莲花池东路118号", lat: 39.894912, lon: 116.322033,
          orario: "20:45", durata: 15, timbro: "北京",
          spostamento: { mezzo: "treno", minuti: 275, da: "da Xi'an North" },
          descrizione: "Arrivo a Pechino! Didi fino all'appartamento (circa 40–50 minuti).",
          consiglio: "Mostrate l'indirizzo con \"Hotel al tassista\": 北京市朝阳区工体北路幸福一村10巷2号.",
        },
      ],
    },

    /* ---------------- 30 ottobre · Pechino imperiale ---------------- */
    {
      data: "2026-10-30", citta: "Pechino", titolo: "Pechino imperiale",
      hotel: "pechino",
      note: "Piazza Tiananmen e Città Proibita vanno prenotate online in anticipo con il passaporto (le prenotazioni aprono circa 7 giorni prima). Portate i passaporti.",
      tappe: [
        {
          id: "tiananmen", nome: "Piazza Tiananmen", nomeCn: "天安门广场",
          indirizzoCn: "北京市东城区东长安街 天安门广场", lat: 39.903182, lon: 116.397755,
          orario: "08:00", durata: 45, timbro: "天安门",
          spostamento: { mezzo: "taxi", minuti: 30 },
          descrizione: "La piazza più grande del mondo, con il ritratto di Mao sulla Porta della Pace Celeste.",
          consiglio: "Ci sono i controlli di sicurezza all'ingresso: arrivate presto.",
        },
        {
          id: "citta-proibita", nome: "Forbidden City", nomeCn: "故宫博物院（午门）",
          indirizzoCn: "北京市东城区景山前街4号 故宫博物院", lat: 39.913582, lon: 116.397228,
          orario: "09:00", durata: 180, timbro: "故宫",
          spostamento: { mezzo: "a piedi", minuti: 10 },
          descrizione: "Il palazzo degli imperatori Ming e Qing: cortili immensi, tetti dorati e quasi 1.000 edifici.",
          consiglio: "Si entra dalla Porta Meridiana (午门, sud) e si esce a nord, proprio davanti a Jingshan.",
        },
        {
          id: "jingshan", nome: "Jingshan Park", nomeCn: "景山公园",
          indirizzoCn: "北京市西城区景山西街44号", lat: 39.924029, lon: 116.396720,
          orario: "12:30", durata: 60, timbro: "景山",
          spostamento: { mezzo: "a piedi", minuti: 5 },
          descrizione: "La collina con la vista migliore sui tetti dorati della Città Proibita.",
          consiglio: "Salite al padiglione in cima per la foto panoramica.",
        },
        {
          id: "hutong", nome: "Hutong", nomeCn: "南锣鼓巷",
          indirizzoCn: "北京市东城区交道口街道 南锣鼓巷", lat: 39.937182, lon: 116.402394,
          orario: "14:00", durata: 120, timbro: "胡同",
          spostamento: { mezzo: "taxi", minuti: 15 },
          descrizione: "I vicoli della vecchia Pechino intorno a Nanluoguxiang: case a corte, botteghe e piccoli locali.",
          consiglio: "Perdetevi nei vicoli laterali, più tranquilli. Lo zhajiangmian di Fang Zhuan Chang 69 è proprio qui.",
        },
        {
          id: "shichahai", nome: "Shichahai la sera", nomeCn: "什刹海",
          indirizzoCn: "北京市西城区地安门西大街49号 什刹海", lat: 39.941893, lon: 116.385121,
          orario: "17:00", durata: 150, timbro: "什刹海",
          spostamento: { mezzo: "a piedi", minuti: 15 },
          descrizione: "I laghi di Houhai e Qianhai: al tramonto si accendono i bar sull'acqua e le bancarelle: il paradiso dello street food.",
          consiglio: "Passate dal ponte Yinding e dalla Yandai Xiejie, la viuzza delle botteghe.",
        },
      ],
    },

    /* ---------------- 31 ottobre · Grande Muraglia ---------------- */
    {
      data: "2026-10-31", citta: "Pechino", titolo: "La Grande Muraglia",
      hotel: "pechino",
      note: "Mutianyu, ingresso alle 08:00 (circa 1h30 di Didi: partite verso le 06:30). Biglietti: ingresso + navetta andata e ritorno + Upward Cableway (cabinovia chiusa fino alla Torre 14) + Downward Slide/Toboggan (dalla Torre 6). Ultima sera in città!",
      tappe: [
        {
          id: "mutianyu-centro", nome: "Mutianyu: centro visitatori e navetta", nomeCn: "慕田峪长城游客中心",
          indirizzoCn: "北京市怀柔区渤海镇 慕田峪长城游客中心", lat: 40.417555, lon: 116.544079,
          orario: "07:45", durata: 20, timbro: "慕田峪",
          spostamento: { mezzo: "taxi", minuti: 90 },
          descrizione: "Qui si comprano/mostrano i biglietti e si prende la navetta interna fino alla zona degli impianti.",
          consiglio: "Il Didi vi lascia qui. Per il ritorno può essere difficile trovarne uno libero: provate a prenotarlo un po' prima.",
        },
        {
          id: "mutianyu-cabinovia", nome: "Cabinovia chiusa fino alla Torre 14", nomeCn: "慕田峪长城缆车",
          indirizzoCn: "北京市怀柔区渤海镇慕田峪村 慕田峪长城缆车下站", lat: 40.431668, lon: 116.565052,
          orario: "08:15", durata: 20, timbro: "缆车",
          spostamento: { mezzo: "bus", minuti: 10 },
          descrizione: "La cabinovia chiusa (Upward Cableway) sale sul lato ovest fino alla Torre 14.",
          consiglio: "Attenzione: ci sono due impianti diversi. La cabinovia chiusa sale alla Torre 14; lo scivolo scende dalla zona della Torre 6.",
        },
        {
          id: "muraglia", nome: "Passeggiata sulla Muraglia: Torre 14 → Torre 6", nomeCn: "慕田峪长城14号敌楼",
          indirizzoCn: "北京市怀柔区渤海镇 慕田峪长城 14号敌楼", lat: 40.441748, lon: 116.565975,
          orario: "08:45", durata: 120, timbro: "长城",
          spostamento: { mezzo: "funivia", minuti: 15 },
          descrizione: "Dalla Torre 14 si cammina sulla Muraglia 14 → 13 → 12… → 6: una passeggiata tranquilla di 1–2 ore, con le torri di guardia restaurate e le montagne tutto intorno.",
          consiglio: "Non serve arrivare alla Torre 20: dalla 14 godetevi il panorama, poi scendete verso la 6.",
        },
        {
          id: "toboggan", nome: "Discesa in toboggan dalla Torre 6", nomeCn: "慕田峪长城滑道",
          indirizzoCn: "北京市怀柔区渤海镇 慕田峪长城 6号敌楼 滑道", lat: 40.432714, lon: 116.570395,
          orario: "11:00", durata: 20, timbro: "滑道",
          spostamento: { mezzo: "a piedi", minuti: 2 },
          descrizione: "Lo scivolo su slittino che scende a serpentina dalla Muraglia fino a valle.",
          consiglio: "Si frena con la leva: andate piano nelle curve, ci sono addetti lungo il percorso.",
        },
      ],
    },

    /* ---------------- 1 novembre · Rientro ---------------- */
    {
      data: "2026-11-01", citta: "Pechino → Roma", titolo: "Si torna a casa",
      hotel: "pechino",
      note: "Check-out (entro le 12:00) e Didi per l'aeroporto. Volo Air China CA 939 · Pechino Capital T3 13:25 → Roma Fiumicino T3 17:50. Codici di prenotazione nella mail di conferma.",
      tappe: [
        {
          id: "pechino-aeroporto", citta: "Pechino", nome: "Aeroporto di Pechino Capital T3", nomeCn: "北京首都国际机场3号航站楼",
          indirizzoCn: "北京市顺义区 北京首都国际机场3号航站楼", lat: 40.054837, lon: 116.614601,
          orario: "10:45", durata: 150, timbro: "再见",
          spostamento: { mezzo: "taxi", minuti: 45 },
          descrizione: "Volo CA 939 delle 13:25 per Roma. Arrivederci, Cina!",
          consiglio: "Partite dall'appartamento verso le 10:00. Per i voli internazionali ci sono anche i controlli in uscita del passaporto.",
        },
      ],
    },
  ],

  ristoranti: [
    /* ---------- SHANGHAI ---------- */
    {
      daFlavia: true, nome: "Lai Lai Xiao Long", nomeCn: "莱莱小笼",
      indirizzoCn: "上海市黄浦区天津路506号", citta: "Shanghai",
      lat: 31.236125, lon: 121.477126, tipo: "Xiaolongbao", prezzo: "€",
      descrizione: "Piccoli ravioli al vapore con carne e brodo all'interno. Da provare soprattutto maiale + granchio (crab roe).",
      consiglio: "⭐ Tra i prioritari di Flavia. Attenzione: il brodo dentro è bollente!",
    },
    {
      daFlavia: true, nome: "Lai Lai Xiao Long (Jing'an)", nomeCn: "莱莱小笼（静安店）",
      indirizzoCn: "上海市静安区万航渡路50号", citta: "Shanghai",
      lat: 31.223977, lon: 121.443636, tipo: "Xiaolongbao", prezzo: "€",
      descrizione: "La filiale di Jing'an, con gli stessi xiaolongbao.",
      consiglio: "Da considerare se la sede di Huangpu ha troppa coda.",
    },
    {
      daFlavia: true, nome: "Wei Xiang Zhai (Hubei Road)", nomeCn: "味香斋面馆（南京东路店）",
      indirizzoCn: "上海市黄浦区湖北路151号", citta: "Shanghai",
      lat: 31.232967, lon: 121.481020, tipo: "Noodles al sesamo", prezzo: "€",
      descrizione: "Spaghetti cinesi ricoperti da una crema densa di sesamo, spesso con olio piccante e cipollotto. Piatto semplice e molto locale.",
      consiglio: "⭐ Tra i prioritari di Flavia.",
    },
    {
      daFlavia: true, nome: "Yong Feng Mian Guan", nomeCn: "永丰面馆",
      indirizzoCn: "上海市黄浦区汉口路320号", citta: "Shanghai",
      lat: 31.235718, lon: 121.484156, tipo: "Noodles", prezzo: "€",
      descrizione: "Ciotole di noodles in brodo o con i condimenti tipici di Shanghai.",
      consiglio: "Buono come pranzo veloce in centro.",
    },
    {
      daFlavia: true, nome: "Wei Xiang Zhai (Yandang Road)", nomeCn: "味香斋（雁荡路店）",
      indirizzoCn: "上海市黄浦区雁荡路14号", citta: "Shanghai",
      lat: 31.220846, lon: 121.469876, tipo: "Noodles al sesamo", prezzo: "€",
      descrizione: "Gli stessi noodles al sesamo, cremosi e saporiti, nella zona della Concessione Francese.",
      consiglio: "Alternativa se siete da quelle parti (è vicino a Xintiandi).",
    },
    {
      daFlavia: true, nome: "Wu You Xian", nomeCn: "屋有鲜",
      indirizzoCn: "上海市黄浦区茂名南路7号", citta: "Shanghai",
      lat: 31.222543, lon: 121.460624, tipo: "Cucina di Shanghai", prezzo: "€€",
      descrizione: "Cucina locale di Shanghai: dumplings e piatti tradizionali.",
      consiglio: "Una possibilità se siete nella Concessione Francese.",
    },
    {
      daFlavia: true, nome: "Da Hu Chun", nomeCn: "大壶春（四川中路店）",
      indirizzoCn: "上海市黄浦区四川中路136号", citta: "Shanghai",
      lat: 31.234836, lon: 121.489181, tipo: "Shengjian bao", prezzo: "€",
      descrizione: "Panini ripieni di carne cotti in padella: croccanti e dorati sotto, morbidi sopra e con il brodo dentro.",
      consiglio: "⭐ Tra i prioritari di Flavia. Diversi dagli xiaolongbao perché fritti in padella.",
    },
    {
      daFlavia: true, nome: "Sheng Yong Xing", nomeCn: "晟永兴（外滩店）",
      indirizzoCn: "上海市黄浦区广东路20号 外滩5号5楼", citta: "Shanghai",
      lat: 31.234342, lon: 121.490646, tipo: "Anatra arrosto", prezzo: "€€€",
      descrizione: "Anatra arrosto e cucina cinese più raffinata, sul Bund.",
      consiglio: "Più da cena vera rispetto agli altri indirizzi.",
    },
    {
      daFlavia: true, nome: "Nanxiang Steamed Bun", nomeCn: "南翔馒头店（城隍庙店）",
      indirizzoCn: "上海市黄浦区豫园路87号", citta: "Shanghai",
      lat: 31.226577, lon: 121.491510, tipo: "Xiaolongbao", prezzo: "€€",
      descrizione: "Il locale storico degli xiaolongbao, a Yu Garden.",
      consiglio: "Zona molto turistica: sceglietelo se siete già a Yu Garden.",
    },
    {
      daFlavia: true, nome: "Auntie Huang's Guotie", nomeCn: "黄阿姨锅贴大王",
      indirizzoCn: "上海市静安区万航渡路174号", citta: "Shanghai",
      lat: 31.225040, lon: 121.441216, tipo: "Guotie e shengjian", prezzo: "€",
      descrizione: "Guotie (ravioli croccanti sul fondo) e shengjian. Piccolo posto molto \"local\".",
    },

    /* ---------- SUZHOU ---------- */
    {
      daFlavia: true, nome: "Yaba Shengjian (Lindun Road)", nomeCn: "哑巴生煎（临顿路店）",
      indirizzoCn: "江苏省苏州市姑苏区临顿路温家岸12号", citta: "Suzhou",
      lat: 31.315120, lon: 120.628428, tipo: "Shengjian bao", prezzo: "€",
      descrizione: "Panini ripieni di carne, croccanti sotto e molto succosi dentro: tipici della zona Shanghai–Suzhou.",
      consiglio: "⭐ Tra i prioritari di Flavia. È la sede storica, a due passi da Pingjiang Road.",
    },
    {
      nome: "Song He Lou", nomeCn: "松鹤楼（观前店）",
      indirizzoCn: "江苏省苏州市姑苏区观前街太监弄15号", citta: "Suzhou",
      lat: 31.310453, lon: 120.625938, tipo: "Cucina di Suzhou", prezzo: "€€",
      descrizione: "Ristorante storico di Suzhou, famoso per il pesce \"scoiattolo\" in agrodolce (松鼠桂鱼).",
      consiglio: "Comodo per cena prima del treno di ritorno.",
    },

    /* ---------- YANGSHUO ---------- */
    {
      daFlavia: true, nome: "Tianqingse Coffee", nomeCn: "阳朔天青色咖啡",
      indirizzoCn: "广西壮族自治区桂林市阳朔县高田镇竹兜寨村", citta: "Yangshuo",
      lat: 24.739512, lon: 110.478527, tipo: "Caffè panoramico", prezzo: "€",
      descrizione: "Più che il cibo, la location: una grande vasca d'acqua che riflette le montagne carsiche.",
      consiglio: "Posto da caffè, pausa e foto.",
    },
    {
      nome: "Xie Dajie (pesce alla birra)", nomeCn: "谢大姐啤酒鱼私房菜（祥凤店）",
      indirizzoCn: "广西壮族自治区桂林市阳朔县将军路27号", citta: "Yangshuo",
      lat: 24.773543, lon: 110.479975, tipo: "Pesce alla birra", prezzo: "€€",
      descrizione: "Il piatto simbolo di Yangshuo: pesce di fiume cotto con birra, pomodoro e peperoncino.",
      consiglio: "Il prezzo del pesce è a peso: chiedete quanto costa prima di scegliere.",
    },

    /* ---------- ZHANGJIAJIE / WULINGYUAN ---------- */
    {
      nome: "Dayong Fucheng (cucina Tujia)", nomeCn: "大庸府城",
      indirizzoCn: "湖南省张家界市永定区解放路 大庸府城", citta: "Zhangjiajie",
      lat: 29.126463, lon: 110.484692, tipo: "Cucina Tujia", prezzo: "€€",
      descrizione: "Il quartiere in stile antico vicino alla funivia di Tianmen, pieno di ristoranti di cucina locale.",
      consiglio: "Provate il san xia guo (三下锅), stufato piccante di carne in tre ingredienti.",
    },
    {
      nome: "Xibu Street", nomeCn: "溪布老街",
      indirizzoCn: "湖南省张家界市武陵源区武陵路 溪布老街", citta: "Wulingyuan",
      lat: 29.344106, lon: 110.556254, tipo: "Ristoranti e street food", prezzo: "€€",
      descrizione: "La via pedonale di Wulingyuan con ristoranti di cucina Tujia e Hunan, snack e negozi.",
      consiglio: "La cucina dello Hunan è molto piccante: \"不辣\" (bù là) significa \"non piccante\".",
    },

    /* ---------- CHENGDU ---------- */
    {
      daFlavia: true, nome: "Lao Chengdu Sanyang Noodles", nomeCn: "老成都逸城鲜三样面",
      indirizzoCn: "四川省成都市青羊区过街楼街46号", citta: "Chengdu",
      lat: 30.669753, lon: 104.058999, tipo: "Dan dan noodles e wonton", prezzo: "€",
      descrizione: "Dan dan noodles (salsa piccante, sesamo, carne macinata e pepe del Sichuan, che \"addormenta\" la lingua) e wonton nell'olio al peperoncino: due piatti simbolo di Chengdu.",
      consiglio: "⭐ Tra i prioritari di Flavia.",
    },
    {
      daFlavia: true, nome: "The Way of the Dragon (hot pot)", nomeCn: "小龙翻大江（宽窄巷子景区店）",
      indirizzoCn: "四川省成都市青羊区窄巷子28号", citta: "Chengdu",
      lat: 30.663528, lon: 104.053461, tipo: "Hot pot", prezzo: "€€",
      descrizione: "Hot pot del Sichuan nel vicolo di Zhai Alley: il brodo bolle al tavolo e ci si cuoce carne, verdure e tofu.",
      consiglio: "Chiedete il brodo diviso a metà (鸳鸯锅, yuānyāng guō): metà piccante e metà no.",
    },
    {
      nome: "Chen Mapo Tofu", nomeCn: "陈麻婆豆腐（春熙直营店）",
      indirizzoCn: "四川省成都市锦江区城守街73号", citta: "Chengdu",
      lat: 30.654548, lon: 104.077523, tipo: "Cucina del Sichuan", prezzo: "€€",
      descrizione: "Il ristorante che ha inventato il mapo tofu, il tofu piccante con carne macinata e pepe del Sichuan.",
      consiglio: "È vicino all'hotel, comodo per la prima sera.",
    },

    /* ---------- XI'AN ---------- */
    {
      daFlavia: true, nome: "Muslim Quarter: street food", nomeCn: "回民街（北院门）",
      indirizzoCn: "陕西省西安市莲湖区北院门 回民街", citta: "Xi'an",
      lat: 34.262300, lon: 108.943600, tipo: "Street food", prezzo: "€",
      descrizione: "Una serata di assaggi: roujiamo (肉夹馍, il \"panino cinese\" con carne stufata), biang biang noodles (larghissimi, fatti a mano), ravioli, spiedini di agnello e preparazioni nel pane.",
      consiglio: "⭐ Tra i prioritari di Flavia. Meglio tanti piccoli assaggi che un pasto unico.",
    },
    {
      daFlavia: true, nome: "De Fa Chang (ravioli)", nomeCn: "德发长饺子（钟楼店）",
      indirizzoCn: "陕西省西安市莲湖区西大街3号", citta: "Xi'an",
      lat: 34.260394, lon: 108.945427, tipo: "Ravioli", prezzo: "€€",
      descrizione: "Il locale storico dei ravioli di Xi'an, accanto alla Bell Tower: ravioli di tante forme e ripieni diversi.",
      consiglio: "Il menù \"banchetto di ravioli\" fa assaggiare tante varietà in una volta.",
    },

    /* ---------- PECHINO ---------- */
    {
      daFlavia: true, nome: "Xianlaoman (jiaozi)", nomeCn: "馅老满（东四店）",
      indirizzoCn: "北京市东城区东四北大街316号", citta: "Pechino",
      lat: 39.930183, lon: 116.417348, tipo: "Jiaozi", prezzo: "€",
      descrizione: "Ravioli cinesi bolliti o al vapore, con tantissime varianti di carne e verdure. Locale semplice e molto tipico.",
      consiglio: "⭐ Tra i prioritari di Flavia.",
    },
    {
      daFlavia: true, nome: "Fang Zhuan Chang No. 69", nomeCn: "方砖厂69号炸酱面",
      indirizzoCn: "北京市东城区方砖厂胡同69号", citta: "Pechino",
      lat: 39.938072, lon: 116.399829, tipo: "Zhajiangmian", prezzo: "€",
      descrizione: "Noodles spessi con una salsa scura di pasta di soia fermentata e carne, con verdure fresche come il cetriolo. Uno dei piatti più pechinesi.",
      consiglio: "⭐ Tra i prioritari di Flavia. È la sede originale, nel vicolo da cui prende il nome; ha anche altre sedi.",
    },
    {
      daFlavia: true, nome: "Liqun Roast Duck", nomeCn: "利群烤鸭店",
      indirizzoCn: "北京市东城区北翔凤胡同11号", citta: "Pechino",
      lat: 39.898254, lon: 116.406199, tipo: "Anatra alla pechinese", prezzo: "€€",
      descrizione: "Anatra arrostita con la pelle sottilissima e croccante, da mangiare nelle crêpe con cetriolo, cipollotto e salsa dolce.",
      consiglio: "⭐⭐⭐ Il preferito di Flavia. È un pasto vero, non uno snack: meglio prenotare.",
    },
    {
      daFlavia: true, nome: "Beiping Impression Roast Duck", nomeCn: "北平印象烤鸭（鼓楼后海店）",
      indirizzoCn: "北京市西城区 鼓楼后海", citta: "Pechino",
      lat: 39.940952, lon: 116.392495, tipo: "Anatra alla pechinese", prezzo: "€€",
      descrizione: "Anatra affettata, pancake, verdure e salsa, nella zona di Houhai e della Drum Tower.",
      consiglio: "Alternativa a Liqun, comoda dopo la serata a Shichahai.",
    },
    {
      daFlavia: true, nome: "Siji Minfu (Città Proibita)", nomeCn: "四季民福烤鸭店（故宫店）",
      indirizzoCn: "北京市东城区南池子大街11号", citta: "Pechino",
      lat: 39.914525, lon: 116.402873, tipo: "Anatra alla pechinese", prezzo: "€€",
      descrizione: "Una delle anatre laccate più amate dai pechinesi. Questa è la sede centrale accanto alla porta est della Città Proibita.",
      consiglio: "C'è sempre coda: prendete il numero e intanto fate un giro.",
    },
    {
      daFlavia: true, nome: "Niujie: street food Hui", nomeCn: "牛街",
      indirizzoCn: "北京市西城区 牛街", citta: "Pechino",
      lat: 39.886879, lon: 116.363411, tipo: "Street food", prezzo: "€",
      descrizione: "La via del quartiere musulmano Hui: baozi al vapore di manzo o agnello, jiaozi, spiedini e dolci di riso glutinoso con fagioli rossi o sesamo.",
      consiglio: "⭐ Tra i prioritari di Flavia: provate soprattutto i baozi.",
    },
  ],
};
