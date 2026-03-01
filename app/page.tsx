'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const fadeUpVariant = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-fintech-dark">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-fintech-dark">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={fadeUpVariant.initial}
            animate={fadeUpVariant.animate}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-fintech-text mb-6"
          >
            Smart Loan Recommendations{' '}
           
          </motion.h1>
          
          
          <motion.p
            initial={fadeUpVariant.initial}
            animate={fadeUpVariant.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-fintech-muted mb-8 max-w-3xl mx-auto"
          >
            Get personalized loan and policy recommendations tailored to your financial profile in minutes
          </motion.p>
          
          <motion.div
            initial={fadeUpVariant.initial}
            animate={fadeUpVariant.animate}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/apply"
              className="inline-block bg-fintech-primary hover:bg-fintech-primary-hover text-white font-semibold px-8 py-4 rounded-lg btn-glow hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:py-24 bg-fintech-dark">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={fadeUpVariant.initial}
            whileInView={fadeUpVariant.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-fintech-text text-center mb-12"
          >
            Why Choose Our Platform
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={fadeUpVariant.initial}
              whileInView={fadeUpVariant.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              className="glass-card"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-fintech-text mb-3">
                AI-Powered Recommendations
              </h3>
              <p className="text-fintech-muted">
                Advanced AI analyzes your financial profile to recommend the best loans and policies
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={fadeUpVariant.initial}
              whileInView={fadeUpVariant.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              className="glass-card"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-fintech-text mb-3">
                Instant Eligibility Check
              </h3>
              <p className="text-fintech-muted">
                Know your eligibility instantly with our real-time evaluation system
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={fadeUpVariant.initial}
              whileInView={fadeUpVariant.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              className="glass-card"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-fintech-text mb-3">
                Sector-Specific Policies
              </h3>
              <p className="text-fintech-muted">
                Discover government policies and schemes tailored to your sector
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 md:py-24 bg-fintech-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={fadeUpVariant.initial}
            whileInView={fadeUpVariant.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-fintech-text text-center mb-12"
          >
            How It Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={fadeUpVariant.initial}
              whileInView={fadeUpVariant.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-fintech-accent rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-fintech-text mb-3">
                Enter Your Information
              </h3>
              <p className="text-fintech-muted">
                Provide your financial details and employment information
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={fadeUpVariant.initial}
              whileInView={fadeUpVariant.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-fintech-accent rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-fintech-text mb-3">
                Get AI Analysis
              </h3>
              <p className="text-fintech-muted">
                Our AI evaluates your profile and calculates your risk level
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={fadeUpVariant.initial}
              whileInView={fadeUpVariant.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-fintech-accent rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-fintech-text mb-3">
                Receive Recommendations
              </h3>
              <p className="text-fintech-muted">
                Get personalized loan products and policy recommendations
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={fadeUpVariant.initial}
            whileInView={fadeUpVariant.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-fintech-text mb-6">
              Ready to Find Your Perfect Loan?
            </h2>
            <p className="text-lg text-fintech-muted mb-8">
              Start your journey to financial success today
            </p>
            <Link
              href="/apply"
              className="inline-block bg-fintech-primary hover:bg-fintech-primary-hover text-white font-semibold px-8 py-4 rounded-lg btn-glow hover:scale-105 transition-transform"
            >
              Start Your Application
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            © 2024 AI Loan Recommendation System. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
