const airtable = require("../airtable");
const helper = require("../helper");

async function sendPermissionsCard(handlerInput, type, permissions) {
  const locale = helper.getLocale(handlerInput);
  let [speakOutput, actionQuery] = await Promise.all([
    airtable.getRandomSpeech("NoPermission", locale),
    airtable.getRandomSpeech("ActionQuery", locale),
  ]);
  speakOutput = speakOutput.replace("TYPE", type);

  return handlerInput.responseBuilder
    .speak(`${speakOutput} ${actionQuery}`)
    .reprompt(actionQuery)
    .withAskForPermissionsConsentCard(permissions)
    .getResponse();
}

module.exports = sendPermissionsCard;
