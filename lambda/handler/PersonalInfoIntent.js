const airtable = require(`../airtable`);
const helper = require(`../helper`);

async function PersonalInfoIntent(handlerInput) {
  console.log(`<=== handler/PersonalInfoIntent.js ===>`);
  helper.setAction(handlerInput, "PERSONALINFOINTENT");
  const locale = helper.getLocale(handlerInput);
  let speakOutput = "";

  const permissions = [
    "alexa::profile:name:read",
    "alexa::profile:email:read",
    "alexa::profile:mobile_number:read",
  ];

  const spokenWords = helper.getSpokenWords(handlerInput);
  const resolvedWords = helper.getResolvedWords(handlerInput);
  try {
    const client = handlerInput.serviceClientFactory.getUpsServiceClient();
    const email = await client.getProfileEmail();
    console.log(`EMAIL = ${email}`);
  } catch (error) {
    return handlerInput.responseBuilder
      .speak(
        "Please enable Customer Profile permissions in the Amazon Alexa app.  I've written a card to your app to make this easier.  What would you lke to do next?"
      )
      .reprompt(
        "Please check the card in your Alexa app.  In the meantime, what would you lke to do next?"
      )
      .withAskForPermissionsConsentCard(permissions)
      .getResponse();
  }

  if (resolvedWords) {
    switch (resolvedWords[0].value.id) {
      case "email_address":
        const client = handlerInput.serviceClientFactory.getUpsServiceClient();
        const email = await client.getProfileEmail();
        console.log(`EMAIL = ${email}`);
        break;
    }
    //TODO: RETRIEVE THE VALUE THAT WAS THE FIRST RESOLVED VALUE.
  } else {
    //TODO: GET EVERYTHING WE HAVE ACCESS TO.
    //TODO: WHAT IF WE DON'T HAVE ACCESS TO ANYTHING?  WE SHOULD ASK USER TO UPDATE PERMISSIONS.  SEND CARD.
  }

  const actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = PersonalInfoIntent;
