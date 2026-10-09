/* Contenuti fissi dell'app: frasario, missioni della Sfida, testi dei pulsanti "?".
   Non dipendono dall'itinerario. */

const FRASARIO = [
  // --- Sopravvivenza (sempre visibili) ---
  { n: 1,  it: "Ciao", cn: "你好", py: "nǐ hǎo" },
  { n: 2,  it: "Grazie", cn: "谢谢", py: "xièxie" },
  { n: 3,  it: "Mi scusi", cn: "不好意思", py: "bù hǎo yìsi" },
  { n: 4,  it: "Arrivederci", cn: "再见", py: "zàijiàn" },
  { n: 5,  it: "Va bene / OK", cn: "好的", py: "hǎo de" },
  { n: 6,  it: "Siamo italiani", cn: "我们是意大利人", py: "wǒmen shì Yìdàlì rén" },
  { n: 7,  it: "Non capisco", cn: "我听不懂", py: "wǒ tīng bù dǒng" },
  { n: 8,  it: "Parla inglese?", cn: "你会说英语吗？", py: "nǐ huì shuō Yīngyǔ ma?" },
  { n: 9,  it: "Dov'è il bagno?", cn: "厕所在哪里？", py: "cèsuǒ zài nǎlǐ?" },
  { n: 10, it: "Mi sono perso/a", cn: "我迷路了", py: "wǒ mílù le" },
  { n: 11, it: "Voglio andare qui (mostrando l'indirizzo)", cn: "我要去这里", py: "wǒ yào qù zhèlǐ" },
  { n: 12, it: "Si fermi qui, per favore", cn: "请在这里停", py: "qǐng zài zhèlǐ tíng" },
  { n: 13, it: "Quanto costa?", cn: "多少钱？", py: "duōshao qián?" },
  { n: 14, it: "Troppo caro, un po' di sconto?", cn: "太贵了，便宜一点吧", py: "tài guì le, piányi yīdiǎn ba" },
  { n: 15, it: "Posso pagare con la carta?", cn: "可以刷卡吗？", py: "kěyǐ shuākǎ ma?" },
  { n: 16, it: "Vorrei questo (indicando)", cn: "我要这个", py: "wǒ yào zhège" },
  { n: 17, it: "Non piccante, per favore", cn: "不要辣", py: "bú yào là" },
  { n: 18, it: "Poco piccante", cn: "微辣", py: "wēi là" },
  { n: 19, it: "Una bottiglia d'acqua", cn: "一瓶水", py: "yì píng shuǐ" },
  { n: 20, it: "Buonissimo!", cn: "好吃！", py: "hǎochī!" },
  { n: 21, it: "Il conto, per favore", cn: "买单", py: "mǎidān" },
  { n: 22, it: "Aiuto!", cn: "救命！", py: "jiùmìng!" },
  { n: 23, it: "Chiamate un'ambulanza", cn: "请叫救护车", py: "qǐng jiào jiùhùchē" },

  // --- Frasario segreto, comico (solo dopo lo sblocco) ---
  { n: 24, comica: true, it: "Mi scusi, sa indicarmi la sala di acquagym più vicina?", cn: "不好意思，请问最近的水中健身操馆在哪里？", py: "bù hǎo yìsi, qǐngwèn zuìjìn de shuǐzhōng jiànshēncāo guǎn zài nǎlǐ?" },
  { n: 25, comica: true, it: "Troppo piccante! Domani brucia culetto!", cn: "太辣了！明天屁股要着火了！", py: "tài là le! míngtiān pìgu yào zháohuǒ le!" },
  { n: 26, comica: true, it: "Ma ti pare? Non pulisco a casa e secondo te mi metto a sistemare qui?", cn: "你开玩笑吧？我在家都不打扫，你觉得我会在这里收拾吗？", py: "nǐ kāi wánxiào ba? wǒ zài jiā dōu bù dǎsǎo, nǐ juéde wǒ huì zài zhèlǐ shōushi ma?" },
  { n: 27, comica: true, it: "Ma che cinesata!", cn: "什么破玩意儿！", py: "shénme pò wányìr!", nota: "In cinese suona come «che patacca!»" },
  { n: 28, comica: true, it: "Ho camminato 20.000 passi, lasciatemi stare!", cn: "我走了两万步，别管我！", py: "wǒ zǒu le liǎng wàn bù, bié guǎn wǒ!" },
  { n: 29, comica: true, it: "Io pLendo Liso fLitto e involtini pLimaveLa", cn: "我要炒饭和春卷", py: "wǒ yào chǎofàn hé chūnjuǎn", nota: "In cinese è una normalissima ordinazione: funziona davvero!" },
  { n: 30, comica: true, it: "Paga lui/lei", cn: "他/她付钱", py: "tā fù qián" },
  { n: 31, comica: true, it: "Chissà se i cinesi vengono chiamati Cenesi per sbaglio 😯", cn: "我姓Cenesi，在意大利语里听起来像“中国人”！😯", py: "wǒ xìng Cenesi, zài Yìdàlìyǔ lǐ tīng qǐlái xiàng “Zhōngguó rén”!", nota: "In cinese la battuta è spiegata: «Mi chiamo Cenesi, in italiano sembra “cinesi”!»" },
  { n: 32, comica: true, it: "Questo <b>SUPER</b> ristorante è <b>SUPER</b> buono e mi sto <b>SUPER</b> divertendo", cn: "这家<b>超级</b>餐厅<b>超级</b>好吃，我玩得<b>超级</b>开心！", py: "zhè jiā chāojí cāntīng chāojí hǎochī, wǒ wán de chāojí kāixīn!" },
];

const MISSIONI = [
  // Cibo
  { n: 1,  cat: "Cibo", t: "Assaggia un piatto di cui non sai pronunciare il nome" },
  { n: 2,  cat: "Cibo", t: "Mangia un intero pasto usando solo le bacchette, compresi riso e zuppa" },
  { n: 3,  cat: "Cibo", t: "Ordina indicando una foto a caso sul menu, senza sapere cos'è" },
  { n: 4,  cat: "Cibo", t: "Prova un dolce cinese mai visto prima" },
  { n: 5,  cat: "Cibo", t: "Bevi un tè al latte con le \"perle\" (bubble tea)" },
  { n: 6,  cat: "Cibo", t: "Assaggia qualcosa di piccante e resisti 10 secondi senza bere" },
  { n: 7,  cat: "Cibo", t: "Mangia un piatto di street food comprato per strada" },
  { n: 8,  cat: "Cibo", t: "Prova un frutto che in Italia non hai mai visto" },
  { n: 9,  cat: "Cibo", t: "Fatti consigliare un piatto dal cameriere e ordinalo a scatola chiusa" },
  { n: 10, cat: "Cibo", t: "Assaggia un raviolo (jiaozi o xiaolongbao) senza ustionarti la lingua" },
  // Lingua e incontri
  { n: 11, cat: "Lingua e incontri", t: "Di' \"grazie\" (xièxie) ad almeno 5 persone diverse" },
  { n: 12, cat: "Lingua e incontri", t: "Fatti insegnare una parola cinese da un locale e usala entro sera" },
  { n: 13, cat: "Lingua e incontri", t: "Fatti fare una foto da uno sconosciuto chiedendolo solo a gesti, senza dire una parola" },
  { n: 14, cat: "Lingua e incontri", t: "Chiedi un'indicazione stradale e arriva a destinazione" },
  { n: 15, cat: "Lingua e incontri", t: "Impara a contare fino a 5 con le dita \"alla cinese\"" },
  { n: 16, cat: "Lingua e incontri", t: "Fatti scrivere il tuo nome in caratteri cinesi da qualcuno" },
  { n: 17, cat: "Lingua e incontri", t: "Saluta con \"nǐ hǎo\" e ottieni una risposta" },
  { n: 18, cat: "Lingua e incontri", t: "Fai un complimento in cinese: \"hǎo chī!\" (buonissimo!) al ristorante" },
  // Foto
  { n: 19, cat: "Foto", t: "Selfie imitando la posa di una statua" },
  { n: 20, cat: "Foto", t: "Foto con il cartello più assurdo tradotto male in inglese" },
  { n: 21, cat: "Foto", t: "Foto di coppia con un panorama alle spalle in cui \"reggete\" un monumento" },
  { n: 22, cat: "Foto", t: "Foto del piatto più strano della giornata" },
  { n: 23, cat: "Foto", t: "Foto di un gatto o di un cane cinese" },
  { n: 24, cat: "Foto", t: "Foto di una lanterna rossa" },
  { n: 25, cat: "Foto", t: "Foto saltando davanti a un'attrazione, entrambi in aria" },
  { n: 26, cat: "Foto", t: "Foto con un drago (statua, disegno o decorazione, va bene tutto)" },
  // Esplorazione
  { n: 27, cat: "Esplorazione", t: "Prendi la metro senza sbagliare direzione" },
  { n: 28, cat: "Esplorazione", t: "Trova un parco dove la gente balla, fa tai chi o canta, e unisciti per un minuto" },
  { n: 29, cat: "Esplorazione", t: "Entra in un negozio di cui non capisci assolutamente cosa venda" },
  { n: 30, cat: "Esplorazione", t: "Compra un souvenir sotto i 10 yuan" },
  { n: 31, cat: "Esplorazione", t: "Contratta il prezzo di qualcosa al mercato e ottieni uno sconto" },
  { n: 32, cat: "Esplorazione", t: "Paga qualcosa con il telefono (Alipay o WeChat Pay)" },
  { n: 33, cat: "Esplorazione", t: "Trova il punto più alto della giornata, che sia una torre, una collina o un piano" },
  { n: 34, cat: "Esplorazione", t: "Cammina almeno 15.000 passi (fa fede il contapassi dell'iPhone)" },
  // Sfide di coppia
  { n: 35, cat: "Sfide di coppia", t: "Indovina il prezzo di qualcosa: vince chi ci va più vicino" },
  { n: 36, cat: "Sfide di coppia", t: "Fate una gara a chi trova per primo un oggetto rosso e oro" },
  { n: 37, cat: "Sfide di coppia", t: "Racconta all'altro il momento più bello della giornata in 3 parole" },
  { n: 38, cat: "Sfide di coppia", t: "Scegli tu la cena per l'altro, che non può rifiutare" },
  { n: 39, cat: "Sfide di coppia", t: "Fai ridere l'altro durante una visita \"seria\" senza farvi notare" },
  { n: 40, cat: "Sfide di coppia", t: "Inventa un soprannome cinese per l'altro e usalo per tutto il giorno" },
];

const ICONE_CATEGORIA = { "Cibo": "🥟", "Lingua e incontri": "🗣️", "Foto": "📸", "Esplorazione": "🧭", "Sfide di coppia": "💞" };

const AIUTI = {
  itinerario: { t: "Itinerario", d: "Qui trovate il programma giorno per giorno. Toccate un giorno per vedere tappe, tempi di visita e spostamenti. In cima c'è la stima della durata totale della giornata." },
  portami: { t: "Portami qui", d: "Il pulsante arancione apre Amap con il percorso già impostato dalla vostra posizione. Se Amap non funziona, usate il pulsante grigio di Apple Maps. Amap in cinese? Mettetela in inglese: icona del profilo in basso a destra → ingranaggio in alto a destra → 通用设置 (Impostazioni generali) → 语言 (Lingua) → English. L'italiano non c'è." },
  tassista: { t: "Mostra al tassista", d: "Mostra nome e indirizzo in cinese a caratteri grandi. Giratelo verso il tassista o verso chiunque debba aiutarvi." },
  hotel: { t: "Torna in hotel", d: "Porta all'hotel di quella sera, con navigazione e indirizzo in cinese già pronti." },
  mangiare: { t: "Dove mangiare", d: "I locali consigliati, divisi per città e vicini alle tappe del giorno. Toccate un locale per vedere la descrizione e arrivarci." },
  frasario: { t: "Frasario", d: "Toccate una frase per mostrarla in grande, oppure premete 🔊 per farla leggere all'iPhone in cinese." },
  passaporto: { t: "Passaporto del Dragone", d: "Fatevi un selfie a inizio viaggio (o quando ci sono troppi timbri): potete farne quanti volete. A ogni attrazione visitata premete \"Timbra\" e scegliete su quale selfie mettere il timbro. Toccate le foto in alto per passare da un selfie all'altro e salvatele o condividetele quando volete." },
  sfida: { t: "Sfida Giuseppe vs Flavia", d: "Ogni giorno premete \"Comincia la sfida\" per estrarre 5 missioni. Quando uno di voi ne completa una spunta il proprio nome. Le missioni cambiano ogni giorno: dal giorno dopo trovate di nuovo il pulsante \"Comincia la sfida\" per estrarre le nuove, e quelle dei giorni passati restano in fondo con il punteggio. Alla fine del viaggio premete \"Svela il vincitore\": il conto alla rovescia, la somma dei punti e la ricompensa. Il vincitore sceglie una penitenza da far fare al perdente!" },
};
