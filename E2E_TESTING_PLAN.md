# E2E Testing Plan - SKIDS Advanced

## Setup

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install
```

## Test Suites

### 1. Authentication Flow
```typescript
// tests/e2e/auth.spec.ts
- Sign up with valid clinic code
- Sign up with invalid clinic code (should fail)
- Sign up with non-whitelisted email (should fail)
- Sign in with Google OAuth
- Sign in with email
- Sign out
- Protected route redirect
```

### 2. Parent Dashboard Flow
```typescript
// tests/e2e/parent-dashboard.spec.ts
- View dashboard after login
- Add child profile
- Edit child profile
- View child health metrics
- Schedule appointment
- View appointments list
- Download report
- Send message to clinic
```

### 3. Admin Dashboard Flow
```typescript
// tests/e2e/admin-dashboard.spec.ts
- View clinic list
- Create new clinic
- Edit clinic details
- Deactivate clinic
- Add parent to whitelist
- Remove parent from whitelist
- Create campaign
- View analytics
```

### 4. Subscription Flow
```typescript
// tests/e2e/subscription.spec.ts
- View care plans
- Select plan
- Complete payment (mock Razorpay)
- Verify subscription active
- Access premium features
```

### 5. Offline Mode Flow
```typescript
// tests/e2e/offline.spec.ts
- Load app online
- Go offline
- View cached data
- Make changes offline
- Go online
- Verify sync completed
```

### 6. Discovery Modules Flow
```typescript
// tests/e2e/discovery.spec.ts
- Navigate to discovery hub
- Open brain module
- Navigate through sections
- View wonder facts
- Complete module
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Utilities

```typescript
// tests/e2e/fixtures.ts
import { test as base } from '@playwright/test';

// Custom fixtures for authenticated users
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Mock Clerk authentication
    await page.goto('/sign-in');
    // ... authentication logic
    await use(page);
  },
  adminPage: async ({ page }, use) => {
    // Mock admin authentication
    await use(page);
  },
});
```

## CI Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```
