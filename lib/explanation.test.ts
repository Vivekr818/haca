/**
 * Unit tests for explanation generation
 */

import { generateExplanation } from './explanation'
import { UserData, EvaluationResult } from './evaluation'

const baseUserData: UserData = {
  user_name: 'Test User',
  age: 30,
  income: 50000,
  credit_score: 720,
  employment_type: 'Salaried',
  sector: 'MSME',
  existing_emi: 5000,
  requested_amount: 500000
}

/**
 * Test: generateExplanation should format income in INR currency format
 */
function testIncomeFormatting() {
  const result: EvaluationResult = {
    risk_level: 'Low',
    recommended_loans: [],
    recommended_policies: []
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (!explanation.includes('₹50,000')) {
    throw new Error('Expected explanation to contain formatted income ₹50,000')
  }
  
  console.log('✓ Income formatting test passed')
}

/**
 * Test: generateExplanation should include credit score
 */
function testCreditScoreInclusion() {
  const result: EvaluationResult = {
    risk_level: 'Low',
    recommended_loans: [],
    recommended_policies: []
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (!explanation.includes('720')) {
    throw new Error('Expected explanation to contain credit score 720')
  }
  
  console.log('✓ Credit score inclusion test passed')
}

/**
 * Test: generateExplanation should include risk level
 */
function testRiskLevelInclusion() {
  const result: EvaluationResult = {
    risk_level: 'Medium',
    recommended_loans: [],
    recommended_policies: []
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (!explanation.includes('Medium')) {
    throw new Error('Expected explanation to contain risk level Medium')
  }
  
  console.log('✓ Risk level inclusion test passed')
}

/**
 * Test: generateExplanation should list loan names when recommendations exist
 */
function testLoanNamesListing() {
  const result: EvaluationResult = {
    risk_level: 'Low',
    recommended_loans: [
      {
        loan_name: 'Personal Loan',
        interest_rate: 10.5,
        max_amount: 1000000,
        tenure_months: 60,
        suitability_score: 85
      },
      {
        loan_name: 'Home Loan',
        interest_rate: 8.5,
        max_amount: 5000000,
        tenure_months: 240,
        suitability_score: 80
      }
    ],
    recommended_policies: []
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (!explanation.includes('Personal Loan') || !explanation.includes('Home Loan')) {
    throw new Error('Expected explanation to contain loan names')
  }
  
  if (!explanation.includes('You qualify for')) {
    throw new Error('Expected explanation to contain "You qualify for"')
  }
  
  console.log('✓ Loan names listing test passed')
}

/**
 * Test: generateExplanation should state no qualification when no loans available
 */
function testNoLoansMessage() {
  const result: EvaluationResult = {
    risk_level: 'High',
    recommended_loans: [],
    recommended_policies: []
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (!explanation.includes('do not currently qualify for any loan products')) {
    throw new Error('Expected explanation to contain no qualification message')
  }
  
  console.log('✓ No loans message test passed')
}

/**
 * Test: generateExplanation should list policy names when recommendations exist
 */
function testPolicyNamesListing() {
  const result: EvaluationResult = {
    risk_level: 'Low',
    recommended_loans: [],
    recommended_policies: [
      {
        policy_name: 'MSME Credit Guarantee Scheme',
        sector: 'MSME',
        benefits: 'Collateral-free loans up to ₹2 crore',
        relevance_score: 90
      },
      {
        policy_name: 'Startup India Seed Fund',
        sector: 'MSME',
        benefits: 'Financial assistance for startups',
        relevance_score: 85
      }
    ]
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (!explanation.includes('MSME Credit Guarantee Scheme') || !explanation.includes('Startup India Seed Fund')) {
    throw new Error('Expected explanation to contain policy names')
  }
  
  if (!explanation.includes('sector-specific schemes')) {
    throw new Error('Expected explanation to contain "sector-specific schemes"')
  }
  
  console.log('✓ Policy names listing test passed')
}

/**
 * Test: generateExplanation should not mention policies when none are available
 */
function testNoPoliciesOmission() {
  const result: EvaluationResult = {
    risk_level: 'Low',
    recommended_loans: [
      {
        loan_name: 'Personal Loan',
        interest_rate: 10.5,
        max_amount: 1000000,
        tenure_months: 60,
        suitability_score: 85
      }
    ],
    recommended_policies: []
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (explanation.includes('sector-specific schemes') || explanation.includes('Additionally')) {
    throw new Error('Expected explanation to not mention policies when none are available')
  }
  
  console.log('✓ No policies omission test passed')
}

/**
 * Test: generateExplanation should return non-empty string
 */
function testNonEmptyString() {
  const result: EvaluationResult = {
    risk_level: 'Low',
    recommended_loans: [],
    recommended_policies: []
  }

  const explanation = generateExplanation({ userData: baseUserData, result })
  
  if (!explanation || explanation.length === 0) {
    throw new Error('Expected explanation to be non-empty')
  }
  
  console.log('✓ Non-empty string test passed')
}

/**
 * Test: generateExplanation should handle all risk levels correctly
 */
function testAllRiskLevels() {
  const riskLevels: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High']
  
  riskLevels.forEach(riskLevel => {
    const result: EvaluationResult = {
      risk_level: riskLevel,
      recommended_loans: [],
      recommended_policies: []
    }

    const explanation = generateExplanation({ userData: baseUserData, result })
    
    if (!explanation.includes(riskLevel)) {
      throw new Error(`Expected explanation to contain risk level ${riskLevel}`)
    }
  })
  
  console.log('✓ All risk levels test passed')
}

/**
 * Test: generateExplanation should format different income values correctly
 */
function testDifferentIncomeFormatting() {
  const incomeTestCases = [
    { income: 25000, expected: '₹25,000' },
    { income: 100000, expected: '₹1,00,000' },
    { income: 1000000, expected: '₹10,00,000' }
  ]

  incomeTestCases.forEach(({ income, expected }) => {
    const userData = { ...baseUserData, income }
    const result: EvaluationResult = {
      risk_level: 'Low',
      recommended_loans: [],
      recommended_policies: []
    }

    const explanation = generateExplanation({ userData, result })
    
    if (!explanation.includes(expected)) {
      throw new Error(`Expected explanation to contain formatted income ${expected}`)
    }
  })
  
  console.log('✓ Different income formatting test passed')
}

// Run all tests
console.log('\nRunning explanation generation tests...\n')

try {
  testIncomeFormatting()
  testCreditScoreInclusion()
  testRiskLevelInclusion()
  testLoanNamesListing()
  testNoLoansMessage()
  testPolicyNamesListing()
  testNoPoliciesOmission()
  testNonEmptyString()
  testAllRiskLevels()
  testDifferentIncomeFormatting()
  
  console.log('\n✅ All explanation generation tests passed!\n')
} catch (error) {
  console.error('\n❌ Test failed:', error)
  process.exit(1)
}
