# Keep-Alive Code Examples & Recipes

## Quick Examples

### Using in Server Components

```typescript
// app/admin/health/page.tsx
import { checkDatabaseHealth } from '@/lib/health-check';

export default async function HealthPage() {
  const health = await checkDatabaseHealth();

  return (
    <div>
      <h1>Database Health</h1>
      <div className={health.success ? 'text-green-600' : 'text-red-600'}>
        Status: {health.success ? 'Healthy' : 'Unhealthy'}
      </div>
      <p>Response Time: {health.duration}ms</p>
      <p>Last Check: {health.timestamp.toISOString()}</p>
    </div>
  );
}
```

### Using in Client Components

```typescript
// components/health-indicator.tsx
'use client';

import { useState, useEffect } from 'react';

export function HealthIndicator() {
  const [status, setStatus] = useState<'healthy' | 'unhealthy' | 'loading'>('loading');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/keep-alive', { method: 'HEAD' });
        setStatus(response.ok ? 'healthy' : 'unhealthy');
      } catch {
        setStatus('unhealthy');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`h-3 w-3 rounded-full ${
      status === 'healthy' ? 'bg-green-500' :
      status === 'unhealthy' ? 'bg-red-500' :
      'bg-yellow-500'
    }`} />
  );
}
```

### Manual Keep-Alive Trigger

```bash
# Test GET endpoint
curl http://localhost:3000/api/keep-alive

# Test HEAD endpoint (lightweight)
curl -I http://localhost:3000/api/keep-alive

# With jq for pretty JSON
curl http://localhost:3000/api/keep-alive | jq '.'

# Measure response time
curl -w "@curl-format.txt" http://localhost:3000/api/keep-alive

# Check status code only
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/keep-alive
```

### Monitoring with Sentry

```typescript
// app/api/keep-alive/route.ts
import * as Sentry from "@sentry/nextjs";

export async function GET(request: NextRequest) {
  const transaction = Sentry.startTransaction({
    name: "Keep-Alive Health Check",
    op: "http.server",
  });

  try {
    // ... existing code ...
    
    transaction.finish();
    return NextResponse.json({ success: true, ... });
  } catch (error) {
    Sentry.captureException(error, {
      contexts: {
        "database": {
          "type": "keep-alive",
          "timestamp": new Date().toISOString()
        }
      }
    });
    transaction.finish();
    return NextResponse.json({ success: false, ... }, { status: 503 });
  }
}
```

### Custom Health Check Variant

```typescript
// For checking specific model existence
export async function GET(request: NextRequest) {
  try {
    const user = await db.user.findFirst({
      select: { id: true }
    });

    return NextResponse.json({
      success: user !== null,
      message: user ? "Database accessible" : "No users found",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}
```

### Multiple Database Keep-Alive

```json
{
  "crons": [
    {
      "path": "/api/keep-alive?db=primary",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/keep-alive?db=analytics",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

```typescript
// app/api/keep-alive/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const db = searchParams.get('db') || 'primary';

  // Handle different databases
  switch(db) {
    case 'primary':
      return checkPrimaryDatabase();
    case 'analytics':
      return checkAnalyticsDatabase();
    default:
      return NextResponse.json({ error: 'Unknown database' }, { status: 400 });
  }
}
```

## Advanced Patterns

### Keep-Alive with Metrics Storage

```typescript
// Store metrics in database for analysis
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    await db.$queryRaw`SELECT 1`;
    const duration = Date.now() - startTime;

    // Store metrics (optional)
    await db.systemMetrics.create({
      data: {
        type: 'KEEP_ALIVE',
        duration,
        success: true,
        timestamp: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    await db.systemMetrics.create({
      data: {
        type: 'KEEP_ALIVE',
        duration,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      }
    });

    return NextResponse.json(
      { success: false, error: 'Database check failed' },
      { status: 503 }
    );
  }
}
```

### Conditional Keep-Alive Based on Environment

```typescript
export async function GET(request: NextRequest) {
  // Skip keep-alive in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({
      message: 'Keep-alive disabled in development',
      environment: 'development'
    });
  }

  // Only run in production
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'DATABASE_URL not configured' },
      { status: 500 }
    );
  }

  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 503 }
    );
  }
}
```

### Rate-Limited Keep-Alive

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function GET(request: NextRequest) {
  const identifier = "keep-alive-cron";
  const { success, limit, reset, remaining, pending } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 503 }
    );
  }
}
```

### Health Check Dashboard

```typescript
// app/admin/system-health/page.tsx
import { db } from '@/lib/prisma';
import { checkDatabaseHealth } from '@/lib/health-check';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SystemHealthPage() {
  const [health, metrics] = await Promise.all([
    checkDatabaseHealth(),
    db.systemMetrics.findMany({
      where: { type: 'KEEP_ALIVE' },
      orderBy: { timestamp: 'desc' },
      take: 10,
    })
  ]);

  const avgDuration = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length)
    : 0;

  const successRate = metrics.length > 0
    ? Math.round((metrics.filter(m => m.success).length / metrics.length) * 100)
    : 100;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold">System Health</h1>

      {/* Current Status */}
      <div className={`p-6 rounded-lg ${health.success ? 'bg-green-50' : 'bg-red-50'}`}>
        <h2 className="text-2xl font-semibold mb-2">Database Status</h2>
        <p className="text-lg">
          {health.success ? '✅ Healthy' : '❌ Unhealthy'}
        </p>
        <p className="text-sm text-gray-600">
          Last checked: {health.timestamp.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          Response time: {health.duration}ms
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-600">Average Response Time</p>
          <p className="text-2xl font-bold">{avgDuration}ms</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold">{successRate}%</p>
        </div>
      </div>

      {/* Recent Executions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Executions</h2>
        <div className="space-y-2">
          {metrics.map((m) => (
            <div key={m.id} className="p-3 border rounded-lg flex justify-between">
              <div>
                <p className="font-medium">
                  {m.success ? '✅' : '❌'} {m.type}
                </p>
                <p className="text-sm text-gray-600">
                  {m.timestamp.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono">{m.duration}ms</p>
                {m.error && (
                  <p className="text-sm text-red-600">{m.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Testing Recipes

### Jest Unit Test

```typescript
// __tests__/api/keep-alive.test.ts
import { GET, HEAD } from '@/app/api/keep-alive/route';
import { NextRequest } from 'next/server';

describe('Keep-Alive API', () => {
  it('should return 200 on successful health check', async () => {
    const request = new NextRequest(new URL('http://localhost/api/keep-alive'));
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.duration).toBeDefined();
  });

  it('should return 500 when DATABASE_URL is missing', async () => {
    const originalUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    const request = new NextRequest(new URL('http://localhost/api/keep-alive'));
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);

    process.env.DATABASE_URL = originalUrl;
  });

  it('should handle HEAD requests', async () => {
    const request = new NextRequest(new URL('http://localhost/api/keep-alive'), {
      method: 'HEAD'
    });
    const response = await HEAD(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-length')).toBe('0');
  });
});
```

### Load Testing with Artillery

```yaml
# load-test.yml
config:
  target: "https://your-domain.vercel.app"
  phases:
    - duration: 60
      arrivalRate: 1
      name: "Ramping up"
    - duration: 120
      arrivalRate: 5
      name: "Sustained load"
    - duration: 60
      arrivalRate: 1
      name: "Ramping down"

scenarios:
  - name: "Keep-Alive Health Checks"
    flow:
      - get:
          url: "/api/keep-alive"
          expect:
            - statusCode: 200
```

```bash
# Run load test
npm install -g artillery
artillery run load-test.yml
```

## Debugging & Logging

### Enhanced Logging

```typescript
// app/api/keep-alive/route.ts with detailed logging
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  console.log(`[keep-alive:${requestId}] Request started at ${new Date().toISOString()}`);

  try {
    if (!process.env.DATABASE_URL) {
      console.warn(`[keep-alive:${requestId}] DATABASE_URL not configured`);
      return NextResponse.json({ ... }, { status: 500 });
    }

    console.log(`[keep-alive:${requestId}] Executing SELECT 1 query...`);
    const startQuery = Date.now();
    await db.$queryRaw`SELECT 1`;
    const queryDuration = Date.now() - startQuery;

    console.log(`[keep-alive:${requestId}] Query completed in ${queryDuration}ms`);

    const totalDuration = Date.now() - startTime;
    console.log(`[keep-alive:${requestId}] Total duration: ${totalDuration}ms`);

    return NextResponse.json({
      success: true,
      duration: `${totalDuration}ms`,
      timestamp: new Date().toISOString(),
      requestId
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[keep-alive:${requestId}] Error after ${duration}ms:`, error);

    return NextResponse.json(
      { success: false, error: 'Database check failed', requestId },
      { status: 503 }
    );
  }
}
```

---

**Status**: ✅ Examples Complete  
**Last Updated**: January 2026
