const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

// Import your server.js file
const app = require('../server'); 

test('GET /health should return 200 and healthy status', async () => {
  // Simulate a GET request to the /health endpoint
  const response = await request(app).get('/health');
  
  // Verify the HTTP status code is 200
  assert.strictEqual(response.status, 200);
  
  // Verify the JSON response exactly matches what your server.js sends
  assert.deepStrictEqual(response.body, {
    status: "healthy",
    service: "holiday-events"
  });
});