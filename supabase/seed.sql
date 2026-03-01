-- AI-Powered Loan & Policy Recommendation System
-- Seed Data for Testing

-- =====================================================
-- Seed Data: loan_products
-- Purpose: Insert 5 sample loan products with varied eligibility criteria
-- Coverage: Low/high income requirements, various credit score thresholds, different DTI ratios
-- =====================================================

INSERT INTO loan_products (loan_name, min_income, min_credit_score, max_amount, max_dti_ratio, interest_rate, tenure_months) VALUES
  -- Product 1: Premium Home Loan (High requirements - for low risk users)
  ('Premium Home Loan', 100000, 750, 10000000, 0.40, 8.5, 240),
  
  -- Product 2: Personal Loan Plus (Medium requirements - for medium risk users)
  ('Personal Loan Plus', 40000, 650, 500000, 0.50, 12.5, 60),
  
  -- Product 3: Quick Cash Loan (Low requirements - for high risk users, edge case)
  ('Quick Cash Loan', 15000, 550, 100000, 0.60, 18.0, 24),
  
  -- Product 4: Business Expansion Loan (High income, medium credit - edge case)
  ('Business Expansion Loan', 80000, 600, 5000000, 0.45, 10.5, 120),
  
  -- Product 5: Education Loan (Low income, high credit - edge case for students)
  ('Education Loan', 25000, 700, 2000000, 0.35, 9.0, 84);

-- =====================================================
-- Seed Data: loan_policies
-- Purpose: Insert 6 sample loan policies covering all sectors
-- Sectors: Education, MSME, Agriculture, Women, Startup, Housing
-- Coverage: Varied eligibility criteria for comprehensive testing
-- =====================================================

INSERT INTO loan_policies (policy_name, sector, min_income, min_credit_score, max_amount, description, benefits) VALUES
  -- Policy 1: Education Sector
  (
    'Pradhan Mantri Vidya Lakshmi Scheme',
    'Education',
    20000,
    600,
    1500000,
    'Government-backed education loan scheme for students pursuing higher education in India and abroad',
    'Interest subsidy during moratorium period, No collateral required up to ₹7.5 lakhs, Tax benefits under Section 80E'
  ),
  
  -- Policy 2: MSME Sector
  (
    'MUDRA Yojana - Tarun',
    'MSME',
    30000,
    650,
    1000000,
    'Micro Units Development and Refinance Agency scheme for small business growth and expansion',
    'Collateral-free loans, Lower interest rates, Easy repayment terms, Credit guarantee coverage'
  ),
  
  -- Policy 3: Agriculture Sector
  (
    'Kisan Credit Card Scheme',
    'Agriculture',
    15000,
    550,
    300000,
    'Short-term credit facility for farmers to meet agricultural expenses and purchase inputs',
    'Interest subvention of 2%, Additional 3% interest relief on prompt repayment, Flexible repayment, Insurance coverage'
  ),
  
  -- Policy 4: Women Sector
  (
    'Stand-Up India Scheme',
    'Women',
    25000,
    600,
    10000000,
    'Facilitating bank loans for women entrepreneurs to set up greenfield enterprises in manufacturing, services or trading',
    'Preferential interest rates, Handholding support, No collateral for loans up to ₹10 lakhs, 7-year repayment period'
  ),
  
  -- Policy 5: Startup Sector
  (
    'Startup India Seed Fund Scheme',
    'Startup',
    35000,
    700,
    2000000,
    'Financial assistance to startups for proof of concept, prototype development, product trials, and market entry',
    'Grant funding up to ₹20 lakhs, Debt/convertible instruments up to ₹50 lakhs, Mentorship support, Tax exemptions'
  ),
  
  -- Policy 6: Housing Sector
  (
    'Pradhan Mantri Awas Yojana - Credit Linked Subsidy',
    'Housing',
    40000,
    620,
    600000,
    'Interest subsidy scheme for economically weaker sections and low-income groups to purchase or construct houses',
    'Interest subsidy up to 6.5%, Subsidy on loan amount up to ₹6 lakhs, Extended loan tenure, Priority sector lending benefits'
  );

-- =====================================================
-- Verification Queries
-- Purpose: Verify seed data was inserted correctly
-- =====================================================

-- Count loan products (should be 5)
-- SELECT COUNT(*) as total_loan_products FROM loan_products;

-- Count loan policies (should be 6)
-- SELECT COUNT(*) as total_loan_policies FROM loan_policies;

-- Verify all sectors are covered
-- SELECT DISTINCT sector FROM loan_policies ORDER BY sector;

-- View loan products ordered by min_credit_score
-- SELECT loan_name, min_income, min_credit_score, max_dti_ratio FROM loan_products ORDER BY min_credit_score;

-- View loan policies ordered by sector
-- SELECT policy_name, sector, min_income, min_credit_score FROM loan_policies ORDER BY sector;
