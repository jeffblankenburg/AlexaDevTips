const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function AchievementIntent(handlerInput) {
  console.log(`<=== handler/AchievementIntent.js ===>`);
  helper.setAction(handlerInput, "ACHIEVEMENTINTENT");
  const locale = helper.getLocale(handlerInput);
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const userRecordId = sessionAttributes.user.RecordId;

  const achSpeech = await airtable.checkForAchievement(
    handlerInput,
    "LEADERBOARD"
  );

  const [
    achievementCount,
    leaderboard,
    leaderboardSpeech,
    actionQuery,
  ] = await Promise.all([
    airtable.getAchievementCount(handlerInput),
    airtable.getLeaderboard(userRecordId),
    airtable.getRandomSpeech("Leaderboard", locale),
    airtable.getRandomSpeech("ActionQuery", locale),
  ]);

  const total = leaderboard.length;
  const place = leaderboard.findIndex(
    (obj) => obj.fields.RecordId == userRecordId
  );
  const score = leaderboard[place].fields.Score;

  let speakOutput = leaderboardSpeech
    .replace("SCORE", score)
    .replace("COUNT", achievementCount)
    .replace("PLACE", place + 1)
    .replace("TOTAL", total);

  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = AchievementIntent;
