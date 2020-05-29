const airtable = require("../airtable");
const helper = require("../helper");

async function stopIntent(handlerInput) {
  console.log("<=== handlers/stopIntent.js ===>");
  helper.setAction(handlerInput, "STOPINTENT");
  const locale = helper.getLocale(handlerInput);

  const speakOutput = await airtable.getRandomSpeech("Goodbye", locale);
  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput}`, handlerInput))
    .getResponse();
}

module.exports = stopIntent;
