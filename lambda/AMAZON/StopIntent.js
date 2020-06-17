const airtable = require("../airtable");
const helper = require("../helper");

async function StopIntent(handlerInput) {
  console.log("<=== AMAZON/StopIntent.js ===>");
  helper.setAction(handlerInput, "STOPINTENT");
  const locale = helper.getLocale(handlerInput);

  const [goodbye, achSpeech] = await Promise.all([
    airtable.getRandomSpeech("Goodbye", locale),
    airtable.checkForAchievement(handlerInput, "STOP"),
  ]);

  const speakOutput = `${achSpeech} ${goodbye}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput}`, handlerInput))
    .getResponse();
}

module.exports = StopIntent;
