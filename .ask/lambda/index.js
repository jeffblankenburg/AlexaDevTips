const Alexa = require("ask-sdk-core");
const airtable = require("./airtable");
const helper = require("./helper.js");
const handlers = require("./handler");
const AMAZON = require("./AMAZON");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    return handlers.LaunchRequest(handlerInput);
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
    return await handlers.SpeechconIntent(handlerInput);
  },
};

const SoundEffectIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "SoundEffectIntent"
    );
  },
  async handle(handlerInput) {
    return await handlers.SoundEffectIntent(handlerInput);
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
    return handlers.ChangeVoiceIntent(handlerInput);
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
    return AMAZON.HelpIntent(handlerInput);
  },
};

const AnswerIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AnswerIntent"
    );
  },
  async handle(handlerInput) {
    return handlers.AnswerIntent(handlerInput);
  },
};

const PersonalInfoIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "PersonalInfoIntent"
    );
  },
  async handle(handlerInput) {
    return handlers.PersonalInfoIntent(handlerInput);
  },
};

const APLTemplateIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "APLTemplateIntent"
    );
  },
  async handle(handlerInput) {
    return handlers.APLTemplateIntent(handlerInput);
  },
};

const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.RepeatIntent"
    );
  },
  async handle(handlerInput) {
    return AMAZON.RepeatIntent(handlerInput);
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
    return AMAZON.StopIntent(handlerInput);
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

const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  async handle(handlerInput) {
    return await handlers.intentReflector(handlerInput);
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  async handle(handlerInput, error) {
    return handlers.error(handlerInput, error);
  },
};

const RequestLog = {
  async process(handlerInput) {
    console.log(
      `REQUEST ENVELOPE ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const userRecord = await airtable.getUserRecord(handlerInput);
    sessionAttributes.user = userRecord.fields;
    sessionAttributes.isError = false;
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(
      `RESPONSE BUILDER = ${JSON.stringify(
        handlerInput.responseBuilder.getResponse()
      )}`
    );
    helper.putRepeatData(handlerInput);
  },
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AnswerIntentHandler,
    APLTemplateIntentHandler,
    PersonalInfoIntentHandler,
    SpeechconIntentHandler,
    SoundEffectIntentHandler,
    HelpIntentHandler,
    RepeatIntentHandler,
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
