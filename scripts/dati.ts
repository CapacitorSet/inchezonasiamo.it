type Color = "rossa" | "arancione" | "gialla" | "bianca";
type Region = "abruzzo"|"basilicata"|"calabria"|"campania"|"emiliaromagna"|"friuliveneziagiulia"|"lazio"|"liguria"|"lombardia"|"marche"|"molise"|"piemonte"|"puglia"|"sardegna"|"sicilia"|"toscana"|"bolzano"|"trento"|"umbria"|"valdaosta"|"veneto";
type BasicRuleData = {
    color: Color;
    from: string;
    to?: string;
    maybe?: boolean;
    notes?: string;
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
    // https://www.fanpage.it/politica/cinque-regioni-in-zona-arancione-resto-ditalia-in-zona-gialla-da-lunedi-11-gennaio/
    {from: "2021-01-11", color: "gialla", regions: ["abruzzo","basilicata","campania","friuliveneziagiulia","lazio","liguria","marche","molise","piemonte","puglia","sardegna","toscana","bolzano","trento","umbria","valdaosta"]},
    {from: "2021-01-11", color: "arancione", regions: ["calabria", "emiliaromagna", "lombardia", "sicilia", "veneto"]},
    // https://www.repubblica.it/cronaca/2021/01/15/news/coronavirus_colori_regioni-282656486/
    {from: "2021-01-17", to: "2021-01-23", color: "gialla", regions: ["basilicata","campania","molise","trento","sardegna","toscana"]},
    {from: "2021-01-17", to: "2021-01-23", color: "arancione", regions: ["abruzzo", "calabria", "emiliaromagna", "friuliveneziagiulia", "lazio", "liguria", "marche", "piemonte", "puglia", "umbria", "valdaosta", "veneto"]},
    {from: "2021-01-17", to: "2021-01-23", color: "rossa", regions: ["bolzano","lombardia","sicilia"]},
    // https://www.repubblica.it/cronaca/2021/01/23/news/coronavirus_colore_regioni-283891395/
    {from: "2021-01-24", to: "2021-01-31", color: "gialla", regions: ["basilicata","campania","molise","trento","toscana"]},
    {from: "2021-01-24", to: "2021-01-31", color: "arancione", regions: ["sardegna", "lombardia", "abruzzo", "calabria", "emiliaromagna", "friuliveneziagiulia", "lazio", "liguria", "marche", "piemonte", "puglia", "umbria", "valdaosta", "veneto"]},
    {from: "2021-01-24", to: "2021-01-31", color: "rossa", regions: ["bolzano","sicilia"]},
    // https://www.repubblica.it/cronaca/2021/01/29/news/monitoraggio_settimanale_l_rt_e_a_0_84-284790919/
    {from: "2021-02-01", color: "arancione", regions: ["puglia", "sardegna", "sicilia", "umbria", "bolzano"]},
    {from: "2021-02-01", color: "gialla", regions: ["abruzzo","basilicata","calabria","campania","emiliaromagna","friuliveneziagiulia","lazio","liguria","lombardia","marche","molise","piemonte","toscana","trento","valdaosta","veneto"]},
    // https://www.repubblica.it/cronaca/2021/02/07/news/covid_l_italia_cambia_colori_da_lunedi_17_regioni_in_giallo_e_4_in_arancione_ma_ci_sono_province_e_comuni_in_lockdown-286417810/
    {from: "2021-02-08", color: "arancione", regions: ["bolzano","puglia","sicilia","umbria"]},
    {from: "2021-02-08", color: "rossa", regions: ["bolzano"]},
    {from: "2021-02-08", color: "rossa", provincie: ["perugia"], parentRegion: "umbria"},
    {from: "2021-02-08", color: "rossa", comuni: ["Amelia", "Attigliano", "Calvi dell'Umbria", "Lugnano in Teverina", "Montegabbione", "San Venanzo"], parentRegion: "umbria", notes: "Zona rossa rafforzata"},
    {from: "2021-02-08", color: "gialla", regions: ["abruzzo","basilicata","calabria","campania","emiliaromagna","friuliveneziagiulia","lazio","liguria","lombardia","marche","molise","piemonte","trento","sardegna","toscana","valdaosta","veneto"]},
    // https://www.repubblica.it/cronaca/2021/02/12/news/nuovi_colori_regioni_ordinanza_speranza-287134143/
    {from: "2021-02-11", color: "gialla", regions: ["puglia"]},
    {from: "2021-02-14", color: "arancione", regions: ["toscana","trento","abruzzo","liguria"]},
    {from: "2021-02-15", color: "gialla", regions: ["sicilia"]},
    // https://www.ansa.it/abruzzo/notizie/2021/02/14/covid-da-oggi-zona-rossa-per-province-pescara-e-chieti_382df930-c8f6-454b-aa22-e1475ed4885c.html
    {from: "2021-02-14", color: "rossa", provincie: ["Pescara", "Chieti"], parentRegion: "abruzzo"},
    // https://milano.repubblica.it/cronaca/2021/02/16/news/castrezzato_zona_rossa_mercoledi_17_febbraio_coronavirus_brescia-287886457/
    {from: "2021-02-17", color: "rossa", comuni: ["Bollate", "Castrezzato", "Mede", "Viggiù"], parentRegion: "lombardia"},
    // https://www.ilrestodelcarlino.it/cronaca/ordinanza-regione-marche-oggi-ancona-1.6032095
    {from: "2021-02-17", color: "gialla", regions: ["marche"], notes: "Fino alla mezzanotte di sabato 20 è vietato entrare e uscire dalla provincia di Ancona."},
    // https://www.repubblica.it/cronaca/2021/02/19/news/covid_monitoraggio_colori_regioni_campania_emilia_molise_arancione-288258108/
    {from: "2021-02-21", color: "arancione", regions: ["campania","emiliaromagna","molise"]},
    {from: "2021-02-21", color: "rossa", regions: ["bolzano"]},
    // https://www.agi.it/cronaca/news/2021-02-23/sei-comuni-aquilano-zona-rossa-covid-11524790/
    {from: "2021-02-25", to: "2021-03-07", color: "rossa", parentRegion: "abruzzo", comuni: ["Ateleta", "Pacentro", "Campo di Giove", "Cansano", "Rocca Casale", "Ortona dei Marsi"]},
    // https://www.repubblica.it/cronaca/2021/02/25/news/covid_sei_regioni_rischiano_di_entrare_in_zona_arancione_le_restrizioni_scateranno_da_lunedi_-289191106/
    {from: "2021-02-27", color: "arancione", regions: ["emiliaromagna"]},
    // https://www.regione.emilia-romagna.it/notizie/primo-piano/dal-27-febbraio-zona-arancione-scuro-in-tutti-comuni-della-citta-metropolitana-di-bologna
    {from: "2021-02-25", to: "2021-03-11", color: "arancione", provincie: ["Imola"], parentRegion: "emiliaromagna"},
    {from: "2021-02-25", to: "2021-03-14", color: "arancione", provincie: ["Bologna"], parentRegion: "emiliaromagna"},
    // https://www.repubblica.it/cronaca/2021/02/26/news/tre_regioni_in_arancione_una_in_rosso-289328808/
    {from: "2021-03-01", color: "bianca", regions: ["sardegna"]},
    {from: "2021-03-01", color: "gialla", regions: ["liguria"]},
    {from: "2021-03-01", color: "arancione", regions: ["lombardia","piemonte","marche"]},
    {from: "2021-03-01", color: "rossa", regions: ["basilicata", "molise"]},
    // https://milano.repubblica.it/cronaca/2021/03/01/news/brescia_arancione_scuro_altri_8_giorni-289795444/
    {from: "2021-02-23", to: "2021-03-09", color: "arancione", provincie: ["Brescia"], parentRegion: "lombardia"},
    {from: "2021-02-23", to: "2021-03-09", color: "arancione", comuni: ["Sarnico, Gandosso, Viadanica, Predore, Adrara San Martino, Villongo, Castelli di Calepio, Credaro, Soncino"], parentRegion: "lombardia"},
    {from: "2021-03-03", to: "2021-03-10", color: "arancione", provincie: ["Como"], parentRegion: "lombardia"},
    {from: "2021-03-03", to: "2021-03-10", color: "arancione", comuni: ["Viadana, Pomponesco, Gazzuolo, Commessaggio, Dosolo, Suzzara, Gonzaga, Pegognaga, Moglia, Quistello, San Giacomo delle Segnate, San Benedetto Po, Asola, Castelgoffredo, Casaloldo, Medole, Casalmoro, Castiglione delle Stiviere (Mantova), Cremona, Spinadesco, Castelverde, Pozzaglio ed Uniti, Corte dei Frati, Corte de’ Cortesi con Cignone, Spineda, Bordolano e Olmeneta (Cremona), Casorate Primo, Trovo, Trivolzio, Rognano, Giussago, Zeccone, Siziano, Battuda, Bereguardo, Borgarello, Zerbolò, Vidigulfo (Pavia), Motta Visconti, Besate, Binasco, Truccazzano, Melzo, Liscate, Pozzuolo Martesana, Vignate, Rodano, Casarile (Milano)"], parentRegion: "lombardia"},
    // https://www.corriere.it/salute/21_marzo_02/bologna-zona-rossa-romagna-gia-oggi-zona-arancione-scuro-21bcf2f0-7b3a-11eb-a9cc-1eebe11a6a7c.shtml
    {from: "2021-03-02", color: "rossa", provincie: ["Bologna"], parentRegion: "emiliaromagna"},
    {from: "2021-03-02", color: "arancione", provincie: ["Ravenna, Cesena, Rimini (eccetto Forlì)"], parentRegion: "emiliaromagna"},
    // https://milano.repubblica.it/cronaca/2021/03/04/news/lombardia_zona_arancione_rinforzato_ordinanza_governatore_attilio_fontana-290257351/
    {from: "2021-03-05", to: "2021-03-14", color: "arancione", regions: ["lombardia"]},
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
        return this.formatInterval() + ": zona " + this.color;
    }
    makeDescription() {
        return this.formatInterval()
            + (this.maybe ? " potrebbero essere " : " sono ")
            + `in zona ${this.color} `
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
