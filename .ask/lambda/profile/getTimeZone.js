async function getTimeZone(handlerInput) {
  console.log(`<=== profile/getTimeZone.js ===>`);
  const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
  const client = handlerInput.serviceClientFactory.getUpsServiceClient();
  return await client.getSystemTimeZone(deviceId);
}

module.exports = getTimeZone;
