/**
 * Unit tests for policy sorting and limiting functionality
 */

import { sortAndLimitPolicies, RelevantPolicy } from './evaluation'

/**
 * Test helper to create a policy with a given relevance score
 */
function createPolicy(name: string, score: number): RelevantPolicy {
  return {
    policy_name: name,
    sector: 'Education',
    benefits: 'Test benefits',
    relevance_score: score
  }
}

/**
 * Test: sortAndLimitPolicies should sort policies by relevance_score in descending order
 */
function testSortingOrder() {
  const policies: RelevantPolicy[] = [
    createPolicy('Policy A', 50),
    createPolicy('Policy B', 80),
    createPolicy('Policy C', 65)
  ]
  
  const result = sortAndLimitPolicies(policies)
  
  // Check that policies are sorted in descending order
  if (result[0].relevance_score !== 80) {
    throw new Error(`Expected first policy to have score 80, got ${result[0].relevance_score}`)
  }
  if (result[1].relevance_score !== 65) {
    throw new Error(`Expected second policy to have score 65, got ${result[1].relevance_score}`)
  }
  if (result[2].relevance_score !== 50) {
    throw new Error(`Expected third policy to have score 50, got ${result[2].relevance_score}`)
  }
  
  console.log('✓ Test passed: Policies are sorted in descending order')
}

/**
 * Test: sortAndLimitPolicies should limit results to top 3 policies
 */
function testLimitToThree() {
  const policies: RelevantPolicy[] = [
    createPolicy('Policy A', 50),
    createPolicy('Policy B', 80),
    createPolicy('Policy C', 65),
    createPolicy('Policy D', 90),
    createPolicy('Policy E', 70)
  ]
  
  const result = sortAndLimitPolicies(policies)
  
  // Check that only 3 policies are returned
  if (result.length !== 3) {
    throw new Error(`Expected 3 policies, got ${result.length}`)
  }
  
  // Check that the top 3 are returned
  if (result[0].relevance_score !== 90) {
    throw new Error(`Expected first policy to have score 90, got ${result[0].relevance_score}`)
  }
  if (result[1].relevance_score !== 80) {
    throw new Error(`Expected second policy to have score 80, got ${result[1].relevance_score}`)
  }
  if (result[2].relevance_score !== 70) {
    throw new Error(`Expected third policy to have score 70, got ${result[2].relevance_score}`)
  }
  
  console.log('✓ Test passed: Results are limited to top 3 policies')
}

/**
 * Test: sortAndLimitPolicies should handle fewer than 3 policies
 */
function testFewerThanThree() {
  const policies: RelevantPolicy[] = [
    createPolicy('Policy A', 50),
    createPolicy('Policy B', 80)
  ]
  
  const result = sortAndLimitPolicies(policies)
  
  // Check that all policies are returned when fewer than 3
  if (result.length !== 2) {
    throw new Error(`Expected 2 policies, got ${result.length}`)
  }
  
  // Check that they are sorted
  if (result[0].relevance_score !== 80) {
    throw new Error(`Expected first policy to have score 80, got ${result[0].relevance_score}`)
  }
  if (result[1].relevance_score !== 50) {
    throw new Error(`Expected second policy to have score 50, got ${result[1].relevance_score}`)
  }
  
  console.log('✓ Test passed: Handles fewer than 3 policies correctly')
}

/**
 * Test: sortAndLimitPolicies should handle empty array
 */
function testEmptyArray() {
  const policies: RelevantPolicy[] = []
  
  const result = sortAndLimitPolicies(policies)
  
  // Check that empty array is returned
  if (result.length !== 0) {
    throw new Error(`Expected 0 policies, got ${result.length}`)
  }
  
  console.log('✓ Test passed: Handles empty array correctly')
}

/**
 * Test: sortAndLimitPolicies should not mutate the original array
 */
function testNoMutation() {
  const policies: RelevantPolicy[] = [
    createPolicy('Policy A', 50),
    createPolicy('Policy B', 80),
    createPolicy('Policy C', 65)
  ]
  
  const originalOrder = policies.map(p => p.policy_name)
  
  sortAndLimitPolicies(policies)
  
  // Check that original array is unchanged
  if (policies[0].policy_name !== originalOrder[0]) {
    throw new Error('Original array was mutated')
  }
  if (policies[1].policy_name !== originalOrder[1]) {
    throw new Error('Original array was mutated')
  }
  if (policies[2].policy_name !== originalOrder[2]) {
    throw new Error('Original array was mutated')
  }
  
  console.log('✓ Test passed: Original array is not mutated')
}

/**
 * Run all tests
 */
function runTests() {
  console.log('Running tests for sortAndLimitPolicies...\n')
  
  try {
    testSortingOrder()
    testLimitToThree()
    testFewerThanThree()
    testEmptyArray()
    testNoMutation()
    
    console.log('\n✅ All tests passed!')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
}
