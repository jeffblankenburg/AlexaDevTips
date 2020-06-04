async function getMobileNumber(handlerInput) {
  console.log(`<=== profile/getMobileNumber.js ===>`);
  try {
    const client = handlerInput.serviceClientFactory.getUpsServiceClient();
    const email = await client.getProfileMobileNumber();
    return email;
  } catch (error) {
    return undefined;
  }
}
module.exports = getMobileNumber;
