/**
 * Unit Tests for Edge Cases (No Database Required)
 * 
 * Task 13.2: Test edge cases
 * 
 * These tests validate edge case handling using mock data,
 * without requiring a database connection.
 */

import { 
  evaluateUserProfile, 
  type UserData,
  assignRiskLevel,
  calculateDTI
} from './evaluation';
import { generateExplanation } from './explanation';

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
 * Mock loan products for testing
 */
const mockLoanProducts = [
  {
    loan_name: 'Premium Personal Loan',
    min_income: 50000,
    min_credit_score: 700,
    max_dti_ratio: 0.4,
    interest_rate: 10.5,
    max_amount: 1000000,
    tenure_months: 60
  },
  {
    loan_name: 'Standard Personal Loan',
    min_income: 30000,
    min_credit_score: 650,
    max_dti_ratio: 0.5,
    interest_rate: 12.5,
    max_amount: 500000,
    tenure_months: 48
  },
  {
    loan_name: 'Basic Personal Loan',
    min_income: 20000,
    min_credit_score: 600,
    max_dti_ratio: 0.45,
    interest_rate: 14.5,
    max_amount: 300000,
    tenure_months: 36
  }
];

/**
 * Mock loan policies for testing
 */
const mockPolicies = [
  {
    policy_name: 'MSME Credit Guarantee Scheme',
    sector: 'MSME',
    min_income: 20000,
    min_credit_score: 600,
    max_amount: 500000,
    description: 'Credit guarantee for MSME sector',
    benefits: 'Lower interest rates and collateral-free loans'
  },
  {
    policy_name: 'Education Loan Subsidy',
    sector: 'Education',
    min_income: 25000,
    min_credit_score: 650,
    max_amount: 1000000,
    description: 'Subsidy for education loans',
    benefits: 'Interest subsidy during study period'
  },
  {
    policy_name: 'Housing Loan Scheme',
    sector: 'Housing',
    min_income: 30000,
    min_credit_score: 700,
    max_amount: 2000000,
    description: 'Affordable housing loan scheme',
    benefits: 'Reduced interest rates for first-time home buyers'
  }
];

/**
 * Test 1: User who qualifies for no loans
 */
function testNoLoansQualified() {
  printTestHeader(1, 'User Who Qualifies for No Loans (Unit Test)');
  
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
    
    const dti = calculateDTI(userData.existing_emi, userData.income);
    console.log(`  → DTI Ratio: ${(dti * 100).toFixed(1)}%`);

    // Evaluate profile
    const result = evaluateUserProfile(userData, mockLoanProducts, mockPolicies);

    // Verify risk level is High
    if (result.risk_level !== 'High') {
      throw new Error(`Expected risk level 'High', got '${result.risk_level}'`);
    }
    console.log(`  ✓ Risk level correctly assigned: ${result.risk_level}`);

    // Verify no loans recommended (high DTI + low credit score)
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

    // Verify explanation contains required fields
    if (!explanation.includes(userData.credit_score.toString())) {
      throw new Error('Explanation should include credit score');
    }
    if (!explanation.includes(result.risk_level)) {
      throw new Error('Explanation should include risk level');
    }
    console.log(`  ✓ Explanation contains all required information`);

    // Verify application handles this gracefully (no crashes)
    console.log(`  ✓ System handled edge case without errors`);

    printTestResult('No Loans Qualified', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('No Loans Qualified', false, message);
  }
}

/**
 * Test 2: User who has no matching policies
 */
function testNoMatchingPolicies() {
  printTestHeader(2, 'User Who Has No Matching Policies (Unit Test)');
  
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

    // Evaluate profile
    const result = evaluateUserProfile(userData, mockLoanProducts, mockPolicies);

    // Verify no policies recommended (credit score too low for Education policy)
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

    // Verify system handles this gracefully
    console.log(`  ✓ System handled edge case without errors`);

    printTestResult('No Matching Policies', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('No Matching Policies', false, message);
  }
}

/**
 * Test 3: User with maximum values
 */
function testMaximumValues() {
  printTestHeader(3, 'User With Maximum Values (Unit Test)');
  
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
    
    const dti = calculateDTI(userData.existing_emi, userData.income);
    console.log(`  → DTI Ratio: ${(dti * 100).toFixed(1)}%`);

    // Evaluate profile
    const result = evaluateUserProfile(userData, mockLoanProducts, mockPolicies);

    // Verify risk level is Low
    if (result.risk_level !== 'Low') {
      throw new Error(`Expected risk level 'Low', got '${result.risk_level}'`);
    }
    console.log(`  ✓ Risk level correctly assigned: ${result.risk_level}`);

    // Verify loans are recommended (should qualify for all)
    if (result.recommended_loans.length === 0) {
      throw new Error('Expected at least 1 loan recommendation');
    }
    console.log(`  ✓ ${result.recommended_loans.length} loan(s) recommended`);

    // Verify suitability scores are high
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
      if (!Number.isInteger(loan.suitability_score)) {
        throw new Error(`Suitability score should be integer: ${loan.suitability_score}`);
      }
    }
    console.log(`  ✓ All suitability scores within bounds (0-100) and are integers`);

    // Verify policies are recommended (Housing sector)
    if (result.recommended_policies.length === 0) {
      throw new Error('Expected at least 1 policy recommendation for Housing sector');
    }
    console.log(`  ✓ ${result.recommended_policies.length} policy/policies recommended`);

    // Verify all policy scores are within bounds (0-100)
    for (const policy of result.recommended_policies) {
      if (policy.relevance_score < 0 || policy.relevance_score > 100) {
        throw new Error(`Relevance score out of bounds: ${policy.relevance_score}`);
      }
      if (!Number.isInteger(policy.relevance_score)) {
        throw new Error(`Relevance score should be integer: ${policy.relevance_score}`);
      }
    }
    console.log(`  ✓ All relevance scores within bounds (0-100) and are integers`);

    // Generate explanation
    const explanation = generateExplanation({ userData, result });

    // Verify explanation is complete
    if (!explanation.includes(userData.credit_score.toString())) {
      throw new Error('Explanation should include credit score');
    }
    if (!explanation.includes(result.risk_level)) {
      throw new Error('Explanation should include risk level');
    }
    if (!explanation.includes('qualify for')) {
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
 * Test 4: User with minimum values
 */
function testMinimumValues() {
  printTestHeader(4, 'User With Minimum Values (Unit Test)');
  
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
    
    const dti = calculateDTI(userData.existing_emi, userData.income);
    console.log(`  → DTI Ratio: ${(dti * 100).toFixed(1)}%`);

    // Evaluate profile
    const result = evaluateUserProfile(userData, mockLoanProducts, mockPolicies);

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
      if (!Number.isInteger(loan.suitability_score)) {
        throw new Error(`Suitability score should be integer: ${loan.suitability_score}`);
      }
    }
    console.log(`  ✓ All suitability scores within bounds (0-100) and are integers`);

    for (const policy of result.recommended_policies) {
      if (policy.relevance_score < 0 || policy.relevance_score > 100) {
        throw new Error(`Relevance score out of bounds: ${policy.relevance_score}`);
      }
      if (!Number.isInteger(policy.relevance_score)) {
        throw new Error(`Relevance score should be integer: ${policy.relevance_score}`);
      }
    }
    console.log(`  ✓ All relevance scores within bounds (0-100) and are integers`);

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

    // Verify DTI calculation doesn't cause division issues
    if (!isFinite(dti) || isNaN(dti)) {
      throw new Error('DTI calculation should produce valid number');
    }
    console.log(`  ✓ DTI calculation handled correctly`);

    printTestResult('Minimum Values', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('Minimum Values', false, message);
  }
}

/**
 * Test 5: Boundary value - Credit score exactly 600
 */
function testBoundaryValue600() {
  printTestHeader(5, 'Boundary Value - Credit Score 600 (Unit Test)');
  
  try {
    console.log('\n📝 Testing boundary value: credit score = 600');
    
    const riskLevel = assignRiskLevel(600);
    
    if (riskLevel !== 'Medium') {
      throw new Error(`Expected 'Medium' for credit score 600, got '${riskLevel}'`);
    }
    console.log(`  ✓ Credit score 600 correctly assigned to 'Medium' risk`);

    printTestResult('Boundary Value 600', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('Boundary Value 600', false, message);
  }
}

/**
 * Test 6: Boundary value - Credit score exactly 700
 */
function testBoundaryValue700() {
  printTestHeader(6, 'Boundary Value - Credit Score 700 (Unit Test)');
  
  try {
    console.log('\n📝 Testing boundary value: credit score = 700');
    
    const riskLevel = assignRiskLevel(700);
    
    if (riskLevel !== 'Medium') {
      throw new Error(`Expected 'Medium' for credit score 700, got '${riskLevel}'`);
    }
    console.log(`  ✓ Credit score 700 correctly assigned to 'Medium' risk`);

    printTestResult('Boundary Value 700', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('Boundary Value 700', false, message);
  }
}

/**
 * Test 7: Zero DTI ratio
 */
function testZeroDTI() {
  printTestHeader(7, 'Zero DTI Ratio (Unit Test)');
  
  const userData: UserData = {
    user_name: 'Henry Lee',
    age: 35,
    income: 100000,
    credit_score: 800,
    employment_type: 'Salaried',
    sector: 'MSME',
    existing_emi: 0,
    requested_amount: 500000
  };

  try {
    console.log('\n📝 Testing user with zero existing EMI (0% DTI)');
    console.log(`  → Income: ₹${userData.income.toLocaleString('en-IN')}`);
    console.log(`  → Existing EMI: ₹${userData.existing_emi.toLocaleString('en-IN')}`);
    
    const dti = calculateDTI(userData.existing_emi, userData.income);
    console.log(`  → DTI Ratio: ${(dti * 100).toFixed(1)}%`);

    if (dti !== 0) {
      throw new Error(`Expected DTI to be 0, got ${dti}`);
    }
    console.log(`  ✓ DTI correctly calculated as 0`);

    // Evaluate profile
    const result = evaluateUserProfile(userData, mockLoanProducts, mockPolicies);

    // Should qualify for all loans (0 DTI is best case)
    if (result.recommended_loans.length === 0) {
      throw new Error('Expected loan recommendations with 0 DTI');
    }
    console.log(`  ✓ ${result.recommended_loans.length} loan(s) recommended`);

    // Suitability scores should be high
    const avgScore = result.recommended_loans.reduce(
      (sum, loan) => sum + loan.suitability_score, 0
    ) / result.recommended_loans.length;
    
    console.log(`  ✓ Average suitability score: ${avgScore.toFixed(1)}`);

    printTestResult('Zero DTI Ratio', true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    printTestResult('Zero DTI Ratio', false, message);
  }
}

/**
 * Main test runner
 */
function runEdgeCaseUnitTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Starting Edge Case Unit Tests (No Database Required)');
  console.log('='.repeat(60));

  // Run all edge case tests
  testNoLoansQualified();
  testNoMatchingPolicies();
  testMaximumValues();
  testMinimumValues();
  testBoundaryValue600();
  testBoundaryValue700();
  testZeroDTI();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${passedTests + failedTests}`);

  if (failedTests === 0) {
    console.log('\n🎉 All edge case unit tests passed!');
    console.log('\n📝 Note: These are unit tests using mock data.');
    console.log('   For full integration tests with database, run:');
    console.log('   node run-edge-case-tests.js');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Run tests
runEdgeCaseUnitTests();
