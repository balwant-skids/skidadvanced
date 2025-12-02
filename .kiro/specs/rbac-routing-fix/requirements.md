# Requirements Document - Simple Parent Whitelisting System

## Introduction

The SKIDS Advanced platform needs a simple parent approval system where super admins can whitelist (approve) parent accounts. Once approved, parents can access educational content, view their subscription plan, and receive plan-specific reminders. The system uses Clerk for authentication and adds minimal access control logic.

## Glossary

- **Super Admin**: The platform administrator who approves parent accounts and manages the system
- **Parent**: An end-user who accesses educational content after being approved
- **Whitelisting**: The process of approving parent accounts for platform access
- **Active Account**: A parent account that has been approved and can access the platform
- **Pending Account**: A newly registered parent account awaiting admin approval
- **Subscription Plan**: The service tier a parent is subscribed to (Essential, Comprehensive, Premium)
- **Educational Content**: Discovery modules and behavioral assessments available to parents

## Requirements

### Requirement 1: Super Admin Access Control

**User Story:** As a super admin, I want full access to the admin dashboard and parent approval system, so that I can manage parent accounts.

#### Acceptance Criteria

1. WHEN a super admin signs in THEN the system SHALL redirect them to /admin/dashboard
2. WHEN a super admin accesses /admin routes THEN the system SHALL grant access
3. WHEN a non-admin user attempts to access /admin routes THEN the system SHALL redirect them to /dashboard
4. WHEN a super admin views the admin dashboard THEN the system SHALL display pending parent approvals and system statistics
5. WHEN a super admin signs out THEN the system SHALL clear their session and redirect to the home page

### Requirement 2: Parent Account Whitelisting

**User Story:** As a super admin, I want to approve or reject parent registrations and assign them a subscription plan, so that I control who can access the platform.

#### Acceptance Criteria

1. WHEN a super admin accesses /admin/whitelist THEN the system SHALL display all pending parent accounts
2. WHEN a super admin clicks "Approve" on a pending parent THEN the system SHALL activate the account, assign the selected plan, and send a confirmation email
3. WHEN a super admin clicks "Reject" on a pending parent THEN the system SHALL mark the account as rejected and send a notification email
4. WHEN a super admin views the whitelist page THEN the system SHALL show parent email, name, registration date, and current status
5. WHEN a super admin assigns a plan during approval THEN the system SHALL save the plan association and make it visible to the parent

### Requirement 3: Parent Account Status

**User Story:** As a parent, I want to know if my account is pending approval, so that I understand why I cannot access certain features.

#### Acceptance Criteria

1. WHEN a parent signs up THEN the system SHALL create an account with isActive set to false
2. WHEN a pending parent signs in THEN the system SHALL redirect them to /pending-approval page
3. WHEN a pending parent views the pending approval page THEN the system SHALL display a message explaining their account is awaiting admin approval
4. WHEN a parent is approved THEN the system SHALL set isActive to true
5. WHEN an approved parent signs in THEN the system SHALL redirect them to /dashboard

### Requirement 4: Parent Dashboard Access

**User Story:** As an approved parent, I want access to educational content and my subscription details, so that I can use the platform's features.

#### Acceptance Criteria

1. WHEN an approved parent signs in THEN the system SHALL redirect them to /dashboard
2. WHEN an approved parent accesses /dashboard THEN the system SHALL display educational content links and their subscription plan
3. WHEN an approved parent attempts to access /admin routes THEN the system SHALL redirect them to /dashboard
4. WHEN an approved parent accesses /discovery routes THEN the system SHALL allow access to educational body system content
5. WHEN an approved parent accesses /behavioral routes THEN the system SHALL allow access to behavioral assessment tools

### Requirement 5: Parent Subscription Plan Display

**User Story:** As an approved parent, I want to see my subscription plan details, so that I know what features I have access to.

#### Acceptance Criteria

1. WHEN a parent views their dashboard THEN the system SHALL display their current plan name and price
2. WHEN a parent views their plan details THEN the system SHALL show plan features and benefits
3. WHEN a parent has a premium plan THEN the system SHALL display additional premium features
4. WHEN a parent views their dashboard THEN the system SHALL show plan-specific reminders if configured
5. WHEN a parent's plan changes THEN the system SHALL update the displayed plan information on next login

### Requirement 6: Plan-Specific Reminders

**User Story:** As an approved parent, I want to see reminders based on my subscription plan, so that I stay on track with my child's health schedule.

#### Acceptance Criteria

1. WHEN a parent with an active plan views their dashboard THEN the system SHALL display upcoming reminders
2. WHEN a reminder is due THEN the system SHALL highlight it on the dashboard
3. WHEN a parent completes a reminder action THEN the system SHALL mark it as complete
4. WHEN a parent has no reminders THEN the system SHALL display a message indicating no upcoming actions
5. WHEN reminders are plan-specific THEN the system SHALL only show reminders relevant to the parent's subscription tier

### Requirement 7: Automatic Role-Based Routing

**User Story:** As a user, I want to be automatically directed to the appropriate page after sign-in based on my account status, so that I have a smooth experience.

#### Acceptance Criteria

1. WHEN any user completes sign-in THEN the system SHALL fetch their role and isActive status from the database
2. WHEN a super admin completes sign-in THEN the system SHALL redirect to /admin/dashboard
3. WHEN a pending parent (isActive = false) completes sign-in THEN the system SHALL redirect to /pending-approval
4. WHEN an approved parent (isActive = true) completes sign-in THEN the system SHALL redirect to /dashboard
5. WHEN user data is unavailable THEN the system SHALL redirect to /sign-in with an error message

### Requirement 8: Admin Dashboard Protection

**User Story:** As a super admin, I want the admin dashboard to be accessible only by super admins, so that parent users cannot access administrative features.

#### Acceptance Criteria

1. WHEN a super admin accesses /admin/dashboard THEN the system SHALL render the admin dashboard
2. WHEN a parent attempts to access /admin/dashboard THEN the system SHALL redirect to /dashboard
3. WHEN an unauthenticated user attempts to access /admin/dashboard THEN the system SHALL redirect to /sign-in
4. WHEN the admin dashboard loads THEN the system SHALL display pending parent approvals and system statistics
5. WHEN a super admin views pending approvals THEN the system SHALL show count of parents awaiting approval

### Requirement 9: Middleware Authentication Check

**User Story:** As a system architect, I want middleware to handle basic authentication and active status checks, so that inactive users are blocked early.

#### Acceptance Criteria

1. WHEN any user accesses a protected route THEN the middleware SHALL verify Clerk authentication
2. WHEN an unauthenticated user accesses a protected route THEN the middleware SHALL redirect to /sign-in
3. WHEN an authenticated user accesses a public route THEN the middleware SHALL allow access
4. WHEN an authenticated but inactive parent accesses /dashboard THEN the middleware SHALL redirect to /pending-approval
5. WHEN middleware completes THEN the system SHALL pass control to page components for role-specific verification

### Requirement 10: Server Component Role Verification

**User Story:** As a developer, I want server components to verify user roles before rendering, so that unauthorized users never see protected content.

#### Acceptance Criteria

1. WHEN a protected page component loads THEN the system SHALL call requireAuth on the server
2. WHEN role verification succeeds THEN the system SHALL render the page with appropriate content
3. WHEN role verification fails THEN the system SHALL redirect to the appropriate page
4. WHEN a server component fetches user data THEN the system SHALL use the authenticated user's ID from Clerk
5. WHEN an error occurs during role verification THEN the system SHALL log the error and redirect to /sign-in

### Requirement 11: API Route Protection

**User Story:** As a backend developer, I want API routes to verify authentication and roles, so that unauthorized API access is prevented.

#### Acceptance Criteria

1. WHEN any API route is called THEN the system SHALL verify authentication using Clerk
2. WHEN an admin-only API route is called THEN the system SHALL verify the user has super_admin role
3. WHEN an unauthorized API call is made THEN the system SHALL return 403 Forbidden
4. WHEN an unauthenticated API call is made THEN the system SHALL return 401 Unauthorized
5. WHEN API role verification succeeds THEN the system SHALL process the request and return data

### Requirement 12: Simple Error Handling

**User Story:** As a user, I want clear messages when I cannot access something, so that I understand what's happening.

#### Acceptance Criteria

1. WHEN a parent is redirected due to insufficient permissions THEN the system SHALL display a message explaining the restriction
2. WHEN an API call fails due to authorization THEN the system SHALL return a clear error message
3. WHEN a pending parent tries to access the dashboard THEN the system SHALL show "Your account is pending approval"
4. WHEN a session expires THEN the system SHALL display "Session expired. Please sign in again."
5. WHEN a parent tries to access admin routes THEN the system SHALL redirect silently to /dashboard
