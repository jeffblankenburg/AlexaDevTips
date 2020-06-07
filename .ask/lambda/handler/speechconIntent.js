const airtable = require("../airtable");
const helper = require("../helper");

async function SpeechconIntent(handlerInput) {
  console.log("<=== handler/SpeechconIntent.js ===>");
  helper.setAction(handlerInput, "SPEECHCONINTENT");
  const locale = helper.getLocale(handlerInput);

  const spokenWords = helper.getSpokenWords(handlerInput, "speechcon");
  const resolvedWords = helper.getResolvedWords(handlerInput, "speechcon");
  const actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  let speakOutput = "";
  let speechcon = "";
  if (resolvedWords != undefined) {
    speechcon = resolvedWords[0].value.name;
    speakOutput = helper.wrapSpeechcon(speechcon);
  } else {
    speechcon = await airtable.getRandomSpeechcon(locale);
    if (spokenWords)
      speakOutput =
        "I heard you say " +
        spokenWords +
        ", but that isn't a speechcon for your locale. Here's a random one instead! " +
        helper.wrapSpeechcon(speechcon);
    else
      speakOutput = `Here's a random speechcon for you! ${helper.wrapSpeechcon(
        speechcon
      )}`;
  }

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .withSimpleCard(
      speechcon,
      `You can use this speechcon in your skill with the following syntax:\n\n${helper.wrapSpeechcon(
        speechcon
      )}`
    )
    .getResponse();
}

module.exports = SpeechconIntent;
