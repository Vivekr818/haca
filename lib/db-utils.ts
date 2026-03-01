/**
 * Database utility functions with error handling and retry logic
 * 
 * Provides wrapper functions for database operations with:
 * - Exponential backoff retry logic
 * - User-friendly error messages
 * - Error logging for monitoring
 * 
 * Validates: Requirements 14.1
 */

import { pool } from './db';
import type { LoanProduct, LoanPolicy, LoanApplication } from './types';

/**
 * Configuration for retry logic
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 5000,
  backoffMultiplier: 2
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attemptNumber: number): number {
  const delay = RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attemptNumber - 1);
  return Math.min(delay, RETRY_CONFIG.maxDelayMs);
}

/**
 * Fetch loan products with retry logic and error handling
 * 
 * @returns Array of loan products
 * @throws Error with user-friendly message if all retries fail
 */
export async function fetchLoanProducts(): Promise<LoanProduct[]> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await pool.query('SELECT * FROM loan_products');
      return result.rows;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Log error for monitoring (Requirement 14.1)
      console.error(`[Attempt ${attempt}/${RETRY_CONFIG.maxRetries}] Error fetching loan products:`, {
        error: lastError.message,
        timestamp: new Date().toISOString()
      });

      // If not the last attempt, wait before retrying
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = getRetryDelay(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries failed - throw user-friendly error (Requirement 14.1)
  throw new Error('Unable to connect to database. Please try again later.');
}

/**
 * Fetch loan policies with retry logic and error handling
 * 
 * @returns Array of loan policies
 * @throws Error with user-friendly message if all retries fail
 */
export async function fetchLoanPolicies(): Promise<LoanPolicy[]> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await pool.query('SELECT * FROM loan_policies');
      return result.rows;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Log error for monitoring (Requirement 14.1)
      console.error(`[Attempt ${attempt}/${RETRY_CONFIG.maxRetries}] Error fetching loan policies:`, {
        error: lastError.message,
        timestamp: new Date().toISOString()
      });

      // If not the last attempt, wait before retrying
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = getRetryDelay(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries failed - throw user-friendly error (Requirement 14.1)
  throw new Error('Unable to connect to database. Please try again later.');
}

/**
 * Fetch all loan applications with retry logic and error handling
 * 
 * @returns Array of loan applications
 * @throws Error with user-friendly message if all retries fail
 */
export async function fetchLoanApplications() {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await pool.query('SELECT * FROM loan_applications ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Log error for monitoring (Requirement 14.1)
      console.error(`[Attempt ${attempt}/${RETRY_CONFIG.maxRetries}] Error fetching loan applications:`, {
        error: lastError.message,
        timestamp: new Date().toISOString()
      });

      // If not the last attempt, wait before retrying
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = getRetryDelay(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries failed - throw user-friendly error (Requirement 14.1)
  throw new Error('Unable to connect to database. Please try again later.');
}

/**
 * Insert loan application with error handling (no retry for writes)
 * 
 * @param applicationData - The application data to insert
 * @returns Success status
 */
export async function insertLoanApplication(applicationData: any): Promise<{ success: boolean; error?: string }> {
  try {
    await pool.query(
      `INSERT INTO loan_applications 
       (user_name, age, income, credit_score, employment_type, sector, existing_emi, requested_amount, risk_level, recommended_loans, recommended_policies) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        applicationData.user_name,
        applicationData.age,
        applicationData.income,
        applicationData.credit_score,
        applicationData.employment_type,
        applicationData.sector,
        applicationData.existing_emi,
        applicationData.requested_amount,
        applicationData.risk_level,
        JSON.stringify(applicationData.recommended_loans),
        JSON.stringify(applicationData.recommended_policies)
      ]
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error for monitoring (Requirement 14.4)
    console.error('Error inserting loan application:', {
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
    
    return { success: false, error: errorMessage };
  }
}
