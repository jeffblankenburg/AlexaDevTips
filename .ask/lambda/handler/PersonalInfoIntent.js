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
        if (email) {
          const emailSpeech = await airtable.getRandomSpeech(
            "PROFILEMAIL",
            locale
          );
          speakOutput = emailSpeech.replace("EMAIL", email);
        } else
          return profile.sendPermissionsCard(handlerInput, "email address", [
            "alexa::profile:email:read",
          ]);
        break;
      case "full_name":
        let name = await profile.getName(handlerInput);
        if (name) {
          nameSpeech = await airtable.getRandomSpeech("PROFILENAME", locale);
          speakOutput = nameSpeech.replace("NAME", name);
        } else
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
          const addressSpeech = await airtable.getRandomSpeech(
            "PROFILEADDRESS",
            locale
          );
          speakOutput = addressSpeech
            .replace("ADDRESSLINE1", deviceAddress.addressLine1)
            .replace("ADDRESSLINE2", deviceAddress.addressLine2)
            .replace("ADDRESSLINE3", deviceAddress.addressLine3)
            .replace("CITY", deviceAddress.city)
            //TODO: WE NEED A LOOKUP SERVICE THAT CAN GET THE FULL NAME OF EACH POSSIBLE STATE OR REGION.
            .replace("STATE", deviceAddress.stateOrRegion)
            .replace("DISTRICT", deviceAddress.districtOrCounty)
            .replace("COUNTRY", deviceAddress.countryCode)
            .replace("POSTALCODE", deviceAddress.postalCode);
        } else
          return profile.sendPermissionsCard(handlerInput, "device address", [
            "read::alexa:device:all:address",
          ]);
        break;
      case "distance_units":
        let distanceUnits = await profile.getDistanceUnits(handlerInput);
        if (distanceUnits) {
          const distanceSpeech = await airtable.getRandomSpeech(
            "PROFILEDISTANCE",
            locale
          );
          speakOutput = distanceSpeech.replace("UNITS", distanceUnits);
        } else
          speakOutput = await airtable.getRandomSpeech(
            "SimulatorNotSupported",
            locale
          );
        break;
      case "temperature_units":
        let temperatureUnits = await profile.getTemperatureUnits(handlerInput);
        if (temperatureUnits) {
          const distanceSpeech = await airtable.getRandomSpeech(
            "PROFILETEMPERATURE",
            locale
          );
          speakOutput = distanceSpeech.replace("UNITS", distanceUnits);
        } else
          speakOutput = await airtable.getRandomSpeech(
            "SimulatorNotSupported",
            locale
          );
        break;
      case "time_zone":
        let timeZone = await profile.getTimeZone(handlerInput);
        if (timeZone) {
          const timeZoneSpeech = await airtable.getRandomSpeech(
            "PROFILETIMEZONE",
            locale
          );
          speakOutput = timeZoneSpeech.replace(
            "TIMEZONE",
            timeZone.replace("_", " ")
          );
        } else
          speakOutput = await airtable.getRandomSpeech(
            "SimulatorNotSupported",
            locale
          );
        break;
      case "geocoordinates":
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
    speakOutput = await airtable.getRandomSpeech("PROFILESPECIFY", locale);
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
