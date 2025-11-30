# Performance Optimization Plan - Vita Workshop Module

## Overview

This document outlines performance optimization strategies for the Vita Workshop module to ensure scalability, fast response times, and efficient resource usage.

## Current Performance Baseline

### API Response Time Targets
- Content retrieval: < 500ms
- Session operations: < 1s
- Progress calculations: < 2s
- Assessment scoring: < 1s
- Recommendation generation: < 3s

### Database Query Optimization

#### 1. Index Optimization
```sql
-- Content Module Indexes
CREATE INDEX idx_content_module_category ON ContentModule(category);
CREATE INDEX idx_content_module_status ON ContentModule(status);
CREATE INDEX idx_content_module_age_range ON ContentModule(ageGroupMin, ageGroupMax);
CREATE INDEX idx_content_module_clinic ON ContentModule(clinicId);

-- Session Indexes
CREATE INDEX idx_workshop_session_child ON WorkshopSession(childId);
CREATE INDEX idx_workshop_session_module ON WorkshopSession(moduleId);
CREATE INDEX idx_workshop_session_accessed ON WorkshopSession(lastAccessedAt);

-- Progress Indexes
CREATE INDEX idx_child_progress_child ON ChildProgress(childId);
CREATE INDEX idx_child_progress_engagement ON ChildProgress(lastEngagementDate);

-- Activity Completion Indexes
CREATE INDEX idx_activity_completion_child ON ActivityCompletion(childId);
CREATE INDEX idx_activity_completion_activity ON ActivityCompletion(activityId);
CREATE INDEX idx_activity_completion_date ON ActivityCompletion(completedAt);

-- Assessment Result Indexes
CREATE INDEX idx_assessment_result_child ON WorkshopAssessmentResult(childId);
CREATE INDEX idx_assessment_result_assessment ON WorkshopAssessmentResult(assessmentId);
CREATE INDEX idx_assessment_result_date ON WorkshopAssessmentResult(completedAt);
```

#### 2. Query Optimization Strategies

**Optimized Content Retrieval**
```typescript
// Before: N+1 query problem
async function getModulesWithActivities(childId: string) {
  const modules = await prisma.contentModule.findMany({
    where: { status: 'published' }
  });
  
  // N+1 queries for activities
  for (const module of modules) {
    module.activities = await prisma.activity.findMany({
      where: { moduleId: module.id }
    });
  }
  return modules;
}

// After: Single query with includes
async function getModulesWithActivitiesOptimized(childId: string) {
  return prisma.contentModule.findMany({
    where: { status: 'published' },
    include: {
      activities: {
        select: {
          id: true,
          name: true,
          type: true,
          duration: true,
          points: true
        }
      },
      mediaAssets: {
        select: {
          id: true,
          type: true,
          url: true
        }
      }
    }
  });
}
```

**Optimized Progress Calculation**
```typescript
// Before: Multiple separate queries
async function calculateProgressSlow(childId: string) {
  const totalModules = await prisma.contentModule.count({
    where: { status: 'published' }
  });
  
  const completedSessions = await prisma.workshopSession.count({
    where: { 
      childId,
      completedAt: { not: null }
    }
  });
  
  return (completedSessions / totalModules) * 100;
}

// After: Single aggregated query
async function calculateProgressFast(childId: string) {
  const [totalModules, completedSessions] = await Promise.all([
    prisma.contentModule.count({
      where: { status: 'published' }
    }),
    prisma.workshopSession.count({
      where: { 
        childId,
        completedAt: { not: null }
      }
    })
  ]);
  
  return (completedSessions / totalModules) * 100;
}
```

### 3. Caching Strategy

#### Redis Caching Implementation
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache content modules
async function getCachedModules(category?: string): Promise<ContentModule[]> {
  const cacheKey = `modules:${category || 'all'}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const modules = await prisma.contentModule.findMany({
    where: category ? { category, status: 'published' } : { status: 'published' },
    include: {
      activities: true,
      mediaAssets: true
    }
  });
  
  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(modules));
  
  return modules;
}

// Cache child progress
async function getCachedProgress(childId: string): Promise<ProgressData> {
  const cacheKey = `progress:${childId}`;
  
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const progress = await calculateProgress(childId);
  
  // Cache for 10 minutes
  await redis.setex(cacheKey, 600, JSON.stringify(progress));
  
  return progress;
}

// Invalidate cache on updates
async function invalidateProgressCache(childId: string) {
  await redis.del(`progress:${childId}`);
}
```

#### Application-Level Caching
```typescript
// In-memory cache for frequently accessed data
class ContentCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  
  set(key: string, data: any, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  
  invalidate(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

const contentCache = new ContentCache();
```

### 4. Database Connection Optimization

#### Connection Pooling
```typescript
// Optimized Prisma configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['warn', 'error']
});

// Connection pool settings for production
const connectionString = new URL(process.env.DATABASE_URL!);
connectionString.searchParams.set('connection_limit', '20');
connectionString.searchParams.set('pool_timeout', '20');
connectionString.searchParams.set('socket_timeout', '60');
```

### 5. API Response Optimization

#### Response Compression
```typescript
// Enable gzip compression
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

#### Pagination Implementation
```typescript
// Optimized pagination for large datasets
async function getPaginatedModules(
  page: number = 1,
  limit: number = 20,
  filters?: ModuleFilters
) {
  const skip = (page - 1) * limit;
  
  const [modules, total] = await Promise.all([
    prisma.contentModule.findMany({
      where: buildWhereClause(filters),
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        ageGroupMin: true,
        ageGroupMax: true,
        status: true,
        createdAt: true
      }
    }),
    prisma.contentModule.count({
      where: buildWhereClause(filters)
    })
  ]);
  
  return {
    modules,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: skip + modules.length < total,
      hasPrev: page > 1
    }
  };
}
```

#### Response Field Selection
```typescript
// Only return necessary fields
async function getModulesList(childId?: string) {
  return prisma.contentModule.findMany({
    where: { status: 'published' },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      ageGroupMin: true,
      ageGroupMax: true,
      // Don't include large fields like content, steps
      activities: {
        select: {
          id: true,
          name: true,
          type: true,
          duration: true,
          points: true
          // Don't include steps JSON
        }
      }
    }
  });
}
```

### 6. Media Asset Optimization

#### CDN Integration with Cloudflare R2
```typescript
// Optimized media serving
async function getOptimizedMediaUrl(
  assetId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  }
): Promise<string> {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id: assetId }
  });
  
  if (!asset) {
    throw new Error('Asset not found');
  }
  
  // Use Cloudflare Image Resizing
  let url = asset.url;
  
  if (transformations) {
    const params = new URLSearchParams();
    if (transformations.width) params.set('width', transformations.width.toString());
    if (transformations.height) params.set('height', transformations.height.toString());
    if (transformations.quality) params.set('quality', transformations.quality.toString());
    if (transformations.format) params.set('format', transformations.format);
    
    url = `${asset.url}?${params.toString()}`;
  }
  
  return url;
}
```

#### Lazy Loading Implementation
```typescript
// Client-side lazy loading for media
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s'
      }}
    />
  );
};
```

### 7. Background Job Processing

#### Queue Implementation for Heavy Operations
```typescript
import Bull from 'bull';

const progressQueue = new Bull('progress calculation', {
  redis: { host: 'localhost', port: 6379 }
});

// Process progress calculations in background
progressQueue.process('calculate-progress', async (job) => {
  const { childId } = job.data;
  
  const progress = await calculateDetailedProgress(childId);
  
  // Update cache
  await redis.setex(`progress:${childId}`, 600, JSON.stringify(progress));
  
  // Notify client via WebSocket if needed
  io.to(`child:${childId}`).emit('progress-updated', progress);
  
  return progress;
});

// Queue progress calculation
async function queueProgressCalculation(childId: string) {
  await progressQueue.add('calculate-progress', { childId }, {
    delay: 1000, // Debounce rapid updates
    removeOnComplete: 10,
    removeOnFail: 5
  });
}
```

### 8. Real-time Updates Optimization

#### WebSocket Connection Management
```typescript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
  transports: ['websocket', 'polling']
});

// Efficient room management
io.on('connection', (socket) => {
  socket.on('join-child-room', (childId) => {
    socket.join(`child:${childId}`);
  });
  
  socket.on('leave-child-room', (childId) => {
    socket.leave(`child:${childId}`);
  });
});

// Batch notifications
const notificationBatch = new Map<string, any[]>();

setInterval(() => {
  for (const [room, notifications] of notificationBatch.entries()) {
    if (notifications.length > 0) {
      io.to(room).emit('batch-notifications', notifications);
      notificationBatch.set(room, []);
    }
  }
}, 1000); // Send batched notifications every second
```

### 9. Frontend Performance Optimization

#### React Query for Data Fetching
```typescript
import { useQuery, useMutation, useQueryClient } from 'react-query';

// Optimized data fetching with caching
function useChildProgress(childId: string) {
  return useQuery(
    ['progress', childId],
    () => fetchChildProgress(childId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false
    }
  );
}

// Optimistic updates
function useCompleteActivity() {
  const queryClient = useQueryClient();
  
  return useMutation(completeActivity, {
    onMutate: async ({ sessionId, activityId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['session', sessionId]);
      
      // Snapshot previous value
      const previousSession = queryClient.getQueryData(['session', sessionId]);
      
      // Optimistically update
      queryClient.setQueryData(['session', sessionId], (old: any) => ({
        ...old,
        completedActivities: [...old.completedActivities, activityId]
      }));
      
      return { previousSession };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['session', variables.sessionId], context?.previousSession);
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['session', variables.sessionId]);
    }
  });
}
```

#### Code Splitting and Lazy Loading
```typescript
// Lazy load workshop components
const WorkshopSession = lazy(() => import('./components/WorkshopSession'));
const ActivityLibrary = lazy(() => import('./components/ActivityLibrary'));
const ProgressDashboard = lazy(() => import('./components/ProgressDashboard'));

// Route-based code splitting
const WorkshopRoutes = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/session/:id" element={<WorkshopSession />} />
      <Route path="/activities" element={<ActivityLibrary />} />
      <Route path="/progress" element={<ProgressDashboard />} />
    </Routes>
  </Suspense>
);
```

### 10. Monitoring and Metrics

#### Performance Monitoring Setup
```typescript
import { performance } from 'perf_hooks';

// API response time monitoring
function trackApiPerformance(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    
    // Log slow requests
    if (duration > 2000) {
      console.warn(`Slow API request: ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Send metrics to monitoring service
    metrics.timing('api.response_time', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
  });
  
  next();
}

// Database query monitoring
const originalQuery = prisma.$use;
prisma.$use(async (params, next) => {
  const start = performance.now();
  const result = await next(params);
  const duration = performance.now() - start;
  
  if (duration > 1000) {
    console.warn(`Slow database query: ${params.model}.${params.action} - ${duration}ms`);
  }
  
  return result;
});
```

## Performance Testing

### Load Testing with Artillery
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100

scenarios:
  - name: "Workshop Session Flow"
    flow:
      - post:
          url: "/api/workshop/sessions"
          json:
            moduleId: "{{ moduleId }}"
            childId: "{{ childId }}"
      - post:
          url: "/api/workshop/sessions/{{ sessionId }}/complete-activity"
          json:
            activityId: "{{ activityId }}"
```

### Performance Benchmarks
```typescript
// Benchmark critical operations
describe('Performance Benchmarks', () => {
  test('Content retrieval should be under 500ms', async () => {
    const start = performance.now();
    await getModulesByAgeGroup(9);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(500);
  });
  
  test('Progress calculation should be under 2s', async () => {
    const start = performance.now();
    await calculateProgress(testChildId);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(2000);
  });
  
  test('Concurrent session starts should handle 50 users', async () => {
    const promises = Array(50).fill().map(() => 
      startWorkshopSession(testChildId, testModuleId)
    );
    
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    expect(successful).toBeGreaterThanOrEqual(45); // 90% success rate
  });
});
```

## Implementation Priority

### Phase 1: Critical Optimizations (Week 1)
1. ✅ Database indexes
2. ✅ Query optimization
3. ✅ Response field selection
4. ✅ Basic caching

### Phase 2: Advanced Optimizations (Week 2)
1. ✅ Redis caching
2. ✅ Background job processing
3. ✅ API pagination
4. ✅ Media optimization

### Phase 3: Monitoring and Scaling (Week 3)
1. ✅ Performance monitoring
2. ✅ Load testing
3. ✅ WebSocket optimization
4. ✅ Frontend optimizations

This comprehensive performance optimization plan ensures the Vita Workshop module can handle production loads efficiently while maintaining fast response times and good user experience.