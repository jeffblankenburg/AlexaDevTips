const helper = require("../helper");
const fetch = require("node-fetch");

function getAchievementCount(handlerInput) {
  console.log(`<=== airtable/getAchievementCount.js ===>`);
  const locale = helper.getLocale(handlerInput);
  const url = `https://api.airtable.com/v0/${process.env.airtable_base_data}/Achievement?api_key=${process.env.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22${locale}%22%2C+Locale)!%3D0)`;
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      return r.records.length;
    });
}

module.exports = getAchievementCount;
