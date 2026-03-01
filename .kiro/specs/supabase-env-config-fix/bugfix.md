# Bugfix Requirements Document

## Introduction

The application crashes when attempting to fetch loan products due to missing Supabase environment variables in the `.env.local` file. The `getSupabaseClient()` function validates that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, but `.env.local` currently only contains a `DATABASE_URL` for Neon database. This causes the app to fail during runtime when `fetchLoanProducts()` is called, resulting in 3 retry attempts followed by the error "Unable to connect to database. Please try again later."

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the application calls `getSupabaseClient()` and `NEXT_PUBLIC_SUPABASE_URL` is not set in `.env.local` THEN the system throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"

1.2 WHEN the application calls `getSupabaseClient()` and `SUPABASE_SERVICE_ROLE_KEY` is not set in `.env.local` THEN the system throws "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY"

1.3 WHEN `fetchLoanProducts()` encounters the missing environment variable error THEN the system retries 3 times with exponential backoff before throwing "Unable to connect to database. Please try again later."

1.4 WHEN the environment variables are missing THEN the application crashes and cannot fetch loan products

### Expected Behavior (Correct)

2.1 WHEN the application calls `getSupabaseClient()` and both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are properly set in `.env.local` THEN the system SHALL successfully initialize the Supabase client without errors

2.2 WHEN `fetchLoanProducts()` is called with valid Supabase configuration THEN the system SHALL successfully connect to Supabase and fetch loan products without retry attempts

2.3 WHEN the Supabase environment variables are properly configured THEN the system SHALL not crash and SHALL complete database operations successfully

2.4 WHEN the `.env.local` file is updated with the required Supabase variables THEN the system SHALL use those values to establish database connections

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the Supabase environment variables are missing THEN the system SHALL CONTINUE TO throw descriptive error messages indicating which variables are missing

3.2 WHEN database queries fail for reasons other than missing environment variables THEN the system SHALL CONTINUE TO retry up to 3 times with exponential backoff

3.3 WHEN all retry attempts are exhausted THEN the system SHALL CONTINUE TO throw the user-friendly error message "Unable to connect to database. Please try again later."

3.4 WHEN the `.env.local` file contains the existing `DATABASE_URL` variable THEN the system SHALL CONTINUE TO preserve that variable alongside the new Supabase variables

3.5 WHEN the application uses other database utility functions like `fetchLoanPolicies()` or `fetchLoanApplications()` THEN the system SHALL CONTINUE TO use the same Supabase client initialization and error handling patterns
