const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function ChangeVoiceIntent(handlerInput) {
  console.log(`<=== handler/ChangeVoiceIntent.js ===>`);
  helper.setAction(handlerInput, `CHANGEVOICEINTENT`);
  const locale = helper.getLocale(handlerInput);

  const spokenWords = helper.getSpokenWords(handlerInput, `voice`);
  const resolvedWords = helper.getResolvedWords(handlerInput, `voice`);
  let speakOutput = ``;
  if (resolvedWords != undefined) {
    await airtable.updateUserPollyVoice(
      handlerInput,
      resolvedWords[0].value.name
    );
    speakOutput = `I am now using the voice of ${resolvedWords[0].value.name}. `;
  } else {
    //CHANGE THE USER'S POLLYVOICE TO A RANDOM VOICE.  LET THEM KNOW TO CHANGE IT BACK TO ALEXA, THEY WILL NEED TO SAY SOMETHING WE HAVEN'T DECIDED YET.
    speakOutput = `${spokenWords} is not the name of a Polly voice. `;
  }

  var actionQuery = await airtable.getRandomSpeech(`ActionQuery`, locale);
  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = ChangeVoiceIntent;
