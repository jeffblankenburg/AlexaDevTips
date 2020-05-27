const get = require("./get");
const helper = require("../helper");

async function getRandomSpeechcon(locale) {
    const response = await get(process.env.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22" + locale + "%22%2C+Locale)!%3D0)", "Speechcon");
    const speechconItem = helper.getRandomItem(response.records);
    console.log("RANDOM [SPEECHCON] = " + JSON.stringify(speechconItem));
    return speechconItem.fields.Name;
}

module.exports = getRandomSpeechcon;