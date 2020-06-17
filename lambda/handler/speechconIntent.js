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

    if (spokenWords) {
      const speechconSpeech = await airtable.getRandomSpeech(
        "SPEECHCONNOTFOUND",
        locale
      );
      speakOutput = speechconSpeech
        .replace("SPOKENWORDS", spokenWords)
        .replace("LOCALE", locale.replace("-", ""))
        .replace("SPEECHCON", helper.wrapSpeechcon(speechcon));
    } else {
      const speechconRandomSpeech = await airtable.getRandomSpeech(
        "SPEECHCONRANDOM",
        locale
      );
      speakOutput = speechconRandomSpeech.replace(
        "SPEECHCON",
        helper.wrapSpeechcon(speechcon)
      );
    }
  }

  const [achSpeech, cardText] = await Promise.all([
    airtable.checkForAchievement(handlerInput, "SPEECHCON"),
    airtable.getRandomSpeech("SSMLCARD", locale),
  ]);

  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .withSimpleCard(
      speechcon,
      `${cardText
        .replace("TYPE", "sound effect")
        .replace(
          "SYNTAX",
          helper.wrapSpeechcon(speechcon).replace("<break time='.5s'/>", "")
        )}`
    )
    .getResponse();
}

module.exports = SpeechconIntent;
