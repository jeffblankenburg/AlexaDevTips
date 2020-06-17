const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function GetNewsIntent(handlerInput) {
  console.log(`<=== handler/GetNewsIntent.js ===>`);
  helper.setAction(handlerInput, "GETNEWSINTENT");
  const locale = helper.getLocale(handlerInput);

  const [news, actionQuery] = await Promise.all([
    airtable.getNews(locale),
    airtable.getRandomSpeech("ACTIONQUERY", locale),
  ]);

  const speakOutput = helper.createNewsSpeech(news);

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = GetNewsIntent;
