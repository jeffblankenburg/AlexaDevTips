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

function createNewsSpeech(records) {
  let newsSpeech = "";
  for (var i = 0; i < records.length; i++) {
    newsSpeech += `<amazon:domain name="news"><audio src="soundbank://soundlibrary/musical/amzn_sfx_electronic_beep_02"/>${records[i].fields.VoiceHeadline} ${records[i].fields.VoiceBody}</amazon:domain>`;
  }
  return newsSpeech;
}

function createNewsCard(records) {
  let newsCard = "";
  for (var i = 0; i < records.length; i++) {
    newsCard += `${records[i].fields.CardHeadline.toUpperCase()}\n${
      records[i].fields.CardBody
    }\n${records[i].fields.LinkPrefix} ${records[i].fields.Link}\n\n`;
  }
  return newsCard;
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

async function getDisambiguationString(values) {
  let string = "";
  for (var i = 0; i < values.length; i++) {
    if (i != 0) string += ", ";
    if (i === values.length - 1) string += " or ";
    if (values[i].fields.Pronunciation)
      string += values[i].fields.Pronunciation;
    else string += values[i].fields.Name;
  }
  return string;
}

function convertLinkToSpeech(link) {
  let speech = link.replace("http://", "").replace("https://");
  // speech = speech.split(".").join(" dot ");
  // speech = speech.split("/").join(" slash ");
  speech = speech.replace(/\./g, " dot ");
  speech = speech.replace(/\//g, " slash ");
  return speech;
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
  return `<say-as interpret-as='interjection'>${speechcon}!</say-as><break time='.5s'/>`;
}

function wrapSoundEffect(category, effect) {
  return `<audio src='soundbank://soundlibrary/${category}/${effect}' />`;
}

function getRandomTwoCharacterString() {
  //This is missing the letter "e".  Yes, on purpose.
  const alphabet = [
    "a",
    "b",
    "d",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const letter1 = getRandomItem(alphabet);
  const letter2 = getRandomItem(alphabet);
  return `${letter1}${letter2}`;
}

function changeVoice(speech, handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const locale = getLocale(handlerInput);
  if (sessionAttributes.user.Voice != undefined) {
    return `<voice name='${sessionAttributes.user.Voice}'><lang xml:lang='${sessionAttributes.user.VoiceLocale}'>${speech}</lang></voice>`;
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

function isGeolocationSupported(handlerInput) {
  return handlerInput.requestEnvelope.context.System.device.supportedInterfaces
    .Geolocation;
}

module.exports = {
  convertLinkToSpeech,
  createNewsCard,
  createNewsSpeech,
  getSpokenWords,
  getResolvedWords,
  getDisambiguationString,
  getRandomItem,
  getRandomTwoCharacterString,
  getIntentName,
  getUserId,
  supportsAPL,
  isEntitled,
  isGeolocationSupported,
  wrapSpeechcon,
  wrapSoundEffect,
  changeVoice,
  setAction,
  getLocale,
  putRepeatData,
};
