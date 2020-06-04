const _ = require("lodash");

function setAction(handlerInput, action) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.previousAction = action;
}

function getLocale(handlerInput) {
  return handlerInput.requestEnvelope.request.locale;
}

function getUserId(handlerInput) {
  return handlerInput.requestEnveloper.context.System.user.userId;
}

function getSpokenWords(handlerInput, slot) {
  return _.get(
    handlerInput,
    `requestEnvelope.request.intent.slots[${slot}].value`
  );
  //return handlerInput?.requestEnvelope?.request?.intent?.slots?.[slot]?.value?
}

function getResolvedWords(handlerInput, slot) {
  if (
    _.get(
      handlerInput,
      `requestEnvelope.request.intent.slots[${slot}].resolutions.resolutionsPerAuthority`
    )
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

function getDisambiguationString(values) {
  let string = "";
  for (var i = 0; i < values.length; i++) {
    if (i != 0) string += ", ";
    if (i === values.length - 1) string += " or ";
    string += values[i].value.name;
  }
  return string;
}

function supportsAPL(handlerInput) {
  if (
    handlerInput &&
    handlerInput.requestEnvelope &&
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces[
      "Alexa.Presentation.APL"
    ]
  )
    return true;
  return false;
  /*
  if (
    _.get(
      handlerInput,
      `handlerInput.requestEnvelope.context.System.device.supportedInterfaces[
      "Alexa.Presentation.APL"
    ]`
    )
  )
    return true;
  return false;
  */
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

function putRepeatData(handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const response = handlerInput.responseBuilder.getResponse();
  if (response.outputSpeech && response.outputSpeech.ssml) {
    sessionAttributes.previousSpeak = response.outputSpeech.ssml
      .replace("<speak>", "")
      .replace("</speak>", "");
  }
  if (
    response.reprompt &&
    response.reprompt.outputSpeech &&
    response.reprompt.outputSpeech.ssml
  ) {
    sessionAttributes.previousReprompt = response.reprompt.outputSpeech.ssml
      .replace("<speak>", "")
      .replace("</speak>", "");
  }
}

module.exports = {
  getSpokenWords,
  getResolvedWords,
  getDisambiguationString,
  getRandomItem,
  getIntentName,
  getUserId,
  supportsAPL,
  isEntitled,
  wrapSpeechcon,
  changeVoice,
  setAction,
  getLocale,
  putRepeatData,
};
