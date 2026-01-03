# Keep-Alive Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL INFRASTRUCTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         VERCEL CRON SCHEDULER (vercel.json)            │ │
│  │  Schedule: */15 * * * *  (Every 15 minutes)            │ │
│  │  Runs 24/7 automatically                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      NEXT.JS API ROUTE HANDLER                         │ │
│  │   app/api/keep-alive/route.ts                          │ │
│  │                                                         │ │
│  │  GET  /api/keep-alive  →  Full JSON response          │ │
│  │  HEAD /api/keep-alive  →  Status code only            │ │
│  │                                                         │ │
│  │  ┌─────────────────────────────────────────────┐      │ │
│  │  │ 1. Verify DATABASE_URL exists               │      │ │
│  │  │ 2. Execute: db.$queryRaw`SELECT 1`          │      │ │
│  │  │ 3. Measure execution time (~10-30ms)        │      │ │
│  │  │ 4. Return response with metrics             │      │ │
│  │  └─────────────────────────────────────────────┘      │ │
│  └────────────────────────────────────────────────────────┘ │
│                         │                                   │
│                         ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      PRISMA CLIENT (lib/prisma.ts)                     │ │
│  │                                                         │ │
│  │  Singleton Pattern:                                    │ │
│  │  ├─ First request: Create PrismaClient instance       │ │
│  │  └─ Subsequent: Reuse same instance                   │ │
│  │                                                         │ │
│  │  Connection Pool Management:                           │ │
│  │  ├─ Maintains persistent connections                  │ │
│  │  ├─ Prevents connection leaks                         │ │
│  │  └─ Serverless-safe (no disconnect needed)            │ │
│  └────────────────────────────────────────────────────────┘ │
│                         │                                   │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │    YOUR DATABASE PROVIDER            │
        ├─────────────────────────────────────┤
        │                                     │
        │  ✅ PostgreSQL  (Your current DB)  │
        │  ✅ MongoDB                         │
        │  ✅ MySQL                           │
        │  ✅ MariaDB                         │
        │  ✅ SQLite                          │
        │  ✅ CockroachDB                     │
        │                                     │
        │  Receives: SELECT 1                 │
        │  Returns: 1 row / success          │
        │  Time: <1ms (pure database op)     │
        └─────────────────────────────────────┘
```

## Request Flow

### Timeline: Every 15 Minutes

```
00:00  ─────┬─────────────────────────────────────────────────
       Cron │ Execution #1
            ├─ GET /api/keep-alive
            ├─ SELECT 1 query
            ├─ Response: 200 OK (12ms)
            └─ Connection refreshed
            
00:15  ─────┬─────────────────────────────────────────────────
       Cron │ Execution #2
            └─ Connection still warm
            
00:30  ─────┬─────────────────────────────────────────────────
       Cron │ Execution #3
            └─ Connection still warm
            
00:45  ─────┬─────────────────────────────────────────────────
       Cron │ Execution #4
            └─ Connection still warm
            
01:00  ─────┬─────────────────────────────────────────────────
            │ Now user accesses app
            │ "Warm connection ready!"
            └─ Instant response (no cold start)
```

## Cold Start Prevention

### Without Keep-Alive ❌
```
T=0min   User visits app
         ↓
T=0min   Check connection status
         ↓
T=0min   Connection timed out (idle 45+ min)
         ↓
T=+5s    Cold start triggered
         ├─ Create new connection
         ├─ Authenticate
         ├─ Initialize pool
         ├─ Spin up container
         └─ Slow experience
         ↓
T=+15s   User finally sees response
```

### With Keep-Alive ✅
```
T=-15m   Cron: SELECT 1 query
         └─ Connection refreshed
         
T=-14m   Cron: SELECT 1 query
         └─ Connection refreshed
         
T=0min   User visits app
         ↓
T=0min   Check connection status
         ↓
T=0min   Connection is active! ✨
         ↓
T=+0.3s  User sees response
```

## Data Flow Sequence

```
        Vercel Cron          Next.js Route Handler       Prisma Client        Database
        ──────────────          ──────────────           ─────────────        ────────
             │                         │                       │                  │
             │  GET /api/keep-alive    │                       │                  │
             ├────────────────────────>│                       │                  │
             │                         │  db.$queryRaw("...") │                  │
             │                         ├──────────────────────>│                  │
             │                         │                       │  SELECT 1        │
             │                         │                       ├─────────────────>│
             │                         │                       │    Result        │
             │                         │                       │<─────────────────┤
             │                         │  result: 1            │                  │
             │                         │<──────────────────────┤                  │
             │                         │                       │                  │
             │  {success: true,        │                       │                  │
             │   duration: 12ms,       │                       │                  │
             │   timestamp: ...}       │                       │                  │
             │<────────────────────────┤                       │                  │
             │                         │                       │                  │
        [Log Success]            [Response sent]      [Connection warm]   [Idle reset]
```

## Error Handling Flow

```
GET /api/keep-alive Request
│
├─ Step 1: Check DATABASE_URL exists
│  ├─ ✅ Found → Continue
│  └─ ❌ Missing → Return 500 "DATABASE_URL not configured"
│
├─ Step 2: Execute SELECT 1 query
│  ├─ ✅ Success → Continue
│  └─ ❌ Failed → Catch error
│
├─ Step 3: Measure timing
│  └─ Record milliseconds
│
├─ Step 4: Format response
│  ├─ ✅ Success Response:
│  │   {
│  │     success: true,
│  │     message: "Connection active",
│  │     duration: "12ms",
│  │     timestamp: "2026-01-03T...",
│  │     environment: "production"
│  │   }
│  │
│  └─ ❌ Error Response:
│       {
│         success: false,
│         message: "Health check failed",
│         duration: "2500ms",
│         timestamp: "2026-01-03T...",
│         error: undefined  [hidden in production]
│       }
│
└─ Step 5: Return with status code
   ├─ 200 OK (success)
   └─ 500/503 (error)
```

## Connection Pool Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│                 CONNECTION POOL STATE                    │
└──────────────────────────────────────────────────────────┘

App Start
├─ Prisma Client initialized
└─ Empty connection pool

First Request (User or Cron)
├─ Get connection from pool
├─ Execute query
├─ Return connection to pool
└─ Pool now contains 1 active connection

Subsequent Requests
├─ Reuse connection from pool
├─ Execute query
└─ Return connection to pool

15 Minutes Without Activity
├─ Database times out connection
└─ Pool marked as stale

Keep-Alive Cron at 15 Minute Mark
├─ Cron triggers GET /api/keep-alive
├─ Cron reuses pool connection
├─ Database sees activity
└─ Pool connection refreshed! 🔄

Pattern Repeats Every 15 Minutes
└─ Connection stays warm forever
```

## Response Time Analysis

```
GET /api/keep-alive Timeline
│
├─ 0-1ms    Parse request
├─ 1-2ms    Validate DATABASE_URL
├─ 2-10ms   Network latency to database
├─ 10-11ms  Database: SELECT 1 (zero-cost operation)
├─ 11-20ms  Network latency back from database
├─ 20-21ms  Construct JSON response
├─ 21-22ms  Serialize JSON
├─ 22-25ms  Send response to client
│
└─ TOTAL: ~10-30ms (typical)

When Database is Slow (e.g., 100ms query time)
├─ Would add +90ms to response
└─ Total: ~100-120ms (still acceptable)

When Database is Down
├─ Connection timeout: ~2500ms
└─ Total: ~2500ms+ (error response)
```

## Vercel Cron Execution

```
┌─────────────────────────────────────────────────────┐
│        VERCEL CRON EXECUTION PATTERN                │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Schedule: */15 * * * *  (Every 15 minutes)         │
│                                                      │
│ Minute 00:                                          │
│ ├─ Cron fires                                       │
│ ├─ HTTP GET /api/keep-alive sent                   │
│ ├─ Serverless function cold starts (if needed)     │
│ ├─ Database connection warmed                      │
│ └─ Log: "✓ CRON GET /api/keep-alive 200 in 24ms" │
│                                                      │
│ Minute 15:                                          │
│ ├─ Cron fires                                       │
│ ├─ HTTP GET /api/keep-alive sent                   │
│ ├─ Serverless function hot start (reused)          │
│ ├─ Database connection refreshed                   │
│ └─ Log: "✓ CRON GET /api/keep-alive 200 in 18ms" │
│                                                      │
│ Minute 30:                                          │
│ ├─ (Pattern repeats)                                │
│                                                      │
│ Minute 45:                                          │
│ └─ (Pattern repeats)                                │
│                                                      │
│ Minute 60 (Hour changes):                           │
│ └─ (Pattern continues across hours)                │
│                                                      │
└─────────────────────────────────────────────────────┘

Daily Statistics:
├─ Executions: 96 (every 15 minutes)
├─ Monthly: ~2,880 executions
├─ Bandwidth: <10MB/month
├─ Cost: Covered by Vercel Free Tier (50/month) ❌
└─ Recommendation: Upgrade to Pro Plan ✅
```

## Scalability

```
Single Database Connection Pool
│
├─ User Requests (concurrent)
│  ├─ Request 1 → Connection #1
│  ├─ Request 2 → Connection #2
│  ├─ Request 3 → Connection #3
│  └─ Request N → Connection #N (from pool)
│
├─ Cron Job (every 15 minutes)
│  └─ Keep-Alive → Reuse existing connection
│
└─ Connection Pool Size
   ├─ Default: 10 connections
   ├─ Under load: All 10 used
   └─ Keep-Alive: Uses 1 of 10 (negligible impact)
```

## Failure Scenarios

```
Scenario 1: Database Timeout
┌────────────────────────────────────────┐
│ GET /api/keep-alive                    │
│ → SELECT 1 command sent                │
│ → Database doesn't respond             │
│ → 2500ms timeout triggered             │
│ → Error caught and logged              │
│ → Return 503 Service Unavailable       │
│ → Alerts (if configured) trigger       │
└────────────────────────────────────────┘

Scenario 2: Missing DATABASE_URL
┌────────────────────────────────────────┐
│ GET /api/keep-alive                    │
│ → Check: process.env.DATABASE_URL      │
│ → Not found                            │
│ → Return 500 with message              │
│ → No database query attempted          │
│ → Quick fail (~1ms)                    │
└────────────────────────────────────────┘

Scenario 3: Cron Disabled
┌────────────────────────────────────────┐
│ vercel.json missing or invalid         │
│ → Vercel doesn't schedule cron job     │
│ → No automatic pings                   │
│ → Connection times out after 30-60min  │
│ → Next user request experiences        │
│   cold start (~5-15 seconds)           │
│ → Manual keep-alive via curl possible  │
└────────────────────────────────────────┘

Scenario 4: Function Execution Limit Exceeded
┌────────────────────────────────────────┐
│ Cron fires but function takes >30s     │
│ → Vercel timeout triggered (maxDuration: 30)
│ → Function aborted                     │
│ → Marked as failed                     │
│ → Check logs for performance issues    │
│ → May indicate database overload       │
└────────────────────────────────────────┘
```

## Resource Consumption

```
Per Keep-Alive Execution:
├─ Compute Time:    <30ms (under 1 second of available)
├─ Memory Peak:     ~15MB (out of 3GB available)
├─ Memory Baseline: ~5MB (reusing Prisma instance)
├─ Network:         ~350 bytes (query + response)
├─ Database:        Negligible (SELECT 1 = zero cost)
└─ Cost:            ~$0.0001 per execution

Monthly (96 executions):
├─ Total Compute:   ~2.88 seconds
├─ Memory Overhead: Negligible
├─ Network:         ~3.4MB
├─ Cost:            ~$0.009
└─ ROI:             Prevents cold starts worth minutes of lost productivity

Vercel Free Plan Impact:
├─ Includes:        3GB CPU-seconds/month
├─ Keep-Alive Uses: ~2.88 seconds/month
├─ Remaining:       ~2.997GB CPU-seconds
└─ Impact:          <0.001% of free tier
```

---

**Diagram Status**: ✅ Complete  
**Last Updated**: January 2026
