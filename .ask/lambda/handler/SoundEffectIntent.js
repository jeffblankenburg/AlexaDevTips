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
    console.log(`RANDOM EFFECT ${JSON.stringify(randomEffect)}`);
    soundEffect = await airtable.getItemByRecordId(
      process.env.airtable_base_soundeffect,
      "SoundEffect",
      randomEffect.value.id
    );
  } else {
    soundEffect = await airtable.getRandomSoundEffect();
  }
  const soundEffectSpeech = await airtable.getRandomSpeech(
    "SOUNDEFFECT",
    locale
  );
  let speakOutput = soundEffectSpeech
    .replace("NAME", soundEffect.fields.Name.split("_").join(" "))
    .replace(
      "SOUNDEFFECT",
      helper.wrapSoundEffect(
        soundEffect.fields.Category,
        soundEffect.fields.Name
      )
    );

  const [achSpeech, cardText] = await Promise.all([
    airtable.checkForAchievement(handlerInput, "EFFECT"),
    airtable.getRandomSpeech("SSMLCARD", locale),
  ]);
  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .withSimpleCard()
    .withSimpleCard(
      soundEffect.Name,
      `${cardText
        .replace("TYPE", "sound effect")
        .replace(
          "SYNTAX",
          helper.wrapSoundEffect(
            soundEffect.fields.Category,
            soundEffect.fields.Name
          )
        )}`
    )
    .getResponse();
}

module.exports = SoundEffectIntent;
