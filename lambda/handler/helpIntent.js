const airtable = require("../airtable");
const helper = require("../helper");

async function helpIntent(handlerInput) {
  console.log("<=== handlers/helpIntent.js ===>");
  helper.setAction(handlerInput, "HELPINTENT");
  const locale = helper.getLocale(handlerInput);

  const speakOutput = await airtable.getRandomSpeech("Help", locale);
  const actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = helpIntent;
