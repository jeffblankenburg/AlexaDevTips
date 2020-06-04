async function getTemperatureUnits(handlerInput) {
  console.log(`<=== profile/getTemperatureUnits.js ===>`);
  const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
  const client = handlerInput.serviceClientFactory.getUpsServiceClient();
  return await client.getSystemTemperatureUnit(deviceId);
}

module.exports = getTemperatureUnits;
