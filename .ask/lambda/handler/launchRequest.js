const airtable = require("../airtable");
const helper = require("../helper");

async function launchRequest(handlerInput) {
  console.log("<=== handler/launchRequest.js ===>");
  helper.setAction(handlerInput, "LAUNCHREQUEST");
  const locale = helper.getLocale(handlerInput);

  var speakOutput = await airtable.getRandomSpeech("Welcome", locale);
  var actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = launchRequest;
