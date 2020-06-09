const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function AchievementIntent(handlerInput) {
  console.log(`<=== handler/AchievementIntent.js ===>`);
  helper.setAction(handlerInput, "ACHIEVEMENTINTENT");
  const locale = helper.getLocale(handlerInput);
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const userRecordId = sessionAttributes.user.RecordId;

  //TODO: IF THIS A USER'S FIRST TIME, GIVE THEM MORE BACKGROUND INFORMATION ABOUT WHAT IS POSSIBLE.
  const [leaderboard, actionQuery] = await Promise.all([
    airtable.getLeaderboard(userRecordId),
    airtable.getRandomSpeech("ActionQuery", locale),
  ]);

  const total = leaderboard.length;
  const position = leaderboard.findIndex(
    (obj) => obj.fields.RecordId == userRecordId
  );
  const score = leaderboard[position].fields.Score + 1;

  const speakOutput = `You have completed ${score} achievements, and you are in <say-as interpret-as="ordinal">${
    position + 1
  }</say-as> place out of ${total}.`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = AchievementIntent;
