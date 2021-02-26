import fs from "fs";
const pug = require("pug");
import {data, nomiFriendly, allRulesForRegion, ruleFor, colorOf, colori} from "./dati";

function compileRegion(region: string) {
    console.log(`Compile ${region}`)
    const output = pug.compile(`include includes/regione.pug\n+paginaRegione("${region}")`, {filename: region + ".pug"})({
        data, nomiFriendly, allRulesForRegion, ruleFor, colorOf, colori
    });
    fs.writeFileSync(region + ".html", output);
}

function compileFile(filename: string) {
    console.log(`Compile ${filename}`)
    const output = pug.compileFile("index.pug")({
        data, nomiFriendly, allRulesForRegion, ruleFor, colorOf, colori
    });
    fs.writeFileSync(filename + ".html", output);
}

for (const regionName in nomiFriendly) {
    compileRegion(regionName);
}
compileFile("index");