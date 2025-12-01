# Design Document

## Overview

This design document outlines the approach for updating and standardizing the pricing structure across the SKIDS Advanced application. The solution involves centralizing pricing data, updating UI components to reflect current pricing, and ensuring consistency across all user-facing pages and backend systems.

The current state shows inconsistency:
- `/care-plans` page: Old monthly pricing (₹299, ₹499, ₹799)
- `/plans` page: Current annual pricing (₹3,999, ₹6,999, ₹9,999)
- `/care-plans-dynamic` page: Uses API data which has old pricing
- Care Plans API: Contains outdated pricing in mock data

The target state will have:
- Consistent annual pricing across all pages
- Centralized pricing configuration
- Clear monthly equivalent calculations
- Updated plan naming (Premium → Guardian)

## Architecture

### Component Structure

```
┌─────────────────────────────────────────┐
│     Pricing Configuration               │
│  (Single Source of Truth)               │
│  - Base prices                          │
│  - Billing cycles                       │
│  - Discount structures                  │
└──────────────┬──────────────────────────┘
               │
               ├──────────────┬──────────────┬──────────────┐
               │              │              │              │
               ▼              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Care     │   │ Plans    │  │ Dynamic  │  │ Care     │
        │ Plans    │   │ Page     │  │ Care     │  │ Plans    │
        │ Page     │   │          │  │ Plans    │  │ API      │
        └──────────┘   └──────────┘  └──────────┘  └──────────┘
```

### Data Flow

1. **Pricing Configuration** → Defines all pricing data
2. **Care Plans API** → Loads pricing from configuration
3. **UI Components** → Fetch pricing from API or use shared constants
4. **Display Layer** → Renders consistent pricing across all pages

## Components and Interfaces

### 1. Pricing Configuration Module

**Location:** `src/config/pricing.ts`

**Purpose:** Central source of truth for all pricing data

**Interface:**
```typescript
export interface PlanPricing {
  id: string
  name: string
  displayName: string
  annualPrice: number
  monthlyEquivalent: number
  savings: number
  category: 'essential' | 'comprehensive' | 'premium'
  features: string[]
  benefits: {
    consultationDiscount: number
    vaccinationDiscount: number
    priorityBooking: boolean
    familySupport: boolean
  }
}

export interface PricingConfig {
  plans: PlanPricing[]
  currency: string
  billingCycles: ('monthly' | 'annual')[]
  lastUpdated: Date
}
```

### 2. Care Plans API Updates

**Location:** `src/lib/api/care-plans.ts`

**Changes:**
- Update `initializeDefaultData()` method to use new pricing
- Change plan names from "Premium" to "Guardian"
- Update monthly prices to annual prices
- Recalculate savings based on new pricing

**Key Methods:**
- `getCarePlans()` - Returns plans with updated pricing
- `getCarePlanById()` - Returns individual plan with correct pricing
- `calculateMonthlyEquivalent()` - Helper to compute monthly from annual

### 3. Care Plans Page Component

**Location:** `src/app/care-plans/page.tsx`

**Changes:**
- Update `carePlans` array with new pricing structure
- Change "Premium Care" to "Guardian Care"
- Update monthly prices to annual prices
- Recalculate savings and value propositions
- Update cost comparison calculations

### 4. Plans Page Component

**Location:** `src/app/plans/page.tsx`

**Status:** Already has correct pricing
**Changes:** Minimal - ensure consistency with naming conventions

### 5. Dynamic Care Plans Page

**Location:** `src/app/care-plans-dynamic/page.tsx`

**Changes:**
- Will automatically reflect API changes
- Verify rendering logic handles new pricing format
- Ensure monthly equivalent calculations are correct

## Data Models

### Current Plan Pricing (in API)

```typescript
{
  id: 'essential-plan',
  pricing: {
    basePrice: 299,        // OLD - monthly
    finalPrice: 299,       // OLD - monthly
    billingCycle: 'monthly'
  }
}
```

### Updated Plan Pricing

```typescript
{
  id: 'essential-plan',
  pricing: {
    basePrice: 3999,       // NEW - annual
    finalPrice: 3999,      // NEW - annual
    billingCycle: 'annual',
    monthlyEquivalent: 333 // NEW - calculated
  }
}
```

### Plan Name Mapping

| Old Name | New Name | ID |
|----------|----------|-----|
| Essential Care | Essential Care | essential |
| Comprehensive Care | Comprehensive Care | comprehensive |
| Premium Care | Guardian Care | premium/guardian |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Annual and monthly prices are always displayed together
*For any* care plan displayed to a user, both the annual price and the monthly equivalent should be present in the rendered output.
**Validates: Requirements 1.2**

### Property 2: Pricing is consistent across pages
*For any* care plan, when fetched from different pages (care-plans, plans, care-plans-dynamic), the pricing information should be identical.
**Validates: Requirements 1.3**

### Property 3: Premium tier is always named "Guardian"
*For any* reference to the premium tier plan, the name should be "Guardian" (not "Premium").
**Validates: Requirements 3.1**

### Property 4: Plan names are from the approved set
*For any* care plan in the system, the name should be one of "Essential", "Comprehensive", or "Guardian".
**Validates: Requirements 3.2**

### Property 5: Plan identifiers are consistent
*For any* care plan, when fetched from different sources (API, pages, database), the identifier should be identical.
**Validates: Requirements 3.3**

### Property 6: Plan names match across pages
*For any* care plan, the display name on the care-plans page should match the display name on the plans page.
**Validates: Requirements 3.5**

### Property 7: Monthly equivalent is calculated correctly
*For any* care plan with annual pricing, the monthly equivalent should equal the annual price divided by 12, rounded to the nearest rupee.
**Validates: Requirements 4.3**

### Property 8: Savings calculation is accurate
*For any* care plan, the displayed savings should equal (monthly equivalent × 12) minus the annual price.
**Validates: Requirements 4.4**

### Property 9: Billing cycle is always indicated
*For any* pricing display, the billing cycle (monthly/annual) should be clearly present in the rendered output.
**Validates: Requirements 4.5**

### Property 10: Monthly equivalent is properly rounded
*For any* annual price, when calculating the monthly equivalent, the result should be rounded to the nearest whole rupee (no decimal places).
**Validates: Requirements 5.1**

### Property 11: Prices are formatted with currency symbols
*For any* price displayed, it should include the ₹ symbol and use thousand separators (e.g., ₹3,999 not ₹3999).
**Validates: Requirements 5.2**

### Property 12: Arithmetic is exact
*For any* savings or discount calculation, the result should be mathematically exact without floating-point rounding errors.
**Validates: Requirements 5.3**

### Property 13: Discount percentages are calculated correctly
*For any* discount shown, the percentage should equal ((original price - discounted price) / original price) × 100.
**Validates: Requirements 5.4**

### Property 14: Tax status is clearly indicated
*For any* price display that includes or excludes taxes, the tax status should be explicitly stated in the rendered output.
**Validates: Requirements 5.5**

### Property 15: All services and features are displayed
*For any* care plan, all services and features defined in the plan data should appear in the rendered output.
**Validates: Requirements 6.1**

### Property 16: Screening information is complete
*For any* care plan that includes screenings, the specific types and frequencies should be listed in the rendered output.
**Validates: Requirements 6.3**

### Property 17: Benefits are displayed
*For any* care plan, the consultation discount, vaccination discount, and other benefits should be shown in the rendered output.
**Validates: Requirements 6.4**

### Property 18: Features are correctly attributed
*For any* feature, it should only be listed under the care plans that actually include it.
**Validates: Requirements 6.5**

### Property 19: Individual service costs are calculated correctly
*For any* care plan, the total cost of individual services should equal the sum of (service base price × sessions) for all included services.
**Validates: Requirements 7.1**

### Property 20: Savings from care plan are calculated correctly
*For any* care plan, the displayed savings should equal the total individual service cost minus the annual plan price.
**Validates: Requirements 7.2**

### Property 21: Service frequency is included in savings calculation
*For any* care plan savings calculation, the individual service costs should be multiplied by the service frequency (e.g., quarterly = 4x per year).
**Validates: Requirements 7.4**

## Error Handling

### Pricing Data Validation

**Validation Rules:**
1. Annual prices must be positive integers
2. Monthly equivalents must be calculated, not stored
3. Plan names must be from approved list
4. All required fields must be present
5. Discount percentages must be between 0 and 100

**Error Scenarios:**
- **Invalid Pricing Data:** If pricing configuration contains invalid data, throw error on initialization
- **Missing Plan:** If a requested plan ID doesn't exist, return null and log warning
- **Calculation Errors:** If arithmetic operations fail, log error and use fallback values
- **API Failures:** If API calls fail, show cached data with warning message

### UI Error Handling

**Display Errors:**
- **Missing Pricing:** Show "Pricing unavailable" message
- **Calculation Failures:** Display base price only, hide savings
- **API Timeout:** Show loading state, then cached data
- **Invalid Data:** Log error, skip rendering invalid plan

## Testing Strategy

### Unit Testing

**Pricing Calculations:**
- Test monthly equivalent calculation with various annual prices
- Test savings calculation with different pricing scenarios
- Test rounding behavior for edge cases (e.g., ₹3,997 / 12 = ₹333.08 → ₹333)
- Test currency formatting with various amounts
- Test discount percentage calculations

**Data Validation:**
- Test pricing configuration validation
- Test plan name validation
- Test required field validation
- Test boundary conditions (zero, negative, very large numbers)

**Component Rendering:**
- Test that pricing displays correctly
- Test that all plan features render
- Test that savings calculations appear
- Test error states render appropriately

### Property-Based Testing

We will use **fast-check** (JavaScript/TypeScript property-based testing library) for implementing property-based tests.

**Configuration:**
- Each property-based test should run a minimum of 100 iterations
- Tests should use appropriate generators for pricing data
- Edge cases should be explicitly included in generators

**Test Tagging:**
- Each property-based test must include a comment with the format:
  `// Feature: pricing-structure-update, Property {number}: {property_text}`
- This links the test to the specific correctness property it validates

**Property Test Examples:**

1. **Monthly Equivalent Calculation Property:**
   - Generate random annual prices (1000-100000)
   - Calculate monthly equivalent
   - Verify: monthlyEquivalent = Math.round(annualPrice / 12)

2. **Pricing Consistency Property:**
   - Generate random plan IDs
   - Fetch plan from multiple sources
   - Verify: all sources return identical pricing

3. **Currency Formatting Property:**
   - Generate random prices
   - Format for display
   - Verify: includes ₹ symbol and thousand separators

4. **Savings Calculation Property:**
   - Generate random annual and monthly prices
   - Calculate savings
   - Verify: savings = (monthlyPrice × 12) - annualPrice

### Integration Testing

**Cross-Page Consistency:**
- Load same plan from /care-plans and /plans
- Verify pricing matches exactly
- Verify plan names match exactly
- Verify features list matches

**API Integration:**
- Test API initialization loads correct pricing
- Test API returns consistent data across calls
- Test API handles invalid requests gracefully

**End-to-End Testing:**
- Navigate through all care plan pages
- Verify pricing displays correctly
- Verify calculations are accurate
- Verify no console errors

### Manual Testing Checklist

- [ ] Visit /care-plans and verify all prices are correct
- [ ] Visit /plans and verify consistency
- [ ] Visit /care-plans-dynamic and verify API data
- [ ] Check that "Premium" is renamed to "Guardian"
- [ ] Verify monthly equivalents are calculated correctly
- [ ] Verify savings calculations are accurate
- [ ] Check currency formatting (₹ symbol, commas)
- [ ] Verify all features are displayed
- [ ] Test on mobile and desktop viewports
- [ ] Check browser console for errors

## Implementation Notes

### Migration Strategy

1. **Phase 1: Update API Data**
   - Update pricing in care-plans.ts
   - Update plan names (Premium → Guardian)
   - Add monthly equivalent calculations

2. **Phase 2: Update Care Plans Page**
   - Update carePlans array with new pricing
   - Update plan names
   - Update savings calculations
   - Update value propositions

3. **Phase 3: Verify Dynamic Page**
   - Test that dynamic page reflects API changes
   - Verify rendering logic handles new format

4. **Phase 4: Testing**
   - Run unit tests
   - Run property-based tests
   - Perform manual testing
   - Verify cross-page consistency

### Rollback Plan

If issues are discovered:
1. Revert API changes first
2. Revert UI changes
3. Investigate root cause
4. Fix and redeploy

### Performance Considerations

- Pricing calculations should be memoized where possible
- API calls should be cached appropriately
- Large plan lists should be paginated
- Avoid unnecessary re-renders when pricing hasn't changed

## Future Enhancements

1. **Dynamic Pricing:** Support for promotional pricing and time-based discounts
2. **Regional Pricing:** Different pricing for different regions
3. **Currency Support:** Multi-currency support for international users
4. **A/B Testing:** Test different pricing strategies
5. **Price History:** Track pricing changes over time
6. **Subscription Management:** Handle plan upgrades/downgrades
