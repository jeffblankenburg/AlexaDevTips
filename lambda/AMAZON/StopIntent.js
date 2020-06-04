const airtable = require("../airtable");
const helper = require("../helper");

async function StopIntent(handlerInput) {
  console.log("<=== AMAZON/StopIntent.js ===>");
  helper.setAction(handlerInput, "STOPINTENT");
  const locale = helper.getLocale(handlerInput);

  const speakOutput = await airtable.getRandomSpeech("Goodbye", locale);
  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput}`, handlerInput))
    .getResponse();
}

module.exports = StopIntent;
