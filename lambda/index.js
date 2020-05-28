const Alexa = require("ask-sdk-core");
const airtable = require("./airtable");
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

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  async handle(handlerInput) {
    console.log("<=== INTENT REFLECTOR HANDLER ===>");
    const locale = helper.getLocale(handlerInput);
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    var actionQuery = await getRandomSpeech("ActionQuery", locale);
    return handlerInput.responseBuilder
      .speak(helper.changeVoice(speakOutput + " " + actionQuery, handlerInput))
      .reprompt(helper.changeVoice(actionQuery, handlerInput))
      .getResponse();
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

function httpGet(base, filter, table = "Data") {
  var options = {
    host: "api.airtable.com",
    port: 443,
    path:
      "/v0/" +
      base +
      "/" +
      table +
      "?api_key=" +
      process.env.airtable_api_key +
      filter,
    method: "GET",
  };
  //console.log("FULL PATH = http://" + options.host + options.path);
  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      response.setEncoding("utf8");
      let returnData = "";
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(
          new Error(
            `${response.statusCode}: ${response.req.getHeader("host")} ${
              response.req.path
            }`
          )
        );
      }
      response.on("data", (chunk) => {
        returnData += chunk;
      });
      response.on("end", () => {
        resolve(JSON.parse(returnData));
      });
      response.on("error", (error) => {
        reject(error);
      });
    });
    request.end();
  });
}

async function getRandomSpeech(table, locale) {
  const response = await httpGet(
    process.env.airtable_base_speech,
    "&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22" +
      locale +
      "%22%2C+Locale)!%3D0)",
    table
  );
  const speech = helper.getRandomItem(response.records);
  console.log(
    "RANDOM [" + table.toUpperCase() + "] = " + JSON.stringify(speech)
  );
  return speech.fields.VoiceResponse;
}

async function getUserRecord(handlerInput) {}

const RequestLog = {
  async process(handlerInput) {
    console.log(
      "REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope)
    );
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const userRecord = await airtable.getUserRecord(handlerInput);
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
