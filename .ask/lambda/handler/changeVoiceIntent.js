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
  let voiceName = "";
  if (resolvedWords != undefined) {
    achSpeech = await airtable.checkForAchievement(
      handlerInput,
      `VOICE${resolvedWords[0].value.name.toUpperCase()}`
    );
    voiceName = resolvedWords[0].value.name;
    const voiceSpeech = await airtable.getRandomSpeech("NewVoice", locale);
    speakOutput = voiceSpeech.replace("VOICENAME", resolvedWords[0].value.name);

    await airtable.updateUserPollyVoice(handlerInput, resolvedWords[0].value);
  } else {
    const voice = await airtable.getRandomVoice();
    const voiceSpeech = await airtable.getRandomSpeech("RandomVoice", locale);
    await airtable.updateUserPollyVoice(handlerInput, {
      id: voice.RecordId,
      name: voice.Name,
    });
    voiceName = voice.Name;

    speakOutput = voiceSpeech.replace("VOICENAME", voice.Name);
  }
  const [actionQuery, voiceCard] = await Promise.all([
    await airtable.getRandomSpeech(`ACTIONQUERY`, locale),
    await airtable.getRandomSpeech(`SSMLCARD`, locale),
  ]);

  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .withSimpleCard(voiceName, voiceCard.split("VOICENAME").join(voiceName))
    .getResponse();
}

module.exports = ChangeVoiceIntent;
