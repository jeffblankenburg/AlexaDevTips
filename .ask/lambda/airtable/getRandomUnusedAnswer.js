const helper = require("../helper");
const fetch = require("node-fetch");

async function getRandomUnusedAnswer(handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const locale = helper.getLocale(handlerInput);
  const url = `https://api.airtable.com/v0/${process.env.airtable_base_data}/Answer?api_key=${process.env.airtable_api_key}&maxRecords=5&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22${sessionAttributes.user.RecordId}%22%2C+User)%3D0,FIND(%22${locale}%22%2C+Locale)!%3D0)`;
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      const item = helper.getRandomItem(r.records);
      return item;
    });
}

module.exports = getRandomUnusedAnswer;
