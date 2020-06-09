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
      // r.records.find(function (item, i) {
      //   const total = r.records.length;
      //   if (item.fields.RecordId === recordId) {
      //     console.log(`POSITION ${i + 1}`);
      //     return `You have completed ${r.records[i].fields.Score} achievements, and you are in <say-as interpret-as="ordinal">${i+1}</say-as> place out of ${total}.`;
      //   }
      // });
    });
}

module.exports = getLeaderboard;

// var filteredObj = data.find(function(item, i){
//   if(item.name === val){
//     index = i;
//     return i;
//   }
//});
