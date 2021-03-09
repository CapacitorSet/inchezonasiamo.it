import fs from "fs";
import crypto from "crypto";
const pug = require("pug");
import {data, nomiFriendly, allRulesForRegion, ruleFor, colorOf, colori} from "./dati";

const today = new Date();

function compileRegion(region: string) {
    console.log(`Compile ${region}`)
    const output = pug.compile(`include includes/regione.pug\n+paginaRegione("${region}")`, {filename: region + ".pug"})({
        data, nomiFriendly, allRulesForRegion, ruleFor, colorOf, colori
    });
    fs.writeFileSync(region + ".html", output);

    const latestRules = allRulesForRegion(region as any).reverse().slice(0, 5)
    const region_json = JSON.stringify(latestRules
        .filter(rule => Math.ceil((Date.now() - rule.from.getTime())/(1000*60*60*24)) <= 7)
        .map(rule => ({
            uid: crypto.createHash("md5").update(JSON.stringify(rule)).digest("hex"),
            updateDate: rule.from.toISOString(),
            titleText: rule.makeTitle(),
            mainText: rule.makeDescription(),
            redirectionUrl: "https://inchezonasiamo.it/" + region
        }))
    );
    fs.writeFileSync(`alexa/${region}.json`, region_json);
}

function compileFile(filename: string) {
    console.log(`Compile ${filename}`)
    const output = pug.compileFile("index.pug")({
        data, nomiFriendly, allRulesForRegion, ruleFor, colorOf, colori
    });
    fs.writeFileSync(filename + ".html", output);
}

if (process.argv.length != 2) {
    process.argv.slice(2).map(region => compileRegion(region));
    process.exit(0);
}

for (const regionName in nomiFriendly) {
    compileRegion(regionName);
}
compileFile("index");

const latestRules = data.reverse().slice(0, 5);
data.reverse(); // Undo in-place reverse
const all_json = JSON.stringify(latestRules
    .filter(rule => Math.ceil((Date.now() - rule.from.getTime())/(1000*60*60*24)) <= 7)
    .map(rule => ({
        uid: crypto.createHash("md5").update(JSON.stringify(rule)).digest("hex"),
        updateDate: rule.from.toISOString(),
        titleText: rule.makeTitle(),
        mainText: rule.makeDescription(),
        redirectionUrl: "https://inchezonasiamo.it"
    }))
);
fs.writeFileSync("alexa/all.json", all_json);