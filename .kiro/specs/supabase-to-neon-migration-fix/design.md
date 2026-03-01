# Supabase to Neon PostgreSQL Migration Bugfix Design

## Overview

The application infrastructure has been migrated from Supabase to Neon PostgreSQL (DATABASE_URL now points to Neon), but the application code still uses Supabase client libraries (@supabase/supabase-js) and expects Supabase-specific environment variables. This causes runtime crashes on all database operations because the required Supabase environment variables are not configured.

The fix involves completely removing Supabase dependencies and replacing them with direct PostgreSQL access using node-postgres (pg) library. The migration will create a single global connection pool instance, refactor all database operations to use parameterized queries, and preserve existing retry logic and error handling patterns.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when any database operation is attempted while the code uses Supabase client but only DATABASE_URL is configured
- **Property (P)**: The desired behavior - database operations should use node-postgres (pg) with DATABASE_URL to connect to Neon PostgreSQL
- **Preservation**: Existing retry logic, error handling, type safety, and API contracts that must remain unchanged
- **getSupabaseClient()**: The function in `lib/supabase.ts` that throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" when called
- **Pool**: The node-postgres connection pool class that manages PostgreSQL connections efficiently
- **Parameterized Query**: SQL queries using $1, $2 placeholders to prevent SQL injection and ensure type safety
- **Exponential Backoff**: Retry strategy with increasing delays (1000ms initial, 2x multiplier, 5000ms max) used for read operations

## Bug Details

### Fault Condition

The bug manifests when any database function (fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication) is called. The code attempts to call getSupabaseClient() which checks for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables, but these are not configured because the infrastructure has migrated to Neon PostgreSQL with only DATABASE_URL available.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type DatabaseOperation (fetchLoanProducts | fetchLoanPolicies | fetchLoanApplications | insertLoanApplication)
  OUTPUT: boolean
  
  RETURN codeUsesSupabaseClient(input)
         AND environmentHasOnlyDATABASE_URL()
         AND NOT environmentHasSupabaseVariables()
         AND databaseOperationAttempted(input)
END FUNCTION
```

### Examples

- **fetchLoanProducts()** called → getSupabaseClient() throws "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" → application crashes
- **insertLoanApplication(data)** called → getSupabaseClient() throws error → loan application submission fails
- **fetchLoanPolicies()** called → getSupabaseClient() throws error → policy recommendations cannot be generated
- **Application startup** → any component calling database functions → immediate runtime failure preventing application from functioning

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Retry logic for read operations (fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications) must continue with 3 retries, exponential backoff (1000ms initial, 2x multiplier, 5000ms max)
- No retry for write operations (insertLoanApplication) - fail immediately and return {success: false, error: string}
- Error logging with timestamps to console.error for all database errors
- User-friendly error messages ("Unable to connect to database. Please try again later.") instead of technical errors
- Server-side only database access (no client-side database operations)
- Return type structures: LoanProduct[], LoanPolicy[], LoanApplication[], {success: boolean, error?: string}
- fetchLoanApplications ordering by created_at descending
- TypeScript type safety for all database operations

**Scope:**
All inputs that do NOT involve database operations should be completely unaffected by this fix. This includes:
- UI components rendering logic
- Loan evaluation algorithms
- Form validation logic
- Client-side state management
- API route handlers that don't use database functions

## Hypothesized Root Cause

Based on the bug description, the root cause is clear:

1. **Infrastructure Migration Completed, Code Migration Incomplete**: The database infrastructure was migrated from Supabase to Neon PostgreSQL (DATABASE_URL configured), but the application code was not updated to use the new connection method

2. **Dependency on Supabase Client**: The code imports and calls getSupabaseClient() from lib/supabase.ts, which requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables that are no longer configured

3. **Missing PostgreSQL Client Implementation**: No code exists to create a PostgreSQL connection pool using DATABASE_URL and node-postgres (pg) library

4. **Outdated Environment Configuration**: .env.example still documents Supabase variables instead of DATABASE_URL, causing developer confusion

## Correctness Properties

Property 1: Fault Condition - Database Operations Use PostgreSQL Pool

_For any_ database operation (fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication) that is called, the fixed code SHALL use a PostgreSQL connection pool created from DATABASE_URL via node-postgres (pg) library, execute parameterized queries using pool.query(), and return results without throwing environment variable errors.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

Property 2: Preservation - Retry Logic and Error Handling

_For any_ database operation that encounters errors, the fixed code SHALL preserve the exact same retry behavior (3 retries with exponential backoff for reads, no retry for writes), error logging with timestamps, and user-friendly error messages as the original Supabase implementation.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

Property 3: Preservation - API Contracts and Type Safety

_For any_ database operation that succeeds, the fixed code SHALL return the exact same data structures (LoanProduct[], LoanPolicy[], LoanApplication[], {success: boolean, error?: string}) with the same TypeScript types as the original Supabase implementation, ensuring no changes are required in calling code.

**Validates: Requirements 3.5, 3.6, 3.7, 3.8, 3.9, 3.10**

## Fix Implementation

### Changes Required

**File 1: CREATE `lib/db.ts`** (New file)

**Purpose**: Create a single global PostgreSQL connection pool instance

**Specific Changes**:
1. **Import pg Pool**: `import { Pool } from 'pg'`
2. **Validate DATABASE_URL**: Check process.env.DATABASE_URL exists, throw descriptive error if missing
3. **Create Pool Instance**: `const pool = new Pool({ connectionString: process.env.DATABASE_URL })`
4. **Export Pool**: `export { pool }` for reuse across all database utilities
5. **Error Handling**: Wrap pool creation in try/catch to handle initialization errors gracefully

**File 2: MODIFY `lib/db-utils.ts`**

**Purpose**: Refactor all database operations to use pg instead of Supabase

**Specific Changes**:
1. **Remove Supabase Import**: Delete `import { getSupabaseClient } from './supabase'`
2. **Add Pool Import**: `import { pool } from './db'`
3. **Add Type Imports**: Import LoanProduct, LoanPolicy, etc. from new types location
4. **Refactor fetchLoanProducts**:
   - Replace `const supabase = getSupabaseClient()` with direct pool usage
   - Replace `await supabase.from('loan_products').select('*')` with `await pool.query('SELECT * FROM loan_products')`
   - Wrap pool.query() in try/catch to catch pg errors
   - Return `result.rows` instead of `data`
   - Preserve retry logic with exponential backoff
5. **Refactor fetchLoanPolicies**: Same pattern as fetchLoanProducts for loan_policies table
6. **Refactor fetchLoanApplications**: 
   - Use `await pool.query('SELECT * FROM loan_applications ORDER BY created_at DESC')`
   - Preserve ordering by created_at descending
7. **Refactor insertLoanApplication**:
   - Use parameterized query: `await pool.query('INSERT INTO loan_applications (user_name, age, income, credit_score, employment_type, sector, existing_emi, requested_amount, risk_level, recommended_loans, recommended_policies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [data.user_name, data.age, data.income, data.credit_score, data.employment_type, data.sector, data.existing_emi, data.requested_amount, data.risk_level, JSON.stringify(data.recommended_loans), JSON.stringify(data.recommended_policies)])`
   - Use JSON.stringify() for recommended_loans and recommended_policies JSON fields
   - No retry logic (preserve write operation behavior)
   - Return {success: boolean, error?: string}

**File 3: CREATE `lib/types.ts`** (New file)

**Purpose**: Move TypeScript type definitions from lib/supabase.ts

**Specific Changes**:
1. **Copy Type Definitions**: Move LoanProduct, LoanPolicy, EligibleLoan, RelevantPolicy, LoanApplication interfaces from lib/supabase.ts
2. **Export All Types**: `export type { LoanProduct, LoanPolicy, EligibleLoan, RelevantPolicy, LoanApplication }`
3. **Remove Database Interface**: Delete Supabase-specific Database interface (not needed for pg)

**File 4: DELETE `lib/supabase.ts`**

**Purpose**: Remove all Supabase client code and dependencies

**Specific Changes**:
1. **Delete Entire File**: Remove lib/supabase.ts completely
2. **Remove Package**: Uninstall @supabase/supabase-js (documented in testing strategy)

**File 5: MODIFY `.env.example`**

**Purpose**: Update environment configuration documentation

**Specific Changes**:
1. **Remove Supabase Variables**: Delete NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
2. **Add DATABASE_URL**: 
   ```
   # Neon PostgreSQL Configuration
   # Get this value from your Neon project dashboard at https://neon.tech
   
   # Your Neon PostgreSQL connection string
   # Format: postgresql://[user]:[password]@[host]/[database]?sslmode=require
   DATABASE_URL=your_neon_postgresql_connection_string
   ```
3. **Add Security Warning**: Document that DATABASE_URL should never be committed to version control

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, verify the bug exists on unfixed code by attempting database operations and observing the "Missing environment variable" error, then verify the fix works correctly with Neon PostgreSQL and preserves all existing behavior patterns.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that the root cause is the Supabase client dependency with missing environment variables.

**Test Plan**: Attempt to call each database function (fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication) on the UNFIXED code with only DATABASE_URL configured. Observe that all operations throw "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" error.

**Test Cases**:
1. **fetchLoanProducts Test**: Call fetchLoanProducts() → expect error "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" (will fail on unfixed code)
2. **fetchLoanPolicies Test**: Call fetchLoanPolicies() → expect error "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" (will fail on unfixed code)
3. **fetchLoanApplications Test**: Call fetchLoanApplications() → expect error "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" (will fail on unfixed code)
4. **insertLoanApplication Test**: Call insertLoanApplication(testData) → expect error "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL" (will fail on unfixed code)

**Expected Counterexamples**:
- All database operations throw "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
- Root cause confirmed: getSupabaseClient() requires environment variables that are not configured
- Infrastructure uses Neon PostgreSQL (DATABASE_URL) but code uses Supabase client

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (database operations attempted), the fixed function produces the expected behavior (uses PostgreSQL pool with DATABASE_URL).

**Pseudocode:**
```
FOR ALL operation IN [fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication] DO
  result := operation_fixed()
  ASSERT result uses pool.query() with DATABASE_URL
  ASSERT result does NOT call getSupabaseClient()
  ASSERT result returns expected data structure
  ASSERT no environment variable errors thrown
END FOR
```

**Test Plan**: After implementing the fix, call each database function and verify:
- No "Missing environment variable" errors
- Successful connection to Neon PostgreSQL via DATABASE_URL
- Correct data returned with expected structure
- TypeScript types preserved

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (non-database operations), the fixed function produces the same result as the original function. Also verify that database operations preserve retry logic, error handling, and API contracts.

**Pseudocode:**
```
FOR ALL operation IN [fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications] DO
  // Test retry logic preservation
  SIMULATE database_connection_error
  ASSERT operation retries 3 times with exponential backoff
  ASSERT delays are 1000ms, 2000ms, 4000ms (capped at 5000ms)
  ASSERT final error is "Unable to connect to database. Please try again later."
END FOR

FOR operation = insertLoanApplication DO
  // Test no-retry preservation for writes
  SIMULATE database_error
  ASSERT operation does NOT retry
  ASSERT returns {success: false, error: errorMessage}
END FOR

FOR ALL operation IN [fetchLoanProducts, fetchLoanPolicies, fetchLoanApplications, insertLoanApplication] DO
  // Test return type preservation
  result := operation_fixed()
  ASSERT result structure matches original Supabase implementation
  ASSERT TypeScript types are identical
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for retry logic, error handling, and data structures

**Test Plan**: 
1. Observe retry behavior on UNFIXED code by simulating connection errors
2. Write property-based tests capturing retry logic (3 attempts, exponential backoff)
3. Verify fixed code preserves exact same retry behavior
4. Test that insertLoanApplication does NOT retry on errors
5. Verify error logging with timestamps continues to work
6. Verify user-friendly error messages are preserved

**Test Cases**:
1. **Retry Logic Preservation**: Simulate connection errors for fetchLoanProducts → verify 3 retries with delays 1000ms, 2000ms, 4000ms → verify final error message
2. **No Retry for Writes Preservation**: Simulate error for insertLoanApplication → verify immediate failure with {success: false, error: string}
3. **Error Logging Preservation**: Trigger database errors → verify console.error logs include timestamp and error details
4. **Return Type Preservation**: Call fetchLoanProducts → verify returns LoanProduct[] with same structure (id, loan_name, min_income, etc.)
5. **Ordering Preservation**: Call fetchLoanApplications → verify results ordered by created_at descending
6. **Type Safety Preservation**: Compile TypeScript code → verify no type errors after migration

### Unit Tests

- Test pool creation in lib/db.ts with valid DATABASE_URL
- Test pool creation error handling with missing DATABASE_URL
- Test fetchLoanProducts returns array of LoanProduct objects
- Test fetchLoanPolicies returns array of LoanPolicy objects
- Test fetchLoanApplications returns ordered array
- Test insertLoanApplication with valid data returns {success: true}
- Test insertLoanApplication with database error returns {success: false, error: string}
- Test parameterized queries prevent SQL injection
- Test JSON.stringify() for recommended_loans and recommended_policies fields

### Property-Based Tests

- Generate random connection error scenarios and verify retry logic executes correctly (3 attempts, exponential backoff, max 5000ms delay)
- Generate random database errors for insertLoanApplication and verify no retry occurs
- Generate random valid loan application data and verify insertion succeeds with correct data structure
- Generate random query results and verify return types match TypeScript interfaces
- Test that all database operations log errors with timestamps when failures occur

### Integration Tests

- Test full loan application flow: fetch products → fetch policies → evaluate → insert application
- Test application startup with DATABASE_URL configured → verify no environment variable errors
- Test concurrent database operations → verify connection pool handles multiple requests
- Test database connection failure scenarios → verify user-friendly error messages displayed
- Test that UI components calling database functions continue to work without modifications
