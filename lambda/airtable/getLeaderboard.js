const helper = require("../helper");
const fetch = require("node-fetch");

function getLeaderboard(recordId) {
  console.log(`<=== airtable/getLeaderboard.js ===>`);
  const url = `https://api.airtable.com/v0/${process.env.airtable_base_data}/User?api_key=${process.env.airtable_api_key}&sort%5B0%5D%5Bfield%5D=Score&sort%5B0%5D%5Bdirection%5D=desc`;
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      return r.records;
    });
}

module.exports = getLeaderboard;
