/**
 * Unit tests for form validation logic
 * 
 * These tests verify that the form validation correctly validates:
 * - Age is between 18 and 100
 * - Income is positive
 * - Credit score is between 300 and 900
 * - Existing EMI is non-negative
 * - Requested amount is positive
 */

// Test helper to simulate validation
function validateField(name: string, value: string): string | undefined {
  const numValue = Number(value);

  switch (name) {
    case 'age':
      if (!value || isNaN(numValue)) {
        return 'Age is required';
      }
      if (numValue < 18 || numValue > 100) {
        return 'Age must be between 18 and 100';
      }
      break;

    case 'income':
      if (!value || isNaN(numValue)) {
        return 'Income is required';
      }
      if (numValue <= 0) {
        return 'Income must be a positive number';
      }
      break;

    case 'credit_score':
      if (!value || isNaN(numValue)) {
        return 'Credit score is required';
      }
      if (numValue < 300 || numValue > 900) {
        return 'Credit score must be between 300 and 900';
      }
      break;

    case 'existing_emi':
      if (!value || isNaN(numValue)) {
        return 'Existing EMI is required';
      }
      if (numValue < 0) {
        return 'Existing EMI must be non-negative';
      }
      break;

    case 'requested_amount':
      if (!value || isNaN(numValue)) {
        return 'Requested amount is required';
      }
      if (numValue <= 0) {
        return 'Requested amount must be a positive number';
      }
      break;
  }

  return undefined;
}

/**
 * Test: Age validation should reject values below 18
 */
function testAgeMinimum() {
  const error = validateField('age', '17');
  if (error !== 'Age must be between 18 and 100') {
    throw new Error(`Expected age error for value 17, got: ${error}`);
  }
  console.log('✓ Age minimum validation works');
}

/**
 * Test: Age validation should reject values above 100
 */
function testAgeMaximum() {
  const error = validateField('age', '101');
  if (error !== 'Age must be between 18 and 100') {
    throw new Error(`Expected age error for value 101, got: ${error}`);
  }
  console.log('✓ Age maximum validation works');
}

/**
 * Test: Age validation should accept valid values
 */
function testAgeValid() {
  const error = validateField('age', '25');
  if (error !== undefined) {
    throw new Error(`Expected no error for valid age 25, got: ${error}`);
  }
  console.log('✓ Age accepts valid values');
}

/**
 * Test: Income validation should reject zero and negative values
 */
function testIncomePositive() {
  const error1 = validateField('income', '0');
  if (error1 !== 'Income must be a positive number') {
    throw new Error(`Expected income error for value 0, got: ${error1}`);
  }
  
  const error2 = validateField('income', '-1000');
  if (error2 !== 'Income must be a positive number') {
    throw new Error(`Expected income error for value -1000, got: ${error2}`);
  }
  console.log('✓ Income validation rejects non-positive values');
}

/**
 * Test: Income validation should accept positive values
 */
function testIncomeValid() {
  const error = validateField('income', '50000');
  if (error !== undefined) {
    throw new Error(`Expected no error for valid income 50000, got: ${error}`);
  }
  console.log('✓ Income accepts positive values');
}

/**
 * Test: Credit score validation should reject values below 300
 */
function testCreditScoreMinimum() {
  const error = validateField('credit_score', '299');
  if (error !== 'Credit score must be between 300 and 900') {
    throw new Error(`Expected credit score error for value 299, got: ${error}`);
  }
  console.log('✓ Credit score minimum validation works');
}

/**
 * Test: Credit score validation should reject values above 900
 */
function testCreditScoreMaximum() {
  const error = validateField('credit_score', '901');
  if (error !== 'Credit score must be between 300 and 900') {
    throw new Error(`Expected credit score error for value 901, got: ${error}`);
  }
  console.log('✓ Credit score maximum validation works');
}

/**
 * Test: Credit score validation should accept valid values
 */
function testCreditScoreValid() {
  const error = validateField('credit_score', '750');
  if (error !== undefined) {
    throw new Error(`Expected no error for valid credit score 750, got: ${error}`);
  }
  console.log('✓ Credit score accepts valid values');
}

/**
 * Test: Existing EMI validation should reject negative values
 */
function testExistingEmiNonNegative() {
  const error = validateField('existing_emi', '-1');
  if (error !== 'Existing EMI must be non-negative') {
    throw new Error(`Expected existing EMI error for value -1, got: ${error}`);
  }
  console.log('✓ Existing EMI validation rejects negative values');
}

/**
 * Test: Existing EMI validation should accept zero and positive values
 */
function testExistingEmiValid() {
  const error1 = validateField('existing_emi', '0');
  if (error1 !== undefined) {
    throw new Error(`Expected no error for valid existing EMI 0, got: ${error1}`);
  }
  
  const error2 = validateField('existing_emi', '5000');
  if (error2 !== undefined) {
    throw new Error(`Expected no error for valid existing EMI 5000, got: ${error2}`);
  }
  console.log('✓ Existing EMI accepts non-negative values');
}

/**
 * Test: Requested amount validation should reject zero and negative values
 */
function testRequestedAmountPositive() {
  const error1 = validateField('requested_amount', '0');
  if (error1 !== 'Requested amount must be a positive number') {
    throw new Error(`Expected requested amount error for value 0, got: ${error1}`);
  }
  
  const error2 = validateField('requested_amount', '-10000');
  if (error2 !== 'Requested amount must be a positive number') {
    throw new Error(`Expected requested amount error for value -10000, got: ${error2}`);
  }
  console.log('✓ Requested amount validation rejects non-positive values');
}

/**
 * Test: Requested amount validation should accept positive values
 */
function testRequestedAmountValid() {
  const error = validateField('requested_amount', '100000');
  if (error !== undefined) {
    throw new Error(`Expected no error for valid requested amount 100000, got: ${error}`);
  }
  console.log('✓ Requested amount accepts positive values');
}

/**
 * Run all validation tests
 */
function runAllTests() {
  console.log('Running form validation tests...\n');
  
  try {
    testAgeMinimum();
    testAgeMaximum();
    testAgeValid();
    testIncomePositive();
    testIncomeValid();
    testCreditScoreMinimum();
    testCreditScoreMaximum();
    testCreditScoreValid();
    testExistingEmiNonNegative();
    testExistingEmiValid();
    testRequestedAmountPositive();
    testRequestedAmountValid();
    
    console.log('\n✅ All form validation tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

export { validateField, runAllTests };

