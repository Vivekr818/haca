# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Database Operations Fail with Supabase Client
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - all database operations with only DATABASE_URL configured
  - Test that fetchLoanProducts() throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" error
  - Test that fetchLoanPolicies() throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" error
  - Test that fetchLoanApplications() throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" error
  - Test that insertLoanApplication(testData) throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" error
  - Run test on UNFIXED code (with Supabase client still in place)
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: all database operations crash due to missing Supabase environment variables
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Retry Logic and API Contracts
  - **IMPORTANT**: Follow observation-first methodology
  - Observe retry behavior on UNFIXED code by simulating connection errors for read operations
  - Observe that fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications retry 3 times with exponential backoff (1000ms, 2000ms, 4000ms)
  - Observe that insertLoanApplication does NOT retry on errors (fails immediately)
  - Observe error logging includes timestamps and user-friendly messages
  - Observe return types: LoanProduct[], LoanPolicy[], LoanApplication[], {success: boolean, error?: string}
  - Write property-based tests capturing these observed behavior patterns:
    - For all read operations with connection errors, verify 3 retries with exponential backoff
    - For insertLoanApplication with errors, verify no retry and immediate {success: false, error: string}
    - For all successful operations, verify return type structures match TypeScript interfaces
    - For fetchLoanApplications, verify ordering by created_at descending
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code (may need to mock Supabase client to observe behavior)
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [x] 3. Migrate from Supabase to Neon PostgreSQL

  - [x] 3.1 Create lib/db.ts - PostgreSQL connection pool
    - Import Pool from pg: `import { Pool } from 'pg'`
    - Validate DATABASE_URL exists in process.env
    - Throw descriptive error if DATABASE_URL is missing
    - Create pool instance: `const pool = new Pool({ connectionString: process.env.DATABASE_URL })`
    - Export pool for reuse: `export { pool }`
    - Wrap pool creation in try/catch for initialization error handling
    - _Bug_Condition: codeUsesSupabaseClient() AND environmentHasOnlyDATABASE_URL() AND databaseOperationAttempted()_
    - _Expected_Behavior: Database operations use PostgreSQL pool with DATABASE_URL via pg library_
    - _Preservation: Server-side only database access, type safety_
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Create lib/types.ts - Move TypeScript interfaces
    - Copy LoanProduct interface from lib/supabase.ts
    - Copy LoanPolicy interface from lib/supabase.ts
    - Copy EligibleLoan interface from lib/supabase.ts
    - Copy RelevantPolicy interface from lib/supabase.ts
    - Copy LoanApplication interface from lib/supabase.ts
    - Export all types: `export type { LoanProduct, LoanPolicy, EligibleLoan, RelevantPolicy, LoanApplication }`
    - Remove Supabase-specific Database interface (not needed for pg)
    - _Bug_Condition: codeUsesSupabaseClient() AND environmentHasOnlyDATABASE_URL()_
    - _Expected_Behavior: Type definitions available without Supabase dependency_
    - _Preservation: TypeScript type safety for all database operations_
    - _Requirements: 2.1, 3.9_

  - [x] 3.3 Refactor lib/db-utils.ts - Replace Supabase with pg
    - Remove Supabase import: Delete `import { getSupabaseClient } from './supabase'`
    - Add pool import: `import { pool } from './db'`
    - Add type imports from lib/types.ts
    - Refactor fetchLoanProducts:
      - Replace `const supabase = getSupabaseClient()` with direct pool usage
      - Replace `await supabase.from('loan_products').select('*')` with `await pool.query('SELECT * FROM loan_products')`
      - Return `result.rows` instead of `data`
      - Preserve retry logic with exponential backoff (3 retries, 1000ms initial, 2x multiplier, 5000ms max)
      - Preserve error logging with timestamps
      - Preserve user-friendly error messages
    - Refactor fetchLoanPolicies: Same pattern for loan_policies table
    - Refactor fetchLoanApplications:
      - Use `await pool.query('SELECT * FROM loan_applications ORDER BY created_at DESC')`
      - Preserve ordering by created_at descending
      - Preserve retry logic
    - Refactor insertLoanApplication:
      - Use parameterized query with $1, $2, etc. placeholders
      - Use JSON.stringify() for recommended_loans and recommended_policies JSONB columns
      - No retry logic (preserve write operation behavior)
      - Return {success: boolean, error?: string}
      - Preserve error logging
    - Ensure all SELECT queries return result.rows
    - Ensure no pg usage inside client components (server-side only)
    - _Bug_Condition: codeUsesSupabaseClient() AND environmentHasOnlyDATABASE_URL() AND databaseOperationAttempted()_
    - _Expected_Behavior: All database operations use pool.query() with parameterized SQL_
    - _Preservation: Retry logic (3 retries, exponential backoff for reads only), error handling, return types, ordering_
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.10_

  - [x] 3.4 Update .env.example - Remove Supabase, add DATABASE_URL
    - Remove NEXT_PUBLIC_SUPABASE_URL variable
    - Remove SUPABASE_SERVICE_ROLE_KEY variable
    - Add DATABASE_URL with documentation:
      ```
      # Neon PostgreSQL Configuration
      # Get this value from your Neon project dashboard at https://neon.tech
      
      # Your Neon PostgreSQL connection string
      # Format: postgresql://[user]:[password]@[host]/[database]?sslmode=require
      DATABASE_URL=your_neon_postgresql_connection_string
      ```
    - Add security warning: DATABASE_URL should never be committed to version control
    - _Bug_Condition: environmentHasOnlyDATABASE_URL() AND documentationShowsSupabaseVariables()_
    - _Expected_Behavior: Environment configuration documents DATABASE_URL for Neon PostgreSQL_
    - _Preservation: Developer documentation clarity_
    - _Requirements: 2.1_

  - [x] 3.5 Delete lib/supabase.ts - Complete removal
    - Delete lib/supabase.ts file completely
    - Verify no imports of lib/supabase.ts remain in codebase
    - Document that @supabase/supabase-js package should be uninstalled: `npm uninstall @supabase/supabase-js`
    - _Bug_Condition: codeUsesSupabaseClient()_
    - _Expected_Behavior: Zero Supabase references remain in codebase_
    - _Preservation: No impact on UI components, evaluation logic, or non-database code_
    - _Requirements: 2.1, 2.2_

  - [x] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Database Operations Use PostgreSQL Pool
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - Verify fetchLoanProducts() succeeds without environment variable errors
    - Verify fetchLoanPolicies() succeeds without environment variable errors
    - Verify fetchLoanApplications() succeeds without environment variable errors
    - Verify insertLoanApplication(testData) succeeds without environment variable errors
    - Verify all operations use pool.query() with DATABASE_URL
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Retry Logic and API Contracts
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - Verify retry logic preserved: 3 retries with exponential backoff for read operations
    - Verify no retry for insertLoanApplication (write operation)
    - Verify error logging with timestamps preserved
    - Verify user-friendly error messages preserved
    - Verify return type structures preserved: LoanProduct[], LoanPolicy[], LoanApplication[], {success: boolean, error?: string}
    - Verify fetchLoanApplications ordering by created_at descending preserved
    - Verify TypeScript type safety preserved
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [x] 4. Checkpoint - Ensure all tests pass
  - Run all exploration tests - verify they pass (bug is fixed)
  - Run all preservation tests - verify they pass (no regressions)
  - Verify zero Supabase references remain in codebase
  - Verify DATABASE_URL is the only database configuration required
  - Verify UI components, evaluation logic, and non-database code unchanged
  - Ask the user if questions arise
