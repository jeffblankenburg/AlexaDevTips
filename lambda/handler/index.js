const changeVoiceIntent = require("./changeVoiceIntent");
const helpIntent = require("./helpIntent");
const launchRequest = require("./launchRequest");
const repeatIntent = require("./repeatIntent");
const speechconIntent = require("./speechconIntent");
const stopIntent = require("./stopIntent");
const error = require("./error");
const intentReflector = require("./intentReflector");

module.exports = {
  changeVoiceIntent,
  helpIntent,
  launchRequest,
  speechconIntent,
  stopIntent,
  repeatIntent,
  error,
  intentReflector,
};
