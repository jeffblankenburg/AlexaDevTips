function setAction(handlerInput, action) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.previousAction = action;
}

function getLocale(handlerInput) {
  return handlerInput.requestEnvelope.request.locale;
}

function getSpokenWords(handlerInput, slot) {
  if (
    handlerInput.requestEnvelope &&
    handlerInput.requestEnvelope.request &&
    handlerInput.requestEnvelope.request.intent &&
    handlerInput.requestEnvelope.request.intent.slots &&
    handlerInput.requestEnvelope.request.intent.slots[slot] &&
    handlerInput.requestEnvelope.request.intent.slots[slot].value
  )
    return handlerInput.requestEnvelope.request.intent.slots[slot].value;
  else return undefined;
}

function getResolvedWords(handlerInput, slot) {
  if (
    handlerInput.requestEnvelope &&
    handlerInput.requestEnvelope.request &&
    handlerInput.requestEnvelope.request.intent &&
    handlerInput.requestEnvelope.request.intent.slots &&
    handlerInput.requestEnvelope.request.intent.slots[slot] &&
    handlerInput.requestEnvelope.request.intent.slots[slot].resolutions &&
    handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
      .resolutionsPerAuthority
  ) {
    for (
      var i = 0;
      i <
      handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
        .resolutionsPerAuthority.length;
      i++
    ) {
      if (
        handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
          .resolutionsPerAuthority[i] &&
        handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
          .resolutionsPerAuthority[i].values &&
        handlerInput.requestEnvelope.request.intent.slots[slot].resolutions
          .resolutionsPerAuthority[i].values[0]
      )
        return handlerInput.requestEnvelope.request.intent.slots[slot]
          .resolutions.resolutionsPerAuthority[i].values;
    }
  } else return undefined;
}

function supportsAPL(handlerInput) {
  if (
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces[
      "Alexa.Presentation.APL"
    ]
  )
    return true;
  return false;
}

function getRandomItem(items) {
  var random = getRandom(0, items.length - 1);
  return items[random];
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isProduct(product) {
  return product && Object.keys(product).length > 0;
}

function isEntitled(product) {
  return isProduct(product) && product.entitled === "ENTITLED";
}

function wrapSpeechcon(speechcon) {
  return (
    "<say-as interpret-as='interjection'>" +
    speechcon +
    "!</say-as><break time='.5s'/>"
  );
}

function changeVoice(speech, handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  if (sessionAttributes.user.PollyVoice != undefined) {
    return (
      "<voice name='" +
      sessionAttributes.user.PollyVoice +
      "'>" +
      speech +
      "</voice>"
    );
  } else return speech;
}

function getIntentName(handlerInput) {
  if (handlerInput.requestEnvelope.request.intent.name != undefined)
    return handlerInput.requestEnvelope.request.intent.name;
  else return handlerInput.requestEnvelope.request.type;
}

module.exports = {
  getSpokenWords,
  getResolvedWords,
  getRandomItem,
  getIntentName,
  supportsAPL,
  isEntitled,
  wrapSpeechcon,
  changeVoice,
  setAction,
  getLocale,
};
