const airtable = require("../airtable");
const helper = require("../helper");

async function intentReflector(handlerInput) {
  console.log("<=== handler/intentReflector.js ===>");
  const locale = helper.getLocale(handlerInput);
  const intentName = helper.getIntentName(handlerInput);
  const speakOutput = `You just triggered ${intentName}`;

  var actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = intentReflector;
