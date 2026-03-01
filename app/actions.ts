'use server';

import { redirect } from 'next/navigation';
import { evaluateUserProfile } from '@/lib/evaluation';
import { generateExplanation } from '@/lib/explanation';
import { fetchLoanProducts, fetchLoanPolicies, insertLoanApplication } from '@/lib/db-utils';
import type { UserData } from '@/lib/evaluation';

/**
 * Server action to handle loan application form submission
 * 
 * This action:
 * 1. Parses and validates form data on server side
 * 2. Fetches loan_products and loan_policies from Supabase
 * 3. Calls evaluateUserProfile with fetched data
 * 4. Calls generateExplanation with evaluation result
 * 5. Inserts application record into loan_applications table
 * 6. Handles database insertion errors gracefully
 * 7. Redirects to results page with evaluation data
 * 
 * @param formData - Form data from the client
 * 
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 14.4, 14.5, 16.1
 */
export async function submitLoanApplication(formData: FormData) {
  // Step 1: Parse and validate form data on server side (Requirement 16.1)
  const userData: UserData = {
    user_name: formData.get('name') as string,
    age: Number(formData.get('age')),
    income: Number(formData.get('income')),
    credit_score: Number(formData.get('credit_score')),
    employment_type: formData.get('employment_type') as string,
    sector: formData.get('sector') as string,
    existing_emi: Number(formData.get('existing_emi')),
    requested_amount: Number(formData.get('requested_amount'))
  };

  // Server-side validation (Requirement 16.1)
  if (!userData.user_name || userData.user_name.trim() === '') {
    throw new Error('Name is required');
  }
  if (userData.age < 18 || userData.age > 100) {
    throw new Error('Age must be between 18 and 100');
  }
  if (userData.income <= 0) {
    throw new Error('Income must be a positive number');
  }
  if (userData.credit_score < 300 || userData.credit_score > 900) {
    throw new Error('Credit score must be between 300 and 900');
  }
  if (userData.existing_emi < 0) {
    throw new Error('Existing EMI must be non-negative');
  }
  if (userData.requested_amount <= 0) {
    throw new Error('Requested amount must be a positive number');
  }
  if (!userData.employment_type || userData.employment_type.trim() === '') {
    throw new Error('Employment type is required');
  }
  if (!userData.sector || userData.sector.trim() === '') {
    throw new Error('Sector is required');
  }

  try {
    // Step 2: Fetch loan_products and loan_policies from Supabase with retry logic
    // Uses exponential backoff retry logic (Requirement 14.1)
    const loanProducts = await fetchLoanProducts();
    const policies = await fetchLoanPolicies();

    // Step 3: Call evaluateUserProfile with fetched data
    const result = evaluateUserProfile(
      userData,
      loanProducts,
      policies
    );

    // Step 4: Call generateExplanation with evaluation result
    const explanation = generateExplanation({ userData, result });

    // Step 5: Insert application record into loan_applications table
    // Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
    const applicationData = {
      user_name: userData.user_name,
      age: userData.age,
      income: userData.income,
      credit_score: userData.credit_score,
      employment_type: userData.employment_type,
      sector: userData.sector,
      existing_emi: userData.existing_emi,
      requested_amount: userData.requested_amount,
      risk_level: result.risk_level,
      recommended_loans: result.recommended_loans,
      recommended_policies: result.recommended_policies
    };

    // Step 6: Handle database insertion errors gracefully (Requirements 8.7, 14.4, 14.5)
    const insertResult = await insertLoanApplication(applicationData);
    
    if (!insertResult.success) {
      // Error is already logged in insertLoanApplication
      // Continue to show results to user even if storage fails
      console.warn('Application data could not be saved, but showing results to user');
    }

    // Step 7: Redirect to results page with evaluation data
    const resultData = {
      ...result,
      explanation,
      userData // Include user data for better error messages
    };

    redirect(`/results?data=${encodeURIComponent(JSON.stringify(resultData))}`);
  } catch (error) {
    // Handle any other errors
    console.error('Error processing loan application:', error);
    
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // Re-throw redirect errors (Next.js uses errors for redirects)
      throw error;
    }
    
    // If it's a database connection error, preserve the user-friendly message
    if (error instanceof Error && error.message.includes('Unable to connect to database')) {
      throw error;
    }
    
    throw new Error('An error occurred while processing your application. Please try again.');
  }
}
