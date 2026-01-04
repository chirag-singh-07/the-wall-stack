/**
 * Keep-Alive Production Job Script
 * 
 * Purpose: This script is intended to be run by an external scheduler (like GitHub Actions)
 * to ping the website and the database keep-alive endpoint, preventing NeonDB sleep.
 * 
 * Usage:
 *   node scripts/keep-alive-job.js
 */

const TARGET_URL = process.env.TARGET_URL || "https://the-wall-stack.vercel.app";
const KEEP_ALIVE_ENDPOINT = "/api/keep-alive";

async function runKeepAliveJob() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting Keep-Alive Job for: ${TARGET_URL}`);

  try {
    // 1. Ping Homepage (Keeps website warm)
    console.log(`[${timestamp}] Pinging Website Homepage...`);
    const homeResponse = await fetch(TARGET_URL);
    console.log(`[${timestamp}] Website Status: ${homeResponse.status} ${homeResponse.statusText}`);

    // 2. Ping Database Keep-Alive Endpoint (Keeps NeonDB warm)
    console.log(`[${timestamp}] Pinging Database Keep-Alive Endpoint...`);
    const dbResponse = await fetch(`${TARGET_URL}${KEEP_ALIVE_ENDPOINT}`);
    const dbData = await dbResponse.json();
    
    console.log(`[${timestamp}] Database Status: ${dbResponse.status} ${dbResponse.statusText}`);
    console.log(`[${timestamp}] Database Response:`, JSON.stringify(dbData));

    if (homeResponse.ok && dbResponse.ok) {
      console.log(`[${timestamp}] ✅ Keep-Alive Job Successful!`);
    } else {
      console.log(`[${timestamp}] ⚠️ Keep-Alive Job completed with warnings.`);
    }

  } catch (error) {
    console.error(`[${timestamp}] ❌ Keep-Alive Job Failed:`, error.message);
    process.exit(1);
  }
}

runKeepAliveJob();
