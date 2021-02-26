"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pug = require("pug");
const dati_1 = require("./dati");
function compileRegion(region) {
    console.log(`Compile ${region}`);
    const output = pug.compile(`include includes/regione.pug\n+paginaRegione("${region}")`, { filename: region + ".pug" })({
        data: dati_1.data, nomiFriendly: dati_1.nomiFriendly, allRulesForRegion: dati_1.allRulesForRegion, ruleFor: dati_1.ruleFor, colorOf: dati_1.colorOf, colori: dati_1.colori
    });
    fs_1.default.writeFileSync(region + ".html", output);
}
function compileFile(filename) {
    console.log(`Compile ${filename}`);
    const output = pug.compileFile("index.pug")({
        data: dati_1.data, nomiFriendly: dati_1.nomiFriendly, allRulesForRegion: dati_1.allRulesForRegion, ruleFor: dati_1.ruleFor, colorOf: dati_1.colorOf, colori: dati_1.colori
    });
    fs_1.default.writeFileSync(filename + ".html", output);
}
for (const regionName in dati_1.nomiFriendly) {
    compileRegion(regionName);
}
compileFile("index");
