/**
 * Database Health Check Utility
 *
 * Optional utility for more granular database health monitoring
 * Can be used in your application to check connection status on-demand
 */

import { db } from "./prisma";

export interface HealthCheckResult {
  success: boolean;
  message: string;
  duration: number;
  timestamp: Date;
  environment: string;
  details?: {
    connectionEstablished: boolean;
    responseTime: number;
  };
}

/**
 * Perform a lightweight database health check
 * Safe to call multiple times without performance impact
 *
 * @returns HealthCheckResult with connection status
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Execute the same lightweight query as the cron job
    await db.$queryRaw`SELECT 1`;

    const duration = Date.now() - startTime;

    return {
      success: true,
      message: "Database connection is healthy",
      duration,
      timestamp: new Date(),
      environment: process.env.NODE_ENV || "unknown",
      details: {
        connectionEstablished: true,
        responseTime: duration,
      },
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown database error",
      duration,
      timestamp: new Date(),
      environment: process.env.NODE_ENV || "unknown",
      details: {
        connectionEstablished: false,
        responseTime: duration,
      },
    };
  }
}

/**
 * Check if database connection is available
 * Returns boolean for simple connectivity checks
 *
 * @returns true if database is reachable, false otherwise
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current database connection pool status
 * Requires PostgreSQL datasource (may not work with all databases)
 *
 * @returns Connection pool metrics
 */
export async function getConnectionPoolStatus() {
  try {
    // This works for PostgreSQL
    const result = await db.$queryRaw<
      Array<{ current_database: string; usename: string; count: string }>
    >`
      SELECT current_database(), usename, COUNT(*) as count
      FROM pg_stat_activity
      GROUP BY current_database, usename
    `;

    return {
      success: true,
      poolStatus: result,
      timestamp: new Date(),
    };
  } catch (error) {
    // Not all databases support this query
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Connection pool status unavailable",
      timestamp: new Date(),
    };
  }
}

/**
 * Example usage in server components:
 *
 * import { checkDatabaseHealth } from '@/lib/health-check';
 *
 * export default async function Dashboard() {
 *   const health = await checkDatabaseHealth();
 *
 *   return (
 *     <div>
 *       <h1>Database Status</h1>
 *       <p>Status: {health.success ? 'Healthy' : 'Unhealthy'}</p>
 *       <p>Response time: {health.duration}ms</p>
 *     </div>
 *   );
 * }
 */
