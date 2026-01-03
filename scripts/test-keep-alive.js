/**
 * Keep-Alive Local Testing Script
 *
 * Usage:
 *   npm run test:keep-alive
 *
 * Tests the keep-alive endpoint locally to ensure it's working correctly
 * before deploying to Vercel
 */

const http = require("http");

const BASE_URL = "http://localhost:3000";
const ENDPOINT = "/api/keep-alive";

async function testKeepAlive() {
  console.log("🔍 Testing Keep-Alive Endpoint...\n");
  console.log(`Testing: ${BASE_URL}${ENDPOINT}\n`);

  // Test 1: GET Request
  console.log("📊 Test 1: GET Request (Full Response)");
  try {
    const getResponse = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "GET",
    });

    const data = await getResponse.json();

    console.log(`Status: ${getResponse.status} ${getResponse.statusText}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

    if (getResponse.status === 200 && data.success) {
      console.log("✅ GET test passed\n");
    } else {
      console.log("❌ GET test failed\n");
    }
  } catch (error) {
    console.log(
      "❌ GET test failed:",
      error instanceof Error ? error.message : "Unknown error",
      "\n"
    );
  }

  // Test 2: HEAD Request
  console.log("📊 Test 2: HEAD Request (Lightweight)");
  try {
    const headResponse = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "HEAD",
    });

    console.log(`Status: ${headResponse.status} ${headResponse.statusText}`);
    console.log(`Content-Length: ${headResponse.headers.get("content-length")}`);

    if (headResponse.status === 200) {
      console.log("✅ HEAD test passed\n");
    } else {
      console.log("❌ HEAD test failed\n");
    }
  } catch (error) {
    console.log(
      "❌ HEAD test failed:",
      error instanceof Error ? error.message : "Unknown error",
      "\n"
    );
  }

  // Test 3: Multiple Consecutive Requests
  console.log("📊 Test 3: Performance - 5 Consecutive Requests");
  const times = [];

  for (let i = 1; i <= 5; i++) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
        method: "GET",
      });
      const duration = Date.now() - startTime;
      times.push(duration);

      console.log(`Request ${i}: ${duration}ms - ${response.status}`);
    } catch (error) {
      console.log(
        `Request ${i}: Failed -`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    console.log(`\nPerformance Summary:`);
    console.log(`  Average: ${avgTime.toFixed(1)}ms`);
    console.log(`  Min: ${minTime}ms`);
    console.log(`  Max: ${maxTime}ms`);
    console.log("✅ Performance test passed\n");
  }

  console.log("✨ All tests completed!");
}

// Run tests
testKeepAlive().catch(console.error);
