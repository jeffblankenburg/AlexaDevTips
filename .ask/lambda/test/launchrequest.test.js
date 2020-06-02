const launchRequestHandler = require("../handler/launchRequest");
const testInput = require("./launchRequest.json");
const rootIndex = require("../");

//launchRequestHandler(JSON).then((r) => console.log(JSON.stringify(r)));

test("Should not be an error", async () => {
  // const data = await launchRequestHandler(testInput);



  
  console.log("testData", data);



  expect(data.sessionAttributes.isError).toBe(false);
});

// test("Should be a launch request", async () => {
//   const data = await launchRequestHandler(testInput);
//   expect(data.sessionAttributes.previousAction).toBe("LAUNCHREQUEST");
// });
