const Airtable = require("airtable");

async function updateUserAnswers(handlerInput, recordId) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  let userAnswers = sessionAttributes.user.Answer;
  if (userAnswers === undefined) userAnswers = [];

  if (!userAnswers.includes(recordId)) {
    userAnswers.push(recordId);
    var airtable = new Airtable({ apiKey: process.env.airtable_api_key }).base(
      process.env.airtable_base_data
    );
    var record = await new Promise((resolve, reject) => {
      airtable("User").update(
        sessionAttributes.user.RecordId,
        {
          Answer: userAnswers,
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
}

module.exports = updateUserAnswers;
