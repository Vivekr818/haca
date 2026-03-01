/**
 * Results Page - Display evaluation results and recommendations
 * 
 * This page:
 * 1. Parses evaluation result from URL parameters
 * 2. Displays risk level badge with color coding (green=Low, yellow=Medium, red=High)
 * 3. Displays personalized explanation text
 * 4. Enhanced with dark theme, glassmorphism, and improved typography
 * 
 * Validates: Requirements 9.1, 9.6
 */

import type { EvaluationResult, UserData } from '@/lib/evaluation';

interface ResultData extends EvaluationResult {
  explanation: string;
  userData?: UserData;
}

interface SearchParams {
  data?: string;
}

// RiskBadge Component - Color-coded risk level display
function RiskBadge({ riskLevel }: { riskLevel: string }) {
  const getBadgeStyles = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'High':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <span
      className={`px-4 py-2 rounded-full border-2 font-semibold backdrop-blur-sm ${getBadgeStyles(
        riskLevel
      )}`}
    >
      {riskLevel}
    </span>
  );
}

// LoanCard Component - Enhanced loan display with glassmorphism
function LoanCard({ loan }: { loan: { loan_name: string; interest_rate: number; max_amount: number; tenure_months: number } }) {
  return (
    <div className="glass-card hover:scale-[1.02] transition-all duration-300">
      <h3 className="text-xl font-bold text-fintech-text mb-4">
        {loan.loan_name}
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-fintech-muted">Interest Rate:</span>
          <span className="font-semibold text-fintech-accent text-base">{loan.interest_rate}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-fintech-muted">Max Amount:</span>
          <span className="font-semibold text-fintech-text text-base">
            ₹{loan.max_amount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-fintech-muted">Tenure:</span>
          <span className="font-semibold text-fintech-text text-base">
            {loan.tenure_months} months
          </span>
        </div>
      </div>
    </div>
  );
}

// PolicyCard Component - Clean policy display with sector badge
function PolicyCard({ policy }: { policy: { policy_name: string; sector: string; benefits: string } }) {
  return (
    <div className="glass-card hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-start justify-between mb-3 gap-3">
        <h3 className="text-lg font-bold text-fintech-text flex-1">
          {policy.policy_name}
        </h3>
        <span className="px-3 py-1 bg-fintech-accent/20 text-fintech-accent text-sm font-medium rounded-full border border-fintech-accent/30 whitespace-nowrap">
          {policy.sector}
        </span>
      </div>
      <p className="text-fintech-muted text-sm leading-relaxed">
        {policy.benefits}
      </p>
    </div>
  );
}

export default function ResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Parse evaluation result from URL parameters
  let resultData: ResultData | null = null;

  try {
    if (searchParams.data) {
      resultData = JSON.parse(decodeURIComponent(searchParams.data));
    }
  } catch (error) {
    console.error('Error parsing result data:', error);
  }

  // Handle case where no data is available
  if (!resultData) {
    return (
      <div className="min-h-screen bg-fintech-dark flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-fintech-text mb-4">No Results Available</h1>
          <p className="text-fintech-muted mb-6">
            We couldn&apos;t find any evaluation results. Please submit the form to get your recommendations.
          </p>
          <a
            href="/"
            className="inline-block bg-fintech-primary hover:bg-fintech-primary-hover text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Go to Form
          </a>
        </div>
      </div>
    );
  }

  // Determine badge color based on risk level (Requirement 9.1)
  // Now handled by RiskBadge component

  // Generate personalized message for no eligible loans (Requirement 14.3)
  const getNoLoansMessage = () => {
    if (!resultData.userData) {
      return {
        message: 'No loans are currently available based on your profile.',
        suggestions: [
          'Improve your credit score',
          'Reduce your existing EMI obligations',
          'Increase your monthly income'
        ]
      };
    }

    const { credit_score, existing_emi, income } = resultData.userData;
    const dti = existing_emi / income;
    const reasons: string[] = [];
    const suggestions: string[] = [];

    // Analyze why user doesn't qualify
    if (credit_score < 600) {
      reasons.push(`Your credit score of ${credit_score} is below the minimum requirement for most loan products (typically 600+)`);
      suggestions.push(`Work on improving your credit score to at least 600 by paying bills on time and reducing credit utilization`);
    } else if (credit_score < 700) {
      reasons.push(`Your credit score of ${credit_score} may limit your options`);
      suggestions.push(`Consider improving your credit score above 700 to qualify for more loan products with better terms`);
    }

    if (dti > 0.4) {
      const dtiPercentage = (dti * 100).toFixed(1);
      reasons.push(`Your debt-to-income ratio is ${dtiPercentage}%, which exceeds the maximum allowed by most lenders (typically 40%)`);
      suggestions.push(`Reduce your existing EMI from ₹${existing_emi.toLocaleString('en-IN')} to improve your debt-to-income ratio`);
    } else if (dti > 0.3) {
      const dtiPercentage = (dti * 100).toFixed(1);
      reasons.push(`Your debt-to-income ratio of ${dtiPercentage}% may be limiting your options`);
      suggestions.push(`Consider reducing your existing EMI to lower your debt-to-income ratio below 30%`);
    }

    if (income < 25000) {
      reasons.push(`Your monthly income of ₹${income.toLocaleString('en-IN')} is below the minimum requirement for most loan products`);
      suggestions.push(`Increase your monthly income to at least ₹25,000 to qualify for more loan options`);
    }

    // If no specific reasons identified, provide general guidance
    if (reasons.length === 0) {
      reasons.push('Your profile does not currently meet the eligibility criteria for available loan products');
      suggestions.push('Review the minimum requirements for different loan products');
      suggestions.push('Consider improving your overall financial profile');
    }

    return {
      message: reasons.join('. ') + '.',
      suggestions
    };
  };

  const noLoansInfo = getNoLoansMessage();

  return (
    <div className="min-h-screen bg-fintech-dark py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card mb-8">
          <h1 className="text-4xl font-bold text-fintech-text mb-6">
            Your Loan & Policy Recommendations
          </h1>

          {/* Risk Level Badge (Requirement 9.1) */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-fintech-muted font-medium text-lg">Risk Level:</span>
            <RiskBadge riskLevel={resultData.risk_level} />
          </div>

          {/* Personalized Explanation (Requirement 9.6) */}
          <div className="bg-fintech-accent/10 border-l-4 border-fintech-accent p-5 rounded-lg backdrop-blur-sm">
            <p className="text-fintech-text leading-relaxed">{resultData.explanation}</p>
          </div>
        </div>

        {/* Loan Recommendations Section (Requirements 9.2, 9.3) */}
        <div className="glass-card mb-8">
          <h2 className="text-3xl font-bold text-fintech-text mb-6">Eligible Loan Products</h2>
          
          {resultData.recommended_loans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {resultData.recommended_loans.map((loan, index) => (
                <LoanCard key={index} loan={loan} />
              ))}
            </div>
          ) : (
            <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <svg
                  className="w-6 h-6 text-amber-400 mr-3 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-400 mb-3">
                    No Eligible Loans Found
                  </h3>
                  <p className="text-amber-200 mb-4 leading-relaxed">
                    {noLoansInfo.message}
                  </p>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-amber-300 mb-3 text-lg">
                      Steps to Improve Your Eligibility:
                    </h4>
                    <ul className="space-y-2">
                      {noLoansInfo.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          <span className="text-amber-100">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Policy Recommendations Section (Requirements 9.4, 9.5) */}
        <div className="glass-card mb-8">
          <h2 className="text-3xl font-bold text-fintech-text mb-6">Sector-Specific Policies</h2>
          
          {resultData.recommended_policies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {resultData.recommended_policies.map((policy, index) => (
                <PolicyCard key={index} policy={policy} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center backdrop-blur-sm">
              <p className="text-fintech-muted">
                No policies match your sector. Policies are sector-specific and tailored to
                industries such as Education, MSME, Agriculture, Women, Startup, and Housing.
              </p>
            </div>
          )}
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block bg-fintech-primary hover:bg-fintech-primary-hover text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Submit Another Application
          </a>
        </div>
      </div>
    </div>
  );
}
