const helper = require("../helper");
const fetch = require("node-fetch");

function getAnswers(resolvedWords) {
  console.log(`<=== airtable/getAnswers.js ===>`);
  if (resolvedWords) {
    let filter = "";
    for (var i = 0; i < resolvedWords.length; i++) {
      if (i > 0 && i != resolvedWords.length) filter += ",";
      filter += `FIND("${resolvedWords[i].value.id}", RecordId)!%3D0`;
    }
    const url = `https://api.airtable.com/v0/${process.env.airtable_base_data}/Answer?api_key=${process.env.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),OR(${filter}))`;
    console.log(`FULL PATH ${url}`);
    const options = {
      method: "GET",
    };

    return fetch(url, options)
      .then((res) => res.json())
      .then((r) => {
        const item = r.records;
        return item;
      });
  }
  return undefined;
}

module.exports = getAnswers;
