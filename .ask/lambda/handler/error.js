const airtable = require("../airtable");
const helper = require("../helper");

async function error(handlerInput, error) {
  console.log("<=== handlers/stopIntent.js ===>");
  const locale = helper.getLocale(handlerInput);
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.isError = true;
  console.log(`ERROR HANDLED: ${error.stack}`);
  const speakOutput = await airtable.getRandomSpeech("Error", locale);
  const actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = error;
