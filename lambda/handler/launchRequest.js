const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function LaunchRequest(handlerInput) {
  console.log(`<=== handler/launchRequest.js ===>`);
  helper.setAction(handlerInput, "LAUNCHREQUEST");
  const locale = helper.getLocale(handlerInput);

  //TODO: IF THIS A USER'S FIRST TIME, GIVE THEM MORE BACKGROUND INFORMATION ABOUT WHAT IS POSSIBLE.
  const [speakOutput, actionQuery] = await Promise.all([
    airtable.getRandomSpeech("Welcome", locale),
    airtable.getRandomSpeech("ActionQuery", locale),
  ]);

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = LaunchRequest;
