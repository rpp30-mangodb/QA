/* eslint-disable camelcase */
const frisby = require('frisby');

// api tests
frisby.globalSetup({
  request: {
    headers: {
      'content-type': 'application/json'
    }, timeout: (30 * 1000)
  }
});

jest.setTimeout(10000);

it ('GET should return a status of 400 bad request if product_id is undefined', function () {
  return frisby
    .get('http://localhost:5000/api/qa/questions?product_id=undefined&page=1&count=100')
    .expect('status', 400);
});

it ('GET should return a status of 400 bad request if page is undefined', function () {
  return frisby
    .get('http://localhost:5000/api/qa/questions?product_id=59553&page=undefined&count=100')
    .expect('status', 400);
});

it ('GET should return a status of 400 bad request if count is undefined', function () {
  return frisby
    .get('http://localhost:5000/api/qa/questions?product_id=59553&page=1&count=undefined')
    .expect('status', 400);
});

it ('GET should return a status of 400 bad request if product_id is not an integer', function () {
  return frisby
    .get('http://localhost:5000/api/qa/questions?product_id=five&page=1&count=100')
    .expect('status', 400);
});

it ('GET should return a status of 400 bad request if page is not an integer', function () {
  return frisby
    .get('http://localhost:5000/api/qa/questions?product_id=59553&page=one&count=100')
    .expect('status', 400);
});

it ('GET should return a status of 400 bad request if count is not an intger', function () {
  return frisby
    .get('http://localhost:5000/api/qa/questions?product_id=59553&page=1&count=hundred')
    .expect('status', 400);
});

it ('GET should return a status of 200 OK with valid parameters', function () {
  return frisby
    .get('http://localhost:5000/api/qa/questions?product_id=59553&page=1&count=100')
    .expect('status', 200);
});
