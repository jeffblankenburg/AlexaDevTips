const Airtable = require("airtable");

async function updateUserPollyVoice(handlerInput, pollyVoice) {
  console.log(`<=== airtable/updateUserPollyVoice.js ===>`);
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  console.log("POLLY VOICE = '" + pollyVoice + "'");
  if (pollyVoice === "Alexa") pollyVoice = "";
  console.log("POLLY VOICE = '" + pollyVoice + "'");
  var airtable = new Airtable({ apiKey: process.env.airtable_api_key }).base(
    process.env.airtable_base_data
  );
  var record = await new Promise((resolve, reject) => {
    airtable("User").update(
      sessionAttributes.user.RecordId,
      {
        PollyVoice: pollyVoice,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        sessionAttributes.user = record.fields;
        resolve(record);
      }
    );
  });
}

module.exports = updateUserPollyVoice;
