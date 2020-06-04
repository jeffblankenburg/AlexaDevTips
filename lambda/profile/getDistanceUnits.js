async function getDistanceUnits(handlerInput) {
  console.log(`<=== profile/getDistanceUnits.js ===>`);
  const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
  const client = handlerInput.serviceClientFactory.getUpsServiceClient();
  return await client.getSystemDistanceUnits(deviceId);
}

module.exports = getDistanceUnits;
