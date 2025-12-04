# Implementation Plan - Simple Parent Whitelisting System

## Overview

This implementation adds a minimal parent approval system with plan and campaign management for super admins. The system uses Clerk for authentication and adds simple access control logic.

---

## Phase 1: Database Schema Updates (Day 1)

- [x] 1. Update User model for whitelisting
  - [x] 1.1 Add isActive field to User model (default: false)
    - Add `isActive Boolean @default(false)` to Prisma schema
    - Add index on isActive field
    - _Requirements: 3.1_
  - [x] 1.2 Add planId field to User model
    - Add `planId String?` to Prisma schema
    - Add relation to SubscriptionPlan
    - Add index on planId field
    - _Requirements: 2.5, 5.1_
  - [x] 1.3 Run Prisma migration
    - Execute `npx prisma db push`
    - Verify fields added in Neon database
    - _Requirements: All data models_

- [x] 2. Create Campaign model
  - [x] 2.1 Add Campaign model to Prisma schema
    - Create Campaign model with name, subject, content, targetAudience fields
    - Add status, sentAt, and stats fields
    - Add relation to SubscriptionPlan for plan-specific campaigns
    - Add indexes on status and planId
    - _Requirements: Campaign Management_
  - [x] 2.2 Run Prisma migration for Campaign
    - Execute `npx prisma db push`
    - Verify Campaign table created
    - _Requirements: Campaign Management_

- [x] 3. Checkpoint - Schema complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 2: Authentication & Routing Logic (Day 1-2)

- [x] 4. Update middleware for isActive check
  - [x] 4.1 Add isActive check in middleware
    - Fetch user from database when accessing /dashboard
    - Redirect inactive parents to /pending-approval
    - Allow super admins through without isActive check
    - _Requirements: 3.2, 9.4_
  - [x] 4.2 Test middleware redirect logic
    - Test inactive parent → /pending-approval
    - Test active parent → /dashboard
    - Test super admin → no redirect
    - _Requirements: 9.4_

- [x] 5. Create auth helper functions
  - [x] 5.1 Create requireAuth function
    - Implement requireAuth() to get authenticated user from Clerk
    - Fetch user details from database including role and isActive
    - Return AuthenticatedUser object
    - _Requirements: 10.1, 10.4_
  - [x] 5.2 Create isAdmin helper
    - Implement isAdmin() to check if user.role === 'super_admin'
    - Use in admin pages for access control
    - _Requirements: 1.2, 8.1_
  - [x] 5.3 Create isActiveParent helper
    - Implement isActiveParent() to check role === 'parent' && isActive === true
    - Use in parent dashboard for access control
    - _Requirements: 3.5, 4.2_

- [ ] 6. Checkpoint - Auth logic complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 3: Admin Whitelist Feature (Day 2-3)

- [x] 7. Create admin whitelist page
  - [x] 7.1 Create /admin/whitelist page component
    - Add server-side auth check (requireAuth + isAdmin)
    - Fetch pending parents (isActive = false)
    - Display list with email, name, registration date
    - Add approve/reject buttons for each parent
    - Add plan selection dropdown
    - _Requirements: 2.1, 2.4_
  - [x] 7.2 Style whitelist page
    - Create clean table/card layout for pending parents
    - Add loading states
    - Add success/error toast notifications
    - _Requirements: 2.4_

- [-] 8. Create whitelist API routes
  - [x] 8.1 Create POST /api/admin/whitelist/approve
    - Verify user is super admin
    - Update user: set isActive = true, assign planId
    - Send approval confirmation email
    - Return success response
    - _Requirements: 2.2, 2.5, 3.4_
  - [ ] 8.2 Create POST /api/admin/whitelist/reject
    - Verify user is super admin
    - Update user status or delete account
    - Send rejection notification email
    - Return success response
    - _Requirements: 2.3_
  - [ ] 8.3 Create GET /api/admin/whitelist/pending
    - Verify user is super admin
    - Fetch all users where isActive = false and role = 'parent'
    - Return list of pending parents
    - _Requirements: 2.1_

- [ ] 9. Checkpoint - Whitelist feature complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 4: Plan Management Feature (Day 3-4)

- [ ] 10. Create plan management page
  - [ ] 10.1 Create /admin/plans page component
    - Add server-side auth check (requireAuth + isAdmin)
    - Fetch all subscription plans
    - Display plans in grid/table with name, price, features
    - Add "Create Plan" button
    - Add edit/delete buttons for each plan
    - _Requirements: Plan Management_
  - [ ] 10.2 Create plan form modal/page
    - Add form fields: name, price, features (array), reminder config
    - Add validation for required fields
    - Handle create and edit modes
    - _Requirements: Plan Management_

- [ ] 11. Create plan management API routes
  - [ ] 11.1 Create GET /api/admin/plans
    - Verify user is super admin
    - Fetch all subscription plans
    - Return plans array
    - _Requirements: Plan Management_
  - [ ] 11.2 Create POST /api/admin/plans
    - Verify user is super admin
    - Validate input data
    - Create new subscription plan
    - Return created plan
    - _Requirements: Plan Management_
  - [ ] 11.3 Create PUT /api/admin/plans/[id]
    - Verify user is super admin
    - Validate input data
    - Update subscription plan
    - Return updated plan
    - _Requirements: Plan Management_
  - [ ] 11.4 Create DELETE /api/admin/plans/[id]
    - Verify user is super admin
    - Check if plan has active users
    - Delete plan or return error if in use
    - Return success response
    - _Requirements: Plan Management_

- [ ] 12. Checkpoint - Plan management complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 5: Campaign Management Feature (Day 4-5)

- [ ] 13. Create campaign management page
  - [ ] 13.1 Create /admin/campaigns page component
    - Add server-side auth check (requireAuth + isAdmin)
    - Fetch all campaigns
    - Display campaigns with name, status, sent date, stats
    - Add "Create Campaign" button
    - Add view/edit buttons for each campaign
    - _Requirements: Campaign Management_
  - [ ] 13.2 Create campaign form page
    - Add form fields: name, subject, content (rich text), target audience
    - Add plan selector for plan-specific campaigns
    - Add recipient selector for custom campaigns
    - Add preview functionality
    - _Requirements: Campaign Management_
  - [ ] 13.3 Add campaign stats display
    - Show sent count, opened count, clicked count
    - Display as cards or charts
    - _Requirements: Campaign Management_

- [ ] 14. Create campaign management API routes
  - [ ] 14.1 Create GET /api/admin/campaigns
    - Verify user is super admin
    - Fetch all campaigns
    - Return campaigns array with stats
    - _Requirements: Campaign Management_
  - [ ] 14.2 Create POST /api/admin/campaigns
    - Verify user is super admin
    - Validate input data
    - Create new campaign (status: draft)
    - Return created campaign
    - _Requirements: Campaign Management_
  - [ ] 14.3 Create POST /api/admin/campaigns/[id]/send
    - Verify user is super admin
    - Fetch campaign details
    - Determine recipients based on targetAudience
    - Send emails to recipients
    - Update campaign status to 'sent' and set sentAt
    - Return success response with sent count
    - _Requirements: Campaign Management_
  - [ ] 14.4 Create GET /api/admin/campaigns/[id]/stats
    - Verify user is super admin
    - Fetch campaign statistics
    - Return stats object
    - _Requirements: Campaign Management_

- [ ] 15. Checkpoint - Campaign management complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 6: Parent Experience (Day 5-6)

- [ ] 16. Create pending approval page
  - [ ] 16.1 Create /pending-approval page component
    - Add server-side auth check (requireAuth)
    - Display friendly message explaining account is pending
    - Show expected timeline for approval
    - Add contact support link
    - _Requirements: 3.3_
  - [ ] 16.2 Style pending approval page
    - Create clean, reassuring design
    - Add illustration or icon
    - _Requirements: 3.3_

- [ ] 17. Update parent dashboard
  - [ ] 17.1 Add plan display to dashboard
    - Fetch user's subscription plan
    - Display plan name, price, features
    - Show plan benefits in card format
    - _Requirements: 5.1, 5.2_
  - [ ] 17.2 Add educational content links
    - Add prominent links to /discovery
    - Add links to /behavioral
    - Add links to /interventions
    - Style as cards or buttons
    - _Requirements: 4.4, 4.5_
  - [ ] 17.3 Add plan-specific reminders section
    - Check if plan has reminderConfig enabled
    - Fetch upcoming reminders for user
    - Display reminders with dates and actions
    - Add mark as complete functionality
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 18. Update sign-in redirect logic
  - [ ] 18.1 Implement post-login redirect
    - Check user role and isActive status
    - Redirect super admin to /admin/dashboard
    - Redirect inactive parent to /pending-approval
    - Redirect active parent to /dashboard
    - _Requirements: 7.2, 7.3, 7.4_
  - [ ] 18.2 Test redirect logic
    - Test all role/status combinations
    - Verify correct landing pages
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 19. Checkpoint - Parent experience complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 7: Admin Dashboard Updates (Day 6)

- [ ] 20. Update admin dashboard
  - [ ] 20.1 Add pending approvals widget
    - Show count of pending parents
    - Add "View All" link to /admin/whitelist
    - _Requirements: 8.4, 8.5_
  - [ ] 20.2 Add quick stats
    - Show total parents, active parents, total plans
    - Show recent campaign stats
    - _Requirements: 8.5_
  - [ ] 20.3 Add navigation links
    - Add links to whitelist, plans, campaigns pages
    - Style as cards or menu items
    - _Requirements: 1.1, 8.1_

- [ ] 21. Checkpoint - Admin dashboard complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 8: Email Notifications (Day 7)

- [ ] 22. Set up email service
  - [ ] 22.1 Configure email provider (Resend, SendGrid, or similar)
    - Add API keys to environment variables
    - Create email service utility
    - _Requirements: 2.2, 2.3_
  - [ ] 22.2 Create email templates
    - Create approval confirmation template
    - Create rejection notification template
    - Create campaign email template
    - _Requirements: 2.2, 2.3, Campaign Management_
  - [ ] 22.3 Implement email sending functions
    - Create sendApprovalEmail function
    - Create sendRejectionEmail function
    - Create sendCampaignEmail function
    - Add error handling and logging
    - _Requirements: 2.2, 2.3, Campaign Management_

- [ ] 23. Checkpoint - Email notifications complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 9: Testing & Polish (Day 7-8)

- [ ] 24. Add error handling
  - [ ] 24.1 Add error messages for all user actions
    - Add toast notifications for success/error states
    - Add form validation error messages
    - Add API error handling
    - _Requirements: 12.1, 12.2, 12.5_
  - [ ] 24.2 Add loading states
    - Add spinners for async operations
    - Add skeleton loaders for data fetching
    - _Requirements: User Experience_

- [ ] 25. Test complete user flows
  - [ ] 25.1 Test parent sign-up to approval flow
    - Sign up as parent
    - Verify pending status
    - Approve as admin
    - Verify active status and dashboard access
    - _Requirements: 2.2, 3.2, 3.4, 3.5_
  - [ ] 25.2 Test plan management flow
    - Create new plan
    - Edit plan
    - Assign plan to parent
    - Verify plan displays on parent dashboard
    - _Requirements: Plan Management, 5.1_
  - [ ] 25.3 Test campaign flow
    - Create campaign
    - Send to specific plan subscribers
    - Verify emails sent
    - Check campaign stats
    - _Requirements: Campaign Management_

- [ ] 26. Final checkpoint - All features complete
  - Ensure all tests pass, ask the user if questions arise.

---

## Summary

**What Gets Built:**
- ✅ Parent whitelisting system (approve/reject + assign plan)
- ✅ Plan management (CRUD for subscription plans)
- ✅ Campaign management (create and send targeted campaigns)
- ✅ Pending approval page for inactive parents
- ✅ Enhanced parent dashboard with plan details and reminders
- ✅ Email notifications for approvals and campaigns

**Total Implementation:**
- 3 admin pages (whitelist, plans, campaigns)
- 1 pending approval page
- 1 updated parent dashboard
- 8 API routes
- Email service integration
- Minimal middleware updates

**Estimated Time:** 7-8 days
