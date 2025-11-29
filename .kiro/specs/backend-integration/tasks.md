# Implementation Plan

## Parallel Workstream Overview

```
WEEK 1                    WEEK 2                    WEEK 3
─────────────────────────────────────────────────────────────────────
                                                    
STREAM A: FOUNDATION (Blocking - Do First)
┌─────────────────────┐
│ 1. Environment +    │
│    Prisma Schema    │──┐
│    (Day 1-2)        │  │
└─────────────────────┘  │
                         │
                         ▼
┌─────────────────────┐  
│ 2. Clerk Auth       │──────────────────────────────────────────────▶
│    (Day 2-4)        │  
└─────────────────────┘  
                         
─────────────────────────────────────────────────────────────────────
                         
STREAM B: ADMIN BACKEND (After Auth)        
                         ┌─────────────────────┐   ┌─────────────────┐
                         │ 3. Clinic APIs      │──▶│ 5. Campaign     │
                         │    + Whitelist      │   │    APIs         │
                         │    (Day 4-6)        │   │    (Day 8-9)    │
                         └─────────────────────┘   └─────────────────┘
                         
─────────────────────────────────────────────────────────────────────
                         
STREAM C: PARENT BACKEND (After Auth) - PARALLEL WITH B
                         ┌─────────────────────┐   ┌─────────────────┐
                         │ 4. Parent + Child   │──▶│ 6. Subscription │
                         │    APIs             │   │    APIs         │
                         │    (Day 4-6)        │   │    (Day 7-8)    │
                         └─────────────────────┘   └─────────────────┘
                         
─────────────────────────────────────────────────────────────────────
                         
STREAM D: INFRASTRUCTURE (Can Start Day 1) - PARALLEL
┌─────────────────────┐   ┌─────────────────────┐
│ 7. Cloudflare R2    │   │ 8. Firebase FCM     │
│    Storage Setup    │   │    Setup            │
│    (Day 1-3)        │   │    (Day 2-4)        │
└─────────────────────┘   └─────────────────────┘
                         
─────────────────────────────────────────────────────────────────────
                         
STREAM E: CLIENT-SIDE (After APIs Ready)
                                               ┌─────────────────────┐
                                               │ 9. IndexedDB        │
                                               │    Offline Sync     │
                                               │    (Day 9-11)       │
                                               └─────────────────────┘
                         
─────────────────────────────────────────────────────────────────────
                         
STREAM F: UI INTEGRATION (After APIs + Offline)
                                               ┌─────────────────────┐
                                               │ 10. Connect Admin   │
                                               │     Dashboard       │
                                               │     (Day 10-12)     │
                                               └─────────────────────┘
                                               ┌─────────────────────┐
                                               │ 11. Connect Parent  │
                                               │     Dashboard       │
                                               │     (Day 11-13)     │
                                               └─────────────────────┘
```

---

## STREAM A: Foundation (BLOCKING - Day 1-4)

- [x] 1. Configure environment and database
  - [x] 1.1 Create .env.local with all credentials
    - DATABASE_URL (Neon PostgreSQL)
    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
    - Firebase config (apiKey, projectId, etc.)
    - Cloudflare R2 credentials (account ID, access key, secret)
    - _Requirements: 11.1_
  - [x] 1.2 Update Prisma schema for multi-tenant models
    - User, Clinic, ParentWhitelist, ParentProfile, Child
    - CarePlan, Subscription, Assessment, Appointment, Report
    - Campaign, Message
    - Add all indexes for performance
    - _Requirements: 11.1, 11.2_
  - [x] 1.3 Run Prisma migration to Neon
    - Execute npx prisma db push
    - Verify tables created
    - _Requirements: 11.2, 11.3_

- [x] 2. Integrate Clerk authentication
  - [x] 2.1 Install and configure Clerk
    - Install @clerk/nextjs package
    - Add ClerkProvider to layout.tsx
    - Update middleware.ts for Clerk
    - _Requirements: 1.1, 1.2_
  - [x] 2.2 Update sign-in page for Clerk
    - Keep existing UI, add useSignIn hook
    - Add Google OAuth button
    - _Requirements: 1.1_
  - [x] 2.3 Update sign-up page with clinic code
    - Add clinic code field
    - Validate code before registration
    - _Requirements: 2.4_
  - [x] 2.4 Create user sync on sign-up
    - Webhook or afterAuth callback
    - Create user record in Neon with clerkId
    - _Requirements: 1.2_
  - [x] 2.5 Implement role-based middleware
    - Public routes: /, /sign-in, /sign-up
    - Admin routes: /admin/*
    - Parent routes: /dashboard/*
    - _Requirements: 1.3, 1.4_

- [ ] 3. Checkpoint - Auth working end-to-end
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM B: Admin Backend APIs (Day 4-9)

- [x] 4. Clinic management APIs
  - [x] 4.1 Create clinic CRUD routes
    - POST /api/clinics - create with unique code
    - GET /api/clinics - list all (admin only)
    - PATCH /api/clinics/[id] - update
    - DELETE /api/clinics/[id] - deactivate
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 4.2 Implement unique code generation
    - 6-char alphanumeric, verify uniqueness
    - _Requirements: 2.1_
  - [ ]* 4.3 Property test: clinic code uniqueness
    - **Property 1: Clinic Code Uniqueness**
    - **Validates: Requirements 2.1**

- [x] 5. Whitelist APIs
  - [x] 5.1 Create whitelist CRUD routes
    - POST /api/clinics/[id]/whitelist - add email
    - GET /api/clinics/[id]/whitelist - list
    - DELETE /api/clinics/[id]/whitelist/[email] - remove
    - _Requirements: 3.1, 3.3, 3.4_
  - [x] 5.2 Whitelist validation in registration
    - Check email in clinic whitelist
    - Reject if not found
    - _Requirements: 3.2_
  - [ ]* 5.3 Property test: whitelist enforcement
    - **Property 3: Whitelist Enforcement**
    - **Validates: Requirements 3.1, 3.2**

- [x] 6. Campaign APIs
  - [x] 6.1 Create campaign CRUD routes
    - POST /api/campaigns - create
    - GET /api/campaigns - list (filtered by role)
    - PATCH /api/campaigns/[id] - update
    - _Requirements: 8.1, 8.2_
  - [x] 6.2 Campaign targeting logic
    - Filter by clinic, plan, or all
    - _Requirements: 8.2, 8.4_

- [ ] 7. Checkpoint - Admin APIs complete
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM C: Parent Backend APIs (Day 4-8)

- [x] 8. Parent and child APIs
  - [x] 8.1 Parent profile routes
    - GET /api/parents/me - current profile
    - PATCH /api/parents/me - update
    - _Requirements: 5.1_
  - [x] 8.2 Child CRUD routes
    - POST /api/children - add child
    - GET /api/children - list
    - GET /api/children/[id] - with health data
    - PATCH /api/children/[id] - update
    - _Requirements: 5.1, 5.2_
  - [ ]* 8.3 Property test: child-parent ownership
    - **Property 5: Child-Parent Ownership**
    - **Validates: Requirements 5.1**

- [x] 9. Subscription APIs
  - [x] 9.1 Care plan routes
    - GET /api/care-plans - list available
    - POST /api/care-plans - create (admin)
    - _Requirements: 4.1, 4.4_
  - [x] 9.2 Subscription routes
    - POST /api/subscriptions - create after payment
    - GET /api/subscriptions/me - current
    - _Requirements: 4.2_
  - [x] 9.3 Subscription status middleware
    - Check active subscription
    - Restrict premium features
    - _Requirements: 4.3_
  - [ ]* 9.4 Property test: subscription state
    - **Property 4: Subscription State Consistency**
    - **Validates: Requirements 4.2, 4.3**

- [x] 10. Appointment and messaging APIs
  - [x] 10.1 Appointment routes
    - POST /api/children/[id]/appointments - schedule
    - GET /api/appointments - list upcoming
    - _Requirements: 7.1, 7.3_
  - [x] 10.2 Message routes
    - POST /api/messages - send
    - GET /api/messages - conversation
    - _Requirements: 9.2, 9.4_

- [ ] 11. Checkpoint - Parent APIs complete
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM D: Infrastructure Services (Day 1-4)

- [ ] 12. Cloudflare R2 storage setup
  - [x] 12.1 Create storage service utility
    - S3-compatible client config
    - uploadFile, getSignedUrl, deleteFile functions
    - _Requirements: 6.1, 8.3_
  - [x] 12.2 Report upload API
    - POST /api/children/[id]/reports - upload
    - GET /api/children/[id]/reports - list
    - GET /api/reports/[id]/download - signed URL
    - _Requirements: 6.1, 6.2_
  - [ ]* 12.3 Property test: report-child association
    - **Property 6: Report-Child Association**
    - **Validates: Requirements 6.1**

- [x] 13. Firebase FCM setup
  - [x] 13.1 Create notification service
    - Firebase Admin SDK config
    - sendToUser, sendToTopic functions
    - _Requirements: 7.2_
  - [x] 13.2 FCM token registration
    - POST /api/notifications/register
    - _Requirements: 7.2_
  - [x] 13.3 Notification triggers
    - On report upload notify parent
    - On new message notify recipient
    - _Requirements: 6.3, 9.2_
  - [ ]* 13.4 Property test: notification delivery
    - **Property 10: Notification Delivery**
    - **Validates: Requirements 7.2**

- [ ] 14. Checkpoint - Infrastructure services ready
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM E: Client-Side Offline (Day 9-11)

- [x] 15. IndexedDB offline sync
  - [x] 15.1 Create offline sync service
    - Initialize IndexedDB with stores
    - saveToCache, getFromCache functions
    - Sync queue for offline changes
    - _Requirements: 10.1, 10.2_
  - [x] 15.2 Data sync on app load
    - Fetch user data from API
    - Save to IndexedDB
    - Track lastSyncAt timestamp
    - _Requirements: 10.1_
  - [x] 15.3 Offline change queue
    - Queue mutations when offline
    - Process queue on reconnect
    - Server-wins conflict resolution
    - _Requirements: 10.3_
  - [ ]* 15.4 Property test: offline sync
    - **Property 7: Offline Data Freshness**
    - **Validates: Requirements 10.1, 10.3**

- [ ] 16. Checkpoint - Offline functionality working
  - Ensure all tests pass, ask the user if questions arise.

---

## STREAM F: UI Integration (Day 10-14)

- [x] 17. Connect admin dashboard
  - [x] 17.1 Clinic management page
    - List clinics from API
    - Create/edit clinic forms
    - Subscriber counts display
    - _Requirements: 2.1, 2.2_
  - [x] 17.2 Parent management page
    - Whitelist table
    - Add to whitelist form
    - Subscription status badges
    - _Requirements: 3.1, 3.3_
  - [x] 17.3 Campaign management page
    - Campaign list
    - Create/edit forms
    - Media upload to R2
    - _Requirements: 8.1_

- [x] 18. Connect parent dashboard
  - [x] 18.1 Child profiles section
    - Children list from API/cache
    - Add/edit child forms
    - Health metrics display
    - _Requirements: 5.1, 5.2_
  - [x] 18.2 Appointments section
    - Upcoming appointments
    - Reminders display
    - _Requirements: 7.1, 7.3_
  - [x] 18.3 Reports section
    - Downloadable reports list
    - Download with local caching
    - _Requirements: 6.2, 6.4_
  - [x] 18.4 Contact clinic
    - WhatsApp click-to-chat
    - In-app messaging UI
    - _Requirements: 9.1_

- [ ] 19. Final Checkpoint - Full integration
  - Ensure all tests pass, ask the user if questions arise.

---

## Parallel Execution Summary

| Day | Stream A | Stream B | Stream C | Stream D | Stream E | Stream F |
|-----|----------|----------|----------|----------|----------|----------|
| 1   | Env+Schema | - | - | R2 Setup | - | - |
| 2   | Prisma+Clerk | - | - | R2+FCM | - | - |
| 3   | Clerk Auth | - | - | FCM Setup | - | - |
| 4   | Auth Done | Clinic APIs | Parent APIs | Done | - | - |
| 5   | - | Clinic APIs | Child APIs | - | - | - |
| 6   | - | Whitelist | Subscription | - | - | - |
| 7   | - | Done | Subscription | - | - | - |
| 8   | - | Campaign | Messaging | - | - | - |
| 9   | - | Done | Done | - | Offline Start | - |
| 10  | - | - | - | - | Offline Sync | Admin UI |
| 11  | - | - | - | - | Done | Admin UI |
| 12  | - | - | - | - | - | Parent UI |
| 13  | - | - | - | - | - | Parent UI |
| 14  | - | - | - | - | - | Done |

**Total: 14 days with 2-3 parallel streams**
**vs Sequential: ~21 days**
**Time Saved: 33%**
