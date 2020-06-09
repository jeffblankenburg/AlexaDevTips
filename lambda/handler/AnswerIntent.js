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

  if (resolvedWords && resolvedWords.length === 1) {
    const answer = await airtable.getItemByRecordId(
      process.env.airtable_base_data,
      "Answer",
      resolvedWords[0].value.id
    );
    let name = answer.fields.Name;
    if (answer.fields.Pronunciation) name = answer.fields.Pronunciation;
    const linkIntro = await airtable.getRandomSpeech("AnswerLinkIntro", locale);
    speakOutput = `You asked me about ${name}. ${
      answer.fields.VoiceResponse
    } ${linkIntro.replace(
      "LINK",
      helper.convertLinkToSpeech(answer.fields.Link)
    )}`;
    if (answer.fields.CardResponse) {
      const cardResponse = `${answer.fields.CardResponse}\n${answer.fields.LinkPrefix} ${answer.fields.Link}`;
      rb.withSimpleCard(answer.fields.Name, cardResponse);
    }
    airtable.updateUserAnswers(handlerInput, resolvedWords[0].value.id);
  } else if (resolvedWords && resolvedWords.length > 1) {
    helper.setAction(handlerInput, "ANSWERINTENT - DISAMBIGUATION");
    actionQuery = "";
    speakOutput = `I found ${
      resolvedWords.length
    } matches for ${spokenWords}.  Did you mean ${await helper.getDisambiguationString(
      resolvedWords
    )}?`;
  } else {
    //TODO: WHAT DO WE DO IF THEY HAVE HEARD ALL THE THINGS?
    if (spokenWords) {
      airtable.saveMissedValue(spokenWords, "MissedAnswer");
      speakOutput = `I don't have a record for ${spokenWords}.  My apologies.  I'll do some research. Instead, `;
    }
    const answer = await airtable.getRandomUnusedAnswer(handlerInput);
    if (answer.fields.CardResponse) {
      const cardResponse = `${answer.fields.CardResponse}\n${answer.fields.LinkPrefix} ${answer.fields.Link}`;
      rb.withSimpleCard(answer.fields.Name, cardResponse);
    }
    let name = answer.fields.Name;
    if (answer.fields.Pronunciation) name = answer.fields.Pronunciation;
    speakOutput += `I picked a random topic for you: ${name}. ${answer.fields.VoiceResponse} `;
  }

  const achSpeech = await airtable.checkForAchievement(handlerInput, "ANSWER");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return rb
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = AnswerIntent;
