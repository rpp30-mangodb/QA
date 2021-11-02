/* eslint-disable camelcase */
const frisby = require('frisby');

frisby.globalSetup({
  request: {
    headers: {
      'content-type': 'application/json'
    }, timeout: (30 * 1000)
  }
});

jest.setTimeout(10000);

// get answers request - frisby.get('url');
it ('GET should return a status of 200 OK', function () {
  return frisby
    .get('http://localhost:5000/qa/questions/209511/answers?page=1&count=100')
    .expect('status', 200);
});
