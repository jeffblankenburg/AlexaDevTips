const airtable = require("../airtable");
const helper = require("../helper");

async function stopIntent(handlerInput) {
  console.log("<=== handlers/stopIntent.js ===>");
  helper.setAction(handlerInput, "STOPINTENT");
  const locale = helper.getLocale(handlerInput);

  const speakOutput = await airtable.getRandomSpeech("Goodbye", locale);
  const actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .getResponse();
}

module.exports = stopIntent;
