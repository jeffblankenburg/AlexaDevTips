const getItemByRecordId = require("./getItemByRecordId");
const getRandomSpeech = require("./getRandomSpeech");
const getRandomSpeechcon = require("./getRandomSpeechcon");
const getRandomUnusedAnswer = require("./getRandomUnusedAnswer");
const getUserRecord = require("./getUserRecord");
const saveMissedValue = require("./saveMissedValue");
const updateUserPollyVoice = require("./updateUserPollyVoice");
const updateUserAnswers = require("./updateUserAnswers");

module.exports = {
  getItemByRecordId,
  getRandomSpeech,
  getRandomSpeechcon,
  getRandomUnusedAnswer,
  getUserRecord,
  saveMissedValue,
  updateUserPollyVoice,
  updateUserAnswers,
};
