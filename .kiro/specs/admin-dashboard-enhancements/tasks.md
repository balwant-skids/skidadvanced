# Implementation Plan

## Overview

This plan implements 5 major enhancements to the admin dashboard: E2E testing, analytics visualization, bulk operations, CSV export, and search/filter capabilities. Tasks are organized by feature stream for parallel development.

---

## STREAM A: E2E Testing Setup (Day 1-2)

- [x] 1. Set up Playwright E2E testing framework
  - [x] 1.1 Install Playwright and dependencies
    - Install @playwright/test
    - Configure playwright.config.ts
    - Set up test database seeding
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 1.2 Create test utilities and helpers
    - Login helpers for different roles
    - Test data factories
    - Cleanup utilities
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 1.3 Write clinic management E2E tests
    - Test clinic creation workflow
    - Test clinic editing workflow
    - Test clinic activation/deactivation
    - _Requirements: 1.1_
  
  - [x] 1.4 Write whitelist management E2E tests
    - Test adding parent to whitelist
    - Test parent approval workflow
    - Test parent rejection workflow
    - _Requirements: 1.2, 1.3_
  
  - [x] 1.5 Write campaign and care plan E2E tests
    - Test campaign creation
    - Test care plan creation
    - Test targeting settings
    - _Requirements: 1.4, 1.5_

- [x] 2. Checkpoint - E2E tests passing
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM B: Analytics Dashboard (Day 1-3)

- [ ] 3. Create analytics API endpoints
  - [x] 3.1 Implement analytics data aggregation
    - Create /api/admin/analytics route
    - Write aggregate queries for totals
    - Implement time-series queries
    - Add caching layer (5 min TTL)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 3.2 Optimize analytics queries
    - Add database indexes
    - Implement query result caching
    - Test with large datasets
    - _Requirements: 6.4_

- [x] 4. Build analytics dashboard UI
  - [x] 4.1 Install and configure Recharts
    - Install recharts library
    - Create chart wrapper components
    - Set up responsive containers
    - _Requirements: 2.2, 2.3, 2.4_
  
  - [x] 4.2 Create metrics cards component
    - Total clinics card
    - Total parents card
    - Total children card
    - Total subscriptions card
    - _Requirements: 2.1_
  
  - [x] 4.3 Implement line chart for registrations
    - Create RegistrationsChart component
    - Format time-series data
    - Add tooltips and legends
    - _Requirements: 2.2_
  
  - [x] 4.4 Implement pie chart for subscriptions
    - Create SubscriptionDistributionChart component
    - Calculate percentages
    - Add color coding by plan
    - _Requirements: 2.3_
  
  - [x] 4.5 Implement bar chart for children per clinic
    - Create ChildrenPerClinicChart component
    - Sort by count descending
    - Add hover effects
    - _Requirements: 2.4_
  
  - [x] 4.6 Add real-time data refresh
    - Implement auto-refresh every 30 seconds
    - Add manual refresh button
    - Show last updated timestamp
    - _Requirements: 2.5_

- [ ] 5. Checkpoint - Analytics dashboard complete
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM C: Bulk Operations (Day 2-4)

- [x] 6. Implement bulk operations API
  - [x] 6.1 Create bulk approve endpoint
    - POST /api/admin/whitelist/bulk-approve
    - Validate plan selection
    - Process in batches of 10
    - Use database transactions
    - Collect errors for failed operations
    - _Requirements: 3.2, 3.4, 3.5_
  
  - [x] 6.2 Create bulk reject endpoint
    - POST /api/admin/whitelist/bulk-reject
    - Process in batches of 10
    - Use database transactions
    - Collect errors for failed operations
    - _Requirements: 3.4, 3.5_
  
  - [x] 6.3 Property test: bulk operation validation
    - **Property 2: Bulk Approval Requires Plan**
    - **Validates: Requirements 3.2**
  
  - [x] 6.4 Property test: bulk error reporting
    - **Property 5: Bulk Error Reporting**
    - **Validates: Requirements 3.5**

- [x] 7. Build bulk operations UI
  - [x] 7.1 Add multi-select functionality to whitelist page
    - Add checkboxes to parent list
    - Implement "select all" checkbox
    - Track selected IDs in state
    - _Requirements: 3.1_
  
  - [x] 7.2 Create bulk action bar component
    - Floating action bar when items selected
    - Bulk approve button
    - Bulk reject button
    - Show selected count
    - _Requirements: 3.1_
  
  - [x] 7.3 Implement bulk approve modal
    - Plan selection dropdown
    - Confirmation with count
    - Progress indicator
    - Success/error summary
    - _Requirements: 3.2, 3.3, 3.4, 3.5_
  
  - [x] 7.4 Implement bulk reject modal
    - Confirmation dialog with count
    - Progress indicator
    - Success/error summary
    - _Requirements: 3.3, 3.4, 3.5_
  
  - [x] 7.5 Property test: UI state management
    - **Property 1: Bulk Selection Enables Actions**
    - **Validates: Requirements 3.1**

- [x] 8. Checkpoint - Bulk operations complete
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM D: CSV Export (Day 3-5)

- [x] 9. Implement CSV export utilities
  - [x] 9.1 Create CSV generation library
    - Create lib/csv-export.ts
    - Implement generateCSV function
    - Add streaming support for large datasets
    - Implement progress callbacks
    - _Requirements: 4.3, 4.5_
  
  - [x] 9.2 Create CSV download utility
    - Implement browser download trigger
    - Generate timestamped filenames
    - Handle large file downloads
    - _Requirements: 4.4_
  
  - [x] 9.3 Property test: CSV completeness
    - **Property 6: CSV Export Completeness**
    - **Validates: Requirements 4.3**
  
  - [x] 9.4 Property test: filename timestamp
    - **Property 7: CSV Filename Timestamp**
    - **Validates: Requirements 4.4**

- [ ] 10. Create export API endpoints
  - [x] 10.1 Implement clinics export endpoint
    - GET /api/admin/export/clinics
    - Fetch all clinic data with counts
    - Generate CSV with all fields
    - Stream for large datasets
    - _Requirements: 4.1, 4.3_
  
  - [x] 10.2 Implement parents export endpoint
    - GET /api/admin/export/parents
    - Apply role-based filtering
    - Include subscription status
    - Stream for large datasets
    - _Requirements: 4.2, 4.3_
  
  - [x] 10.3 Property test: role-based filtering
    - **Property 8: Role-Based Export Filtering**
    - **Validates: Requirements 4.2**

- [x] 11. Add export UI to admin pages
  - [x] 11.1 Add export button to clinics page
    - Export button with icon
    - Progress modal during generation
    - Success notification
    - Error handling with retry
    - _Requirements: 4.1, 4.4, 4.5_
  
  - [x] 11.2 Add export button to parents page
    - Export button with icon
    - Progress modal during generation
    - Success notification
    - Error handling with retry
    - _Requirements: 4.2, 4.4, 4.5_

- [x] 12. Checkpoint - CSV export complete
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM E: Search and Filter (Day 4-6)

- [x] 13. Implement search and filter API
  - [x] 13.1 Add search to clinics API
    - Update GET /api/clinics
    - Add search query parameter
    - Search by name, code, email
    - Implement full-text search
    - _Requirements: 5.1_
  
  - [x] 13.2 Add filters to clinics API
    - Add status filter parameter
    - Add date range filters
    - Combine filters with AND logic
    - _Requirements: 5.2, 5.4_
  
  - [x] 13.3 Add search to parents API
    - Update GET /api/admin/parents
    - Add search query parameter
    - Search by name, email, subscription
    - _Requirements: 5.3_
  
  - [x] 13.4 Add pagination to list APIs
    - Add limit and offset parameters
    - Return total count
    - Implement cursor-based pagination
    - _Requirements: 6.1_
  
  - [x] 13.5 Property test: search result matching
    - **Property 9: Search Result Matching**
    - **Validates: Requirements 5.1, 5.3**
  
  - [x] 13.6 Property test: filter consistency
    - **Property 10: Filter Result Consistency**
    - **Validates: Requirements 5.2**
  
  - [x] 13.7 Property test: combined filters
    - **Property 11: Combined Filter AND Logic**
    - **Validates: Requirements 5.4**

- [x] 14. Build search and filter UI components
  - [x] 14.1 Create SearchBar component
    - Search input with icon
    - Clear button
    - Debounced input (300ms)
    - Loading indicator
    - _Requirements: 5.1, 5.3, 6.2_
  
  - [x] 14.2 Create FilterDropdown component
    - Multi-select dropdown
    - Filter chips for active filters
    - Clear all filters button
    - _Requirements: 5.2, 5.4_
  
  - [x] 14.3 Create EmptyState component
    - Helpful message for no results
    - Suggestions to modify search/filters
    - Clear filters button
    - _Requirements: 5.5_
  
  - [x] 14.4 Property test: empty state display
    - **Property 12: Empty State Display**
    - **Validates: Requirements 5.5**
  
  - [x] 14.5 Property test: debouncing
    - **Property 14: Search Debouncing**
    - **Validates: Requirements 6.2**

- [x] 15. Integrate search/filter into admin pages
  - [x] 15.1 Add search/filter to clinics page
    - Add SearchBar component
    - Add status filter dropdown
    - Update list on search/filter change
    - Show result count
    - _Requirements: 5.1, 5.2, 5.4, 5.5_
  
  - [x] 15.2 Add search/filter to parents page
    - Add SearchBar component
    - Add subscription status filter
    - Update list on search/filter change
    - Show result count
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [x] 15.3 Add pagination to both pages
    - Pagination controls
    - Page size selector
    - Total count display
    - _Requirements: 6.1_

- [x] 16. Checkpoint - Search and filter complete
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM F: Performance Optimization (Day 5-6)

- [ ] 17. Implement performance optimizations
  - [x] 17.1 Add database indexes
    - Index on clinics(name, code, email)
    - Index on users(name, email, role, isActive)
    - Index on subscriptions(status, carePlanId)
    - _Requirements: 6.1_
  
  - [ ] 17.2 Implement query result caching
    - Cache analytics queries (5 min)
    - Cache search results (1 min)
    - Use Redis or in-memory cache
    - _Requirements: 6.2_
  
  - [ ] 17.3 Optimize chart rendering
    - Limit data points to 100
    - Use React.memo for charts
    - Lazy load Recharts library
    - _Requirements: 6.4_
  
  - [ ] 17.4 Implement virtual scrolling
    - Use react-window for large lists
    - Render only visible items
    - Smooth scrolling experience
    - _Requirements: 6.1_
  
  - [ ] 17.5 Property test: pagination threshold
    - **Property 13: Pagination Threshold**
    - **Validates: Requirements 6.1**

- [ ] 18. Final checkpoint - All enhancements complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Summary

| Stream | Tasks | Description |
|--------|-------|-------------|
| A: E2E Testing | 2 tasks | Playwright setup and admin workflow tests |
| B: Analytics | 3 tasks | API, charts, and real-time updates |
| C: Bulk Operations | 3 tasks | API, UI, and progress tracking |
| D: CSV Export | 4 tasks | Generation, API, and UI integration |
| E: Search/Filter | 4 tasks | API, components, and integration |
| F: Performance | 2 tasks | Optimization and caching |

**Total:** 18 tasks (6 checkpoints included)

**Property Tests:** 11 comprehensive tests (all required)

**Estimated Timeline:** 6 days with parallel development
