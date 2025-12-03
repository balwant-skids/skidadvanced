# Implementation Plan

- [x] 1. Set up database schema and migrations
  - [x] 1.1 Add AdminActivityLog model to Prisma schema
    - Create new model with userId, action, entityType, entityId, metadata, timestamp fields
    - Add relation to User model
    - Add indexes for performance
    - _Requirements: 5.3, 5.4_
  
  - [x] 1.2 Run Prisma migration
    - Execute `npx prisma db push` to update database
    - Verify new table is created
    - _Requirements: 5.3_

- [x] 2. Create API utilities and validation schemas
  - [x] 2.1 Create Zod validation schemas
    - Create schema for admin user creation (email, name, role, clinicId)
    - Create schema for admin user update (name, role, clinicId, isActive)
    - Create schema for query parameters (filters, pagination, sorting)
    - _Requirements: 1.1, 3.1, 3.2, 3.3_
  
  - [x] 2.2 Create activity logging utility
    - Create `logAdminActivity` function to record actions
    - Include userId, action, entityType, entityId, metadata
    - Handle errors gracefully
    - _Requirements: 5.3_
  
  - [x] 2.3 Create admin user serialization utility
    - Create function to transform User model to AdminUser response
    - Include computed fields (lastLogin, activityCount)
    - Handle null values appropriately
    - _Requirements: 2.2_

- [ ] 3. Implement core API endpoints
  - [x] 3.1 Create GET /api/admin/users endpoint
    - Validate super admin role using requireSuperAdmin()
    - Parse and validate query parameters (filters, pagination, sorting)
    - Query database with Prisma
    - Return paginated results with user list
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.1_
  
  - [x] 3.2 Create POST /api/admin/users endpoint
    - Validate super admin role
    - Validate request body with Zod schema
    - Check for duplicate email
    - Validate clinic association for clinic_manager role
    - Create user in database
    - Send Clerk invitation
    - Log activity
    - Return created user
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1_
  
  - [x] 3.3 Create GET /api/admin/users/[id] endpoint
    - Validate super admin role
    - Fetch user with relations (managedClinic)
    - Fetch activity summary
    - Return detailed user information
    - _Requirements: 2.2, 6.1_
  
  - [x] 3.4 Create PATCH /api/admin/users/[id] endpoint
    - Validate super admin role
    - Validate request body
    - Check if user exists
    - Validate clinic association if role is clinic_manager
    - Update user in database
    - Log activity
    - Return updated user
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.2_
  
  - [x] 3.5 Create DELETE /api/admin/users/[id] endpoint (deactivate)
    - Validate super admin role
    - Check if user exists
    - Set isActive to false
    - Log activity
    - Return success response
    - _Requirements: 4.1, 4.4, 6.2_
  
  - [x] 3.6 Create POST /api/admin/users/[id]/reactivate endpoint
    - Validate super admin role
    - Check if user exists
    - Set isActive to true
    - Log activity
    - Return success response
    - _Requirements: 4.3, 6.2_
  
  - [x] 3.7 Create GET /api/admin/users/[id]/activity endpoint
    - Validate super admin role
    - Parse query parameters (date range, pagination)
    - Fetch activity logs from database
    - Return activity list with pagination
    - _Requirements: 5.3, 5.4, 6.1_

- [ ] 4. Write property-based tests for core functionality
  - [x] 4.1 Property test: Admin creation requires super admin role
    - **Property 1: Admin creation requires super admin role**
    - **Validates: Requirements 6.1**
    - Generate random user roles and admin creation requests
    - Verify only super_admin role succeeds
  
  - [x] 4.2 Property test: Email uniqueness enforcement
    - **Property 2: Email uniqueness enforcement**
    - **Validates: Requirements 1.5**
    - Generate random email addresses and user data
    - Create user, then attempt duplicate creation
    - Verify duplicate is rejected
  
  - [x] 4.3 Property test: Clinic manager requires clinic association
    - **Property 3: Clinic manager requires clinic association**
    - **Validates: Requirements 1.4**
    - Generate random users with clinic_manager role
    - Verify all have non-null clinicId
  
  - [x] 4.4 Property test: Deactivation preserves data
    - **Property 4: Deactivation preserves data**
    - **Validates: Requirements 4.4**
    - Generate random admin users with activity logs
    - Deactivate users
    - Verify all historical data remains unchanged
  
  - [x] 4.5 Property test: Role-based access control
    - **Property 5: Role-based access control**
    - **Validates: Requirements 6.1, 6.2**
    - Generate random users with different roles
    - Attempt to access admin endpoints
    - Verify only super_admin succeeds
  
  - [x] 4.6 Property test: Activity logging completeness
    - **Property 6: Activity logging completeness**
    - **Validates: Requirements 5.3**
    - Generate random admin actions
    - Verify activity logs are created with correct data
  
  - [x] 4.7 Property test: Clinic manager data isolation
    - **Property 7: Clinic manager data isolation**
    - **Validates: Requirements 6.3**
    - Generate random clinic managers and multi-clinic data
    - Verify data access is restricted to assigned clinic
  
  - [x] 4.8 Property test: Status consistency
    - **Property 8: Status consistency**
    - **Validates: Requirements 4.2**
    - Generate random admin users
    - Deactivate users
    - Verify authentication and route access fails

- [x] 5. Update frontend staff management page
  - [x] 5.1 Replace mock data with API calls
    - Update loadStaffData to call GET /api/admin/users
    - Handle loading and error states
    - Implement search and filter functionality
    - _Requirements: 2.1, 2.3, 2.4_
  
  - [x] 5.2 Implement add staff modal functionality
    - Create form with email, name, role, clinic fields
    - Validate inputs on client side
    - Call POST /api/admin/users on submit
    - Show success/error notifications
    - Refresh staff list on success
    - _Requirements: 1.1, 1.3, 1.4_
  
  - [x] 5.3 Implement edit staff functionality
    - Pre-populate form with existing data
    - Call PATCH /api/admin/users/[id] on submit
    - Handle role changes and clinic association
    - Show success/error notifications
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 5.4 Implement deactivate/reactivate functionality
    - Add confirmation dialog for deactivation
    - Call DELETE /api/admin/users/[id] for deactivation
    - Call POST /api/admin/users/[id]/reactivate for reactivation
    - Update UI to reflect status change
    - _Requirements: 4.1, 4.3_
  
  - [x] 5.5 Implement activity view
    - Create activity timeline component
    - Call GET /api/admin/users/[id]/activity
    - Display activity logs with timestamps
    - Implement pagination for activity logs
    - _Requirements: 5.3, 5.4_

- [ ] 6. Write unit tests for API endpoints
  - [ ] 6.1 Test GET /api/admin/users endpoint
    - Test successful list retrieval
    - Test filtering by role, status, clinic
    - Test sorting functionality
    - Test pagination
    - Test authentication failure
    - Test authorization failure (non-super-admin)
    - _Requirements: 2.1, 2.3, 2.4, 6.1_
  
  - [ ] 6.2 Test POST /api/admin/users endpoint
    - Test successful admin creation
    - Test duplicate email rejection
    - Test clinic_manager without clinicId rejection
    - Test invalid email format
    - Test authentication failure
    - Test authorization failure
    - _Requirements: 1.1, 1.4, 1.5, 6.1_
  
  - [ ] 6.3 Test PATCH /api/admin/users/[id] endpoint
    - Test successful update
    - Test role change
    - Test clinic association change
    - Test user not found
    - Test authorization failure
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.2_
  
  - [ ] 6.4 Test DELETE and reactivate endpoints
    - Test successful deactivation
    - Test successful reactivation
    - Test user not found
    - Test authorization failure
    - _Requirements: 4.1, 4.3, 6.2_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Add error handling and edge cases
  - [ ] 8.1 Implement comprehensive error handling
    - Add try-catch blocks to all API endpoints
    - Transform Prisma errors to user-friendly messages
    - Handle Clerk API failures with retry logic
    - Log all errors with context
    - _Requirements: All_
  
  - [ ] 8.2 Add input validation edge cases
    - Validate email format
    - Validate role values
    - Validate clinicId exists when required
    - Prevent last super admin deletion
    - _Requirements: 1.1, 1.4, 1.5_
  
  - [ ] 8.3 Add rate limiting
    - Implement rate limiting on admin user creation
    - Add rate limiting to sensitive endpoints
    - Return 429 status when limit exceeded
    - _Requirements: Security consideration_

- [x] 9. Update authentication middleware
  - [x] 9.1 Enhance auth-utils.ts
    - Ensure requireSuperAdmin properly validates role
    - Add helper for checking clinic manager permissions
    - Add helper for validating clinic access
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 9.2 Update middleware.ts if needed
    - Ensure deactivated users cannot access admin routes
    - Add logging for authentication failures
    - _Requirements: 4.2_

- [ ] 10. Add activity tracking to existing admin actions
  - [ ] 10.1 Add activity logging to clinic management
    - Log clinic creation, updates, deletions
    - _Requirements: 5.3_
  
  - [ ] 10.2 Add activity logging to campaign management
    - Log campaign creation, updates, status changes
    - _Requirements: 5.3_
  
  - [ ] 10.3 Add activity logging to parent management
    - Log whitelist additions, approvals, rejections
    - _Requirements: 5.3_

- [ ] 11. Final checkpoint - Integration testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Documentation and deployment preparation
  - [ ] 12.1 Update API documentation
    - Document all new endpoints
    - Include request/response examples
    - Document error codes
    - _Requirements: All_
  
  - [ ] 12.2 Create admin user management guide
    - Document how to create admin users
    - Document role differences
    - Document activity monitoring
    - _Requirements: All_
  
  - [ ] 12.3 Update deployment checklist
    - Add database migration step
    - Add environment variable checks
    - Add Clerk configuration verification
    - _Requirements: All_
