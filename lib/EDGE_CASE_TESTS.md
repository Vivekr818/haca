# Edge Case Tests Documentation

## Overview

This document describes the edge case tests implemented for Task 13.2 of the AI-Powered Loan & Policy Recommendation System. The tests validate that the application handles boundary conditions and extreme values gracefully.

## Test Files

### 1. `lib/edge-cases-unit.test.ts` (Unit Tests - No Database Required)

**Purpose**: Validates edge case handling using mock data without requiring a database connection.

**Run Command**:
```bash
npx tsx lib/edge-cases-unit.test.ts
```

**Test Cases**:

#### Test 1: User Who Qualifies for No Loans
- **Profile**: Very low credit score (350), low income (₹15,000), high DTI (66.7%)
- **Expected**: High risk, no loans recommended
- **Validates**: System handles users with no loan eligibility gracefully
- **Requirements**: 2.7, 6.5, 14.3

#### Test 2: User Who Has No Matching Policies
- **Profile**: Low credit score (550), sector with policies but doesn't meet requirements
- **Expected**: No policies recommended, explanation omits policy section
- **Validates**: System handles users with no policy matches gracefully
- **Requirements**: 3.7, 6.6

#### Test 3: User With Maximum Values
- **Profile**: Maximum credit score (900), very high income (₹500,000), zero DTI
- **Expected**: Low risk, multiple loans with high suitability scores (>80)
- **Validates**: System handles maximum values without overflow or errors
- **Requirements**: 1.4, 2.4, 3.4, 4.4, 5.3

#### Test 4: User With Minimum Values
- **Profile**: Minimum credit score (300), very low income (₹10,000), high DTI (80%)
- **Expected**: High risk, system handles without crashes, all scores within bounds
- **Validates**: System handles minimum values without underflow or errors
- **Requirements**: 1.2, 2.4, 3.4, 4.4, 5.3

#### Test 5: Boundary Value - Credit Score 600
- **Profile**: Credit score exactly 600
- **Expected**: Risk level assigned as 'Medium'
- **Validates**: Boundary condition at lower end of Medium risk range
- **Requirements**: 1.3

#### Test 6: Boundary Value - Credit Score 700
- **Profile**: Credit score exactly 700
- **Expected**: Risk level assigned as 'Medium'
- **Validates**: Boundary condition at upper end of Medium risk range
- **Requirements**: 1.3

#### Test 7: Zero DTI Ratio
- **Profile**: Zero existing EMI (0% DTI), good credit score (800)
- **Expected**: Multiple loans recommended with high suitability scores
- **Validates**: System handles zero DTI correctly
- **Requirements**: 1.1, 2.3

### 2. `lib/e2e-edge-cases.test.ts` (Integration Tests - Database Required)

**Purpose**: Validates edge case handling with real database data and full integration.

**Prerequisites**:
1. Supabase database configured with schema and seed data
2. Environment variables set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Run Command**:
```bash
node run-edge-case-tests.js
```

Or directly:
```bash
npx tsx lib/e2e-edge-cases.test.ts
```

**Test Cases**:

#### Test 1: User Who Qualifies for No Loans (Integration)
- Same as unit test but uses real database data
- Validates database queries handle edge cases correctly

#### Test 2: User Who Has No Matching Policies (Integration)
- Same as unit test but uses real database data
- Validates policy filtering with actual database records

#### Test 3: User With Maximum Values (Integration)
- Same as unit test but uses real database data
- Validates system handles maximum values with real loan products

#### Test 4: User With Minimum Values (Integration)
- Same as unit test but uses real database data
- Validates system handles minimum values with real loan products

## Test Coverage

### Edge Cases Covered

1. **No Loan Eligibility**
   - Users with very low credit scores
   - Users with high DTI ratios
   - Users with low income
   - Combination of multiple disqualifying factors

2. **No Policy Matches**
   - Users in sectors with policies but not meeting requirements
   - Users with credit scores below policy thresholds
   - Users with income below policy minimums

3. **Maximum Values**
   - Credit score at maximum (900)
   - Very high income (₹500,000+)
   - Zero DTI ratio
   - Validates no overflow or calculation errors

4. **Minimum Values**
   - Credit score at minimum (300)
   - Very low income (₹10,000)
   - High DTI ratio (80%+)
   - Validates no underflow or calculation errors

5. **Boundary Values**
   - Credit score exactly 600 (High/Medium boundary)
   - Credit score exactly 700 (Medium/Low boundary)
   - Zero DTI ratio
   - Validates correct risk level assignment at boundaries

### Requirements Validated

The edge case tests validate the following requirements:

- **Requirement 1.1**: DTI ratio calculation with extreme values
- **Requirement 1.2**: Risk level assignment for minimum credit score
- **Requirement 1.3**: Risk level assignment at boundary values (600, 700)
- **Requirement 1.4**: Risk level assignment for maximum credit score
- **Requirement 2.3**: Loan filtering with extreme DTI ratios
- **Requirement 2.4**: Suitability score bounds (0-100) with extreme values
- **Requirement 2.7**: Empty loan list handling
- **Requirement 3.4**: Relevance score bounds (0-100) with extreme values
- **Requirement 3.7**: Empty policy list handling
- **Requirement 4.4**: Suitability score capping at 100
- **Requirement 5.3**: Relevance score capping at 100
- **Requirement 6.5**: Explanation for no loan qualification
- **Requirement 6.6**: Explanation handling when no policies available
- **Requirement 14.3**: User-friendly messages for edge cases

## Running the Tests

### Quick Start (Unit Tests)

No setup required - just run:

```bash
npx tsx lib/edge-cases-unit.test.ts
```

### Full Integration Tests

1. **Set up Supabase**:
   ```bash
   # Create a Supabase project at https://app.supabase.com
   # Run the schema: supabase/schema.sql
   # Run the seed data: supabase/seed.sql
   ```

2. **Configure environment**:
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   ```

3. **Run tests**:
   ```bash
   node run-edge-case-tests.js
   ```

## Expected Output

### Successful Test Run

```
============================================================
🚀 Starting Edge Case Unit Tests (No Database Required)
============================================================

============================================================
TEST 1: User Who Qualifies for No Loans (Unit Test)
============================================================

📝 Testing user with very low credit score and high DTI ratio
  → Income: ₹15,000
  → Credit Score: 350
  → Existing EMI: ₹10,000
  → DTI Ratio: 66.7%
  ✓ Risk level correctly assigned: High
  ✓ No loans recommended (as expected)
  ✓ Explanation correctly states no loan qualification
  ✓ Explanation contains all required information
  ✓ System handled edge case without errors
✅ No Loans Qualified PASSED

[... similar output for other tests ...]

============================================================
📊 TEST SUMMARY
============================================================
✅ Passed: 7
❌ Failed: 0
📈 Total: 7

🎉 All edge case unit tests passed!
```

## Test Maintenance

### Adding New Edge Cases

To add a new edge case test:

1. **For unit tests** (`lib/edge-cases-unit.test.ts`):
   ```typescript
   function testNewEdgeCase() {
     printTestHeader(8, 'New Edge Case Description');
     
     const userData: UserData = {
       // Define test user profile
     };

     try {
       // Test logic
       const result = evaluateUserProfile(userData, mockLoanProducts, mockPolicies);
       
       // Assertions
       if (/* condition */) {
         throw new Error('Expected ...');
       }
       
       printTestResult('New Edge Case', true);
     } catch (error) {
       const message = error instanceof Error ? error.message : 'Unknown error';
       printTestResult('New Edge Case', false, message);
     }
   }
   
   // Add to runEdgeCaseUnitTests()
   testNewEdgeCase();
   ```

2. **For integration tests** (`lib/e2e-edge-cases.test.ts`):
   - Follow the same pattern but use `fetchLoanProducts()` and `fetchLoanPolicies()`
   - Add to `runEdgeCaseTests()` function

### Updating Test Data

- **Unit tests**: Update `mockLoanProducts` and `mockPolicies` arrays
- **Integration tests**: Update seed data in `supabase/seed.sql`

## Troubleshooting

### Unit Tests Fail

1. Check that evaluation logic is correct in `lib/evaluation.ts`
2. Verify explanation generation in `lib/explanation.ts`
3. Review test assertions for correctness

### Integration Tests Fail

1. Verify database connection:
   ```bash
   # Check .env.local file exists and has correct values
   cat .env.local
   ```

2. Verify database has data:
   - Check Supabase dashboard
   - Ensure seed data was loaded

3. Check for database errors in test output

### Environment Setup Issues

If you see "Environment variables not configured":

1. Create `.env.local` file in project root
2. Add Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_key
   ```
3. Get credentials from Supabase dashboard → Settings → API

## Integration with CI/CD

To run edge case tests in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run Edge Case Tests
  run: npx tsx lib/edge-cases-unit.test.ts

# For integration tests (requires Supabase)
- name: Run Edge Case Integration Tests
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  run: node run-edge-case-tests.js
```

## Related Files

- `lib/edge-cases-unit.test.ts` - Unit tests (no database)
- `lib/e2e-edge-cases.test.ts` - Integration tests (database required)
- `run-edge-case-tests.js` - Test runner with environment checks
- `lib/evaluation.ts` - Core evaluation logic
- `lib/explanation.ts` - Explanation generation
- `lib/db-utils.ts` - Database utilities
- `supabase/schema.sql` - Database schema
- `supabase/seed.sql` - Test data

## Summary

The edge case tests ensure the AI-Powered Loan & Policy Recommendation System handles extreme and boundary conditions gracefully:

✅ Users who qualify for no loans receive appropriate messages  
✅ Users with no matching policies see correct explanations  
✅ Maximum values (credit score 900, high income) are handled correctly  
✅ Minimum values (credit score 300, low income) don't cause errors  
✅ Boundary values (600, 700) are assigned correct risk levels  
✅ All scores remain within bounds (0-100)  
✅ System never crashes or produces invalid results  

These tests provide confidence that the system will handle real-world edge cases in production.
