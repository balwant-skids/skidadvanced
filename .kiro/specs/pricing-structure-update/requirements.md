# Requirements Document

## Introduction

This specification addresses the inconsistency in pricing structures across the SKIDS Advanced application. Currently, the `/care-plans` page displays outdated monthly pricing (₹299, ₹499, ₹799), while the `/plans` page shows the current annual pricing structure (₹3,999, ₹6,999, ₹9,999 per year). This update will ensure consistent pricing information across all user-facing pages and backend systems.

## Glossary

- **Care Plan**: A subscription-based health service package offering various screenings and assessments for children
- **Pricing Structure**: The defined cost model for care plans, including base prices, billing cycles, and discounts
- **Essential Plan**: The entry-level care plan offering foundational health screenings
- **Comprehensive Plan**: The mid-tier care plan with additional specialized assessments
- **Guardian Plan**: The premium care plan (formerly called "Premium") with maximum coverage
- **Billing Cycle**: The frequency at which customers are charged (monthly or annual)
- **Care Plans Page**: The user interface at `/care-plans` displaying available care plans
- **Plans Page**: The user interface at `/plans` showing detailed plan comparisons
- **Dynamic Care Plans Page**: The user interface at `/care-plans-dynamic` showing API-driven care plans
- **Care Plans API**: The backend service managing care plan data and pricing

## Requirements

### Requirement 1

**User Story:** As a parent browsing care plans, I want to see consistent pricing information across all pages, so that I can make informed decisions without confusion.

#### Acceptance Criteria

1. WHEN a user views the care plans page THEN the system SHALL display the current annual pricing structure (₹3,999, ₹6,999, ₹9,999)
2. WHEN a user views any care plan THEN the system SHALL show both annual price and equivalent monthly price
3. WHEN a user compares plans across different pages THEN the system SHALL display identical pricing for the same plan
4. WHEN pricing information is updated THEN the system SHALL reflect changes across all user interfaces simultaneously
5. WHEN a user views the Essential plan THEN the system SHALL display ₹3,999/year (₹333/month)

### Requirement 2

**User Story:** As a system administrator, I want pricing to be managed centrally, so that updates are consistent and maintainable.

#### Acceptance Criteria

1. WHEN pricing is defined THEN the system SHALL store it in a single source of truth
2. WHEN the care plans API initializes THEN the system SHALL load the current pricing structure
3. WHEN pricing data is requested THEN the system SHALL return values from the centralized pricing configuration
4. WHEN pricing is updated in the API THEN the system SHALL propagate changes to all dependent components
5. WHEN the system starts THEN the system SHALL validate pricing data integrity

### Requirement 3

**User Story:** As a developer, I want clear plan naming conventions, so that the codebase is consistent and maintainable.

#### Acceptance Criteria

1. WHEN referencing the premium tier THEN the system SHALL use the name "Guardian" consistently
2. WHEN displaying plan names THEN the system SHALL use "Essential", "Comprehensive", and "Guardian"
3. WHEN storing plan data THEN the system SHALL use consistent identifiers across all systems
4. WHEN migrating from old naming THEN the system SHALL maintain backward compatibility for existing subscriptions
5. WHEN plan names are displayed THEN the system SHALL match the naming in the plans page

### Requirement 4

**User Story:** As a parent, I want to understand the value of annual vs monthly billing, so that I can choose the best payment option.

#### Acceptance Criteria

1. WHEN viewing annual pricing THEN the system SHALL display the equivalent monthly cost
2. WHEN comparing billing cycles THEN the system SHALL show savings from annual payment
3. WHEN a plan shows monthly equivalent THEN the system SHALL calculate it as annual price divided by 12
4. WHEN displaying savings THEN the system SHALL show the difference between monthly total and annual price
5. WHEN a user views pricing THEN the system SHALL clearly indicate the billing cycle

### Requirement 5

**User Story:** As a quality assurance tester, I want pricing calculations to be accurate, so that customers are charged correctly.

#### Acceptance Criteria

1. WHEN calculating monthly equivalent THEN the system SHALL round to the nearest rupee
2. WHEN displaying prices THEN the system SHALL format them with proper currency symbols and separators
3. WHEN computing savings THEN the system SHALL use accurate arithmetic without floating-point errors
4. WHEN showing discounts THEN the system SHALL calculate percentages correctly
5. WHEN pricing includes taxes THEN the system SHALL clearly indicate tax-inclusive or tax-exclusive amounts

### Requirement 6

**User Story:** As a parent, I want to see what features are included in each plan, so that I can understand what I'm paying for.

#### Acceptance Criteria

1. WHEN viewing a care plan THEN the system SHALL display all included services and features
2. WHEN comparing plans THEN the system SHALL highlight differences in service frequency and coverage
3. WHEN a plan includes screenings THEN the system SHALL list the specific types and frequencies
4. WHEN viewing benefits THEN the system SHALL show consultation and vaccination discounts
5. WHEN a feature is plan-specific THEN the system SHALL clearly indicate which plans include it

### Requirement 7

**User Story:** As a parent, I want to see the cost comparison between individual tests and care plans, so that I can understand the value proposition.

#### Acceptance Criteria

1. WHEN viewing a care plan THEN the system SHALL calculate the total cost of individual services
2. WHEN comparing costs THEN the system SHALL show the savings from choosing a care plan
3. WHEN individual test costs are displayed THEN the system SHALL use current market pricing
4. WHEN calculating annual savings THEN the system SHALL account for service frequency
5. WHEN showing value proposition THEN the system SHALL display clear cost-benefit analysis
