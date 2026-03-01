// =====================================================
// TypeScript Interfaces for Database Models
// =====================================================

export interface LoanProduct {
  id: string
  loan_name: string
  min_income: number
  min_credit_score: number
  max_amount: number
  max_dti_ratio: number
  interest_rate: number
  tenure_months: number
  created_at?: string
}

export interface LoanPolicy {
  id: string
  policy_name: string
  sector: string
  min_income: number
  min_credit_score: number
  max_amount: number
  description: string
  benefits: string
  created_at?: string
}

export interface EligibleLoan {
  loan_name: string
  interest_rate: number
  max_amount: number
  tenure_months: number
  suitability_score: number
}

export interface RelevantPolicy {
  policy_name: string
  sector: string
  benefits: string
  relevance_score: number
}

export interface LoanApplication {
  id: string
  user_name: string
  age: number
  income: number
  credit_score: number
  employment_type: string
  sector: string
  existing_emi: number
  requested_amount: number
  risk_level: string
  recommended_loans: EligibleLoan[]
  recommended_policies: RelevantPolicy[]
  created_at: string
}
