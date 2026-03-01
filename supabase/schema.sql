-- AI-Powered Loan & Policy Recommendation System
-- Database Schema for Supabase PostgreSQL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: loan_products
-- Purpose: Store loan product offerings with eligibility criteria
-- =====================================================
CREATE TABLE IF NOT EXISTS loan_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_name TEXT NOT NULL,
  min_income NUMERIC NOT NULL CHECK (min_income > 0),
  min_credit_score INTEGER NOT NULL CHECK (min_credit_score >= 300 AND min_credit_score <= 900),
  max_amount NUMERIC NOT NULL CHECK (max_amount > 0),
  max_dti_ratio NUMERIC NOT NULL CHECK (max_dti_ratio > 0 AND max_dti_ratio <= 1),
  interest_rate NUMERIC NOT NULL CHECK (interest_rate > 0),
  tenure_months INTEGER NOT NULL CHECK (tenure_months > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table: loan_policies
-- Purpose: Store government sector-specific loan policies
-- =====================================================
CREATE TABLE IF NOT EXISTS loan_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_name TEXT NOT NULL,
  sector TEXT NOT NULL CHECK (sector IN ('Education', 'MSME', 'Agriculture', 'Women', 'Startup', 'Housing')),
  min_income NUMERIC NOT NULL CHECK (min_income > 0),
  min_credit_score INTEGER NOT NULL CHECK (min_credit_score >= 300 AND min_credit_score <= 900),
  max_amount NUMERIC NOT NULL CHECK (max_amount > 0),
  description TEXT NOT NULL,
  benefits TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Table: loan_applications
-- Purpose: Store user loan applications with recommendations
-- =====================================================
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
  income NUMERIC NOT NULL CHECK (income > 0),
  credit_score INTEGER NOT NULL CHECK (credit_score >= 300 AND credit_score <= 900),
  employment_type TEXT NOT NULL,
  sector TEXT NOT NULL,
  existing_emi NUMERIC NOT NULL CHECK (existing_emi >= 0),
  requested_amount NUMERIC NOT NULL CHECK (requested_amount > 0),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  recommended_loans JSONB DEFAULT '[]'::jsonb,
  recommended_policies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance Optimization
-- =====================================================

-- Index on credit_score for loan_applications (frequently queried for statistics)
CREATE INDEX IF NOT EXISTS idx_loan_applications_credit_score 
ON loan_applications(credit_score);

-- Index on sector for loan_applications (used for filtering and analytics)
CREATE INDEX IF NOT EXISTS idx_loan_applications_sector 
ON loan_applications(sector);

-- Index on risk_level for loan_applications (used for admin dashboard statistics)
CREATE INDEX IF NOT EXISTS idx_loan_applications_risk_level 
ON loan_applications(risk_level);

-- Index on created_at for loan_applications (used for sorting and time-based queries)
CREATE INDEX IF NOT EXISTS idx_loan_applications_created_at 
ON loan_applications(created_at DESC);

-- Index on sector for loan_policies (used for matching user sector)
CREATE INDEX IF NOT EXISTS idx_loan_policies_sector 
ON loan_policies(sector);

-- Index on min_credit_score for loan_products (used for eligibility filtering)
CREATE INDEX IF NOT EXISTS idx_loan_products_min_credit_score 
ON loan_products(min_credit_score);

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE loan_products IS 'Stores loan product offerings with eligibility criteria and terms';
COMMENT ON TABLE loan_policies IS 'Stores government sector-specific loan policies and schemes';
COMMENT ON TABLE loan_applications IS 'Stores user loan applications with calculated risk levels and AI recommendations';

COMMENT ON COLUMN loan_products.max_dti_ratio IS 'Maximum debt-to-income ratio allowed (0-1 range)';
COMMENT ON COLUMN loan_applications.recommended_loans IS 'JSONB array of recommended loan products with suitability scores';
COMMENT ON COLUMN loan_applications.recommended_policies IS 'JSONB array of recommended policies with relevance scores';
