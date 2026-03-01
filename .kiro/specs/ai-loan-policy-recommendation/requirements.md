# Requirements Document: AI-Powered Loan & Policy Recommendation System

## Introduction

This document specifies the requirements for an AI-powered web application that evaluates user financial profiles and recommends eligible loan products and sector-specific government policies. The system calculates risk levels based on credit scores and debt-to-income ratios, matches users with appropriate financial products, and provides personalized explanations. Built as a hackathon-ready solution using Next.js 14, Tailwind CSS, and Supabase, the system prioritizes simplicity, rapid deployment, and maintainability.

## Glossary

- **System**: The AI-Powered Loan & Policy Recommendation System
- **User**: An individual seeking loan and policy recommendations
- **Admin**: A system administrator monitoring applications and statistics
- **Evaluation_Engine**: The core business logic component that processes user data and generates recommendations
- **Supabase_Client**: The database client component that manages data persistence
- **Form_Page**: The user interface component for collecting financial information
- **Results_Page**: The user interface component for displaying recommendations
- **Admin_Dashboard**: The user interface component for monitoring applications
- **DTI_Ratio**: Debt-to-Income ratio, calculated as existing_emi / income
- **Risk_Level**: A categorical assessment of user creditworthiness (Low, Medium, or High)
- **Suitability_Score**: A numerical score (0-100) indicating how well a loan product matches a user's profile
- **Relevance_Score**: A numerical score (0-100) indicating how relevant a policy is to a user's sector and profile
- **Loan_Product**: A financial product offered by lenders with specific eligibility criteria
- **Loan_Policy**: A government sector-specific scheme or policy with benefits for eligible users
- **Loan_Application**: A record of a user's submission including their data and recommendations

## Requirements

### Requirement 1: User Profile Evaluation

**User Story:** As a user, I want the system to evaluate my financial profile, so that I can understand my creditworthiness and eligibility for financial products.

#### Acceptance Criteria

1. WHEN a user submits valid financial data, THE Evaluation_Engine SHALL calculate the DTI ratio as existing_emi divided by income
2. WHEN a user has a credit score less than 600, THE Evaluation_Engine SHALL assign a risk level of "High"
3. WHEN a user has a credit score between 600 and 700 inclusive, THE Evaluation_Engine SHALL assign a risk level of "Medium"
4. WHEN a user has a credit score greater than 700, THE Evaluation_Engine SHALL assign a risk level of "Low"
5. WHEN the evaluation is complete, THE Evaluation_Engine SHALL return a result containing risk level, recommended loans, and recommended policies

### Requirement 2: Loan Product Recommendation

**User Story:** As a user, I want to receive personalized loan product recommendations, so that I can identify which loans I qualify for and which best suit my needs.

#### Acceptance Criteria

1. WHEN evaluating loan eligibility, THE Evaluation_Engine SHALL include only loans where the user's income meets or exceeds the loan's minimum income requirement
2. WHEN evaluating loan eligibility, THE Evaluation_Engine SHALL include only loans where the user's credit score meets or exceeds the loan's minimum credit score requirement
3. WHEN evaluating loan eligibility, THE Evaluation_Engine SHALL include only loans where the user's DTI ratio is less than or equal to the loan's maximum DTI ratio
4. WHEN calculating suitability scores, THE Evaluation_Engine SHALL produce scores between 0 and 100 inclusive
5. WHEN multiple loans are eligible, THE Evaluation_Engine SHALL sort them by suitability score in descending order
6. WHEN returning loan recommendations, THE Evaluation_Engine SHALL return at most 3 loan products
7. WHEN no loans meet the eligibility criteria, THE Evaluation_Engine SHALL return an empty list of recommended loans

### Requirement 3: Policy Recommendation

**User Story:** As a user, I want to receive sector-specific policy recommendations, so that I can access government schemes and benefits relevant to my industry.

#### Acceptance Criteria

1. WHEN evaluating policy relevance, THE Evaluation_Engine SHALL include only policies where the policy sector matches the user's sector
2. WHEN evaluating policy relevance, THE Evaluation_Engine SHALL include only policies where the user's income meets or exceeds the policy's minimum income requirement
3. WHEN evaluating policy relevance, THE Evaluation_Engine SHALL include only policies where the user's credit score meets or exceeds the policy's minimum credit score requirement
4. WHEN calculating relevance scores, THE Evaluation_Engine SHALL produce scores between 0 and 100 inclusive
5. WHEN multiple policies are relevant, THE Evaluation_Engine SHALL sort them by relevance score in descending order
6. WHEN returning policy recommendations, THE Evaluation_Engine SHALL return at most 3 policies
7. WHEN no policies meet the relevance criteria, THE Evaluation_Engine SHALL return an empty list of recommended policies

### Requirement 4: Suitability Score Calculation

**User Story:** As a user, I want loans to be ranked by how well they match my profile, so that I can prioritize the most suitable options.

#### Acceptance Criteria

1. WHEN calculating a suitability score, THE Evaluation_Engine SHALL allocate 40 points based on the credit score ratio (credit_score / 900)
2. WHEN calculating a suitability score, THE Evaluation_Engine SHALL allocate 30 points based on the income ratio relative to the loan's minimum income
3. WHEN calculating a suitability score, THE Evaluation_Engine SHALL allocate 30 points based on the DTI ratio relative to the loan's maximum DTI ratio
4. WHEN calculating a suitability score, THE Evaluation_Engine SHALL ensure the final score does not exceed 100
5. WHEN calculating a suitability score, THE Evaluation_Engine SHALL round the score to the nearest integer

### Requirement 5: Relevance Score Calculation

**User Story:** As a user, I want policies to be ranked by relevance to my profile, so that I can focus on the most beneficial schemes.

#### Acceptance Criteria

1. WHEN calculating a relevance score, THE Evaluation_Engine SHALL allocate 50 points based on the credit score ratio (credit_score / 900)
2. WHEN calculating a relevance score, THE Evaluation_Engine SHALL allocate 50 points based on the income ratio relative to the policy's minimum income
3. WHEN calculating a relevance score, THE Evaluation_Engine SHALL ensure the final score does not exceed 100
4. WHEN calculating a relevance score, THE Evaluation_Engine SHALL round the score to the nearest integer

### Requirement 6: Personalized Explanation Generation

**User Story:** As a user, I want to receive a personalized explanation of my results, so that I can understand why I received specific recommendations.

#### Acceptance Criteria

1. WHEN generating an explanation, THE System SHALL include the user's formatted monthly income in INR currency format
2. WHEN generating an explanation, THE System SHALL include the user's credit score
3. WHEN generating an explanation, THE System SHALL include the assigned risk level
4. WHEN the user qualifies for one or more loans, THE System SHALL list the loan names in the explanation
5. WHEN the user qualifies for zero loans, THE System SHALL state that the user does not currently qualify for any loan products
6. WHEN the user is eligible for one or more policies, THE System SHALL list the policy names in the explanation
7. WHEN generating an explanation, THE System SHALL return a non-empty string

### Requirement 7: User Data Collection

**User Story:** As a user, I want to enter my financial information through a simple form, so that I can receive personalized recommendations.

#### Acceptance Criteria

1. WHEN a user accesses the home page, THE Form_Page SHALL display input fields for name, age, income, credit score, employment type, sector, existing EMI, and requested amount
2. WHEN a user enters data in a field, THE Form_Page SHALL validate that age is between 18 and 100
3. WHEN a user enters data in a field, THE Form_Page SHALL validate that income is a positive number
4. WHEN a user enters data in a field, THE Form_Page SHALL validate that credit score is between 300 and 900
5. WHEN a user enters data in a field, THE Form_Page SHALL validate that existing EMI is a non-negative number
6. WHEN a user enters data in a field, THE Form_Page SHALL validate that requested amount is a positive number
7. WHEN validation fails, THE Form_Page SHALL display field-specific error messages
8. WHEN validation fails, THE Form_Page SHALL prevent form submission

### Requirement 8: Application Persistence

**User Story:** As a system administrator, I want all user applications to be stored in the database, so that I can track usage and analyze patterns.

#### Acceptance Criteria

1. WHEN a user submits a valid form, THE System SHALL store the application data in the loan_applications table
2. WHEN storing an application, THE System SHALL include all user input fields
3. WHEN storing an application, THE System SHALL include the calculated risk level
4. WHEN storing an application, THE System SHALL include the list of recommended loans
5. WHEN storing an application, THE System SHALL include the list of recommended policies
6. WHEN storing an application, THE System SHALL record a timestamp
7. IF database insertion fails, THEN THE System SHALL log the error and still display results to the user

### Requirement 9: Results Display

**User Story:** As a user, I want to see my recommendations in a clear and organized format, so that I can easily understand my options.

#### Acceptance Criteria

1. WHEN a user is redirected to the results page, THE Results_Page SHALL display a risk level badge
2. WHEN the user has eligible loans, THE Results_Page SHALL display each loan in a card layout with loan name, interest rate, maximum amount, and tenure
3. WHEN the user has no eligible loans, THE Results_Page SHALL display a message explaining that no loans are currently available
4. WHEN the user has relevant policies, THE Results_Page SHALL display each policy with policy name, sector, and benefits
5. WHEN the user has no relevant policies, THE Results_Page SHALL display a message explaining that no policies match their sector
6. WHEN displaying results, THE Results_Page SHALL show the personalized explanation text

### Requirement 10: Admin Dashboard Statistics

**User Story:** As an admin, I want to view application statistics, so that I can monitor system usage and identify trends.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard, THE Admin_Dashboard SHALL display the total count of applications
2. WHEN an admin accesses the dashboard, THE Admin_Dashboard SHALL display the count of high-risk applications
3. WHEN an admin accesses the dashboard, THE Admin_Dashboard SHALL calculate and display the average credit score across all applications
4. WHEN calculating the average credit score, THE Admin_Dashboard SHALL round the result to the nearest integer
5. WHEN there are no applications, THE Admin_Dashboard SHALL handle the empty state gracefully without errors

### Requirement 11: Admin Dashboard Application List

**User Story:** As an admin, I want to view a list of all applications, so that I can review individual submissions and their outcomes.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard, THE Admin_Dashboard SHALL fetch all loan applications from the database
2. WHEN displaying applications, THE Admin_Dashboard SHALL show user name, age, income, credit score, sector, and risk level for each application
3. WHEN displaying applications, THE Admin_Dashboard SHALL show the count of recommended loans for each application
4. WHEN displaying applications, THE Admin_Dashboard SHALL show the count of recommended policies for each application
5. WHEN displaying applications, THE Admin_Dashboard SHALL show the submission timestamp for each application

### Requirement 12: Database Client Configuration

**User Story:** As a developer, I want a configured database client, so that I can perform data operations without managing connection details in each component.

#### Acceptance Criteria

1. WHEN the Supabase_Client is initialized, THE System SHALL read the Supabase URL from environment variables
2. WHEN the Supabase_Client is initialized, THE System SHALL read the service role key from environment variables
3. IF required environment variables are missing, THEN THE System SHALL throw a descriptive error
4. WHEN the Supabase_Client is requested, THE System SHALL return a typed client with access to loan_products, loan_policies, and loan_applications tables

### Requirement 13: Data Model Validation

**User Story:** As a developer, I want data models to enforce validation rules, so that invalid data cannot corrupt the system.

#### Acceptance Criteria

1. THE System SHALL enforce that loan product minimum income is a positive number
2. THE System SHALL enforce that loan product minimum credit score is between 300 and 900
3. THE System SHALL enforce that loan product maximum amount is a positive number
4. THE System SHALL enforce that loan product maximum DTI ratio is between 0 and 1
5. THE System SHALL enforce that loan product interest rate is a positive number
6. THE System SHALL enforce that loan product tenure is a positive number
7. THE System SHALL enforce that loan policy sector is one of: Education, MSME, Agriculture, Women, Startup, Housing
8. THE System SHALL enforce that loan policy minimum income is a positive number
9. THE System SHALL enforce that loan policy minimum credit score is between 300 and 900
10. THE System SHALL enforce that loan policy maximum amount is a positive number

### Requirement 14: Error Handling

**User Story:** As a user, I want clear error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. IF the database connection fails, THEN THE System SHALL display the message "Unable to connect to database. Please try again later."
2. IF form validation fails, THEN THE System SHALL display field-specific validation errors
3. IF no eligible loans are found, THEN THE System SHALL display a message explaining why and suggesting improvement steps
4. IF database insertion fails, THEN THE System SHALL log the error for admin review
5. IF database insertion fails, THEN THE System SHALL still display recommendations to the user

### Requirement 15: Performance Requirements

**User Story:** As a user, I want fast response times, so that I can receive recommendations without delays.

#### Acceptance Criteria

1. WHEN evaluating a user profile, THE Evaluation_Engine SHALL complete processing within 100 milliseconds for typical datasets
2. WHEN querying the database, THE System SHALL complete queries within 200 milliseconds with proper indexing
3. WHEN submitting a form, THE System SHALL display results within 500 milliseconds from submission to results page load

### Requirement 16: Security Requirements

**User Story:** As a user, I want my data to be secure, so that my financial information is protected.

#### Acceptance Criteria

1. WHEN processing form inputs, THE System SHALL validate all inputs on the server side before processing
2. WHEN storing credentials, THE System SHALL use environment variables for sensitive configuration
3. THE System SHALL never expose the service role key to client-side code
4. WHEN deployed to production, THE System SHALL use HTTPS for all communications
5. WHERE authentication is enabled, THE System SHALL implement Supabase Row Level Security policies

