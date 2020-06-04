const Airtable = require("airtable");

function saveMissedValue(spokenWords, table) {
  console.log(`<=== airtable/saveMissedValue.js ===>`);
  var base = new Airtable({ apiKey: process.env.airtable_api_key }).base(
    process.env.airtable_base_data
  );

  base(table).create({ Value: spokenWords }, function (err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(record.getId());
  });
}

module.exports = saveMissedValue;
