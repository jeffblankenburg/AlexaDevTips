const airtable = require("../airtable");
const helper = require("../helper");

async function AnswerIntent(handlerInput) {
  console.log(`<=== handler/AnswerIntent.js ===>`);
  helper.setAction(handlerInput, "ANSWERINTENT");
  const locale = helper.getLocale(handlerInput);
  const spokenWords = helper.getSpokenWords(handlerInput, "answer");
  const resolvedWords = helper.getResolvedWords(handlerInput, "answer");
  let speakOutput = "";
  let actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  let rb = handlerInput.responseBuilder;

  const answers = await airtable.getAnswers(resolvedWords);

  if (answers && answers.length === 1) {
    const answer = answers[0];
    let name = answer.fields.Name;
    if (answer.fields.Pronunciation) name = answer.fields.Pronunciation;
    const answerConfirmation = await airtable.getRandomSpeech(
      "AnswerConfirmation",
      locale
    );
    speakOutput = `${answerConfirmation.replace("ANSWER", name)} ${
      answer.fields.VoiceResponse
    }`;
    if (answer.fields.Link) {
      const linkIntro = await airtable.getRandomSpeech(
        "AnswerLinkIntro",
        locale
      );
      linkIntro.replace("LINK", helper.convertLinkToSpeech(answer.fields.Link));
    }
    if (answer.fields.CardResponse) {
      const cardResponse = `${answer.fields.CardResponse}\n${answer.fields.LinkPrefix} ${answer.fields.Link}`;
      rb.withSimpleCard(answer.fields.Name, cardResponse);
    }
    airtable.updateUserAnswers(handlerInput, resolvedWords[0].value.id);
  } else if (answers && answers.length > 1) {
    helper.setAction(handlerInput, "ANSWERINTENT - DISAMBIGUATION");
    const disambiguation = await airtable.getRandomSpeech(
      "Disambiguation",
      locale
    );
    actionQuery = "";
    speakOutput = disambiguation
      .replace("COUNT", answers.length)
      .replace("SPOKENWORDS", spokenWords)
      .replace("RESOLVEDLIST", await helper.getDisambiguationString(answers));
  } else {
    //TODO: WHAT DO WE DO IF THEY HAVE HEARD ALL THE THINGS?
    if (spokenWords) {
      airtable.saveMissedValue(spokenWords, "MissedAnswer");
      const answerApology = await airtable.getRandomSpeech(
        "AnswerApology",
        locale
      );
      speakOutput = `${answerApology.replace("SPOKENWORDS", spokenWords)} `;
    }
    const answer = await airtable.getRandomUnusedAnswer(handlerInput);
    airtable.updateUserAnswers(handlerInput, answer.fields.RecordId);
    if (answer.fields.CardResponse) {
      const cardResponse = `${answer.fields.CardResponse}\n${answer.fields.LinkPrefix} ${answer.fields.Link}`;
      rb.withSimpleCard(answer.fields.Name, cardResponse);
    }
    let name = answer.fields.Name;
    if (answer.fields.Pronunciation) name = answer.fields.Pronunciation;
    const randomAnswer = await airtable.getRandomSpeech("AnswerRandom", locale);
    speakOutput += `${randomAnswer.replace("NAME", name)} ${
      answer.fields.VoiceResponse
    } `;
  }

  const achSpeech = await airtable.checkForAchievement(handlerInput, "ANSWER");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return rb
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = AnswerIntent;
