const airtable = require("../airtable");

async function RepeatIntent(handlerInput) {
  console.log("<=== AMAZON/RepeatIntent.js ===>");
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  //WE EXPLICITLY DO NOT SET THE PREVIOUS ACTION ON A REPEAT.
  //helper.setAction(handlerInput, "REPEATINTENT");
  let speakOutput = sessionAttributes.previousSpeak;
  const reprompt = sessionAttributes.previousReprompt;

  const achSpeech = await airtable.checkForAchievement(handlerInput, "REPEAT");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(speakOutput)
    .reprompt(reprompt)
    .getResponse();
}

module.exports = RepeatIntent;
