const airtable = require("../airtable");
const helper = require("../helper");

async function AnswerIntent(handlerInput) {
  console.log(`<=== handler/AnswerIntent.js ===>`);

  const locale = helper.getLocale(handlerInput);
  const spokenWords = helper.getSpokenWords(handlerInput, "answer");
  const resolvedWords = helper.getResolvedWords(handlerInput, "answer");
  let speakOutput = "";
  let actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);

  if (resolvedWords && resolvedWords.length === 1) {
    const answer = await airtable.getItemByRecordId(
      process.env.airtable_base_data,
      "Answer",
      resolvedWords[0].value.id
    );

    speakOutput = `You asked me about ${answer.fields.Name}. ${answer.fields.VoiceResponse}`;
    airtable.updateUserAnswers(handlerInput, resolvedWords[0].value.id);
  } else if (resolvedWords && resolvedWords.length > 1) {
    helper.setAction(handlerInput, "ANSWERINTENT - DISAMBIGUATION");
    actionQuery = "";
    speakOutput = `I found ${
      resolvedWords.length
    } matches for ${spokenWords}.  Did you mean ${helper.getDisambiguationString(
      resolvedWords
    )}?`;
  } else {
    //TODO: WHAT DO WE DO IF THEY HAVE HEARD ALL THE THINGS?
    //TODO: IF THEY SAID SOMETHING THAT DIDN'T MATCH, WE SHOULD LOG IT SO THAT WE CAN ADD IT.
    if (spokenWords) {
      airtable.saveMissedValue(spokenWords, "MissedAnswer");
      speakOutput = `I don't have a record for ${spokenWords}.  My apologies.  I'll do some research. Instead, `;
    }
    const answer = await airtable.getRandomUnusedAnswer(handlerInput);
    console.log(`ANSWER = ${JSON.stringify(answer)}`);
    speakOutput += `I picked a random topic for you: ${answer.fields.Name}. ${answer.fields.VoiceResponse} `;
  }

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = AnswerIntent;
