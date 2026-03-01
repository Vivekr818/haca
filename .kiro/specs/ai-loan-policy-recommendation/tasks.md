# Implementation Plan: AI-Powered Loan & Policy Recommendation System

## Overview

This plan implements a Next.js 14 application with TypeScript that evaluates user financial profiles and recommends eligible loan products and sector-specific policies. The implementation follows a bottom-up approach: database setup, core business logic, frontend pages, and integration. All business logic resides in the /lib folder with Supabase for data persistence.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Initialize Next.js 14 project with TypeScript and App Router
  - Install core dependencies: @supabase/supabase-js, tailwindcss
  - Configure Tailwind CSS with postcss and autoprefixer
  - Create environment variables template (.env.example)
  - Set up TypeScript configuration for strict type checking
  - _Requirements: 12.1, 12.2, 12.3_

- [ ] 2. Create Supabase database schema and seed data
  - [x] 2.1 Create database schema SQL file
    - Define loan_products table with columns: id, loan_name, min_income, min_credit_score, max_amount, max_dti_ratio, interest_rate, tenure_months
    - Define loan_policies table with columns: id, policy_name, sector, min_income, min_credit_score, max_amount, description, benefits
    - Define loan_applications table with columns: id, user_name, age, income, credit_score, employment_type, sector, existing_emi, requested_amount, risk_level, recommended_loans (jsonb), recommended_policies (jsonb), created_at
    - Add indexes on credit_score and sector for performance
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10_
  
  - [x] 2.2 Create seed data SQL file
    - Insert 5 sample loan products with varied eligibility criteria
    - Insert 6 sample loan policies covering all sectors (Education, MSME, Agriculture, Women, Startup, Housing)
    - Ensure data covers edge cases for testing (low/high income requirements, various credit score thresholds)
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

- [ ] 3. Implement Supabase client configuration
  - [x] 3.1 Create /lib/supabase.ts with typed client
    - Define Database interface with Tables for loan_products, loan_policies, loan_applications
    - Define TypeScript interfaces: LoanProduct, LoanPolicy, LoanApplication
    - Implement getSupabaseClient() function that reads environment variables
    - Add error handling for missing environment variables
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 3.2 Write property test for Supabase client initialization
    - **Property 22: Data Model Validation**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10**

- [ ] 4. Implement core evaluation engine
  - [x] 4.1 Create /lib/evaluation.ts with UserData and EvaluationResult interfaces
    - Define UserData interface with all required fields
    - Define EvaluationResult interface with risk_level, recommended_loans, recommended_policies
    - Define EligibleLoan and RelevantPolicy interfaces
    - _Requirements: 1.5, 2.6, 3.6_
  
  - [x] 4.2 Implement DTI calculation and risk level assignment
    - Implement logic to calculate DTI ratio as existing_emi / income
    - Implement risk level assignment: High (<600), Medium (600-700), Low (>700)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ]* 4.3 Write property tests for DTI and risk level
    - **Property 1: DTI Ratio Calculation**
    - **Validates: Requirements 1.1**
    - **Property 2: Risk Level Assignment**
    - **Validates: Requirements 1.2, 1.3, 1.4**
  
  - [x] 4.4 Implement loan eligibility filtering
    - Filter loans by minimum income requirement
    - Filter loans by minimum credit score requirement
    - Filter loans by maximum DTI ratio
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ]* 4.5 Write property test for loan eligibility criteria
    - **Property 4: Loan Eligibility Criteria**
    - **Validates: Requirements 2.1, 2.2, 2.3**
  
  - [x] 4.6 Implement suitability score calculation
    - Calculate credit score component (40 points based on credit_score / 900)
    - Calculate income component (30 points based on income ratio)
    - Calculate DTI component (30 points based on DTI ratio)
    - Ensure score is capped at 100 and rounded to integer
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 4.7 Write property test for suitability score bounds
    - **Property 5: Suitability Score Bounds**
    - **Validates: Requirements 2.4, 4.5**
  
  - [x] 4.8 Implement loan sorting and limiting
    - Sort eligible loans by suitability_score in descending order
    - Limit results to top 3 loans
    - _Requirements: 2.5, 2.6_
  
  - [ ]* 4.9 Write property tests for loan sorting and limits
    - **Property 6: Loan Sorting Order**
    - **Validates: Requirements 2.5**
    - **Property 7: Loan Result Limit**
    - **Validates: Requirements 2.6**
  
  - [x] 4.10 Implement policy relevance filtering
    - Filter policies by matching sector
    - Filter policies by minimum income requirement
    - Filter policies by minimum credit score requirement
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 4.11 Write property test for policy relevance criteria
    - **Property 8: Policy Relevance Criteria**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  
  - [x] 4.12 Implement relevance score calculation
    - Calculate credit score component (50 points)
    - Calculate income component (50 points)
    - Ensure score is capped at 100 and rounded to integer
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 4.13 Write property test for relevance score bounds
    - **Property 9: Relevance Score Bounds**
    - **Validates: Requirements 3.4, 5.4**
  
  - [x] 4.14 Implement policy sorting and limiting
    - Sort relevant policies by relevance_score in descending order
    - Limit results to top 3 policies
    - _Requirements: 3.5, 3.6_
  
  - [ ]* 4.15 Write property tests for policy sorting and limits
    - **Property 10: Policy Sorting Order**
    - **Validates: Requirements 3.5**
    - **Property 11: Policy Result Limit**
    - **Validates: Requirements 3.6**
  
  - [x] 4.16 Integrate all components into evaluateUserProfile function
    - Combine DTI calculation, risk assignment, loan filtering, and policy matching
    - Return complete EvaluationResult object
    - _Requirements: 1.5_
  
  - [ ]* 4.17 Write property test for evaluation result structure
    - **Property 3: Evaluation Result Structure**
    - **Validates: Requirements 1.5**

- [x] 5. Checkpoint - Ensure core evaluation logic is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement explanation generator
  - [x] 6.1 Create /lib/explanation.ts with ExplanationInput interface
    - Define ExplanationInput interface with userData and result fields
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 6.2 Implement generateExplanation function
    - Format income in INR currency format using Intl.NumberFormat
    - Include credit score and risk level in explanation
    - Conditionally include loan names if recommendations exist
    - Conditionally include policy names if recommendations exist
    - Handle case when no loans qualify
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [ ]* 6.3 Write property tests for explanation completeness
    - **Property 12: Explanation Completeness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.7**
    - **Property 13: Explanation Loan Content**
    - **Validates: Requirements 6.4**
    - **Property 14: Explanation Policy Content**
    - **Validates: Requirements 6.6**

- [ ] 7. Implement form page with validation
  - [x] 7.1 Create /app/page.tsx with form UI
    - Create form with input fields: name, age, income, credit_score, employment_type, sector, existing_emi, requested_amount
    - Style form with Tailwind CSS for clean, responsive layout
    - Add sector dropdown with options: Education, MSME, Agriculture, Women, Startup, Housing
    - _Requirements: 7.1_
  
  - [x] 7.2 Implement client-side form validation
    - Validate age is between 18 and 100
    - Validate income is positive
    - Validate credit_score is between 300 and 900
    - Validate existing_emi is non-negative
    - Validate requested_amount is positive
    - Display field-specific error messages
    - Prevent submission when validation fails
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  
  - [ ]* 7.3 Write property test for form input validation
    - **Property 15: Form Input Validation**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5, 7.6**
    - **Property 16: Validation Error Display**
    - **Validates: Requirements 7.7, 7.8**
  
  - [x] 7.4 Implement server action for form submission
    - Create server action to handle form submission
    - Parse and validate form data on server side
    - Fetch loan_products and loan_policies from Supabase
    - Call evaluateUserProfile with fetched data
    - Call generateExplanation with evaluation result
    - Insert application record into loan_applications table
    - Handle database insertion errors gracefully
    - Redirect to results page with evaluation data
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 14.4, 14.5, 16.1_
  
  - [ ]* 7.5 Write property test for application persistence
    - **Property 17: Application Persistence Completeness**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**

- [ ] 8. Implement results page
  - [x] 8.1 Create /app/results/page.tsx with results display
    - Parse evaluation result from URL parameters
    - Display risk level badge with color coding (green=Low, yellow=Medium, red=High)
    - Display personalized explanation text
    - _Requirements: 9.1, 9.6_
  
  - [x] 8.2 Implement loan recommendations display
    - Display eligible loans in card layout with Tailwind CSS
    - Show loan_name, interest_rate, max_amount, tenure_months for each loan
    - Display "No loans available" message when list is empty
    - _Requirements: 9.2, 9.3_
  
  - [x] 8.3 Implement policy recommendations display
    - Display relevant policies in list format
    - Show policy_name, sector, benefits for each policy
    - Display "No policies match your sector" message when list is empty
    - _Requirements: 9.4, 9.5_
  
  - [ ]* 8.4 Write property test for results page display
    - **Property 18: Results Page Display Completeness**
    - **Validates: Requirements 9.1, 9.2, 9.4, 9.6**

- [x] 9. Checkpoint - Ensure user flow is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement admin dashboard
  - [x] 10.1 Create /app/admin/page.tsx with dashboard layout
    - Fetch all loan_applications from Supabase
    - Style dashboard with Tailwind CSS for clean layout
    - _Requirements: 11.1_
  
  - [x] 10.2 Implement statistics calculation
    - Calculate total applications count
    - Calculate high-risk applications count (risk_level === 'High')
    - Calculate average credit score and round to nearest integer
    - Handle empty state when no applications exist
    - Display statistics in card layout
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 10.3 Write property test for admin statistics accuracy
    - **Property 19: Admin Statistics Accuracy**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
  
  - [x] 10.4 Implement applications table
    - Display table with columns: user_name, age, income, credit_score, sector, risk_level, loan count, policy count, created_at
    - Format created_at timestamp in readable format
    - Style table with Tailwind CSS for responsive design
    - _Requirements: 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 10.5 Write property test for admin application display
    - **Property 20: Admin Application Display Completeness**
    - **Validates: Requirements 11.2, 11.3, 11.4, 11.5**

- [ ] 11. Implement error handling and user feedback
  - [x] 11.1 Add error handling for database connection failures
    - Display "Unable to connect to database. Please try again later." message
    - Implement retry logic with exponential backoff
    - Log errors for monitoring
    - _Requirements: 14.1_
  
  - [x] 11.2 Add error handling for no eligible loans scenario
    - Display helpful message explaining why user doesn't qualify
    - Suggest improvement steps (improve credit score, reduce existing EMI)
    - _Requirements: 14.3_
  
  - [ ]* 11.3 Write property test for server-side validation
    - **Property 21: Server-Side Validation**
    - **Validates: Requirements 16.1**

- [ ] 12. Add documentation and setup instructions
  - [x] 12.1 Create README.md with setup instructions
    - Document environment variables required
    - Provide Supabase setup instructions
    - Include commands to run database schema and seed files
    - Document how to run development server
    - Add deployment instructions for Vercel
  
  - [x] 12.2 Create .env.example file
    - Include NEXT_PUBLIC_SUPABASE_URL placeholder
    - Include SUPABASE_SERVICE_ROLE_KEY placeholder
    - Add comments explaining each variable

- [ ] 13. Final integration and testing
  - [x] 13.1 Test complete user flow end-to-end
    - Submit form with various user profiles (low/medium/high risk)
    - Verify results page displays correct recommendations
    - Verify application is stored in database
    - Verify admin dashboard shows new application
  
  - [x] 13.2 Test edge cases
    - Test with user who qualifies for no loans
    - Test with user who has no matching policies
    - Test with maximum values (credit score 900, high income)
    - Test with minimum values (credit score 300, low income)
  
  - [ ]* 13.3 Run all property-based tests
    - Execute all property tests with fast-check
    - Verify all 22 correctness properties pass
    - Fix any failing properties

- [x] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- The implementation uses TypeScript throughout for type safety
- All business logic resides in /lib folder with no separate backend server
- Database schema and seed files should be run in Supabase SQL editor before starting the application
