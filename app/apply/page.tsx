'use client';

import { useState } from 'react';
import { submitLoanApplication } from '../actions';

export default function ApplyPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation logic - PRESERVED from original implementation
  const validateField = (name: string, value: string): string | undefined => {
    const numValue = Number(value);

    switch (name) {
      case 'age':
        if (!value || isNaN(numValue)) return 'Age is required';
        if (numValue < 18 || numValue > 100) return 'Age must be between 18 and 100';
        break;

      case 'income':
        if (!value || isNaN(numValue)) return 'Income is required';
        if (numValue <= 0) return 'Income must be a positive number';
        break;

      case 'credit_score':
        if (!value || isNaN(numValue)) return 'Credit score is required';
        if (numValue < 300 || numValue > 900) return 'Credit score must be between 300 and 900';
        break;

      case 'existing_emi':
        if (!value || isNaN(numValue)) return 'Existing EMI is required';
        if (numValue < 0) return 'Existing EMI must be non-negative';
        break;

      case 'requested_amount':
        if (!value || isNaN(numValue)) return 'Requested amount is required';
        if (numValue <= 0) return 'Requested amount must be a positive number';
        break;

      case 'name':
        if (!value || value.trim() === '') return 'Name is required';
        break;

      case 'employment_type':
        if (!value || value.trim() === '') return 'Employment type is required';
        break;

      case 'sector':
        if (!value || value.trim() === '') return 'Sector is required';
        break;
    }

    return undefined;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    // Validate all fields
    const fields = ['name', 'age', 'income', 'credit_score', 'existing_emi', 'requested_amount', 'employment_type', 'sector'];
    
    for (const field of fields) {
      const value = formData.get(field) as string;
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await submitLoanApplication(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-fintech-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-fintech-text mb-3">
            Loan Application Form
          </h1>
          <p className="text-fintech-muted">
            Fill in your details to get personalized loan recommendations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-fintech-text mb-4">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-fintech-muted mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text placeholder-fintech-muted/50 focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-fintech-muted mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="18"
                  max="100"
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text placeholder-fintech-muted/50 focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-400">{errors.age}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-fintech-text mb-4">
              Financial Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income */}
              <div>
                <label htmlFor="income" className="block text-sm font-medium text-fintech-muted mb-2">
                  Monthly Income (₹) *
                </label>
                <input
                  type="number"
                  id="income"
                  name="income"
                  required
                  min="0"
                  step="1000"
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text placeholder-fintech-muted/50 focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                  placeholder="e.g., 50000"
                />
                {errors.income && (
                  <p className="mt-1 text-sm text-red-400">{errors.income}</p>
                )}
              </div>

              {/* Credit Score */}
              <div>
                <label htmlFor="credit_score" className="block text-sm font-medium text-fintech-muted mb-2">
                  Credit Score *
                </label>
                <input
                  type="number"
                  id="credit_score"
                  name="credit_score"
                  required
                  min="300"
                  max="900"
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text placeholder-fintech-muted/50 focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                  placeholder="e.g., 750"
                />
                {errors.credit_score && (
                  <p className="mt-1 text-sm text-red-400">{errors.credit_score}</p>
                )}
              </div>

              {/* Existing EMI */}
              <div>
                <label htmlFor="existing_emi" className="block text-sm font-medium text-fintech-muted mb-2">
                  Existing EMI (₹) *
                </label>
                <input
                  type="number"
                  id="existing_emi"
                  name="existing_emi"
                  required
                  min="0"
                  step="1000"
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text placeholder-fintech-muted/50 focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                  placeholder="e.g., 5000"
                />
                {errors.existing_emi && (
                  <p className="mt-1 text-sm text-red-400">{errors.existing_emi}</p>
                )}
              </div>

              {/* Requested Amount */}
              <div>
                <label htmlFor="requested_amount" className="block text-sm font-medium text-fintech-muted mb-2">
                  Requested Loan Amount (₹) *
                </label>
                <input
                  type="number"
                  id="requested_amount"
                  name="requested_amount"
                  required
                  min="0"
                  step="10000"
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text placeholder-fintech-muted/50 focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                  placeholder="e.g., 500000"
                />
                {errors.requested_amount && (
                  <p className="mt-1 text-sm text-red-400">{errors.requested_amount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-fintech-text mb-4">
              Employment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employment Type */}
              <div>
                <label htmlFor="employment_type" className="block text-sm font-medium text-fintech-muted mb-2">
                  Employment Type *
                </label>
                <input
                  type="text"
                  id="employment_type"
                  name="employment_type"
                  required
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text placeholder-fintech-muted/50 focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                  placeholder="e.g., Salaried, Self-employed"
                />
                {errors.employment_type && (
                  <p className="mt-1 text-sm text-red-400">{errors.employment_type}</p>
                )}
              </div>

              {/* Sector */}
              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-fintech-muted mb-2">
                  Sector *
                </label>
                <select
                  id="sector"
                  name="sector"
                  required
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-fintech-card border border-fintech-muted/20 rounded-lg text-fintech-text focus:outline-none focus:ring-2 focus:ring-fintech-primary focus:border-transparent transition-all"
                >
                  <option value="">Select a sector</option>
                  <option value="Education">Education</option>
                  <option value="MSME">MSME</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Women">Women</option>
                  <option value="Startup">Startup</option>
                  <option value="Housing">Housing</option>
                </select>
                {errors.sector && (
                  <p className="mt-1 text-sm text-red-400">{errors.sector}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-fintech-primary hover:bg-fintech-primary-hover text-white font-semibold px-8 py-4 rounded-lg btn-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
