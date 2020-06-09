const checkForAchievement = require("./checkForAchievement");
const getItemByRecordId = require("./getItemByRecordId");
const getLeaderboard = require("./getLeaderboard");
const getRandomSpeech = require("./getRandomSpeech");
const getRandomSoundEffect = require("./getRandomSoundEffect");
const getRandomSpeechcon = require("./getRandomSpeechcon");
const getRandomUnusedAnswer = require("./getRandomUnusedAnswer");
const getUserRecord = require("./getUserRecord");
const saveMissedValue = require("./saveMissedValue");
const updateUserPollyVoice = require("./updateUserPollyVoice");
const updateUserAnswers = require("./updateUserAnswers");

module.exports = {
  checkForAchievement,
  getItemByRecordId,
  getLeaderboard,
  getRandomSoundEffect,
  getRandomSpeech,
  getRandomSpeechcon,
  getRandomUnusedAnswer,
  getUserRecord,
  saveMissedValue,
  updateUserPollyVoice,
  updateUserAnswers,
};
