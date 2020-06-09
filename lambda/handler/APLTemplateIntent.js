const airtable = require("../airtable");
const helper = require("../helper");

async function APLTemplateIntent(handlerInput) {
  console.log(`<=== handler/APLTemplateIntent.js ===>`);
  helper.setAction(handlerInput, `APLTEMPLATEINTENT`);
  const locale = helper.getLocale(handlerInput);
  const spokenWords = helper.getSpokenWords(handlerInput, "apltemplate");
  const resolvedWords = helper.getResolvedWords(handlerInput, "apltemplate");
  let speakOutput = "";
  let actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);

  if (helper.supportsAPL(handlerInput)) {
    if (resolvedWords && resolvedWords.length === 1) {
      speakOutput = `The ${resolvedWords[0].value.name} template is displayed on your screen.`;
      const apl = require(`../apltemplates/${resolvedWords[0].value.id}.json`);
      handlerInput.responseBuilder.addDirective({
        type: "Alexa.Presentation.APL.RenderDocument",
        token: "[SkillProvidedToken]",
        version: "1.3",
        document: apl.document,
        datasources: apl.datasources,
      });
    } else if (resolvedWords && resolvedWords.length > 1) {
      speakOutput = `I found ${
        resolvedWords.length
      } matches for ${spokenWords}.  Did you mean ${helper.getDisambiguationString(
        resolvedWords
      )}?`;
    } else {
      //TODO: SHOW A LIST OF APL TEMPLATES WHEN ONE ISN'T INDICATED.
      const answer = await airtable.getRandomUnusedAnswer(handlerInput);
      console.log(`ANSWER = ${JSON.stringify(answer)}`);
      speakOutput = `I picked a random topic for you: ${answer.fields.Name}. ${answer.fields.VoiceResponse} `;
    }
  } else {
    speakOutput = `I'm sorry, your device does not support APL. `;
  }

  const achSpeech = await airtable.checkForAchievement(handlerInput, "APL");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = APLTemplateIntent;
