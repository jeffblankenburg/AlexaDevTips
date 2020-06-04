async function getDeviceAddress(handlerInput) {
  console.log(`<=== profile/getDeviceAddress.js ===>`);
  try {
    const deviceId =
      handlerInput.requestEnvelope.context.System.device.deviceId;
    const client = handlerInput.serviceClientFactory.getDeviceAddressServiceClient();
    const address = await client.getFullAddress(deviceId);
    return address;
  } catch (error) {
    return undefined;
  }
}

module.exports = getDeviceAddress;
