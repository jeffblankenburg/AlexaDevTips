async function RepeatIntent(handlerInput) {
  console.log("<=== AMAZON/RepeatIntent.js ===>");
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  //WE EXPLICITLY DO NOT SET THE PREVIOUS ACTION ON A REPEAT.
  //helper.setAction(handlerInput, "REPEATINTENT");

  return handlerInput.responseBuilder
    .speak(sessionAttributes.previousSpeak)
    .reprompt(sessionAttributes.previousReprompt)
    .getResponse();
}

module.exports = RepeatIntent;
