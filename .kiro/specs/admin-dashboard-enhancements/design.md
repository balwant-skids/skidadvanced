# Design Document

## Overview

This design document outlines the architecture for enhancing the SKIDS Advanced admin dashboard with E2E testing, analytics visualization, bulk operations, CSV export, and search/filter capabilities. The enhancements will use Playwright for E2E testing, Recharts for data visualization, and implement efficient client-side and server-side processing for bulk operations and exports.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD ENHANCEMENTS ARCHITECTURE               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  E2E TESTING LAYER (Playwright)                                     │
│  ├── Admin workflow tests                                           │
│  ├── Bulk operations tests                                          │
│  └── Export functionality tests                                     │
│                                                                      │
│  FRONTEND ENHANCEMENTS                                              │
│  ├── Analytics Dashboard (Recharts)                                 │
│  │   ├── Line charts (registrations over time)                      │
│  │   ├── Pie charts (subscription distribution)                     │
│  │   └── Bar charts (children per clinic)                           │
│  │                                                                   │
│  ├── Bulk Operations UI                                             │
│  │   ├── Multi-select checkboxes                                    │
│  │   ├── Bulk action buttons                                        │
│  │   └── Progress indicators                                        │
│  │                                                                   │
│  ├── Search & Filter Components                                     │
│  │   ├── Debounced search inputs                                    │
│  │   ├── Filter dropdowns                                           │
│  │   └── Real-time result updates                                   │
│  │                                                                   │
│  └── Export UI                                                      │
│      ├── Export buttons                                             │
│      ├── Progress indicators                                        │
│      └── Download triggers                                          │
│                                                                      │
│  BACKEND ENHANCEMENTS                                               │
│  ├── Analytics API (/api/admin/analytics)                          │
│  │   ├── Aggregate queries                                          │
│  │   ├── Time-series data                                           │
│  │   └── Cached results                                             │
│  │                                                                   │
│  ├── Bulk Operations API                                            │
│  │   ├── Batch processing                                           │
│  │   ├── Transaction handling                                       │
│  │   └── Error collection                                           │
│  │                                                                   │
│  ├── Export API (/api/admin/export)                                │
│  │   ├── CSV generation                                             │
│  │   ├── Streaming responses                                        │
│  │   └── Role-based filtering                                       │
│  │                                                                   │
│  └── Search/Filter API                                              │
│      ├── Full-text search                                           │
│      ├── Combined filters                                           │
│      └── Pagination                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. E2E Testing Framework (Playwright)

```typescript
// tests/e2e/admin/clinic-management.spec.ts
interface ClinicTestContext {
  page: Page;
  adminUser: { email: string; password: string };
}

// Test utilities
interface TestHelpers {
  loginAsAdmin(page: Page): Promise<void>;
  createTestClinic(data: ClinicData): Promise<Clinic>;
  cleanupTestData(): Promise<void>;
}
```

### 2. Analytics Dashboard

```typescript
// components/admin/AnalyticsDashboard.tsx
interface AnalyticsData {
  totals: {
    clinics: number;
    parents: number;
    children: number;
    subscriptions: number;
  };
  registrations: {
    date: string;
    count: number;
  }[];
  subscriptionDistribution: {
    planName: string;
    count: number;
    percentage: number;
  }[];
  childrenPerClinic: {
    clinicName: string;
    childCount: number;
  }[];
}

interface ChartProps {
  data: any[];
  width?: number;
  height?: number;
  loading?: boolean;
}
```

### 3. Bulk Operations

```typescript
// components/admin/BulkOperations.tsx
interface BulkOperationState {
  selectedIds: Set<string>;
  processing: boolean;
  progress: number;
  errors: BulkError[];
}

interface BulkError {
  id: string;
  name: string;
  reason: string;
}

interface BulkApproveRequest {
  parentIds: string[];
  planId: string;
}

interface BulkRejectRequest {
  parentIds: string[];
}

interface BulkOperationResponse {
  success: number;
  failed: number;
  errors: BulkError[];
}
```

### 4. CSV Export

```typescript
// lib/csv-export.ts
interface ExportOptions {
  filename: string;
  headers: string[];
  data: Record<string, any>[];
  onProgress?: (progress: number) => void;
}

interface CSVGenerator {
  generateCSV(options: ExportOptions): Promise<Blob>;
  downloadCSV(blob: Blob, filename: string): void;
  streamCSV(data: AsyncIterable<Record<string, any>>): AsyncGenerator<string>;
}
```

### 5. Search and Filter

```typescript
// components/admin/SearchFilter.tsx
interface SearchFilterState {
  searchQuery: string;
  filters: Record<string, any>;
  debouncedQuery: string;
}

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  filterOptions: Record<string, FilterOption[]>;
  placeholder?: string;
}
```

## Data Models

### Analytics Aggregation Queries

```sql
-- Total counts
SELECT 
  (SELECT COUNT(*) FROM clinics WHERE isActive = 1) as totalClinics,
  (SELECT COUNT(*) FROM users WHERE role = 'parent' AND isActive = 1) as totalParents,
  (SELECT COUNT(*) FROM children) as totalChildren,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as totalSubscriptions;

-- Registrations over time (last 30 days)
SELECT 
  DATE(createdAt) as date,
  COUNT(*) as count
FROM users
WHERE role = 'parent' 
  AND createdAt >= DATE('now', '-30 days')
GROUP BY DATE(createdAt)
ORDER BY date ASC;

-- Subscription distribution
SELECT 
  cp.name as planName,
  COUNT(s.id) as count,
  ROUND(COUNT(s.id) * 100.0 / (SELECT COUNT(*) FROM subscriptions WHERE status = 'active'), 2) as percentage
FROM subscriptions s
JOIN care_plans cp ON s.carePlanId = cp.id
WHERE s.status = 'active'
GROUP BY cp.id, cp.name
ORDER BY count DESC;

-- Children per clinic
SELECT 
  c.name as clinicName,
  COUNT(ch.id) as childCount
FROM clinics c
LEFT JOIN parent_profiles pp ON pp.clinicId = c.id
LEFT JOIN children ch ON ch.parentId = pp.id
WHERE c.isActive = 1
GROUP BY c.id, c.name
ORDER BY childCount DESC
LIMIT 10;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Bulk Selection Enables Actions
*For any* set of selected parents (size > 0), the bulk action buttons should be enabled.
**Validates: Requirements 3.1**

### Property 2: Bulk Approval Requires Plan
*For any* bulk approval attempt without a plan selection, the operation should be rejected with an error message.
**Validates: Requirements 3.2**

### Property 3: Bulk Confirmation Shows Count
*For any* bulk reject operation, the confirmation dialog should display the exact count of selected parents.
**Validates: Requirements 3.3**

### Property 4: Bulk Success Message Accuracy
*For any* successful bulk operation, the success message should contain the correct number of processed parents.
**Validates: Requirements 3.4**

### Property 5: Bulk Error Reporting
*For any* bulk operation with failures, the error list should contain all failed parent IDs with reasons.
**Validates: Requirements 3.5**

### Property 6: CSV Export Completeness
*For any* dataset export, the generated CSV should contain all specified fields for all records.
**Validates: Requirements 4.3**

### Property 7: CSV Filename Timestamp
*For any* CSV export, the filename should contain a valid timestamp in ISO format.
**Validates: Requirements 4.4**

### Property 8: Role-Based Export Filtering
*For any* clinic manager export, the CSV should contain only parents from their clinic.
**Validates: Requirements 4.2**

### Property 9: Search Result Matching
*For any* search query, all returned results should match the query in at least one searchable field.
**Validates: Requirements 5.1, 5.3**

### Property 10: Filter Result Consistency
*For any* applied filter, all returned results should match the filter criteria.
**Validates: Requirements 5.2**

### Property 11: Combined Filter AND Logic
*For any* set of multiple filters, results should match ALL filter criteria simultaneously.
**Validates: Requirements 5.4**

### Property 12: Empty State Display
*For any* search/filter combination returning zero results, an empty state message should be displayed.
**Validates: Requirements 5.5**

### Property 13: Pagination Threshold
*For any* list with more than 100 items, pagination controls should be visible and functional.
**Validates: Requirements 6.1**

### Property 14: Search Debouncing
*For any* sequence of rapid search inputs (< 300ms apart), only the final input should trigger an API call.
**Validates: Requirements 6.2**

### Property 15: Progress Update Frequency
*For any* bulk operation processing more than 10 records, progress updates should occur at least every 10 records.
**Validates: Requirements 6.5**

## Error Handling

### E2E Test Failures
- Test timeout → Retry with increased timeout
- Element not found → Wait with explicit timeout, then fail with screenshot
- Assertion failure → Capture full page state and logs

### Analytics Loading Errors
- API failure → Show error state with retry button
- Invalid data → Log error, show empty charts with message
- Timeout → Show loading state, retry after 5 seconds

### Bulk Operation Errors
- Partial failure → Complete successful operations, report failures
- Network error → Retry failed operations, maintain state
- Validation error → Show error before processing, don't modify data

### Export Errors
- Memory limit → Switch to streaming export
- Permission denied → Show appropriate error message
- File generation failure → Log error, show user-friendly message

### Search/Filter Errors
- API timeout → Show cached results if available
- Invalid query → Sanitize input, show warning
- Too many results → Enforce pagination, show count

## Testing Strategy

### E2E Testing (Playwright)
- Admin login and navigation flows
- Clinic creation and management workflows
- Parent whitelist and approval workflows
- Campaign creation workflows
- Care plan management workflows
- Bulk operations (approve/reject)
- CSV export functionality
- Search and filter interactions

### Unit Testing (Jest)
- CSV generation functions
- Search/filter logic
- Debounce utilities
- Bulk operation state management
- Chart data transformation

### Property-Based Testing (fast-check)
- Bulk operation validation
- CSV export completeness
- Search result matching
- Filter combination logic
- Pagination behavior

### Integration Testing
- Analytics API with real database queries
- Bulk operations API with transaction handling
- Export API with large datasets
- Search API with various query types

### Testing Libraries
- **E2E**: Playwright
- **Unit/Integration**: Jest + @testing-library/react
- **Property-Based**: fast-check
- **Chart Testing**: @testing-library/react + recharts test utilities

### Test Annotation Format
Each property-based test must include:
```typescript
/**
 * Feature: admin-dashboard-enhancements, Property {number}: {property_text}
 * Validates: Requirements {X.Y}
 */
```

## Performance Considerations

### Analytics Dashboard
- Cache aggregate queries for 5 minutes
- Limit chart data points to 100 for line charts
- Use React.memo for chart components
- Lazy load chart library (code splitting)

### Bulk Operations
- Process in batches of 10 records
- Use database transactions for consistency
- Show progress every 10% completion
- Implement cancellation support

### CSV Export
- Stream data for exports > 1000 records
- Generate CSV client-side for < 1000 records
- Use Web Workers for large client-side generation
- Compress large files before download

### Search/Filter
- Debounce search input (300ms)
- Implement client-side filtering for < 100 items
- Use server-side filtering for larger datasets
- Cache filter results for 1 minute
- Implement virtual scrolling for large result sets

## UI/UX Design

### Analytics Dashboard
- Card-based layout for metrics
- Responsive charts (mobile-friendly)
- Loading skeletons for charts
- Tooltips on chart hover
- Date range selector for time-series data

### Bulk Operations
- Checkbox in table header for "select all"
- Visual feedback for selected items
- Floating action bar when items selected
- Progress modal during processing
- Success/error summary after completion

### CSV Export
- Export button with icon
- Progress modal with percentage
- Success notification with download link
- Error handling with retry option

### Search/Filter
- Search bar with icon and clear button
- Filter chips showing active filters
- Real-time result count
- Smooth transitions for result updates
- Empty state with helpful message
