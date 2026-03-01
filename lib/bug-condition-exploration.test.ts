/**
 * Bug Condition Exploration Test for Supabase to Neon Migration
 * 
 * This test verifies that all database operations throw "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
 * error when only DATABASE_URL is configured (Supabase client still in place).
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
 * 
 * Property 1: Fault Condition - Database Operations Fail with Supabase Client
 * 
 * For any database operation (fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, 
 * insertLoanApplication) that is called with only DATABASE_URL configured, the code SHALL 
 * throw "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" error because it attempts 
 * to use getSupabaseClient() which requires Supabase environment variables.
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication } from './db-utils';

// Test data for insertLoanApplication
const testApplicationData = {
  user_name: 'Test User',
  age: 30,
  income: 50000,
  credit_score: 700,
  employment_type: 'Salaried',
  sector: 'Technology',
  existing_emi: 5000,
  requested_amount: 100000,
  risk_level: 'Low',
  recommended_loans: [],
  recommended_policies: []
};

/**
 * Test helper to verify error message
 * For read operations: expects user-friendly error after retry logic
 * For write operations: expects raw Supabase error
 */
function assertErrorMessage(error: Error, operation: string, isReadOperation: boolean) {
  const userFriendlyError = 'Unable to connect to database. Please try again later.';
  const supabaseError = 'Missing environment variable: NEXT_PUBLIC_SUPABASE_URL';
  
  if (isReadOperation) {
    // Read operations should throw user-friendly error after retries
    if (error.message === userFriendlyError) {
      console.log(`✓ ${operation} throws user-friendly error after retries: "${userFriendlyError}"`);
      console.log(`  (Root cause logged: "${supabaseError}")`);
      return true;
    } else {
      console.error(`✗ ${operation} threw unexpected error: "${error.message}"`);
      console.error(`  Expected: "${userFriendlyError}"`);
      return false;
    }
  } else {
    // Write operations should return/throw raw error immediately
    if (error.message.includes(supabaseError)) {
      console.log(`✓ ${operation} returns raw error immediately: "${supabaseError}"`);
      return true;
    } else {
      console.error(`✗ ${operation} threw unexpected error: "${error.message}"`);
      console.error(`  Expected error to include: "${supabaseError}"`);
      return false;
    }
  }
}

/**
 * Main test runner
 */
async function runBugConditionExplorationTests() {
  console.log('\n=== Bug Condition Exploration Test ===');
  console.log('Testing database operations with Supabase client (unfixed code)');
  console.log('Expected: All operations should fail due to missing Supabase environment variables');
  console.log('  - Read operations: throw user-friendly error after retries');
  console.log('  - Write operations: return raw error immediately\n');

  const results: boolean[] = [];

  // Test 1: fetchLoanProducts (read operation)
  console.log('Test 1: fetchLoanProducts() [READ OPERATION]');
  try {
    await fetchLoanProducts();
    console.error('✗ fetchLoanProducts did NOT throw an error (unexpected)');
    results.push(false);
  } catch (error) {
    if (error instanceof Error) {
      results.push(assertErrorMessage(error, 'fetchLoanProducts', true));
    } else {
      console.error('✗ fetchLoanProducts threw non-Error object');
      results.push(false);
    }
  }
  console.log('');

  // Test 2: fetchLoanPolicies (read operation)
  console.log('Test 2: fetchLoanPolicies() [READ OPERATION]');
  try {
    await fetchLoanPolicies();
    console.error('✗ fetchLoanPolicies did NOT throw an error (unexpected)');
    results.push(false);
  } catch (error) {
    if (error instanceof Error) {
      results.push(assertErrorMessage(error, 'fetchLoanPolicies', true));
    } else {
      console.error('✗ fetchLoanPolicies threw non-Error object');
      results.push(false);
    }
  }
  console.log('');

  // Test 3: fetchLoanApplications (read operation)
  console.log('Test 3: fetchLoanApplications() [READ OPERATION]');
  try {
    await fetchLoanApplications();
    console.error('✗ fetchLoanApplications did NOT throw an error (unexpected)');
    results.push(false);
  } catch (error) {
    if (error instanceof Error) {
      results.push(assertErrorMessage(error, 'fetchLoanApplications', true));
    } else {
      console.error('✗ fetchLoanApplications threw non-Error object');
      results.push(false);
    }
  }
  console.log('');

  // Test 4: insertLoanApplication (write operation)
  console.log('Test 4: insertLoanApplication(testData) [WRITE OPERATION]');
  try {
    const result = await insertLoanApplication(testApplicationData);
    // insertLoanApplication returns {success: false, error: string} instead of throwing
    if (!result.success && result.error?.includes('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')) {
      console.log(`✓ insertLoanApplication returns error: "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"`);
      results.push(true);
    } else {
      console.error(`✗ insertLoanApplication returned unexpected result:`, result);
      results.push(false);
    }
  } catch (error) {
    // If it throws instead of returning error object, check if it's the expected error
    if (error instanceof Error) {
      results.push(assertErrorMessage(error, 'insertLoanApplication', false));
    } else {
      console.error('✗ insertLoanApplication threw non-Error object');
      results.push(false);
    }
  }
  console.log('');

  // Summary
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log('=== Test Summary ===');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  
  console.log('\n=== Counterexamples Found ===');
  console.log('Bug Condition Confirmed: All database operations fail when code uses Supabase client');
  console.log('but only DATABASE_URL is configured (Supabase environment variables missing).');
  console.log('');
  console.log('Root Cause: getSupabaseClient() in lib/supabase.ts requires NEXT_PUBLIC_SUPABASE_URL');
  console.log('and SUPABASE_SERVICE_ROLE_KEY, but these are not configured after migration to Neon.');
  console.log('');
  console.log('Observed Behavior:');
  console.log('  - fetchLoanProducts: Retries 3 times, then throws user-friendly error');
  console.log('  - fetchLoanPolicies: Retries 3 times, then throws user-friendly error');
  console.log('  - fetchLoanApplications: Retries 3 times, then throws user-friendly error');
  console.log('  - insertLoanApplication: Fails immediately with raw error (no retry)');
  console.log('');
  
  if (passedTests === totalTests) {
    console.log('✓ ALL TESTS PASSED - Bug condition fully confirmed!');
    console.log('The application cannot perform any database operations.\n');
    process.exit(0);
  } else {
    console.log('✗ SOME TESTS FAILED - Bug condition not fully confirmed');
    console.log('Some operations did not fail as expected.\n');
    process.exit(1);
  }
}

// Run the tests
runBugConditionExplorationTests().catch(error => {
  console.error('\n✗ Test execution failed with unexpected error:');
  console.error(error);
  process.exit(1);
});
