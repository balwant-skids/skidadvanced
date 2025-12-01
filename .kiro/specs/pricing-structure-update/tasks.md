# Implementation Plan

- [x] 1. Update Care Plans API with new pricing structure
  - Update the `initializeDefaultData()` method in `src/lib/api/care-plans.ts`
  - Change Essential plan pricing from ₹299/month to ₹3999/year
  - Change Comprehensive plan pricing from ₹499/month to ₹6999/year
  - Change Premium plan pricing from ₹799/month to ₹9999/year
  - Rename "Premium Care" to "Guardian Care" throughout
  - Update plan IDs to use consistent naming
  - Add monthly equivalent calculations
  - Update savings calculations based on new pricing
  - _Requirements: 1.1, 1.5, 2.2, 3.1, 3.2, 3.3_

- [ ]* 1.1 Write property test for pricing consistency
  - **Property 2: Pricing is consistent across pages**
  - **Validates: Requirements 1.3**

- [ ]* 1.2 Write property test for plan naming
  - **Property 3: Premium tier is always named "Guardian"**
  - **Validates: Requirements 3.1**

- [ ]* 1.3 Write property test for monthly equivalent calculation
  - **Property 7: Monthly equivalent is calculated correctly**
  - **Validates: Requirements 4.3**

- [x] 2. Update Care Plans Page component
  - Update the `carePlans` array in `src/app/care-plans/page.tsx`
  - Change monthly prices to annual prices (299 → 3999, 499 → 6999, 799 → 9999)
  - Update plan names (Premium Care → Guardian Care)
  - Recalculate `annualPrice` and `savings` fields
  - Update `monthlyPrice` to show monthly equivalent (annual / 12)
  - Update value propositions to reflect new pricing
  - Update cost comparison calculations in the component
  - _Requirements: 1.1, 1.2, 1.5, 3.1, 3.2, 4.1, 4.2_

- [ ]* 2.1 Write property test for annual and monthly display
  - **Property 1: Annual and monthly prices are always displayed together**
  - **Validates: Requirements 1.2**

- [ ]* 2.2 Write property test for savings calculation
  - **Property 8: Savings calculation is accurate**
  - **Validates: Requirements 4.4**

- [ ]* 2.3 Write property test for billing cycle indication
  - **Property 9: Billing cycle is always indicated**
  - **Validates: Requirements 4.5**

- [x] 3. Verify Plans Page consistency
  - Review `src/app/plans/page.tsx` to ensure it matches new pricing
  - Verify plan names are consistent (Essential, Comprehensive, Guardian)
  - Ensure annual pricing is displayed correctly
  - Verify monthly equivalent calculations match
  - _Requirements: 1.3, 3.2, 3.5_

- [ ]* 3.1 Write property test for plan name consistency
  - **Property 6: Plan names match across pages**
  - **Validates: Requirements 3.5**

- [x] 4. Update Dynamic Care Plans Page
  - Review `src/app/care-plans-dynamic/page.tsx`
  - Verify it correctly displays API data with new pricing
  - Ensure monthly equivalent calculations are correct
  - Update any hardcoded pricing references
  - Test that sorting and filtering work with new pricing
  - _Requirements: 1.2, 1.3, 4.1_

- [x] 5. Add pricing calculation utilities
  - Create helper functions for common calculations
  - Implement `calculateMonthlyEquivalent(annualPrice: number): number`
  - Implement `calculateAnnualSavings(monthlyPrice: number, annualPrice: number): number`
  - Implement `formatCurrency(amount: number): string`
  - Implement `calculateDiscountPercentage(original: number, discounted: number): number`
  - Add proper rounding for currency values
  - _Requirements: 4.3, 4.4, 5.1, 5.2, 5.3, 5.4_

- [ ]* 5.1 Write property test for rounding behavior
  - **Property 10: Monthly equivalent is properly rounded**
  - **Validates: Requirements 5.1**

- [ ]* 5.2 Write property test for currency formatting
  - **Property 11: Prices are formatted with currency symbols**
  - **Validates: Requirements 5.2**

- [ ]* 5.3 Write property test for arithmetic accuracy
  - **Property 12: Arithmetic is exact**
  - **Validates: Requirements 5.3**

- [ ]* 5.4 Write property test for discount calculations
  - **Property 13: Discount percentages are calculated correctly**
  - **Validates: Requirements 5.4**

- [x] 6. Update service and feature displays
  - Ensure all plan features are displayed correctly
  - Verify screening information shows types and frequencies
  - Update benefit displays (consultation/vaccination discounts)
  - Ensure features are correctly attributed to plans
  - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [ ]* 6.1 Write property test for feature display
  - **Property 15: All services and features are displayed**
  - **Validates: Requirements 6.1**

- [ ]* 6.2 Write property test for screening information
  - **Property 16: Screening information is complete**
  - **Validates: Requirements 6.3**

- [ ]* 6.3 Write property test for benefits display
  - **Property 17: Benefits are displayed**
  - **Validates: Requirements 6.4**

- [x] 7. Update cost comparison calculations
  - Update individual service cost calculations
  - Recalculate savings from choosing care plans
  - Ensure service frequency is included in calculations
  - Update value proposition displays
  - _Requirements: 7.1, 7.2, 7.4_

- [ ]* 7.1 Write property test for individual service costs
  - **Property 19: Individual service costs are calculated correctly**
  - **Validates: Requirements 7.1**

- [ ]* 7.2 Write property test for care plan savings
  - **Property 20: Savings from care plan are calculated correctly**
  - **Validates: Requirements 7.2**

- [ ]* 7.3 Write property test for frequency in savings
  - **Property 21: Service frequency is included in savings calculation**
  - **Validates: Requirements 7.4**

- [x] 8. Add data validation
  - Implement validation for pricing configuration
  - Add checks for required fields
  - Validate plan names against approved list
  - Add boundary condition checks
  - Implement error handling for invalid data
  - _Requirements: 2.5, 5.3_

- [ ]* 8.1 Write unit tests for data validation
  - Test pricing configuration validation
  - Test plan name validation
  - Test required field validation
  - Test boundary conditions
  - _Requirements: 2.5_

- [x] 9. Update type definitions
  - Review and update TypeScript interfaces in `src/types/care-plans.ts`
  - Ensure PlanPricing interface includes monthlyEquivalent field
  - Add validation types for pricing data
  - Update JSDoc comments to reflect new pricing structure
  - _Requirements: 2.1, 4.3_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Cross-page consistency verification
  - Load same plan from multiple pages
  - Verify pricing matches exactly
  - Verify plan names match exactly
  - Verify features lists match
  - Document any discrepancies
  - _Requirements: 1.3, 3.3, 3.5_

- [ ]* 11.1 Write integration tests for cross-page consistency
  - Test pricing consistency across pages
  - Test plan name consistency
  - Test feature list consistency
  - _Requirements: 1.3, 3.5_

- [ ] 12. Manual testing and verification
  - Visit /care-plans and verify all prices are correct
  - Visit /plans and verify consistency
  - Visit /care-plans-dynamic and verify API data
  - Check that "Premium" is renamed to "Guardian" everywhere
  - Verify monthly equivalents are calculated correctly
  - Verify savings calculations are accurate
  - Check currency formatting (₹ symbol, commas)
  - Verify all features are displayed
  - Test on mobile and desktop viewports
  - Check browser console for errors
  - _Requirements: All_

- [ ] 13. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
