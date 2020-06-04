const helper = require("../helper");

function getGeocoordinates(handlerInput) {
  console.log(`<=== profile/getGeocoordinates.js ===>`);
  if (helper.isGeolocationSupported(handlerInput)) {
    // try {
    //   const client = handlerInput.serviceClientFactory.getUpsServiceClient();
    //   const email = await client.();
    //   return email;
    // } catch (error) {
    return undefined;
    // }
  } else {
    return undefined;
  }
}

module.exports = getGeocoordinates;
