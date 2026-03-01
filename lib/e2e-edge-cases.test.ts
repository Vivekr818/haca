/**
 * Edge Case Tests for AI-Powered Loan & Policy Recommendation System
 * 
 * Task 13.2: Test edge cases
 * 
 * This test file validates that the application handles edge cases gracefully:
 * - Users who qualify for no loans
 * - Users who have no matching policies
 * - Users with maximum values (credit score 900, high income)
 * - Users with minimum values (credit score 300, low income)
 */

import { evaluateUserProfile, type UserData } from './evaluation';
import { generateExplanation } from './explanation';
import { fetchLoanProducts, fetchLoanPolicies } from './db-utils';

/**
 * Test result tracking
 */
let passedTests = 0;
let failedTests = 0;

/**
 * Helper function to print test section headers
 */
function printTestHeader(testNumber: number, testName: string) {
  console.log('\n' + '='.repeat(60));
  console.log(`TEST ${testNumber}: ${testName}`);
  console.log('='.repeat(60));
}

/**
 * Helper function to print test results
 */
function printTestResult(testName: string, passed: boolean, message?: string) {
  if (passed) {
    console.log(`✅ ${testName} PASSED`);
    passedTests++;
  } else {
    console.error(`❌ ${testName} FAILED: ${message}`);
    failedTests++;
  }
}

/**
 * Edge Case 1: User who qualifies for no loans
 * 
 * This user has:
 * - Very low credit score (350)
 * - Low income (₹15,000/month)
 * - High DTI ratio (existing EMI ₹10,000 = 66.7% DTI)
 * 
 * Expected: No loans recommended, but may have policies if sector matches
 */
async function testNoLoansQualified() {
  printTestHeader(1, 'User Who Qualifies for No Loans');
  
  const userData: UserData = {
    user_name: 'David Wilson',
    age: 25,
    income: 15000,
    credit_score: 350,
    employment_type: 'Self-Employed',
    sector: 'MSME',
    existing_emi: 10000,
    requested_amount: 100000
  };

  try {
    console.log('\n📝 Testing user with very low credit score and high DTI ratio');
    console.log(`  → Income: ₹${userData.income.toLocaleString('en-IN')}`);
    console.log(`  → Credit Score: ${userData.credit_score}`);
    console.log(`  → Existing EMI: ₹${userData.existing_emi.toLocaleString('en-IN')}`);
    console.log(`  → DTI Ratio: ${((userData.existing_emi / userData.income) * 100).toFixed(1)}%`);

    // Fetch data
    const loanProducts = await fetchLoanProducts();
    const policies = await fetchLoanPolicies();

    // Evaluate profile
    const result = evaluateUserProfile(userData, loanProducts, policies);

    // Verify risk level is High
    if (result.risk_level !== 'High') {
      throw new Error(`Expected risk level 'High', got '${result.risk_level}'`);
    }
    console.log(`  ✓ Risk level correctly assigned: ${result.risk_level}`);

    // Verify no loans recommended
    if (result.recommended_loans.length !== 0) {
      throw new Error(`Expected 0 loans, got ${result.recommended_loans.length}`);
    }
    console.log(`  ✓ No loans recommended (as expected)`);

    // Generate explanation
    const explanation = generateExplanation({ userData, result });

    // Verify explanation mentions no qualification
    if (!explanation.includes('do not currently qualify')) {
      throw new Error('Explanation should mention user does not qualify for loans');
    }
    console.log(`  ✓ Explanation correctly states no loan qualification`);

    // Verify explanation is non-empty and contains required fields
    if (!explanation || explanation.length === 0) {
      throw new Error('Explanation should not be empty');
    }
    if (!explanation.includes(userData.credit_score.toString())) {
      throw new Error('Explanation should include credit score');
    }
    if (!explanation.includes(result.risk_level)) {
      throw new Error('Explanation should include risk level');
    }
    console.log(`  ✓ Explanation contains all required information`);

    printTestResult('No Loans Qualified', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('No Loans Qualified', false, message);
  }
}

/**
 * Edge Case 2: User who has no matching policies
 * 
 * This user has:
 * - Good credit score (750)
 * - Good income (₹60,000/month)
 * - Sector with no policies OR doesn't meet policy requirements
 * 
 * We'll use a sector that exists but with income/credit requirements not met
 * by adjusting the user profile to not match any policy criteria
 */
async function testNoMatchingPolicies() {
  printTestHeader(2, 'User Who Has No Matching Policies');
  
  const userData: UserData = {
    user_name: 'Emma Thompson',
    age: 30,
    income: 25000,
    credit_score: 550,
    employment_type: 'Salaried',
    sector: 'Education',
    existing_emi: 5000,
    requested_amount: 200000
  };

  try {
    console.log('\n📝 Testing user with sector but not meeting policy requirements');
    console.log(`  → Income: ₹${userData.income.toLocaleString('en-IN')}`);
    console.log(`  → Credit Score: ${userData.credit_score}`);
    console.log(`  → Sector: ${userData.sector}`);

    // Fetch data
    const loanProducts = await fetchLoanProducts();
    const policies = await fetchLoanPolicies();

    // Evaluate profile
    const result = evaluateUserProfile(userData, loanProducts, policies);

    // Verify no policies recommended
    if (result.recommended_policies.length !== 0) {
      throw new Error(`Expected 0 policies, got ${result.recommended_policies.length}`);
    }
    console.log(`  ✓ No policies recommended (as expected)`);

    // Generate explanation
    const explanation = generateExplanation({ userData, result });

    // Verify explanation doesn't mention policies
    if (explanation.includes('eligible for sector-specific schemes')) {
      throw new Error('Explanation should not mention policies when none are available');
    }
    console.log(`  ✓ Explanation correctly omits policy section`);

    // Verify explanation still contains required fields
    if (!explanation.includes(userData.credit_score.toString())) {
      throw new Error('Explanation should include credit score');
    }
    if (!explanation.includes(result.risk_level)) {
      throw new Error('Explanation should include risk level');
    }
    console.log(`  ✓ Explanation contains all required information`);

    printTestResult('No Matching Policies', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('No Matching Policies', false, message);
  }
}

/**
 * Edge Case 3: User with maximum values
 * 
 * This user has:
 * - Maximum credit score (900)
 * - Very high income (₹500,000/month)
 * - No existing EMI (0% DTI)
 * 
 * Expected: Should qualify for all loans and policies, with maximum suitability scores
 */
async function testMaximumValues() {
  printTestHeader(3, 'User With Maximum Values');
  
  const userData: UserData = {
    user_name: 'Frank Richards',
    age: 45,
    income: 500000,
    credit_score: 900,
    employment_type: 'Salaried',
    sector: 'Housing',
    existing_emi: 0,
    requested_amount: 5000000
  };

  try {
    console.log('\n📝 Testing user with maximum credit score and very high income');
    console.log(`  → Income: ₹${userData.income.toLocaleString('en-IN')}`);
    console.log(`  → Credit Score: ${userData.credit_score}`);
    console.log(`  → Existing EMI: ₹${userData.existing_emi.toLocaleString('en-IN')}`);
    console.log(`  → DTI Ratio: ${((userData.existing_emi / userData.income) * 100).toFixed(1)}%`);

    // Fetch data
    const loanProducts = await fetchLoanProducts();
    const policies = await fetchLoanPolicies();

    // Evaluate profile
    const result = evaluateUserProfile(userData, loanProducts, policies);

    // Verify risk level is Low
    if (result.risk_level !== 'Low') {
      throw new Error(`Expected risk level 'Low', got '${result.risk_level}'`);
    }
    console.log(`  ✓ Risk level correctly assigned: ${result.risk_level}`);

    // Verify loans are recommended (should qualify for multiple)
    if (result.recommended_loans.length === 0) {
      throw new Error('Expected at least 1 loan recommendation');
    }
    console.log(`  ✓ ${result.recommended_loans.length} loan(s) recommended`);

    // Verify suitability scores are high (should be close to 100)
    const avgSuitabilityScore = result.recommended_loans.reduce(
      (sum, loan) => sum + loan.suitability_score, 0
    ) / result.recommended_loans.length;
    
    if (avgSuitabilityScore < 80) {
      throw new Error(`Expected high suitability scores (>80), got average ${avgSuitabilityScore.toFixed(1)}`);
    }
    console.log(`  ✓ High suitability scores (average: ${avgSuitabilityScore.toFixed(1)})`);

    // Verify all scores are within bounds (0-100)
    for (const loan of result.recommended_loans) {
      if (loan.suitability_score < 0 || loan.suitability_score > 100) {
        throw new Error(`Suitability score out of bounds: ${loan.suitability_score}`);
      }
    }
    console.log(`  ✓ All suitability scores within bounds (0-100)`);

    // Verify policies are recommended if sector matches
    console.log(`  ✓ ${result.recommended_policies.length} policy/policies recommended`);

    // Verify all policy scores are within bounds (0-100)
    for (const policy of result.recommended_policies) {
      if (policy.relevance_score < 0 || policy.relevance_score > 100) {
        throw new Error(`Relevance score out of bounds: ${policy.relevance_score}`);
      }
    }
    console.log(`  ✓ All relevance scores within bounds (0-100)`);

    // Generate explanation
    const explanation = generateExplanation({ userData, result });

    // Verify explanation is complete
    if (!explanation.includes(userData.credit_score.toString())) {
      throw new Error('Explanation should include credit score');
    }
    if (!explanation.includes(result.risk_level)) {
      throw new Error('Explanation should include risk level');
    }
    if (result.recommended_loans.length > 0 && !explanation.includes('qualify for')) {
      throw new Error('Explanation should mention loan qualification');
    }
    console.log(`  ✓ Explanation contains all required information`);

    printTestResult('Maximum Values', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('Maximum Values', false, message);
  }
}

/**
 * Edge Case 4: User with minimum values
 * 
 * This user has:
 * - Minimum credit score (300)
 * - Very low income (₹10,000/month)
 * - High existing EMI (₹8,000 = 80% DTI)
 * 
 * Expected: High risk, likely no loans, possibly no policies
 */
async function testMinimumValues() {
  printTestHeader(4, 'User With Minimum Values');
  
  const userData: UserData = {
    user_name: 'Grace Martinez',
    age: 22,
    income: 10000,
    credit_score: 300,
    employment_type: 'Self-Employed',
    sector: 'Agriculture',
    existing_emi: 8000,
    requested_amount: 50000
  };

  try {
    console.log('\n📝 Testing user with minimum credit score and very low income');
    console.log(`  → Income: ₹${userData.income.toLocaleString('en-IN')}`);
    console.log(`  → Credit Score: ${userData.credit_score}`);
    console.log(`  → Existing EMI: ₹${userData.existing_emi.toLocaleString('en-IN')}`);
    console.log(`  → DTI Ratio: ${((userData.existing_emi / userData.income) * 100).toFixed(1)}%`);

    // Fetch data
    const loanProducts = await fetchLoanProducts();
    const policies = await fetchLoanPolicies();

    // Evaluate profile
    const result = evaluateUserProfile(userData, loanProducts, policies);

    // Verify risk level is High
    if (result.risk_level !== 'High') {
      throw new Error(`Expected risk level 'High', got '${result.risk_level}'`);
    }
    console.log(`  ✓ Risk level correctly assigned: ${result.risk_level}`);

    // Verify system handles minimum values without crashing
    console.log(`  ✓ System handled minimum values without errors`);
    console.log(`  ✓ ${result.recommended_loans.length} loan(s) recommended`);
    console.log(`  ✓ ${result.recommended_policies.length} policy/policies recommended`);

    // Verify all scores are within bounds even with minimum values
    for (const loan of result.recommended_loans) {
      if (loan.suitability_score < 0 || loan.suitability_score > 100) {
        throw new Error(`Suitability score out of bounds: ${loan.suitability_score}`);
      }
    }
    console.log(`  ✓ All suitability scores within bounds (0-100)`);

    for (const policy of result.recommended_policies) {
      if (policy.relevance_score < 0 || policy.relevance_score > 100) {
        throw new Error(`Relevance score out of bounds: ${policy.relevance_score}`);
      }
    }
    console.log(`  ✓ All relevance scores within bounds (0-100)`);

    // Generate explanation
    const explanation = generateExplanation({ userData, result });

    // Verify explanation handles minimum values gracefully
    if (!explanation || explanation.length === 0) {
      throw new Error('Explanation should not be empty');
    }
    if (!explanation.includes(userData.credit_score.toString())) {
      throw new Error('Explanation should include credit score');
    }
    if (!explanation.includes(result.risk_level)) {
      throw new Error('Explanation should include risk level');
    }
    console.log(`  ✓ Explanation generated successfully with minimum values`);

    printTestResult('Minimum Values', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('Minimum Values', false, message);
  }
}

/**
 * Main test runner
 */
async function runEdgeCaseTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Starting Edge Case Tests');
  console.log('='.repeat(60));

  // Run all edge case tests
  await testNoLoansQualified();
  await testNoMatchingPolicies();
  await testMaximumValues();
  await testMinimumValues();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${passedTests + failedTests}`);

  if (failedTests === 0) {
    console.log('\n🎉 All edge case tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Check if environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\n❌ Error: Environment variables not configured');
  console.error('\nPlease set up your .env.local file with:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.error('\nSee lib/E2E_TEST_README.md for setup instructions.');
  process.exit(1);
}

// Run tests
runEdgeCaseTests().catch(error => {
  console.error('\n💥 Fatal error running tests:', error);
  process.exit(1);
});
