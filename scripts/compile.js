"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const pug = require("pug");
const dati_1 = require("./dati");
const today = new Date();
function compileRegion(region) {
    console.log(`Compile ${region}`);
    const output = pug.compile(`include includes/regione.pug\n+paginaRegione("${region}")`, { filename: region + ".pug" })({
        data: dati_1.data, nomiFriendly: dati_1.nomiFriendly, allRulesForRegion: dati_1.allRulesForRegion, ruleFor: dati_1.ruleFor, colorOf: dati_1.colorOf, colori: dati_1.colori
    });
    fs_1.default.writeFileSync(region + ".html", output);
    const latestRules = dati_1.allRulesForRegion(region).reverse().slice(0, 5);
    const region_json = JSON.stringify(latestRules
        .filter(rule => Math.ceil((Date.now() - rule.from.getTime()) / (1000 * 60 * 60 * 24)) <= 7)
        .map(rule => ({
        uid: crypto_1.default.createHash("md5").update(JSON.stringify(rule)).digest("hex"),
        updateDate: rule.from.toISOString(),
        titleText: rule.makeTitle(),
        mainText: rule.makeDescription(),
        redirectionUrl: "https://inchezonasiamo.it/" + region
    })));
    fs_1.default.writeFileSync(`alexa/${region}.json`, region_json);
}
function compileFile(filename) {
    console.log(`Compile ${filename}`);
    const output = pug.compileFile("index.pug")({
        data: dati_1.data, nomiFriendly: dati_1.nomiFriendly, allRulesForRegion: dati_1.allRulesForRegion, ruleFor: dati_1.ruleFor, colorOf: dati_1.colorOf, colori: dati_1.colori
    });
    fs_1.default.writeFileSync(filename + ".html", output);
}
if (process.argv.length != 2) {
    process.argv.slice(2).map(region => compileRegion(region));
    process.exit(0);
}
for (const regionName in dati_1.nomiFriendly) {
    compileRegion(regionName);
}
compileFile("index");
const latestRules = dati_1.data.reverse().slice(0, 5);
dati_1.data.reverse(); // Undo in-place reverse
const all_json = JSON.stringify(latestRules
    .filter(rule => Math.ceil((Date.now() - rule.from.getTime()) / (1000 * 60 * 60 * 24)) <= 7)
    .map(rule => ({
    uid: crypto_1.default.createHash("md5").update(JSON.stringify(rule)).digest("hex"),
    updateDate: rule.from.toISOString(),
    titleText: rule.makeTitle(),
    mainText: rule.makeDescription(),
    redirectionUrl: "https://inchezonasiamo.it"
})));
fs_1.default.writeFileSync("alexa/all.json", all_json);
