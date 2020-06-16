const helper = require("../helper");
const fetch = require("node-fetch");

async function getRandomSpeech(table, locale) {
  console.log(`<=== airtable/getRandomSpeech.js ===>`);
  //const url = `https://api.airtable.com/v0/${process.env.airtable_base_speech}/${table}?api_key=${process.env.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22${locale}%22%2C+Locale)!%3D0)`;
  const url = `https://api.airtable.com/v0/${
    process.env.airtable_base_data
  }/Speech?api_key=${
    process.env.airtable_api_key
  }&filterByFormula=AND(IsDisabled%3DFALSE(),SpeechType%3D"${table.toUpperCase()}",FIND(%22${locale}%22%2C+Locale)!%3D0)`;
  //console.log(`FULL PATH ${url}`);
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      const item = helper.getRandomItem(r.records);
      return item.fields.VoiceResponse;
    });
}

module.exports = getRandomSpeech;
