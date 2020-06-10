const airtable = require(`../airtable`);
const helper = require(`../helper`);
const profile = require("../profile");

async function PersonalInfoIntent(handlerInput) {
  console.log(`<=== handler/PersonalInfoIntent.js ===>`);
  helper.setAction(handlerInput, "PERSONALINFOINTENT");
  const locale = helper.getLocale(handlerInput);
  let speakOutput = "";

  const spokenWords = helper.getSpokenWords(handlerInput, "infotype");
  const resolvedWords = helper.getResolvedWords(handlerInput, "infotype");

  if (resolvedWords) {
    switch (resolvedWords[0].value.id) {
      case "email_address":
        let email = await profile.getEmail(handlerInput);
        if (email)
          speakOutput = `Your profile email address is ${email}.  You can set your email in your Amazon account, under log-in and security.`;
        else
          return profile.sendPermissionsCard(handlerInput, "email address", [
            "alexa::profile:email:read",
          ]);
        break;
      case "full_name":
        let name = await profile.getName(handlerInput);
        if (name)
          speakOutput = `Your name is ${name}. You can set your name in the Alexa app, under calling and messaging, or you can set it in your Amazon account, under log-in and security.`;
        else
          return profile.sendPermissionsCard(handlerInput, "name", [
            "alexa::profile:name:read",
          ]);
        break;
      case "mobile_number":
        let mobileNumber = await profile.getMobileNumber(handlerInput);
        if (mobileNumber) {
          const speech = await airtable.getRandomSpeech(
            "ProfileMobileNumber",
            locale
          );
          speakOutput = speech
            .replace("COUNTRYCODE", mobileNumber.countryCode)
            .replace("PHONENUMBER", mobileNumber.phoneNumber);
        } else
          return profile.sendPermissionsCard(handlerInput, "mobile number", [
            "alexa::profile:mobile_number:read",
          ]);
        break;
      case "device_address":
        let deviceAddress = await profile.getDeviceAddress(handlerInput);
        if (deviceAddress) {
          // const speech = await airtable.getRandomSpeech(
          //   "ProfileDeviceAddress",
          //   locale
          // );
          //TODO: Don't talk about values that are null.
          const speech = `Your complete device address is<break time='.5s'/>Address Line 1: <say-as interpret-as="address">${deviceAddress.addressLine1}</say-as><break time='.5s'/>Address Line 2: <say-as interpret-as="address">${deviceAddress.addressLine2}</say-as><break time='.5s'/>Address Line 3: <say-as interpret-as="address">${deviceAddress.addressLine3}</say-as><break time='.5s'/>City: ${deviceAddress.city}<break time='.5s'/>State or Region: <say-as interpret-as="spell-out">${deviceAddress.stateOrRegion}</say-as><break time='.5s'/>District or County: ${deviceAddress.districtOrCounty}<break time='.5s'/>Country Code: ${deviceAddress.countryCode}<break time='.5s'/>Postal Code: <say-as interpret-as="spell-out">${deviceAddress.postalCode}</say-as> `;
          speakOutput = speech
            .replace("COUNTRYCODE", deviceAddress.addressLine1)
            .replace("PHONENUMBER", deviceAddress.postalCode);
        } else
          return profile.sendPermissionsCard(handlerInput, "device address", [
            "read::alexa:device:all:address",
          ]);
        break;
      case "distance_units":
        let distanceUnits = await profile.getDistanceUnits(handlerInput);
        if (distanceUnits)
          speakOutput = `Your device is using ${distanceUnits} units for distance.`;
        else
          speakOutput = await airtable.getRandomSpeech(
            "SimulatorNotSupported",
            locale
          );
        break;
      case "temperature_units":
        let temperatureUnits = await profile.getTemperatureUnits(handlerInput);
        if (temperatureUnits)
          speakOutput = `Your device is using ${temperatureUnits} for temperature.`;
        else
          speakOutput = await airtable.getRandomSpeech(
            "SimulatorNotSupported",
            locale
          );
        break;
      case "time_zone":
        let timeZone = await profile.getTimeZone(handlerInput);
        if (timeZone)
          speakOutput = `Your device is using the ${timeZone.replace(
            "_",
            " "
          )} time zone.`;
        else
          speakOutput = await airtable.getRandomSpeech(
            "SimulatorNotSupported",
            locale
          );
        break;
      case "given_name":
        let geocoordinates = await profile.getGeocoordinates(handlerInput);
        if (geocoordinates)
          speakOutput = `Your geocoordinates are ${geocoordinates}.`;
        // const lat = geoObject.coordinate.latitudeInDegrees;
        //       const lon = geoObject.coordinate.longitudeInDegrees;
        //       const coordinateAccuracy = geoObject.coordinate.accuracyInMeters;
        //       const altitude = geoObject.altitude ? geoObject.altitude.altitudeInMeters : null;
        //       const altitudeAccuracy = geoObject.altitude ? geoObject.altitude.accuracyInMeters : null;
        //       const heading = geoObject.heading.directionInDegrees;
        //       const speed = geoObject.heading.speedInMetersPerSecond;
        //       const cardinalLat = lat >= 0 ? handlerInput.t('CARDINAL_NORTH') : handlerInput.t('CARDINAL_SOUTH');
        //       const cardinalLon = lon >= 0 ? handlerInput.t('CARDINAL_EAST') : handlerInput.t('CARDINAL_WEST');
        else
          return profile.sendPermissionsCard(handlerInput, "geolocation", [
            "alexa::devices:all:geolocation:read",
          ]);
        break;
    }
  } else {
    //TODO: GET EVERYTHING WE HAVE ACCESS TO.
    //TODO: WHAT IF WE DON'T HAVE ACCESS TO ANYTHING?  WE SHOULD ASK USER TO UPDATE PERMISSIONS.  SEND CARD.
  }

  const actionQuery = await airtable.getRandomSpeech("ActionQuery", locale);

  const achSpeech = await airtable.checkForAchievement(handlerInput, "INFO");
  speakOutput = `${achSpeech} ${speakOutput}`;

  return handlerInput.responseBuilder
    .speak(helper.changeVoice(`${speakOutput} ${actionQuery}`, handlerInput))
    .reprompt(helper.changeVoice(actionQuery, handlerInput))
    .getResponse();
}

module.exports = PersonalInfoIntent;
