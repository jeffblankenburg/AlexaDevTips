async function getName(handlerInput) {
  console.log(`<=== profile/getName.js ===>`);
  try {
    const client = handlerInput.serviceClientFactory.getUpsServiceClient();
    const givenName = await client.getProfileName();
    return givenName;
  } catch (error) {
    return undefined;
  }
}

module.exports = getName;
