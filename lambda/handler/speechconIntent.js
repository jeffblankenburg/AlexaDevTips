const airtable = require("../airtable");
const helper = require("../helper");

async function SpeechconIntent(handlerInput) {
  console.log("<=== handler/SpeechconIntent.js ===>");
  helper.setAction(handlerInput, "SPEECHCONINTENT");
  var locale = helper.getLocale(handlerInput);

  var spokenWords = helper.getSpokenWords(handlerInput, "speechcon");
  var resolvedWords = helper.getResolvedWords(handlerInput, "speechcon");
  var actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  var speakOutput = "";
  if (resolvedWords != undefined) {
    speakOutput = helper.wrapSpeechcon(resolvedWords[0].value.name);
  } else {
    var speechcon = await airtable.getRandomSpeechcon(locale);
    speakOutput =
      "I heard you say " +
      spokenWords +
      ", but that isn't a speechcon for your locale. Here's a random one instead! " +
      helper.wrapSpeechcon(speechcon);
  }

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = SpeechconIntent;
