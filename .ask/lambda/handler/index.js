const AnswerIntent = require("./AnswerIntent");
const APLTemplateIntent = require("./APLTemplateIntent");
const ChangeVoiceIntent = require("./ChangeVoiceIntent");
const LaunchRequest = require("./LaunchRequest");
const PersonalInfoIntent = require("./PersonalInfoIntent");
const SpeechconIntent = require("./SpeechconIntent");
const error = require("./error");
const intentReflector = require("./intentReflector");

module.exports = {
  AnswerIntent,
  APLTemplateIntent,
  ChangeVoiceIntent,
  LaunchRequest,
  PersonalInfoIntent,
  SpeechconIntent,
  error,
  intentReflector,
};
