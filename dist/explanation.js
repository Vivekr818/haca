"use strict";
/**
 * Explanation generation module for personalized user recommendations
 * Provides interfaces and functions for creating AI-style explanations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExplanation = generateExplanation;
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
function generateExplanation(input) {
    var userData = input.userData, result = input.result;
    // Format income in INR currency format
    var formattedIncome = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(userData.income);
    // Build explanation parts
    var parts = [];
    // Part 1: Risk assessment with income and credit score
    parts.push("Based on your monthly income of ".concat(formattedIncome, " and credit score of ").concat(userData.credit_score, ", ") +
        "your risk category is ".concat(result.risk_level, "."));
    // Part 2: Loan recommendations
    if (result.recommended_loans.length > 0) {
        var loanNames = result.recommended_loans
            .map(function (loan) { return loan.loan_name; })
            .join(', ');
        parts.push("You qualify for ".concat(loanNames, "."));
    }
    else {
        parts.push('Unfortunately, you do not currently qualify for any loan products.');
    }
    // Part 3: Policy recommendations (only if policies exist)
    if (result.recommended_policies.length > 0) {
        var policyNames = result.recommended_policies
            .map(function (policy) { return policy.policy_name; })
            .join(', ');
        parts.push("Additionally, you are eligible for sector-specific schemes such as ".concat(policyNames, "."));
    }
    return parts.join(' ');
}
