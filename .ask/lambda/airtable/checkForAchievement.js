const Airtable = require("airtable");
const helper = require("../helper");
const fetch = require("node-fetch");

async function checkForAchievement(handlerInput, code) {
  console.log(`<=== airtable/checkForAchievement.js ===>`);
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const locale = helper.getLocale(handlerInput);
  const userRecordId = sessionAttributes.user.RecordId;
  const url = `https://api.airtable.com/v0/${process.env.airtable_base_data}/Achievement?api_key=${process.env.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),Code="${code}",FIND(%22${locale}%22%2C+Locale)!%3D0)`;
  //console.log(`FULL PATH ${url}`);
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      if (r.records.length > 0) {
        const achievement = r.records[0];
        if (
          !achievement.fields.UserAchievement ||
          (achievement.fields.UserAchievement &&
            !achievement.fields.User.includes(userRecordId))
        ) {
          createUserAchievementRecord(
            userRecordId,
            achievement.fields.RecordId
          );
          const achievementSound = `<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02"/> Achievement Unlocked!`; //await airtable.getRandomSpeech("ACHIEVEMENTUNLOCKED");
          return ""; // `${achievementSound} ${achievement.fields.Description}`;
        }
      }

      return "";
    });
}

function createUserAchievementRecord(userId, achievementId) {
  var airtable = new Airtable({ apiKey: process.env.airtable_api_key }).base(
    process.env.airtable_base_data
  );
  return new Promise((resolve, reject) => {
    airtable("UserAchievement").create(
      { User: [userId], Achievement: [achievementId] },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      }
    );
  });
}

module.exports = checkForAchievement;
