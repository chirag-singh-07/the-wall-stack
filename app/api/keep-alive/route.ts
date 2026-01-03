/**
 * Keep-Alive API Route for Database Connection Warm
 *
 * Purpose: Prevent database connection timeouts and cold starts in serverless environments
 * by performing lightweight health checks at regular intervals.
 *
 * Deployment: Vercel Cron Job (scheduled via vercel.json)
 * Runtime: Node.js (serverless function)
 * Frequency: Every 15 minutes
 *
 * Why 15 minutes?
 * - MongoDB Atlas free/shared clusters have a 60-minute idle connection timeout
 * - PostgreSQL connections timeout after 30-60 minutes of inactivity
 * - Running every 15 minutes ensures at least 2 pings before timeout
 * - Minimizes cold starts when users access the app
 */

import { NextRequest, NextResponse } from "next/server";

// Import the reusable Prisma Client singleton
// This prevents connection pool leaks in serverless environments
import { db } from "@/lib/prisma";

/**
 * GET /api/keep-alive
 *
 * Lightweight health check endpoint that:
 * 1. Verifies database connectivity
 * 2. Performs a minimal read operation (no data modification)
 * 3. Returns status and timestamp
 * 4. Safely handles errors without crashing
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "DATABASE_URL environment variable is not configured",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    /**
     * Perform a lightweight database operation to verify connectivity
     *
     * Options:
     * - PostgreSQL: $queryRaw`SELECT 1` (fastest)
     * - MongoDB: db.$runCommandRaw({ ping: 1 }) (idiomatic)
     *
     * Using $queryRaw for both databases as it's universally supported
     * and has minimal overhead.
     */
    await db.$queryRaw`SELECT 1`;

    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        message: "Database connection is active",
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "unknown",
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown database error";

    console.error("[keep-alive] Database health check failed:", {
      error: errorMessage,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        message: "Database health check failed",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

/**
 * HEAD /api/keep-alive
 *
 * Lightweight health check that doesn't require a response body
 * Useful for lightweight monitoring and reducing bandwidth
 */
export async function HEAD(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return new NextResponse(null, { status: 500 });
    }

    await db.$queryRaw`SELECT 1`;

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[keep-alive] HEAD health check failed:", error);
    return new NextResponse(null, { status: 503 });
  }
}

/**
 * Configuration for Vercel serverless function
 * - maxDuration: Set reasonable timeout (default 10s, max 300s on Pro plan)
 * - Keep lightweight to avoid exceeding execution time limits
 */
export const maxDuration = 30;
