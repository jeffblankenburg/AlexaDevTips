const airtable = require(`../airtable`);
const helper = require(`../helper`);
const profile = require("../profile");

async function PersonalInfoIntent(handlerInput) {
  console.log(`<=== handler/PersonalInfoIntent.js ===>`);
  helper.setAction(handlerInput, "PERSONALINFOINTENT");
  const locale = helper.getLocale(handlerInput);
  let speakOutput = "";

  const spokenWords = helper.getSpokenWords(handlerInput, "infotype");
  const resolvedWords = helper.getResolvedWords(handlerInput, "infotype");

  if (resolvedWords) {
    switch (resolvedWords[0].value.id) {
      case "email_address":
        let email = await profile.getEmail(handlerInput);
        if (email) speakOutput = `Your profile email address is ${email}.`;
        else
          return profile.sendPermissionsCard(handlerInput, "email address", [
            "alexa::profile:email:read",
          ]);
        break;
      case "full_name":
        let givenName = await profile.getName(handlerInput);
        if (givenName) speakOutput = `Your name is ${givenName}.`;
        else
          return profile.sendPermissionsCard(handlerInput, "name", [
            "alexa::profile:name:read",
          ]);
        break;
    }
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
