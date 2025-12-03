# Requirements Document

## Introduction

This feature enables super administrators to manage administrative users within the system. Currently, the staff management UI exists but uses mock data. This spec will implement the complete backend API to support creating, updating, and managing admin users with proper role-based access control.

## Glossary

- **Super Admin**: A user with the highest level of administrative privileges who can manage all aspects of the system including other administrators
- **Admin User**: A user with administrative privileges who can manage clinics, parents, and campaigns but cannot manage other admins
- **Clinic Manager**: An admin user associated with a specific clinic who can only manage their clinic's data
- **Staff Management System**: The backend API and database operations that handle admin user lifecycle
- **Clerk**: The authentication service used for user identity management
- **Role Assignment**: The process of granting specific permission levels to users

## Requirements

### Requirement 1

**User Story:** As a super admin, I want to create new admin users, so that I can delegate administrative responsibilities to trusted staff members.

#### Acceptance Criteria

1. WHEN a super admin submits a new admin user form with email, name, and role THEN the Staff Management System SHALL create a new user record with the specified details
2. WHEN creating an admin user THEN the Staff Management System SHALL send an invitation email to the specified address
3. WHEN an admin user is created THEN the Staff Management System SHALL assign the specified role (admin or clinic_manager)
4. WHERE a clinic manager role is specified THEN the Staff Management System SHALL require a clinic association
5. WHEN an admin user email already exists THEN the Staff Management System SHALL prevent duplicate creation and return an error

### Requirement 2

**User Story:** As a super admin, I want to view all admin users in the system, so that I can see who has administrative access.

#### Acceptance Criteria

1. WHEN a super admin requests the admin user list THEN the Staff Management System SHALL return all users with admin or clinic_manager roles
2. WHEN displaying admin users THEN the Staff Management System SHALL include email, name, role, status, and associated clinic
3. WHEN filtering admin users THEN the Staff Management System SHALL support filtering by role, status, and clinic
4. WHEN sorting admin users THEN the Staff Management System SHALL support sorting by name, email, created date, and last active date

### Requirement 3

**User Story:** As a super admin, I want to update admin user details, so that I can correct information or change their responsibilities.

#### Acceptance Criteria

1. WHEN a super admin updates an admin user's name THEN the Staff Management System SHALL persist the new name
2. WHEN a super admin changes an admin user's role THEN the Staff Management System SHALL update the role and adjust permissions accordingly
3. WHEN a super admin changes a clinic manager's clinic association THEN the Staff Management System SHALL update the clinic relationship
4. WHEN updating an admin user THEN the Staff Management System SHALL validate that the requesting user is a super admin

### Requirement 4

**User Story:** As a super admin, I want to deactivate admin users, so that I can revoke access when staff members leave or change roles.

#### Acceptance Criteria

1. WHEN a super admin deactivates an admin user THEN the Staff Management System SHALL set the user status to inactive
2. WHEN an admin user is deactivated THEN the Staff Management System SHALL prevent that user from accessing admin routes
3. WHEN a super admin reactivates an admin user THEN the Staff Management System SHALL restore the user's access
4. WHEN deactivating an admin user THEN the Staff Management System SHALL maintain the user's historical data and audit trail

### Requirement 5

**User Story:** As a super admin, I want to view admin user activity, so that I can monitor system usage and identify inactive accounts.

#### Acceptance Criteria

1. WHEN an admin user logs in THEN the Staff Management System SHALL update the last active timestamp
2. WHEN displaying admin users THEN the Staff Management System SHALL show the last login date
3. WHEN an admin user performs actions THEN the Staff Management System SHALL log the activity for audit purposes
4. WHEN viewing activity logs THEN the Staff Management System SHALL display user, action, timestamp, and affected resources

### Requirement 6

**User Story:** As a system, I want to enforce role-based permissions, so that only authorized users can perform administrative actions.

#### Acceptance Criteria

1. WHEN a non-super-admin attempts to create an admin user THEN the Staff Management System SHALL reject the request with an authorization error
2. WHEN a non-super-admin attempts to modify admin users THEN the Staff Management System SHALL reject the request with an authorization error
3. WHEN a clinic manager attempts to access other clinics' data THEN the Staff Management System SHALL restrict access to only their assigned clinic
4. WHEN validating permissions THEN the Staff Management System SHALL check both the user's role and the resource being accessed
