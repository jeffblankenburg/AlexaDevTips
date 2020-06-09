const airtable = require("../airtable");
const helper = require("../helper");

async function StopIntent(handlerInput) {
  console.log("<=== AMAZON/StopIntent.js ===>");
  helper.setAction(handlerInput, "STOPINTENT");
  const locale = helper.getLocale(handlerInput);

  let speakOutput = `${achievementSpeech} ${await airtable.getRandomSpeech(
    "Goodbye",
    locale
  )}`;

  const achSpeech = await airtable.checkForAchievement(handlerInput, "STOP");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput}`, handlerInput))
    .getResponse();
}

module.exports = StopIntent;
