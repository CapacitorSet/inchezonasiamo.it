type Color = "rossa" | "arancione" | "gialla" | "bianca";
type Region = "abruzzo"|"basilicata"|"calabria"|"campania"|"emiliaromagna"|"friuliveneziagiulia"|"lazio"|"liguria"|"lombardia"|"marche"|"molise"|"piemonte"|"puglia"|"sardegna"|"sicilia"|"toscana"|"bolzano"|"trento"|"umbria"|"valdaosta"|"veneto";
type BasicRuleData = {
    color: Color;
    from: string;
    to?: string;
    maybe?: boolean;
    notes?: string;
    rafforzata?: boolean;
    source?: string;
}
type AnyRuleData = BasicRuleData & {
    any: true;
}
type RegionsRuleData = BasicRuleData & {
    regions: Region[];
}
type ProvincieRuleData = BasicRuleData & {
    provincie: string[];
    parentRegion: Region;
}
type ComuniRuleData = BasicRuleData & {
    comuni: string[];
    parentRegion: Region;
}

export type RuleData = AnyRuleData | RegionsRuleData | ProvincieRuleData | ComuniRuleData;

export interface IRule {
    color: string

    dateIsContained(date: Date): boolean
    regionIsPartlyAffected(region: Region): boolean
    regionIsCompletelyAffected(region: Region): boolean
    whatIsAffected(): string
}

const nomiFriendly: { [K in Region]: string} = {
    abruzzo: "Abruzzo",
    basilicata: "Basilicata",
    calabria: "Calabria",
    campania: "Campania",
    emiliaromagna: "Emilia Romagna",
    friuliveneziagiulia: "Friuli Venezia Giulia",
    lazio: "Lazio",
    liguria: "Liguria",
    lombardia: "Lombardia",
    marche: "Marche",
    molise: "Molise",
    piemonte: "Piemonte",
    puglia: "Puglia",
    sardegna: "Sardegna",
    sicilia: "Sicilia",
    toscana: "Toscana",
    bolzano: "Trentino prov. Bolzano",
    trento: "Trentino prov. Trento",
    umbria: "Umbria",
    valdaosta: "Valle d'Aosta",
    veneto: "Veneto",
};

const _data: RuleData[] = [
    // dpcm 3 dicembre
    {from: "2020-12-04", to: "2021-01-05", color: "gialla", regions: ["lazio", "liguria", "molise", "trento", "sardegna", "sicilia", "veneto"]},
    {from: "2020-12-04", to: "2021-01-05", color: "arancione", regions: ["basilicata", "calabria", "emiliaromagna", "friuliveneziagiulia", "lombardia", "marche", "piemonte", "puglia", "umbria"]},
    {from: "2020-12-04", to: "2021-01-05", color: "rossa", regions: ["abruzzo","campania","bolzano","toscana","valdaosta"]},
    {from: "2021-01-05", to: "2021-01-06", color: "rossa", any: true},
    {from: "2021-01-07", to: "2021-01-08", color: "gialla", any: true, notes: "Sono vietati gli spostamenti tra regioni."},
    {from: "2021-01-09", to: "2021-01-10", color: "arancione", any: true},
    {from: "2021-01-11", color: "gialla", regions: ["abruzzo","basilicata","campania","friuliveneziagiulia","lazio","liguria","marche","molise","piemonte","puglia","sardegna","toscana","bolzano","trento","umbria","valdaosta"], source: "https://www.fanpage.it/politica/cinque-regioni-in-zona-arancione-resto-ditalia-in-zona-gialla-da-lunedi-11-gennaio/"},
    {from: "2021-01-11", color: "arancione", regions: ["calabria", "emiliaromagna", "lombardia", "sicilia", "veneto"]},
    {from: "2021-01-17", to: "2021-01-23", color: "gialla", regions: ["basilicata","campania","molise","trento","sardegna","toscana"], source: "https://www.repubblica.it/cronaca/2021/01/15/news/coronavirus_colori_regioni-282656486/"},
    {from: "2021-01-17", to: "2021-01-23", color: "arancione", regions: ["abruzzo", "calabria", "emiliaromagna", "friuliveneziagiulia", "lazio", "liguria", "marche", "piemonte", "puglia", "umbria", "valdaosta", "veneto"]},
    {from: "2021-01-17", to: "2021-01-23", color: "rossa", regions: ["bolzano","lombardia","sicilia"]},
    {from: "2021-01-24", to: "2021-01-31", color: "gialla", regions: ["basilicata","campania","molise","trento","toscana"], source: "https://www.repubblica.it/cronaca/2021/01/23/news/coronavirus_colore_regioni-283891395/"},
    {from: "2021-01-24", to: "2021-01-31", color: "arancione", regions: ["sardegna", "lombardia", "abruzzo", "calabria", "emiliaromagna", "friuliveneziagiulia", "lazio", "liguria", "marche", "piemonte", "puglia", "umbria", "valdaosta", "veneto"]},
    {from: "2021-01-24", to: "2021-01-31", color: "rossa", regions: ["bolzano","sicilia"]},
    {from: "2021-02-01", color: "arancione", regions: ["puglia", "sardegna", "sicilia", "umbria", "bolzano"], source: "https://www.repubblica.it/cronaca/2021/01/29/news/monitoraggio_settimanale_l_rt_e_a_0_84-284790919/"},
    {from: "2021-02-01", color: "gialla", regions: ["abruzzo","basilicata","calabria","campania","emiliaromagna","friuliveneziagiulia","lazio","liguria","lombardia","marche","molise","piemonte","toscana","trento","valdaosta","veneto"]},
    {from: "2021-02-08", color: "arancione", regions: ["bolzano","puglia","sicilia","umbria"], source: "https://www.repubblica.it/cronaca/2021/02/07/news/covid_l_italia_cambia_colori_da_lunedi_17_regioni_in_giallo_e_4_in_arancione_ma_ci_sono_province_e_comuni_in_lockdown-286417810/"},
    {from: "2021-02-08", color: "rossa", regions: ["bolzano"]},
    {from: "2021-02-08", color: "rossa", provincie: ["perugia"], parentRegion: "umbria"},
    {from: "2021-02-08", color: "rossa", comuni: ["Amelia", "Attigliano", "Calvi dell'Umbria", "Lugnano in Teverina", "Montegabbione", "San Venanzo"], parentRegion: "umbria", notes: "Zona rossa rafforzata"},
    {from: "2021-02-08", color: "gialla", regions: ["abruzzo","basilicata","calabria","campania","emiliaromagna","friuliveneziagiulia","lazio","liguria","lombardia","marche","molise","piemonte","trento","sardegna","toscana","valdaosta","veneto"]},
    {from: "2021-02-11", color: "gialla", regions: ["puglia"], source: "https://www.repubblica.it/cronaca/2021/02/12/news/nuovi_colori_regioni_ordinanza_speranza-287134143/"},
    {from: "2021-02-14", color: "arancione", regions: ["toscana","trento","abruzzo","liguria"]},
    {from: "2021-02-15", color: "gialla", regions: ["sicilia"]},
    {from: "2021-02-14", color: "rossa", provincie: ["Pescara", "Chieti"], parentRegion: "abruzzo", source: "https://www.ansa.it/abruzzo/notizie/2021/02/14/covid-da-oggi-zona-rossa-per-province-pescara-e-chieti_382df930-c8f6-454b-aa22-e1475ed4885c.html"},
    {from: "2021-02-17", color: "rossa", comuni: ["Bollate", "Castrezzato", "Mede", "Viggiù"], parentRegion: "lombardia", source: "https://milano.repubblica.it/cronaca/2021/02/16/news/castrezzato_zona_rossa_mercoledi_17_febbraio_coronavirus_brescia-287886457/"},
    {from: "2021-02-17", color: "gialla", regions: ["marche"], notes: "Fino alla mezzanotte di sabato 20 è vietato entrare e uscire dalla provincia di Ancona.", source: "https://www.ilrestodelcarlino.it/cronaca/ordinanza-regione-marche-oggi-ancona-1.6032095"},
    {from: "2021-02-21", color: "arancione", regions: ["campania","emiliaromagna","molise"], source: "https://www.repubblica.it/cronaca/2021/02/19/news/covid_monitoraggio_colori_regioni_campania_emilia_molise_arancione-288258108/"},
    {from: "2021-02-21", color: "rossa", regions: ["bolzano"]},
    {from: "2021-02-25", to: "2021-03-07", color: "rossa", parentRegion: "abruzzo", comuni: ["Ateleta", "Pacentro", "Campo di Giove", "Cansano", "Rocca Casale", "Ortona dei Marsi"], source: "https://www.agi.it/cronaca/news/2021-02-23/sei-comuni-aquilano-zona-rossa-covid-11524790/"},
    {from: "2021-02-27", color: "arancione", regions: ["emiliaromagna"], source: "https://www.repubblica.it/cronaca/2021/02/25/news/covid_sei_regioni_rischiano_di_entrare_in_zona_arancione_le_restrizioni_scateranno_da_lunedi_-289191106/"},
    {from: "2021-02-25", to: "2021-03-11", color: "arancione", provincie: ["Imola"], parentRegion: "emiliaromagna", source: "https://www.regione.emilia-romagna.it/notizie/primo-piano/dal-27-febbraio-zona-arancione-scuro-in-tutti-comuni-della-citta-metropolitana-di-bologna"},
    {from: "2021-02-25", to: "2021-03-14", color: "arancione", provincie: ["Bologna"], parentRegion: "emiliaromagna"},
    {from: "2021-03-01", color: "bianca", regions: ["sardegna"], source: "https://www.repubblica.it/cronaca/2021/02/26/news/tre_regioni_in_arancione_una_in_rosso-289328808/"},
    {from: "2021-03-01", color: "gialla", regions: ["liguria"]},
    {from: "2021-03-01", color: "arancione", regions: ["lombardia","piemonte","marche"]},
    {from: "2021-03-01", color: "rossa", regions: ["basilicata", "molise"]},
    {from: "2021-02-23", to: "2021-03-09", color: "arancione", provincie: ["Brescia"], parentRegion: "lombardia", source: "https://milano.repubblica.it/cronaca/2021/03/01/news/brescia_arancione_scuro_altri_8_giorni-289795444/"},
    {from: "2021-02-23", to: "2021-03-09", color: "arancione", comuni: ["Sarnico, Gandosso, Viadanica, Predore, Adrara San Martino, Villongo, Castelli di Calepio, Credaro, Soncino"], parentRegion: "lombardia"},
    {from: "2021-03-03", to: "2021-03-10", color: "arancione", provincie: ["Como"], parentRegion: "lombardia"},
    {from: "2021-03-03", to: "2021-03-10", color: "arancione", comuni: ["Viadana, Pomponesco, Gazzuolo, Commessaggio, Dosolo, Suzzara, Gonzaga, Pegognaga, Moglia, Quistello, San Giacomo delle Segnate, San Benedetto Po, Asola, Castelgoffredo, Casaloldo, Medole, Casalmoro, Castiglione delle Stiviere (Mantova), Cremona, Spinadesco, Castelverde, Pozzaglio ed Uniti, Corte dei Frati, Corte de’ Cortesi con Cignone, Spineda, Bordolano e Olmeneta (Cremona), Casorate Primo, Trovo, Trivolzio, Rognano, Giussago, Zeccone, Siziano, Battuda, Bereguardo, Borgarello, Zerbolò, Vidigulfo (Pavia), Motta Visconti, Besate, Binasco, Truccazzano, Melzo, Liscate, Pozzuolo Martesana, Vignate, Rodano, Casarile (Milano)"], parentRegion: "lombardia"},
    {from: "2021-03-02", color: "rossa", provincie: ["Bologna"], parentRegion: "emiliaromagna", source: "https://www.corriere.it/salute/21_marzo_02/bologna-zona-rossa-romagna-gia-oggi-zona-arancione-scuro-21bcf2f0-7b3a-11eb-a9cc-1eebe11a6a7c.shtml"},
    {from: "2021-03-02", color: "arancione", provincie: ["Ravenna, Cesena, Rimini (eccetto Forlì)"], parentRegion: "emiliaromagna"},
    {from: "2021-03-05", to: "2021-03-14", color: "arancione", regions: ["lombardia"], source: "https://milano.repubblica.it/cronaca/2021/03/04/news/lombardia_zona_arancione_rinforzato_ordinanza_governatore_attilio_fontana-290257351/"},
    {from: "2021-03-06", color: "rossa", provincie: ["Ancona", "Macerata"], parentRegion: "marche", source: "https://www.repubblica.it/cronaca/2021/03/05/news/monitoraggio_colori_regioni_zona_rossa_zona_arancione_iss-290417979/"},
    {from: "2021-03-08", color: "arancione", regions: ["friuliveneziagiulia", "veneto"]},
    {from: "2021-03-08", color: "arancione", regions: ["lombardia"], rafforzata: true},
    {from: "2021-03-08", color: "rossa", regions: ["campania"]},
    {from: "2021-03-11", to: "2021-03-28", color: "gialla", rafforzata: true, comuni: ["Bari"], parentRegion: "puglia", notes: "Divieto di asporto e chiusura dei distributori automatici di cibi e bevande dalle ore 18 e sospensione delle attività di vendita al dettaglio dalle 19.", source: "https://www.repubblica.it/politica/2021/03/10/news/covid_e_nuovo_dpcm_riunita_la_cabina_di_regia_con_draghi-291651612/"},
    {from: "2021-03-11", to: "2021-03-21", color: "rossa", rafforzata: true, regions: ["campania"], notes: "Chiusi al pubblico parchi urbani, ville comunali, giardini pubblici, lungomari e piazze."},
    {from: "2021-03-15", color: "rossa", provincie: ["Arezzo", "Prato", "Pistoia"], parentRegion: "toscana", source: "https://www.arezzonotizie.it/cronaca/provincia-arezzo-zona-rossa-giani-toscana-proposta.html"},
    {from: "2021-03-15", color: "rossa", provincie: ["Santa Luce, Castellina Marittima, Montopoli, San Miniato, Castelfranco di Sotto, Santa Croce sull'Arno (Pisa)"], parentRegion: "toscana"},
    {from: "2021-03-15", color: "rossa", regions: ["lombardia", "emiliaromagna", "piemonte", "veneto", "trento", "friuliveneziagiulia", "lazio", "marche", "puglia", "campania", "molise"], source: "https://www.repubblica.it/cronaca/2021/03/12/news/l_istituto_superiore_di_sanita_l_epidemia_accelera_-291933309/"},
    {from: "2021-03-15", color: "arancione", regions: ["valdaosta", "bolzano", "liguria", "toscana", "umbria", "abruzzo", "calabria", "basilicata", "sicilia"]},
    {from: "2021-03-15", color: "bianca", regions: ["sardegna"]},
    {from: "2021-03-22", color: "rossa", regions: ["friuliveneziagiulia", "emiliaromagna", "piemonte", "marche", "lombardia", "campania", "trento", "puglia", "veneto"], source: "https://www.repubblica.it/cronaca/2021/03/19/news/otto_regioni_e_una_provincia_in_rosso_fino_a_pasqua-292873770/"},
    {from: "2021-03-22", color: "arancione", regions: ["molise", "sardegna"]},
    {from: "2021-03-30", color: "arancione", regions: ["lazio"], source: "https://www.repubblica.it/cronaca/2021/03/26/news/colori_lazio_e_val_d_aosta_cambiano_zona_rosso_certo_fino_al_13_aprile_per_otto_regioni_e_una_provincia-293849549/"},
    {from: "2021-03-30", color: "rossa", regions: ["valdaosta", "calabria", "toscana"]},
    {from: "2021-04-03", to: "2021-04-05", color: "rossa", any: true, notes: "Consentito lo spostamento verso una sola abitazione nel proprio comune, una volta al giorno, tra le 5:00 e le 22:00, per un massimo di due visitatori.", source: "https://www.altalex.com/documents/news/2021/03/13/decreto-pasqua"},
    {from: "2021-04-05", color: "arancione", regions: ["veneto", "marche", "trento"], source: "https://www.repubblica.it/cronaca/2021/04/02/news/monitoraggio_l_rt_scende_sotto_1_nessuna_regione_cambia_colore_ma_in_9_restano_in_rosso_fino_al_20_aprile-294760599/"},
    {from: "2021-04-07", to: "2021-04-22", color: "rossa", provincie: ["Palermo"], parentRegion: "sicilia", source: "https://gdsit.cdn-immedia.net/2021/04/Ordinanza_Musumeci.pdf"},
    {from: "2021-04-12", color: "arancione", regions: ["piemonte","toscana","emiliaromagna","lombardia","friuliveneziagiulia"], source: "https://www.repubblica.it/cronaca/2021/04/09/news/piemonte_toscana_emilia_lombardia_e_friuli_verso_l_arancione-295611654/?ref=tgpr"},
    {from: "2021-04-12", color: "rossa", regions: ["sardegna"]},
    {from: "2021-04-12", color: "rossa", provincie: ["Cuneo"], parentRegion: "piemonte", source: "https://torino.repubblica.it/cronaca/2021/04/09/news/zona_arancione_lunedi_in_piemonte_le_province_di_torino_e_cuneo_resteranno_rosse_se_ne_riparlera_a_meta_settimana-295746714/"},
    {from: "2021-04-19", color: "arancione", regions: ["campania"], source: "https://www.repubblica.it/cronaca/2021/04/16/news/colori_delle_regioni_solo_tre_restano_in_rosso_la_campania_diventa_arancione-296639084/"},
    {from: "2021-04-26", color: "rossa", regions: ["sardegna"], source: "https://www.repubblica.it/cronaca/2021/04/23/news/cabina_di_regia_l_rt_scende_a_0_81_nessuna_regione_in_rosso-297665062/"},
    {from: "2021-04-26", color: "arancione", regions: ["calabria", "sicilia", "valdaosta", "basilicata", "puglia"]},
    {from: "2021-04-26", color: "gialla", regions: ["abruzzo", "campania", "emiliaromagna", "friuliveneziagiulia", "lazio", "liguria", "lombardia", "marche", "molise", "piemonte", "toscana", "umbria", "veneto", "bolzano", "trento"]},
    {from: "2021-05-03", color: "rossa", regions: ["valdaosta"], source: "https://www.repubblica.it/cronaca/2021/04/30/news/monitoraggio_l_rt_a_0_85_quattro_regioni_sono_in_arancione_e_una_in_rosso_la_puglia_e_in_bilico-298756911/"},
    {from: "2021-05-03", color: "arancione", regions: ["sardegna"]},
    {from: "2021-05-10", color: "arancione", regions: ["sicilia", "valdaosta", "sardegna"], source: "https://www.repubblica.it/cronaca/2021/05/06/news/colori_delle_regioni_italia_tutta_gialla_in_arancione_solo_sicilia_e_valle_d_aosta-299575897/"},
    {from: "2021-05-10", color: "gialla", regions: ["calabria", "basilicata", "puglia"]},
    {from: "2021-05-17", color: "gialla", regions: ["sardegna", "sicilia"], source: "https://www.ilpost.it/2021/05/17/coronavirus-italia-colori-regioni-17-maggio/"},
    {from: "2021-05-24", color: "gialla", regions: ["valdaosta"], source: "https://www.adnkronos.com/valle-daosta-zona-gialla-da-lunedi-24-maggio-le-riaperture_14PGTa8oPMdWh6eTN8oQRb"},
    {from: "2021-06-01", color: "bianca", regions: ["friuliveneziagiulia", "sardegna", "molise"], source: "https://www.repubblica.it/cronaca/2021/05/17/news/coronavirus_il_numero_dei_casi_continua_a_scendere_-28_in_una_settimana-301374104/"},
    {from: "2021-06-07", color: "bianca", regions: ["veneto", "liguria", "umbria", "abruzzo"], source: "https://www.repubblica.it/cronaca/2021/06/06/news/coprifuoco_da_domani_slitta_a_mezzanotte_e_altre_4_regioni_entrano_in_zona_bianca-304405202/"},
    {from: "2021-06-14", color: "bianca", regions: ["emiliaromagna", "lombardia", "lazio", "piemonte", "puglia", "trento"]},
    {from: "2021-06-28", color: "bianca", any: true, source: "https://www.ilpost.it/2021/06/25/italia-zona-bianca-regioni/"},
    {from: "2021-08-30", color: "gialla", regions: ["sicilia"], source: "https://www.repubblica.it/cronaca/2021/08/26/news/sicilia_in_giallo_domani_l_ufficialita_-315357527/"},
    { from: "2021-10-09", color: "bianca", regions: ["sicilia"] },
    { from: "2021-11-29", color: "gialla", regions: ["friuliveneziagiulia"] },
    /*
    { from: "2021-12-06", color: "bianca", regions: ["campania", "calabria", "sicilia"], notes: "Obbligo di mascherina anche all'aperto.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "sardegna", comuni: ["Cagliari"], notes: "Obbligo di mascherina anche all'aperto.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "lazio", comuni: ["Roma"], notes: "Obbligo di mascherina anche all'aperto nelle vie dello shopping.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "toscana", comuni: ["Firenze"], notes: "Obbligo di mascherina anche all'aperto in alcuni orari e aree della città.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "liguria", comuni: ["Genova"], notes: "Obbligo di mascherina anche all'aperto in alcune aree della città.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "emiliaromagna", comuni: ["Reggio Emilia"], notes: "Obbligo di mascherina anche all'aperto in alcune aree della città.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "lombardia", comuni: ["Milano", "Pavia"], notes: "Obbligo di mascherina anche all'aperto in alcune aree della città.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "piemonte", comuni: ["Torino"], notes: "Obbligo di mascherina anche all'aperto in alcuni orari e aree della città.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    { from: "2021-12-06", color: "bianca", parentRegion: "valdaosta", comuni: ["Aosta"], notes: "Obbligo di mascherina anche all'aperto in alcune aree della città.", source: "https://tg24.sky.it/cronaca/2021/12/06/covid-mascherine-aperto" },
    */
    { from: "2021-12-06", color: "gialla", regions: ["bolzano"], source: "https://www.repubblica.it/cronaca/2021/11/30/news/green_pass_l_alto_adige_da_lunedi_diventa_zona_gialla-328397943/" },
    { from: "2021-12-13", color: "gialla", regions: ["calabria"], source: "https://www.repubblica.it/cronaca/2021/12/10/news/covid_iss_incidenza_sale_da_155_a_176_rt_in_lieve_calo_all_1_18-329633390/" },
    { from: "2021-12-20", color: "gialla", regions: ["liguria", "veneto", "marche", "trento"], source: "https://www.repubblica.it/cronaca/2021/12/16/news/veneto_liguria_marche_e_trento_vanno_in_giallo-330446091/" },
    // { from: "2021-12-23", color: "bianca", regions: ["lazio"], notes: "Obbligo di mascherina anche all'aperto.", source: "https://roma.repubblica.it/cronaca/2021/12/18/news/covid_folla_nel_centro_di_roma_chiuso_tratto_via_del_corso-330706840/" },
    { from: "2022-01-03", color: "gialla", regions: ["lazio", "lombardia", "sicilia", "piemonte"], source: "https://www.ilpost.it/2022/01/01/lazio-lombardia-sicilia-piemonte-zona-gialla/" },
    { from: "2022-01-10", color: "gialla", regions: ["toscana", "emiliaromagna", "abruzzo", "valdaosta"], source: "https://www.repubblica.it/cronaca/2022/01/07/news/covid_italia_rt_incidenza-332953400/" },
    { from: "2022-01-17", color: "gialla", regions: ["campania"], source: "https://www.rainews.it/articoli/2022/01/il-ministro-speranza-ha-firmato-lordinanza-val-daosta-in-zona-arancione-campania-in-giallo-bffbe24c-587e-4d1b-afd3-32b8b78f3a18.html" },
    { from: "2022-01-17", color: "arancione", regions: ["valdaosta"], source: "https://www.rainews.it/articoli/2022/01/il-ministro-speranza-ha-firmato-lordinanza-val-daosta-in-zona-arancione-campania-in-giallo-bffbe24c-587e-4d1b-afd3-32b8b78f3a18.html" },
    { from: "2021-01-24", color: "arancione", regions: ["abruzzo", "friuliveneziagiulia", "sicilia", "piemonte"], source: "https://www.ilpost.it/2022/01/22/friuli-venezia-giulia-abruzzo-piemonte-sicilia-zona-arancione/" },
    { from: "2021-02-14", color: "gialla", regions: ["sicilia", "molise"], source: "https://www.ilpost.it/2022/02/11/sicilia-molise-zona-gialla-coronavirus/" },
];

const months = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
function formatDate(date: Date): string {
    return date.getDate() + " " + months[date.getMonth()];
}

export class BasicRule {
    color: Color;
    notes: string | null;
    from: Date;
    to?: Date;
    originalTo?: Date;
    maybe: boolean;
    rafforzata: boolean;
    source?: string;

    constructor(src: BasicRuleData) {
        this.color = src.color;
        this.from = new Date(src.from);
        if (src.to !== undefined) {
            // Fix in modo che "to" comprenda tutta la giornata indicata: aggiungo 1 giorno
            const to = new Date(src.to);
            to.setDate(to.getDate() + 1);
            this.to = to;
            this.originalTo = new Date(src.to);
        }
        this.notes = src.notes || "";
        this.maybe = src.maybe || false;
        this.rafforzata = src.rafforzata || false;
        this.source = src.source;
    }
    dateIsContained(date: Date): boolean {
        if (date < this.from)
            return false;
        if (this.to !== undefined && date >= this.to)
            return false;
        return true;
    }
    formatInterval() {
        let ret = "Dal " + formatDate(this.from);
        if (this.originalTo !== undefined)
            ret += " al " + formatDate(this.originalTo);
        return ret;
    }
    makeTitle() {
        return this.formatInterval() + ": zona " + this.color + (this.rafforzata ? " rafforzata" : "");
    }
    makeDescription() {
        return this.formatInterval()
            + (this.maybe ? " potrebbero essere " : " sono ")
            + `in zona ${this.color} `
            + (this.rafforzata ? "rafforzata " : "")
            + (this as unknown as IRule).whatIsAffected()
            + "."
            + (this.notes
                ? (" Nota: " + this.notes)
                : "");
    }
}

class AnyRule extends BasicRule implements IRule {
    constructor(src: AnyRuleData) {
        super(src);
    }
    regionIsPartlyAffected(region: Region): boolean {
        return true;
    }
    regionIsCompletelyAffected(region: Region): boolean {
        return true;
    }
    whatIsAffected(): string {
        return "tutte le regioni";
    }
}

class RegionsRule extends BasicRule implements IRule {
    regions: Region[];

    constructor(src: RegionsRuleData) {
        super(src);
        this.regions = src.regions;
    }
    regionIsPartlyAffected(region: Region): boolean {
        return this.regions.includes(region);
    }
    regionIsCompletelyAffected(region: Region): boolean {
        return this.regions.includes(region);
    }
    whatIsAffected(): string {
        return "le seguenti regioni: " + this.regions.map(it => nomiFriendly[it]).join(", ");
    }
}

class ComuniRule extends BasicRule implements IRule {
    comuni: string[];
    parentRegion: Region;

    constructor(src: ComuniRuleData) {
        super(src);
        this.comuni = src.comuni;
        this.parentRegion = src.parentRegion;
    }
    regionIsPartlyAffected(region: Region): boolean {
        return this.parentRegion == region;
    }
    regionIsCompletelyAffected(region: Region): boolean {
        return false;
    }
    whatIsAffected(): string {
        return `i seguenti comuni in ${nomiFriendly[this.parentRegion]}: ${this.comuni.join(", ")}`;
    }
}

class ProvincieRule extends BasicRule implements IRule {
    provincie: string[];
    parentRegion: Region;

    constructor(src: ProvincieRuleData) {
        super(src);
        this.provincie = src.provincie;
        this.parentRegion = src.parentRegion;
    }
    regionIsPartlyAffected(region: Region): boolean {
        return this.parentRegion == region;
    }
    regionIsCompletelyAffected(region: Region): boolean {
        return false;
    }
    whatIsAffected(): string {
        return `le seguenti provincie in ${nomiFriendly[this.parentRegion]}: ${this.provincie.join(", ")}`;
    }
}

export type Rule = AnyRule | RegionsRule | ComuniRule | ProvincieRule;

const data: Rule[] = _data.map(ruleData => {
    if ("any" in ruleData) {
        return new AnyRule(ruleData as AnyRuleData)
    } else if ("regions" in ruleData) {
        return new RegionsRule(ruleData as RegionsRuleData)
    } else if ("comuni" in ruleData) {
        return new ComuniRule(ruleData as ComuniRuleData)
    } else if ("provincie" in ruleData) {
        return new ProvincieRule(ruleData as ProvincieRuleData)
    } else {
        throw new Error("Unknown rule data subtype!")
    }
});

// All rules that affect a region either completely or in part
function allRulesForRegion(region: Region): Rule[] {
    return data.filter(item => item.regionIsPartlyAffected(region));
}

// The rule that defines the color of the entire region
function ruleFor(region: Region, date = new Date()): Rule {
    if (!(region in nomiFriendly))
        throw new Error("Unknown region " + region);
    let rule;
    for (const item of data) {
        if (item.regionIsCompletelyAffected(region) && item.dateIsContained(date))
            rule = item;
    }
    if (rule === undefined)
        throw new Error(`No rule for region=${region}, date=${date.toDateString()}`);
    return rule;
}

function colorOf(region: Region, date = new Date()): string {
    return ruleFor(region, date).color;
}

const colori = {
    rossa: "#e2001a",
    arancione: "#ee7f01",
    gialla: "#fbc02d",
    bianca: "#ffffff"
};  

export {data, nomiFriendly, allRulesForRegion, ruleFor, colorOf, colori};
