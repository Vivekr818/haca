# Bugfix Requirements Document

## Introduction

The application was migrated from Supabase to Neon PostgreSQL at the infrastructure level (DATABASE_URL now points to Neon), but the application code still attempts to use Supabase client libraries and environment variables. This causes runtime crashes when any database operation is attempted because the required Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are not configured, while DATABASE_URL for Neon PostgreSQL is available but unused.

The bug affects all database operations including fetching loan products, loan policies, loan applications, and inserting new loan applications. The application cannot function until the database layer is fully migrated to use Neon PostgreSQL via node-postgres (pg) instead of Supabase client.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the application calls any database function (fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication) THEN the system calls getSupabaseClient() which throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" because .env.local only contains DATABASE_URL

1.2 WHEN lib/db-utils.ts imports getSupabaseClient from lib/supabase.ts THEN the system creates a dependency on @supabase/supabase-js package and Supabase-specific environment variables that are no longer configured

1.3 WHEN the application attempts to initialize THEN the system fails at runtime because the database client cannot be created without the missing Supabase environment variables

1.4 WHEN developers reference .env.example THEN the system shows only Supabase configuration (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) with no mention of DATABASE_URL, causing configuration confusion

1.5 WHEN the codebase contains lib/supabase.ts with Supabase client initialization THEN the system maintains dead code that references a database provider no longer in use

### Expected Behavior (Correct)

2.1 WHEN the application calls any database function (fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication) THEN the system SHALL use a PostgreSQL connection pool created from DATABASE_URL environment variable via node-postgres (pg) library

2.2 WHEN lib/db-utils.ts needs database access THEN the system SHALL import a centralized Pool instance from lib/db.ts that uses DATABASE_URL, with no dependency on Supabase client or environment variables

2.3 WHEN the application performs SELECT queries THEN the system SHALL use parameterized queries with pool.query() and return result.rows array

2.4 WHEN the application performs INSERT queries with JSON data (recommended_loans, recommended_policies) THEN the system SHALL stringify JSON fields using JSON.stringify() before insertion

2.5 WHEN developers reference .env.example THEN the system SHALL show only DATABASE_URL configuration with clear documentation that this is for Neon PostgreSQL

2.6 WHEN the codebase is inspected THEN the system SHALL contain no references to @supabase/supabase-js imports, lib/supabase.ts file, or NEXT_PUBLIC_SUPABASE_* environment variables

### Unchanged Behavior (Regression Prevention)

3.1 WHEN fetchLoanProducts or fetchLoanPolicies encounters a database error THEN the system SHALL CONTINUE TO retry up to 3 times with exponential backoff (initial delay 1000ms, multiplier 2, max delay 5000ms) before throwing "Unable to connect to database. Please try again later."

3.2 WHEN insertLoanApplication encounters a database error THEN the system SHALL CONTINUE TO NOT retry and SHALL return {success: false, error: errorMessage} immediately

3.3 WHEN any database operation encounters an error THEN the system SHALL CONTINUE TO log the error with timestamp to console.error for monitoring purposes

3.4 WHEN database operations fail after all retries THEN the system SHALL CONTINUE TO throw user-friendly error messages ("Unable to connect to database. Please try again later.") rather than exposing technical database errors

3.5 WHEN the application performs database operations THEN the system SHALL CONTINUE TO execute them server-side only with no client-side database access

3.6 WHEN fetchLoanProducts is called THEN the system SHALL CONTINUE TO return an array of LoanProduct objects with the same structure (id, loan_name, min_income, min_credit_score, max_amount, max_dti_ratio, interest_rate, tenure_months, created_at)

3.7 WHEN fetchLoanPolicies is called THEN the system SHALL CONTINUE TO return an array of LoanPolicy objects with the same structure (id, policy_name, sector, min_income, min_credit_score, max_amount, description, benefits, created_at)

3.8 WHEN fetchLoanApplications is called THEN the system SHALL CONTINUE TO return applications ordered by created_at descending

3.9 WHEN insertLoanApplication is called with application data THEN the system SHALL CONTINUE TO accept the same data structure and return {success: boolean, error?: string}

3.10 WHEN the UI and evaluation logic call database functions THEN the system SHALL CONTINUE TO work without any changes to those calling components
