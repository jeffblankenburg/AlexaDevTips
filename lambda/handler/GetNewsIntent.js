const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function GetNewsIntent(handlerInput) {
  console.log(`<=== handler/GetNewsIntent.js ===>`);
  helper.setAction(handlerInput, "GETNEWSINTENT");
  const locale = helper.getLocale(handlerInput);

  const [news, actionQuery, newsIntro] = await Promise.all([
    airtable.getNews(locale),
    airtable.getRandomSpeech("ACTIONQUERY", locale),
    airtable.getRandomSpeech("NEWSINTRO", locale),
  ]);

  const speakOutput = `${newsIntro} ${helper.createNewsSpeech(news)}`;
  const cardOutput = helper.createNewsCard(news);

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .withSimpleCard("LATEST ALEXA DEVELOPER NEWS", cardOutput)
    .getResponse();
}

module.exports = GetNewsIntent;
