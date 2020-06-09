const helper = require("../helper");
const fetch = require("node-fetch");

async function getRandomSoundEffect() {
  console.log(`<=== airtable/getRandomSoundEffect.js ===>`);
  const random = helper.getRandomTwoCharacterString();

  const url = `https://api.airtable.com/v0/${process.env.airtable_base_soundeffect}/SoundEffect?api_key=${process.env.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22${random}%22%2C+RecordId)!%3D0)`;
  //console.log(`FULL PATH = ${url}`);
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

module.exports = getRandomSoundEffect;
