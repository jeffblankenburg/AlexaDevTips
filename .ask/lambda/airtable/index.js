const get = require("./get");
const getItemByRecordId = require("./getItemByRecordId");
const getRandomSpeech = require("./getRandomSpeech");
const getRandomSpeechcon = require("./getRandomSpeechcon");
const getRandomUnusedAnswer = require("./getRandomUnusedAnswer");
const updateUserPollyVoice = require("./updateUserPollyVoice");
const updateUserAnswers = require("./updateUserAnswers");
const getUserRecord = require("./getUserRecord");

module.exports = {
  get,
  getItemByRecordId,
  getRandomSpeech,
  getRandomSpeechcon,
  getRandomUnusedAnswer,
  getUserRecord,
  updateUserPollyVoice,
  updateUserAnswers,
};
