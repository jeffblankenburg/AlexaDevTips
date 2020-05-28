const launchRequestHandler = require("../handler/launchRequest");
const JSON = require("./launchRequest.json");

//launchRequestHandler(JSON).then((r) => console.log(JSON.stringify(r)));

test("Should not be an error", async () => {
  const data = await launchRequestHandler(JSON);
  expect(data.sessionAttributes.isError).toBe(false);
});

test("Should be a launch request", async () => {
  const data = await launchRequestHandler(JSON);
  expect(data.sessionAttributes.previousAction).toBe("LAUNCHREQUEST");
});
