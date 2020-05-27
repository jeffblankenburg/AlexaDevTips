const assert = require('assert');

describe('Age Tests', () => {
  it('Nothing should be @jeffblankenburg 5 years, 7 months', () => {
    commands
      .age('')
      .then((r) =>
        assert.equal(
          r,
          '@jeffblankenburg has been on Twitch for 5 years, 7 months.',
        ),
      );
  });
});


