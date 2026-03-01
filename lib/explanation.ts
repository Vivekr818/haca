/**
 * Explanation generation module for personalized user recommendations
 * Provides interfaces and functions for creating AI-style explanations
 */

import { UserData, EvaluationResult } from './evaluation'

/**
 * Input data for generating personalized explanations
 * Combines user profile data with evaluation results
 */
export interface ExplanationInput {
  userData: UserData
  result: EvaluationResult
}

/**
 * Generate personalized AI-style explanation based on user data and evaluation results
 * 
 * @param input - Contains user data and evaluation result
 * @returns Personalized explanation string with formatted financial data
 * 
 * @example
 * const explanation = generateExplanation({
 *   userData: { income: 50000, credit_score: 720, ... },
 *   result: { risk_level: 'Low', recommended_loans: [...], recommended_policies: [...] }
 * })
 * // Returns: "Based on your monthly income of ₹50,000 and credit score of 720, your risk category is Low. You qualify for Personal Loan, Home Loan. Additionally, you are eligible for sector-specific schemes such as MSME Credit Guarantee Scheme."
 */
export function generateExplanation(input: ExplanationInput): string {
  const { userData, result } = input

  // Format income in INR currency format
  const formattedIncome = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(userData.income)

  // Build explanation parts
  const parts: string[] = []

  // Part 1: Risk assessment with income and credit score
  parts.push(
    `Based on your monthly income of ${formattedIncome} and credit score of ${userData.credit_score}, ` +
    `your risk category is ${result.risk_level}.`
  )

  // Part 2: Loan recommendations
  if (result.recommended_loans.length > 0) {
    const loanNames = result.recommended_loans
      .map(loan => loan.loan_name)
      .join(', ')
    parts.push(`You qualify for ${loanNames}.`)
  } else {
    parts.push('Unfortunately, you do not currently qualify for any loan products.')
  }

  // Part 3: Policy recommendations (only if policies exist)
  if (result.recommended_policies.length > 0) {
    const policyNames = result.recommended_policies
      .map(policy => policy.policy_name)
      .join(', ')
    parts.push(
      `Additionally, you are eligible for sector-specific schemes such as ${policyNames}.`
    )
  }

  return parts.join(' ')
}
