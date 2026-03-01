"use strict";
/**
 * Core evaluation engine for loan and policy recommendations
 * Contains interfaces and types for user data and evaluation results
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDTI = calculateDTI;
exports.assignRiskLevel = assignRiskLevel;
exports.filterEligibleLoans = filterEligibleLoans;
exports.calculateSuitabilityScore = calculateSuitabilityScore;
exports.sortAndLimitLoans = sortAndLimitLoans;
exports.filterRelevantPolicies = filterRelevantPolicies;
exports.calculateRelevanceScore = calculateRelevanceScore;
exports.sortAndLimitPolicies = sortAndLimitPolicies;
exports.evaluateUserProfile = evaluateUserProfile;
/**
 * Calculate Debt-to-Income (DTI) ratio
 *
 * @param existing_emi - Monthly EMI payment
 * @param income - Monthly income
 * @returns DTI ratio as a decimal (e.g., 0.3 for 30%)
 *
 * Validates: Requirements 1.1
 */
function calculateDTI(existing_emi, income) {
    return existing_emi / income;
}
/**
 * Assign risk level based on credit score
 *
 * @param credit_score - User's credit score (300-900)
 * @returns Risk level: 'High' (<600), 'Medium' (600-700), 'Low' (>700)
 *
 * Validates: Requirements 1.2, 1.3, 1.4
 */
function assignRiskLevel(credit_score) {
    if (credit_score < 600) {
        return 'High';
    }
    else if (credit_score >= 600 && credit_score <= 700) {
        return 'Medium';
    }
    else {
        return 'Low';
    }
}
/**
 * Filter loan products based on user eligibility criteria
 *
 * A loan is eligible if:
 * - User's income meets or exceeds the loan's minimum income requirement
 * - User's credit score meets or exceeds the loan's minimum credit score requirement
 * - User's DTI ratio is less than or equal to the loan's maximum DTI ratio
 *
 * @param loanProducts - Array of loan products to filter
 * @param userData - User's financial profile
 * @param dti - User's calculated DTI ratio
 * @returns Array of eligible loan products
 *
 * Validates: Requirements 2.1, 2.2, 2.3
 */
function filterEligibleLoans(loanProducts, userData, dti) {
    return loanProducts.filter(function (product) {
        // Check income requirement (Requirement 2.1)
        var meetsIncomeRequirement = userData.income >= product.min_income;
        // Check credit score requirement (Requirement 2.2)
        var meetsCreditScoreRequirement = userData.credit_score >= product.min_credit_score;
        // Check DTI ratio requirement (Requirement 2.3)
        var meetsDTIRequirement = dti <= product.max_dti_ratio;
        // Loan is eligible only if all criteria are met
        return meetsIncomeRequirement && meetsCreditScoreRequirement && meetsDTIRequirement;
    });
}
/**
 * Calculate suitability score for a loan product based on user profile
 *
 * The score is calculated using a weighted formula:
 * - Credit score component: 40 points (credit_score / 900)
 * - Income component: 30 points (income ratio relative to minimum income, capped at 2x)
 * - DTI component: 30 points (inverse of DTI ratio relative to maximum DTI)
 *
 * @param userData - User's financial profile
 * @param product - Loan product to evaluate
 * @param dti - User's calculated DTI ratio
 * @returns Suitability score between 0 and 100 (rounded to integer)
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */
function calculateSuitabilityScore(userData, product, dti) {
    var score = 0;
    // Credit score component (40 points based on credit_score / 900)
    // Requirement 4.1
    var creditScoreRatio = userData.credit_score / 900;
    score += creditScoreRatio * 40;
    // Income component (30 points based on income ratio)
    // Requirement 4.2
    // Cap the income ratio at 2x to prevent excessive scores
    var incomeRatio = Math.min(userData.income / product.min_income, 2) / 2;
    score += incomeRatio * 30;
    // DTI component (30 points based on DTI ratio)
    // Requirement 4.3
    // Higher DTI is worse, so we use inverse: (1 - dti/max_dti)
    var dtiScore = (1 - (dti / product.max_dti_ratio)) * 30;
    score += Math.max(dtiScore, 0); // Ensure non-negative
    // Ensure score is capped at 100 and rounded to integer
    // Requirements 4.4, 4.5
    return Math.round(Math.min(score, 100));
}
/**
 * Sort eligible loans by suitability score and limit to top 3
 *
 * Takes an array of eligible loans with suitability scores and returns
 * the top 3 loans sorted by suitability_score in descending order.
 *
 * @param eligibleLoans - Array of eligible loans with suitability scores
 * @returns Top 3 loans sorted by suitability_score (descending), or fewer if less than 3 available
 *
 * Validates: Requirements 2.5, 2.6
 */
function sortAndLimitLoans(eligibleLoans) {
    // Sort by suitability_score in descending order (Requirement 2.5)
    var sortedLoans = __spreadArray([], eligibleLoans, true).sort(function (a, b) { return b.suitability_score - a.suitability_score; });
    // Limit to top 3 loans (Requirement 2.6)
    return sortedLoans.slice(0, 3);
}
/**
 * Filter loan policies based on user eligibility criteria
 *
 * A policy is relevant if:
 * - The policy's sector matches the user's sector
 * - User's income meets or exceeds the policy's minimum income requirement
 * - User's credit score meets or exceeds the policy's minimum credit score requirement
 *
 * @param policies - Array of loan policies to filter
 * @param userData - User's financial profile
 * @returns Array of relevant loan policies
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 */
function filterRelevantPolicies(policies, userData) {
    return policies.filter(function (policy) {
        // Check sector match (Requirement 3.1)
        var matchesSector = policy.sector === userData.sector;
        // Check income requirement (Requirement 3.2)
        var meetsIncomeRequirement = userData.income >= policy.min_income;
        // Check credit score requirement (Requirement 3.3)
        var meetsCreditScoreRequirement = userData.credit_score >= policy.min_credit_score;
        // Policy is relevant only if all criteria are met
        return matchesSector && meetsIncomeRequirement && meetsCreditScoreRequirement;
    });
}
/**
 * Calculate relevance score for a loan policy based on user profile
 *
 * The score is calculated using a weighted formula:
 * - Credit score component: 50 points (credit_score / 900)
 * - Income component: 50 points (income ratio relative to minimum income, capped at 2x)
 *
 * @param userData - User's financial profile
 * @param policy - Loan policy to evaluate
 * @returns Relevance score between 0 and 100 (rounded to integer)
 *
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 */
function calculateRelevanceScore(userData, policy) {
    var score = 0;
    // Credit score component (50 points based on credit_score / 900)
    // Requirement 5.1
    var creditScoreRatio = userData.credit_score / 900;
    score += creditScoreRatio * 50;
    // Income component (50 points based on income ratio)
    // Requirement 5.2
    // Cap the income ratio at 2x to prevent excessive scores
    var incomeRatio = Math.min(userData.income / policy.min_income, 2) / 2;
    score += incomeRatio * 50;
    // Ensure score is capped at 100 and rounded to integer
    // Requirements 5.3, 5.4
    return Math.round(Math.min(score, 100));
}
/**
 * Sort relevant policies by relevance score and limit to top 3
 *
 * Takes an array of relevant policies with relevance scores and returns
 * the top 3 policies sorted by relevance_score in descending order.
 *
 * @param relevantPolicies - Array of relevant policies with relevance scores
 * @returns Top 3 policies sorted by relevance_score (descending), or fewer if less than 3 available
 *
 * Validates: Requirements 3.5, 3.6
 */
function sortAndLimitPolicies(relevantPolicies) {
    // Sort by relevance_score in descending order (Requirement 3.5)
    var sortedPolicies = __spreadArray([], relevantPolicies, true).sort(function (a, b) { return b.relevance_score - a.relevance_score; });
    // Limit to top 3 policies (Requirement 3.6)
    return sortedPolicies.slice(0, 3);
}
/**
 * Main evaluation function that orchestrates all helper functions
 * to produce a complete evaluation result with risk assessment and recommendations
 *
 * This function:
 * 1. Calculates the user's DTI ratio
 * 2. Assigns a risk level based on credit score
 * 3. Filters eligible loans and calculates suitability scores
 * 4. Sorts and limits loans to top 3
 * 5. Filters relevant policies and calculates relevance scores
 * 6. Sorts and limits policies to top 3
 *
 * @param userData - User's financial profile
 * @param loanProducts - Array of available loan products
 * @param policies - Array of available loan policies
 * @returns Complete evaluation result with risk level and recommendations
 *
 * Validates: Requirements 1.5
 */
function evaluateUserProfile(userData, loanProducts, policies) {
    // Step 1: Calculate DTI ratio
    var dti = calculateDTI(userData.existing_emi, userData.income);
    // Step 2: Assign risk level based on credit score
    var riskLevel = assignRiskLevel(userData.credit_score);
    // Step 3: Filter eligible loans
    var eligibleLoans = filterEligibleLoans(loanProducts, userData, dti);
    // Step 4: Calculate suitability scores for eligible loans
    var loansWithScores = eligibleLoans.map(function (product) { return ({
        loan_name: product.loan_name,
        interest_rate: product.interest_rate,
        max_amount: product.max_amount,
        tenure_months: product.tenure_months,
        suitability_score: calculateSuitabilityScore(userData, product, dti)
    }); });
    // Step 5: Sort and limit loans to top 3
    var topLoans = sortAndLimitLoans(loansWithScores);
    // Step 6: Filter relevant policies
    var relevantPolicies = filterRelevantPolicies(policies, userData);
    // Step 7: Calculate relevance scores for relevant policies
    var policiesWithScores = relevantPolicies.map(function (policy) { return ({
        policy_name: policy.policy_name,
        sector: policy.sector,
        benefits: policy.benefits,
        relevance_score: calculateRelevanceScore(userData, policy)
    }); });
    // Step 8: Sort and limit policies to top 3
    var topPolicies = sortAndLimitPolicies(policiesWithScores);
    // Return complete evaluation result
    return {
        risk_level: riskLevel,
        recommended_loans: topLoans,
        recommended_policies: topPolicies
    };
}
