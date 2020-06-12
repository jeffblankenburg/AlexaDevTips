const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function ChangeVoiceIntent(handlerInput) {
  console.log(`<=== handler/ChangeVoiceIntent.js ===>`);
  helper.setAction(handlerInput, `CHANGEVOICEINTENT`);
  const locale = helper.getLocale(handlerInput);

  const spokenWords = helper.getSpokenWords(handlerInput, `voice`);
  const resolvedWords = helper.getResolvedWords(handlerInput, `voice`);
  let achSpeech = "";
  let speakOutput = "";
  if (resolvedWords != undefined) {
    achSpeech = await airtable.checkForAchievement(
      handlerInput,
      `VOICE${resolvedWords[0].value.name.toUpperCase()}`
    );
    const voiceSpeech = await airtable.getRandomSpeech("NewVoice", locale);
    speakOutput = voiceSpeech.replace("VOICENAME", resolvedWords[0].value.name);
    await airtable.updateUserPollyVoice(
      handlerInput,
      resolvedWords[0].value.name
    );
  } else {
    //CHANGE THE USER'S POLLY VOICE TO A RANDOM VOICE.  LET THEM KNOW TO CHANGE IT BACK TO ALEXA, THEY WILL NEED TO SAY SOMETHING WE HAVEN'T DECIDED YET.
    const voiceSpeech = await airtable.getRandomSpeech("NotVoice", locale);
    speakOutput = voiceSpeech.replace("VOICENAME", spokenWords);
  }

  var actionQuery = await airtable.getRandomSpeech(`ActionQuery`, locale);

  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = ChangeVoiceIntent;
