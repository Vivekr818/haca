# End-to-End User Flow Test Documentation

## Overview

The end-to-end test (`lib/e2e-user-flow.test.ts`) validates the complete user journey through the AI-Powered Loan & Policy Recommendation System, from form submission to results display and admin dashboard visibility.

## Test Coverage

### Task 13.1: Test complete user flow end-to-end

The test validates all sub-tasks:

1. **Submit form with various user profiles**
   - Low risk profile (credit score > 700)
   - Medium risk profile (credit score 600-700)
   - High risk profile (credit score < 600)

2. **Verify results page displays correct recommendations**
   - Risk level badge is displayed correctly
   - Personalized explanation is present
   - Loan recommendations show all required fields
   - Policy recommendations show all required fields
   - Appropriate messages for empty results

3. **Verify application is stored in database**
   - All user input fields are persisted
   - Calculated risk level is stored
   - Recommended loans are stored as JSONB
   - Recommended policies are stored as JSONB
   - Timestamp is recorded

4. **Verify admin dashboard shows new application**
   - Application appears in the dashboard
   - All required fields are displayed
   - Field values match submitted data
   - Statistics are calculated correctly

## Requirements Validated

The test validates the following requirements from the specification:

- **Requirements 7.1-7.8**: User Data Collection (form validation and submission)
- **Requirements 8.1-8.7**: Application Persistence (database storage)
- **Requirements 9.1-9.6**: Results Display (results page rendering)
- **Requirements 11.1-11.5**: Admin Dashboard (application list and statistics)

## Test Scenarios

### Scenario 1: Low Risk User

**Profile:**
- Name: Alice Johnson
- Age: 35
- Income: ₹80,000/month
- Credit Score: 750
- Employment: Salaried
- Sector: Education
- Existing EMI: ₹10,000
- Requested Amount: ₹500,000

**Expected Results:**
- Risk Level: Low
- Should qualify for multiple loans
- Should see Education sector policies

### Scenario 2: Medium Risk User

**Profile:**
- Name: Bob Smith
- Age: 42
- Income: ₹50,000/month
- Credit Score: 650
- Employment: Self-Employed
- Sector: MSME
- Existing EMI: ₹15,000
- Requested Amount: ₹300,000

**Expected Results:**
- Risk Level: Medium
- May qualify for some loans
- Should see MSME sector policies

### Scenario 3: High Risk User

**Profile:**
- Name: Charlie Brown
- Age: 28
- Income: ₹30,000/month
- Credit Score: 550
- Employment: Salaried
- Sector: Startup
- Existing EMI: ₹12,000
- Requested Amount: ₹200,000

**Expected Results:**
- Risk Level: High
- May not qualify for many loans (high DTI ratio)
- Should see Startup sector policies if eligible

## Prerequisites

### 1. Supabase Database Setup

You need a Supabase project with the database schema and seed data:

1. Create a Supabase project at https://app.supabase.com
2. Run the schema file in the SQL editor:
   ```sql
   -- Run: supabase/schema.sql
   ```
3. Run the seed file to populate test data:
   ```sql
   -- Run: supabase/seed.sql
   ```

### 2. Environment Variables

Create a `.env.local` file in the project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to Settings > API
- Copy the Project URL for `NEXT_PUBLIC_SUPABASE_URL`
- Copy the service_role key for `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Security Warning**: Never commit the `.env.local` file to version control!

### 3. Dependencies

The test requires the `tsx` package for TypeScript execution:

```bash
npm install --save-dev tsx
```

## Running the Test

### Option 1: Using the Test Runner (Recommended)

```bash
node run-e2e-test.js
```

The test runner will:
- Check if environment variables are configured
- Provide setup instructions if not configured
- Run the test if everything is ready

### Option 2: Direct Execution

If you have environment variables set:

```bash
npx tsx lib/e2e-user-flow.test.ts
```

Or with Node.js:

```bash
node --import tsx lib/e2e-user-flow.test.ts
```

## Test Output

### Successful Test Run

```
============================================================
🚀 Starting End-to-End User Flow Tests
============================================================

============================================================
TEST 1: Low Risk User Flow
============================================================

📝 Simulating form submission for: Alice Johnson
  → Fetching loan products and policies...
  ✓ Fetched 5 loan products and 6 policies
  → Evaluating user profile...
  ✓ Risk level: Low
  ✓ Recommended loans: 3
  ✓ Recommended policies: 2
  → Generating explanation...
  ✓ Explanation generated (245 characters)
  → Storing application in database...
  ✓ Application stored successfully

🔍 Verifying results page data for: Alice Johnson
  ✓ Risk level badge: Low
  ✓ Explanation text present
  ✓ 3 loan(s) would be displayed in card layout
  ✓ All loans have required fields (name, interest rate, max amount, tenure)
  ✓ 2 policy/policies would be displayed
  ✓ All policies have required fields (name, sector, benefits)

📊 Verifying admin dashboard for: Alice Johnson
  → Fetching all applications...
  ✓ Found 1 application(s) in database
  ✓ Application found in admin dashboard
  ✓ Application has all required fields
  ✓ All field values match submitted data
  ✓ Statistics calculated:
    - Total applications: 1
    - High risk applications: 0
    - Average credit score: 750

✅ TEST 1 PASSED: Low risk user flow completed successfully

[Similar output for TEST 2 and TEST 3...]

============================================================
📊 TEST SUMMARY
============================================================
✅ Passed: 3
❌ Failed: 0
📈 Total: 3

🎉 All end-to-end tests passed!
```

### Failed Test Run

If a test fails, you'll see detailed error messages:

```
❌ TEST 1 FAILED: Application for Alice Johnson not found in admin dashboard
```

## Test Architecture

### Test Flow

```
1. simulateUserFlow()
   ├─ Fetch loan products from database
   ├─ Fetch loan policies from database
   ├─ Evaluate user profile
   ├─ Generate explanation
   └─ Store application in database

2. verifyResultsPageData()
   ├─ Verify risk level badge
   ├─ Verify explanation text
   ├─ Verify loan recommendations
   └─ Verify policy recommendations

3. verifyAdminDashboard()
   ├─ Fetch all applications
   ├─ Find user's application
   ├─ Verify all required fields
   ├─ Verify field values match
   └─ Verify statistics calculation
```

### Key Functions

#### `simulateUserFlow(userData: UserData)`
Simulates the complete form submission process:
- Fetches loan products and policies
- Evaluates user profile
- Generates explanation
- Stores application in database

#### `verifyResultsPageData(userData, result, explanation)`
Verifies the results page would display correct data:
- Risk level badge
- Explanation text
- Loan recommendations with all required fields
- Policy recommendations with all required fields

#### `verifyAdminDashboard(userData)`
Verifies the admin dashboard shows the application:
- Application is present in database
- All required fields are included
- Field values match submitted data
- Statistics are calculated correctly

## Troubleshooting

### Error: "Unable to connect to database"

**Cause**: Supabase credentials are incorrect or database is not accessible.

**Solution**:
1. Verify your `.env.local` file has correct credentials
2. Check that your Supabase project is active
3. Ensure your IP is not blocked by Supabase

### Error: "No loan products found in database"

**Cause**: Database tables are empty.

**Solution**:
1. Run the seed file: `supabase/seed.sql`
2. Verify data was inserted by checking the Supabase dashboard

### Error: "Application for [name] not found in admin dashboard"

**Cause**: Database insertion failed or application was not stored.

**Solution**:
1. Check database logs in Supabase dashboard
2. Verify the `loan_applications` table exists
3. Check for any database constraints that might prevent insertion

### Test hangs or times out

**Cause**: Network issues or database connection problems.

**Solution**:
1. Check your internet connection
2. Verify Supabase project is accessible
3. Try running the test again

## Integration with CI/CD

To run this test in a CI/CD pipeline:

1. Set environment variables in your CI/CD platform
2. Ensure the database is accessible from CI/CD environment
3. Run the test as part of your test suite:

```yaml
# Example GitHub Actions workflow
- name: Run E2E Tests
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  run: node run-e2e-test.js
```

## Maintenance

### Adding New Test Scenarios

To add a new test scenario:

1. Create a new user profile object:
```typescript
const newUser: UserData = {
  user_name: 'New User',
  age: 30,
  income: 60000,
  credit_score: 700,
  employment_type: 'Salaried',
  sector: 'Housing',
  existing_emi: 5000,
  requested_amount: 400000
};
```

2. Add a new test case in `runE2ETests()`:
```typescript
try {
  console.log('\nTEST 4: New Scenario');
  const newFlow = await simulateUserFlow(newUser);
  verifyResultsPageData(newUser, newFlow.result, newFlow.explanation);
  await verifyAdminDashboard(newUser);
  console.log('✅ TEST 4 PASSED');
  passedTests++;
} catch (error) {
  console.error('❌ TEST 4 FAILED:', error);
  failedTests++;
}
```

### Updating Verification Logic

If requirements change, update the verification functions:

- `verifyResultsPageData()` - for results page changes
- `verifyAdminDashboard()` - for admin dashboard changes

## Related Files

- `lib/e2e-user-flow.test.ts` - Main test file
- `run-e2e-test.js` - Test runner script
- `lib/evaluation.ts` - Core evaluation logic
- `lib/explanation.ts` - Explanation generation
- `lib/db-utils.ts` - Database operations
- `app/actions.ts` - Server actions
- `app/results/page.tsx` - Results page
- `app/admin/page.tsx` - Admin dashboard

## Support

If you encounter issues with the test:

1. Check this documentation for troubleshooting steps
2. Verify all prerequisites are met
3. Review the test output for specific error messages
4. Check the Supabase dashboard for database issues
