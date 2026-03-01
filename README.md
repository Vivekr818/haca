# AI-Powered Loan & Policy Recommendation System

A hackathon-ready web application that evaluates user financial profiles and recommends eligible loan products and sector-specific policies. Built with Next.js 14 (App Router), Tailwind CSS, and Supabase.

## Features

- **Financial Profile Evaluation**: Calculate risk levels based on credit scores and debt-to-income ratios
- **Loan Product Recommendations**: Match users with appropriate financial products based on eligibility criteria
- **Policy Recommendations**: Suggest sector-specific government schemes and benefits
- **Personalized Explanations**: Provide AI-style explanations for recommendations
- **Admin Dashboard**: Monitor applications and view statistics

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase account (free tier available at https://supabase.com)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-loan-policy-recommendation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

#### Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: ai-loan-recommendation (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for setup to complete (1-2 minutes)

#### Get Your API Credentials

1. Once your project is ready, go to Project Settings (gear icon in sidebar)
2. Navigate to "API" section
3. Copy the following values:
   - Project URL (under "Project URL")
   - service_role key (under "Project API keys" - this is the secret key)

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials from step 3.

### 5. Set up the database

#### Run Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the entire contents of `supabase/schema.sql` from this repository
5. Paste it into the SQL editor
6. Click "Run" to execute the schema creation

This will create three tables:
- `loan_products` - Stores loan offerings with eligibility criteria
- `loan_policies` - Stores government sector-specific schemes
- `loan_applications` - Stores user submissions and recommendations

#### Run Seed Data

1. In the SQL Editor, click "New query" again
2. Copy the entire contents of `supabase/seed.sql` from this repository
3. Paste it into the SQL editor
4. Click "Run" to execute the seed data insertion

This will populate your database with:
- 5 sample loan products with varied eligibility criteria
- 6 sample loan policies covering all sectors (Education, MSME, Agriculture, Women, Startup, Housing)

#### Verify Database Setup

Run this query in the SQL Editor to verify:

```sql
-- Check loan products
SELECT COUNT(*) as total_loan_products FROM loan_products;

-- Check loan policies
SELECT COUNT(*) as total_loan_policies FROM loan_policies;

-- Check all sectors are covered
SELECT DISTINCT sector FROM loan_policies ORDER BY sector;
```

You should see:
- 5 loan products
- 6 loan policies
- 6 distinct sectors

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the loan application form. Try submitting with these test values:
- Name: John Doe
- Age: 30
- Monthly Income: 50000
- Credit Score: 720
- Employment Type: Salaried
- Sector: Education
- Existing EMI: 5000
- Requested Amount: 500000

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (loan application form)
│   ├── actions.ts         # Server actions for form submission
│   ├── results/           # Results page
│   │   └── page.tsx       # Display recommendations
│   └── admin/             # Admin dashboard
│       └── page.tsx       # View applications and statistics
├── lib/                   # Business logic
│   ├── supabase.ts       # Supabase client configuration
│   ├── evaluation.ts     # Core evaluation engine
│   ├── explanation.ts    # Explanation generator
│   └── db-utils.ts       # Database utility functions
├── supabase/             # Database files
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

The application requires the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (secret) | Yes |

**Security Note**: The `NEXT_PUBLIC_` prefix makes the URL available to the browser. The service role key is only used server-side and should never be exposed to the client.

## Database Schema

### loan_products

Stores loan product offerings with eligibility criteria.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| loan_name | TEXT | Name of the loan product |
| min_income | NUMERIC | Minimum monthly income required |
| min_credit_score | INTEGER | Minimum credit score required (300-900) |
| max_amount | NUMERIC | Maximum loan amount |
| max_dti_ratio | NUMERIC | Maximum debt-to-income ratio (0-1) |
| interest_rate | NUMERIC | Annual interest rate |
| tenure_months | INTEGER | Loan tenure in months |
| created_at | TIMESTAMP | Record creation timestamp |

### loan_policies

Stores government sector-specific loan policies.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| policy_name | TEXT | Name of the policy |
| sector | TEXT | Sector (Education, MSME, Agriculture, Women, Startup, Housing) |
| min_income | NUMERIC | Minimum monthly income required |
| min_credit_score | INTEGER | Minimum credit score required (300-900) |
| max_amount | NUMERIC | Maximum policy amount |
| description | TEXT | Policy description |
| benefits | TEXT | Policy benefits |
| created_at | TIMESTAMP | Record creation timestamp |

### loan_applications

Stores user loan applications with recommendations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_name | TEXT | Applicant name |
| age | INTEGER | Applicant age (18-100) |
| income | NUMERIC | Monthly income |
| credit_score | INTEGER | Credit score (300-900) |
| employment_type | TEXT | Type of employment |
| sector | TEXT | Industry sector |
| existing_emi | NUMERIC | Existing monthly EMI |
| requested_amount | NUMERIC | Requested loan amount |
| risk_level | TEXT | Calculated risk level (Low, Medium, High) |
| recommended_loans | JSONB | Array of recommended loans with scores |
| recommended_policies | JSONB | Array of recommended policies with scores |
| created_at | TIMESTAMP | Application submission timestamp |

## How It Works

### Risk Level Calculation

The system assigns risk levels based on credit scores:

- **High Risk**: Credit score < 600
- **Medium Risk**: Credit score 600-700
- **Low Risk**: Credit score > 700

### Loan Eligibility

A user is eligible for a loan if:
1. Income ≥ loan's minimum income requirement
2. Credit score ≥ loan's minimum credit score requirement
3. DTI ratio ≤ loan's maximum DTI ratio

DTI (Debt-to-Income) ratio = existing_emi / income

### Suitability Score

Loans are ranked by suitability score (0-100):
- 40 points: Credit score component (credit_score / 900)
- 30 points: Income component (income / min_income)
- 30 points: DTI component (1 - dti / max_dti_ratio)

### Policy Relevance

A user is eligible for a policy if:
1. Policy sector matches user's sector
2. Income ≥ policy's minimum income requirement
3. Credit score ≥ policy's minimum credit score requirement

### Relevance Score

Policies are ranked by relevance score (0-100):
- 50 points: Credit score component (credit_score / 900)
- 50 points: Income component (income / min_income)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to https://vercel.com and sign in with GitHub

3. Click "New Project"

4. Import your repository

5. Configure your project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: .next (default)

6. Add environment variables:
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL` with your Supabase URL
   - Add `SUPABASE_SERVICE_ROLE_KEY` with your service role key
   - Make sure to add them for Production, Preview, and Development environments

7. Click "Deploy"

8. Wait for deployment to complete (1-2 minutes)

9. Your app will be live at `https://your-project-name.vercel.app`

### Post-Deployment

After deployment:
- Test the application with sample data
- Monitor the Vercel dashboard for any errors
- Check Supabase dashboard for database activity
- Consider adding authentication for the admin dashboard

## Security Notes

- Never commit your `.env.local` file to version control (it's in `.gitignore`)
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret - it has full database access
- The service role key is only used in server-side code (Server Actions)
- For production, implement Row Level Security (RLS) policies in Supabase
- Add authentication for the admin dashboard in production
- Use HTTPS in production (Vercel provides this automatically)
- Implement rate limiting on form submissions to prevent abuse

## Troubleshooting

### Database Connection Issues

If you see "Unable to connect to database":
1. Verify your environment variables are correct
2. Check that your Supabase project is active
3. Ensure you're using the service role key, not the anon key
4. Restart your development server after changing `.env.local`

### Schema Errors

If you get database errors:
1. Verify you ran `schema.sql` before `seed.sql`
2. Check the SQL Editor for any error messages
3. Try dropping all tables and re-running both files

### Build Errors

If `npm run build` fails:
1. Run `npm run lint` to check for code issues
2. Ensure all environment variables are set
3. Check that TypeScript has no errors: `npx tsc --noEmit`

### Missing Data

If no loans or policies appear:
1. Verify seed data was inserted: Run `SELECT COUNT(*) FROM loan_products;`
2. Check browser console for errors
3. Verify your Supabase credentials are correct

## Development Roadmap

- [x] Task 1: Project setup and dependencies
- [x] Task 2: Database schema and seed data
- [x] Task 3: Supabase client configuration
- [x] Task 4: Core evaluation engine
- [x] Task 5: Explanation generator
- [x] Task 6: Form page with validation
- [x] Task 7: Results page
- [x] Task 8: Admin dashboard
- [x] Task 9: Error handling
- [x] Task 10: Testing and documentation

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
