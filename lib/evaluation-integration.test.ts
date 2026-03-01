/**
 * Integration test for evaluateUserProfile function
 * Tests the complete evaluation flow with all helper functions
 */

import { evaluateUserProfile, UserData } from './evaluation'

/**
 * Test: evaluateUserProfile should return complete evaluation result
 */
function testCompleteEvaluation() {
  // Sample user data
  const userData: UserData = {
    user_name: 'Test User',
    age: 30,
    income: 50000,
    credit_score: 750,
    employment_type: 'Salaried',
    sector: 'Education',
    existing_emi: 5000,
    requested_amount: 500000
  }

  // Sample loan products
  const loanProducts = [
    {
      loan_name: 'Personal Loan A',
      min_income: 30000,
      min_credit_score: 650,
      max_dti_ratio: 0.4,
      interest_rate: 10.5,
      max_amount: 1000000,
      tenure_months: 60
    },
    {
      loan_name: 'Personal Loan B',
      min_income: 40000,
      min_credit_score: 700,
      max_dti_ratio: 0.35,
      interest_rate: 9.5,
      max_amount: 1500000,
      tenure_months: 72
    },
    {
      loan_name: 'Personal Loan C',
      min_income: 60000,
      min_credit_score: 800,
      max_dti_ratio: 0.3,
      interest_rate: 8.5,
      max_amount: 2000000,
      tenure_months: 84
    }
  ]

  // Sample policies
  const policies = [
    {
      policy_name: 'Education Loan Scheme',
      sector: 'Education',
      min_income: 25000,
      min_credit_score: 600,
      max_amount: 1000000,
      description: 'Education sector scheme',
      benefits: 'Lower interest rates for education sector'
    },
    {
      policy_name: 'MSME Support Scheme',
      sector: 'MSME',
      min_income: 30000,
      min_credit_score: 650,
      max_amount: 500000,
      description: 'MSME sector scheme',
      benefits: 'Support for small businesses'
    },
    {
      policy_name: 'Advanced Education Scheme',
      sector: 'Education',
      min_income: 40000,
      min_credit_score: 700,
      max_amount: 2000000,
      description: 'Advanced education scheme',
      benefits: 'Premium benefits for higher education'
    }
  ]

  // Evaluate user profile
  const result = evaluateUserProfile(userData, loanProducts, policies)

  // Verify result structure
  if (!result.risk_level) {
    throw new Error('Result should have risk_level')
  }
  if (!Array.isArray(result.recommended_loans)) {
    throw new Error('Result should have recommended_loans array')
  }
  if (!Array.isArray(result.recommended_policies)) {
    throw new Error('Result should have recommended_policies array')
  }

  // Verify risk level (credit score 750 should be Low)
  if (result.risk_level !== 'Low') {
    throw new Error(`Expected risk level 'Low', got '${result.risk_level}'`)
  }

  // Verify loans are returned (user should qualify for at least 2 loans)
  if (result.recommended_loans.length === 0) {
    throw new Error('Expected at least one recommended loan')
  }

  // Verify loans are limited to 3
  if (result.recommended_loans.length > 3) {
    throw new Error(`Expected at most 3 loans, got ${result.recommended_loans.length}`)
  }

  // Verify policies are returned (user should qualify for Education sector policies)
  if (result.recommended_policies.length === 0) {
    throw new Error('Expected at least one recommended policy')
  }

  // Verify policies are limited to 3
  if (result.recommended_policies.length > 3) {
    throw new Error(`Expected at most 3 policies, got ${result.recommended_policies.length}`)
  }

  // Verify all policies match user sector
  for (const policy of result.recommended_policies) {
    if (policy.sector !== userData.sector) {
      throw new Error(`Expected policy sector '${userData.sector}', got '${policy.sector}'`)
    }
  }

  // Verify loans are sorted by suitability score
  for (let i = 0; i < result.recommended_loans.length - 1; i++) {
    if (result.recommended_loans[i].suitability_score < result.recommended_loans[i + 1].suitability_score) {
      throw new Error('Loans should be sorted by suitability_score in descending order')
    }
  }

  // Verify policies are sorted by relevance score
  for (let i = 0; i < result.recommended_policies.length - 1; i++) {
    if (result.recommended_policies[i].relevance_score < result.recommended_policies[i + 1].relevance_score) {
      throw new Error('Policies should be sorted by relevance_score in descending order')
    }
  }

  console.log('✓ Test passed: Complete evaluation works correctly')
  console.log(`  Risk Level: ${result.risk_level}`)
  console.log(`  Recommended Loans: ${result.recommended_loans.length}`)
  console.log(`  Recommended Policies: ${result.recommended_policies.length}`)
}

/**
 * Test: evaluateUserProfile with high risk user
 */
function testHighRiskUser() {
  const userData: UserData = {
    user_name: 'High Risk User',
    age: 25,
    income: 20000,
    credit_score: 550,
    employment_type: 'Salaried',
    sector: 'MSME',
    existing_emi: 8000,
    requested_amount: 100000
  }

  const loanProducts = [
    {
      loan_name: 'Basic Loan',
      min_income: 15000,
      min_credit_score: 500,
      max_dti_ratio: 0.5,
      interest_rate: 15.5,
      max_amount: 200000,
      tenure_months: 36
    }
  ]

  const policies = [
    {
      policy_name: 'MSME Support',
      sector: 'MSME',
      min_income: 15000,
      min_credit_score: 500,
      max_amount: 300000,
      description: 'MSME support',
      benefits: 'Support for small businesses'
    }
  ]

  const result = evaluateUserProfile(userData, loanProducts, policies)

  // Verify high risk level
  if (result.risk_level !== 'High') {
    throw new Error(`Expected risk level 'High', got '${result.risk_level}'`)
  }

  console.log('✓ Test passed: High risk user evaluation works correctly')
}

/**
 * Test: evaluateUserProfile with no eligible loans
 */
function testNoEligibleLoans() {
  const userData: UserData = {
    user_name: 'Low Income User',
    age: 28,
    income: 15000,
    credit_score: 450,
    employment_type: 'Self-Employed',
    sector: 'Agriculture',
    existing_emi: 5000,
    requested_amount: 50000
  }

  const loanProducts = [
    {
      loan_name: 'Premium Loan',
      min_income: 50000,
      min_credit_score: 700,
      max_dti_ratio: 0.3,
      interest_rate: 8.5,
      max_amount: 2000000,
      tenure_months: 84
    }
  ]

  const policies = [
    {
      policy_name: 'Agriculture Support',
      sector: 'Agriculture',
      min_income: 10000,
      min_credit_score: 400,
      max_amount: 100000,
      description: 'Agriculture support',
      benefits: 'Support for farmers'
    }
  ]

  const result = evaluateUserProfile(userData, loanProducts, policies)

  // Verify no loans are recommended
  if (result.recommended_loans.length !== 0) {
    throw new Error(`Expected 0 loans, got ${result.recommended_loans.length}`)
  }

  // Verify policies are still recommended
  if (result.recommended_policies.length === 0) {
    throw new Error('Expected at least one policy')
  }

  console.log('✓ Test passed: No eligible loans scenario works correctly')
}

/**
 * Run all tests
 */
function runTests() {
  console.log('Running integration tests for evaluateUserProfile...\n')

  try {
    testCompleteEvaluation()
    testHighRiskUser()
    testNoEligibleLoans()

    console.log('\n✅ All integration tests passed!')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
}
