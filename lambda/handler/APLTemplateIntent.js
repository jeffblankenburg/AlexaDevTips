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
      const templateSpeech = await airtable.getRandomSpeech(
        "APLTemplate",
        locale
      );
      speakOutput = templateSpeech.replace(
        "TEMPLATENAME",
        resolvedWords[0].value.name
      );
      const apl = require(`../apltemplates/${resolvedWords[0].value.id}.json`);
      handlerInput.responseBuilder.addDirective({
        type: "Alexa.Presentation.APL.RenderDocument",
        token: "[SkillProvidedToken]",
        version: "1.3",
        document: apl.document,
        datasources: apl.datasources,
      });
    } else if (resolvedWords && resolvedWords.length > 1) {
      const disambiguation = await airtable.getRandomSpeech(
        "Disambiguation",
        locale
      );
      actionQuery = "";
      speakOutput = disambiguation
        .replace("COUNT", resolvedWords.length)
        .replace("SPOKENWORDS", spokenWords)
        .replace(
          "RESOLVEDLIST",
          await helper.getDisambiguationString(resolvedWords)
        );
    } else {
      //TODO: SHOW A LIST OF APL TEMPLATES WHEN ONE ISN'T INDICATED.
      speakOutput =
        "I should be showing you a list of APL templates, but that hasn't been built yet.";
    }
  } else {
    const notSupported = await airtable.getRandomSpeech("NotSupported", locale);
    speakOutput = notsupported.replace("THING", "APL");
  }

  const achSpeech = await airtable.checkForAchievement(handlerInput, "APL");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = APLTemplateIntent;
