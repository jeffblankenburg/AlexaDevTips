const get = require("./get");
const helper = require("../helper");

async function getRandomSpeech(table, locale) {
    const response = await get(process.env.airtable_base_speech, "&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22" + locale + "%22%2C+Locale)!%3D0)", table);
    const speech = helper.getRandomItem(response.records);
    console.log("RANDOM [" + table.toUpperCase() + "] = " + JSON.stringify(speech));
    return speech.fields.VoiceResponse;
}

module.exports = getRandomSpeech;