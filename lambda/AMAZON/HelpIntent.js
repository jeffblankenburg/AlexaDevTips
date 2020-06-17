const airtable = require("../airtable");
const helper = require("../helper");

async function HelpIntent(handlerInput) {
  console.log("<=== AMAZON/HelpIntent.js ===>");
  helper.setAction(handlerInput, "HELPINTENT");
  const locale = helper.getLocale(handlerInput);

  let [speakOutput, actionQuery] = await Promise.all([
    airtable.getRandomSpeech("Help", locale),
    airtable.getRandomSpeech("ActionQuery", locale),
  ]);

  const achSpeech = await airtable.checkForAchievement(handlerInput, "HELP");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = HelpIntent;
