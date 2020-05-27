const Alexa = require("ask-sdk-core");
const https = require("https");
const Airtable = require("airtable");
var helper = require("./helper.js");
const handlers = require("./handler");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  async handle(handlerInput) {
    return await handlers.launchRequest(handlerInput);
  },
};

const SpeechconIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "SpeechconIntent"
    );
  },
  async handle(handlerInput) {
    return await handlers.speechconIntent(handlerInput);
  },
};

const ChangeVoiceIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "ChangeVoiceIntent"
    );
  },
  async handle(handlerInput) {
    return handlers.changeVoiceIntent(handlerInput);
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  async handle(handlerInput) {
    return handlers.helpIntent(handlerInput);
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  async handle(handlerInput) {
    return handlers.stopIntent(handlerInput);
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  async handle(handlerInput) {
    console.log("<=== SESSIONENDED HANDLER ===>");
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  },
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  async handle(handlerInput, error) {
    return handlers.error(handlerInput, error);
  },
};

async function getUserRecord(handlerInput) {
  console.log("GETTING USER RECORD");
  var userId = handlerInput.requestEnvelope.session.user.userId;
  var filter =
    "&filterByFormula=%7BUserId%7D%3D%22" + encodeURIComponent(userId) + "%22";
  const userRecord = await httpGet(
    process.env.airtable_base_data,
    filter,
    "User"
  );
  //IF THERE ISN"T A USER RECORD, CREATE ONE.
  if (userRecord.records.length === 0) {
    console.log("CREATING NEW USER RECORD");
    var airtable = new Airtable({ apiKey: process.env.airtable_api_key }).base(
      process.env.airtable_base_data
    );
    return new Promise((resolve, reject) => {
      airtable("User").create({ UserId: userId }, function (err, record) {
        console.log("NEW USER RECORD = " + JSON.stringify(record));
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      });
    });
  } else {
    console.log(
      "RETURNING FOUND USER RECORD = " + JSON.stringify(userRecord.records[0])
    );
    return userRecord.records[0];
  }
}

const RequestLog = {
  async process(handlerInput) {
    console.log(
      "REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope)
    );
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    var userRecord = await getUserRecord(handlerInput);
    sessionAttributes.user = userRecord.fields;
    sessionAttributes.isError = false;
    console.log("USER RECORD = " + JSON.stringify(userRecord.fields));
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(
      "RESPONSE BUILDER = " +
        JSON.stringify(handlerInput.responseBuilder.getResponse())
    );
  },
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    SpeechconIntentHandler,
    HelpIntentHandler,
    ChangeVoiceIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  )
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(RequestLog)
  .addResponseInterceptors(ResponseLog)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda();
