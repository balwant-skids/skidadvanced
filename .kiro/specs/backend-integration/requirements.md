# Requirements Document

## Introduction

This document specifies the requirements for integrating SKIDS Advanced with a production-ready backend infrastructure. The integration replaces the current mock data and SQLite setup with Neon PostgreSQL, Clerk authentication, Cloudflare R2 storage, and Firebase for push notifications. The system supports a multi-tenant clinic model where super admins manage clinics, clinic managers whitelist parents, and parents access child health information with offline capabilities.

## Glossary

- **SKIDS Platform**: The child development and healthcare management system
- **Super Admin**: Platform administrator who creates and manages clinic codes
- **Clinic Manager**: Staff member who manages a specific clinic's parents and uploads reports
- **Parent**: End user who accesses child health information and receives consultations
- **Clinic Code**: Unique identifier that links parents to a specific clinic
- **Care Plan**: Subscription package with specific features and pricing
- **PWA**: Progressive Web App with offline capabilities

## Requirements

### Requirement 1: Authentication System

**User Story:** As a user, I want to sign in with Google or email, so that I can securely access the platform with minimal friction.

#### Acceptance Criteria

1. WHEN a user clicks "Sign in with Google" THEN the SKIDS Platform SHALL authenticate via Clerk and create/retrieve the user profile
2. WHEN a user signs up with email THEN the SKIDS Platform SHALL create a Clerk account and store user metadata in Neon database
3. WHEN an authenticated user accesses a protected route THEN the SKIDS Platform SHALL verify the Clerk session and allow access
4. WHEN an unauthenticated user accesses a protected route THEN the SKIDS Platform SHALL redirect to the sign-in page
5. WHEN a user signs out THEN the SKIDS Platform SHALL clear the Clerk session and redirect to the home page

### Requirement 2: Multi-Tenant Clinic Management

**User Story:** As a super admin, I want to create and manage clinic codes, so that I can onboard new clinics to the platform.

#### Acceptance Criteria

1. WHEN a super admin creates a clinic THEN the SKIDS Platform SHALL generate a unique clinic code and store clinic details in the database
2. WHEN a super admin views clinics THEN the SKIDS Platform SHALL display all clinics with their subscriber counts and active status
3. WHEN a super admin deactivates a clinic THEN the SKIDS Platform SHALL prevent new parent registrations for that clinic code
4. WHEN a clinic code is entered during parent registration THEN the SKIDS Platform SHALL validate the code and link the parent to the clinic

### Requirement 3: Parent Whitelisting and Management

**User Story:** As a clinic manager, I want to whitelist parents and manage their subscriptions, so that I can control access to my clinic's services.

#### Acceptance Criteria

1. WHEN a clinic manager adds a parent email to whitelist THEN the SKIDS Platform SHALL allow that parent to register with the clinic code
2. WHEN a non-whitelisted parent attempts to register THEN the SKIDS Platform SHALL reject the registration with an appropriate message
3. WHEN a clinic manager views parents THEN the SKIDS Platform SHALL display all whitelisted parents with their subscription status
4. WHEN a clinic manager removes a parent from whitelist THEN the SKIDS Platform SHALL revoke the parent's access to clinic services

### Requirement 4: Subscription and Care Plans

**User Story:** As a parent, I want to subscribe to a care plan, so that I can access health services for my child.

#### Acceptance Criteria

1. WHEN a parent views care plans THEN the SKIDS Platform SHALL display available plans with pricing and features
2. WHEN a parent selects a plan and completes payment THEN the SKIDS Platform SHALL activate the subscription and grant access to plan features
3. WHEN a subscription expires THEN the SKIDS Platform SHALL notify the parent and restrict access to premium features
4. WHEN a clinic manager customizes plans THEN the SKIDS Platform SHALL display clinic-specific pricing and features

### Requirement 5: Child Profile and Health Data

**User Story:** As a parent, I want to manage my children's profiles and view their health information, so that I can track their development.

#### Acceptance Criteria

1. WHEN a parent adds a child THEN the SKIDS Platform SHALL create a child profile linked to the parent account
2. WHEN a parent views a child's profile THEN the SKIDS Platform SHALL display health metrics, assessments, and appointments
3. WHEN health data is updated THEN the SKIDS Platform SHALL sync the data to the local device for offline access
4. WHEN the app is offline THEN the SKIDS Platform SHALL display cached child data from local storage

### Requirement 6: Report Upload and Access

**User Story:** As a clinic manager, I want to upload health reports for parents, so that they can access their child's medical documents.

#### Acceptance Criteria

1. WHEN a clinic manager uploads a report THEN the SKIDS Platform SHALL store the file in Cloudflare R2 and link it to the child profile
2. WHEN a parent views reports THEN the SKIDS Platform SHALL display downloadable report files
3. WHEN a report is uploaded THEN the SKIDS Platform SHALL send a push notification to the parent
4. WHEN a parent downloads a report THEN the SKIDS Platform SHALL cache it locally for offline access

### Requirement 7: Consultation Reminders

**User Story:** As a parent, I want to receive reminders for upcoming consultations, so that I don't miss appointments.

#### Acceptance Criteria

1. WHEN a consultation is scheduled THEN the SKIDS Platform SHALL create a reminder in the database
2. WHEN a reminder time approaches THEN the SKIDS Platform SHALL send a push notification via Firebase FCM
3. WHEN a parent views reminders THEN the SKIDS Platform SHALL display upcoming consultations sorted by date
4. WHEN the app is offline THEN the SKIDS Platform SHALL display cached reminders from local storage

### Requirement 8: Campaign Management

**User Story:** As a super admin, I want to create engagement campaigns, so that I can keep parents informed and engaged.

#### Acceptance Criteria

1. WHEN an admin creates a campaign THEN the SKIDS Platform SHALL store campaign details with target audience and schedule
2. WHEN a campaign is active THEN the SKIDS Platform SHALL display campaign content to targeted parents
3. WHEN campaign media is uploaded THEN the SKIDS Platform SHALL store files in Cloudflare R2
4. WHEN a parent views campaigns THEN the SKIDS Platform SHALL display relevant campaigns based on their clinic and plan

### Requirement 9: Parent-Clinic Communication

**User Story:** As a parent, I want to contact my clinic with questions, so that I can get support when needed.

#### Acceptance Criteria

1. WHEN a parent clicks contact clinic THEN the SKIDS Platform SHALL display clinic contact options (WhatsApp, in-app message)
2. WHEN a parent sends an in-app message THEN the SKIDS Platform SHALL store the message and notify the clinic manager
3. WHEN a clinic manager responds THEN the SKIDS Platform SHALL notify the parent via push notification
4. WHEN viewing messages THEN the SKIDS Platform SHALL display conversation history

### Requirement 10: Offline-First Data Sync

**User Story:** As a parent, I want the app to work offline, so that I can access my child's information without internet.

#### Acceptance Criteria

1. WHEN the app loads THEN the SKIDS Platform SHALL sync user data to IndexedDB for offline access
2. WHEN the app is offline THEN the SKIDS Platform SHALL serve data from IndexedDB cache
3. WHEN the app comes online THEN the SKIDS Platform SHALL sync any offline changes to the server
4. WHEN educational content is downloaded THEN the SKIDS Platform SHALL cache it locally for offline viewing

### Requirement 11: Database Architecture (Turso + Client-Side)

**User Story:** As a developer, I want to use Turso for cloud database with client-side SQLite, so that heavy data lives on user devices and cloud stays minimal.

#### Acceptance Criteria

1. WHEN the app initializes THEN the SKIDS Platform SHALL connect to Turso cloud for identity and sync metadata
2. WHEN a user first syncs THEN the SKIDS Platform SHALL download full data to client-side IndexedDB/SQLite
3. WHEN subsequent syncs occur THEN the SKIDS Platform SHALL fetch only incremental changes (diffs) from Turso
4. WHEN sync events are older than 30 days THEN the SKIDS Platform SHALL purge them from Turso cloud
5. WHEN queries execute on cloud THEN the SKIDS Platform SHALL complete within 50ms using edge replicas
