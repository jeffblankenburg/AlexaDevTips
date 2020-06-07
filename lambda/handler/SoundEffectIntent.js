const airtable = require("../airtable");
const helper = require("../helper");

async function SoundEffectIntent(handlerInput) {
  console.log("<=== handler/SoundEffectIntent.js ===>");
  helper.setAction(handlerInput, "SOUNDEFFECTINTENT");
  const locale = helper.getLocale(handlerInput);

  const spokenWords = helper.getSpokenWords(handlerInput, "soundeffect");
  const resolvedWords = helper.getResolvedWords(handlerInput, "soundeffect");
  const actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);
  let soundEffect = "";
  if (resolvedWords != undefined) {
    const randomEffect = helper.getRandomItem(resolvedWords);
    soundEffect = await airtable.getItemByRecordId(
      process.env.airtable_base_data,
      "SoundEffect",
      randomEffect.value.id
    );
  } else {
    soundEffect = await airtable.getRandomSoundEffect();
  }

  speakOutput = `This sound effect is called ${soundEffect.fields.Name.split(
    "_"
  ).join(" ")}. ${helper.wrapSoundEffect(
    soundEffect.fields.Category,
    soundEffect.fields.Name
  )}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .withSimpleCard()
    .withSimpleCard(
      soundEffect.Name,
      `You can use this sound effect in your skill with the following SSML syntax:\n\n${helper.wrapSoundEffect(
        soundEffect.fields.Category,
        soundEffect.fields.Name
      )}`
    )
    .getResponse();
}

module.exports = SoundEffectIntent;
