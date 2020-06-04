const helper = require("../helper");
const fetch = require("node-fetch");

async function getRandomSpeechcon(locale) {
  console.log(`<=== airtable/getRandomSpeechcon.js ===>`);
  const url = `https://api.airtable.com/v0/${process.env.airtable_base_data}/Speechcon?api_key=${process.env.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22${locale}%22%2C+Locale)!%3D0)`;
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      const item = helper.getRandomItem(r.records);
      return item.fields.Name;
    });
}

module.exports = getRandomSpeechcon;
