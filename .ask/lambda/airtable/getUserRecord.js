const Airtable = require("airtable");
const helper = require("../helper");
const fetch = require("node-fetch");

function getUserRecord(handlerInput) {
  console.log(`<=== airtable/getUserRecord.js ===>`);
  const userId = handlerInput.requestEnvelope.context.System.user.userId;

  const url = `https://api.airtable.com/v0/${
    process.env.airtable_base_data
  }/User?api_key=${
    process.env.airtable_api_key
  }&filterByFormula=%7BUserId%7D%3D%22${encodeURIComponent(userId)}%22`;
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      if (r.records.length === 0) {
        return createUserRecord(userId);
      } else return r.records[0];
    });
}

function createUserRecord(userId) {
  var airtable = new Airtable({ apiKey: process.env.airtable_api_key }).base(
    process.env.airtable_base_data
  );
  return new Promise((resolve, reject) => {
    airtable("User").create({ UserId: userId }, function (err, record) {
      if (err) {
        console.error(err);
        return;
      }
      resolve(record);
    });
  });
}

module.exports = getUserRecord;
