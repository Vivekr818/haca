import { LoanApplication } from '@/lib/types'
import { fetchLoanApplications } from '@/lib/db-utils'

/**
 * Admin Dashboard Page
 * 
 * Displays all loan applications with statistics and a detailed table.
 * Fetches data from Supabase and calculates metrics on the server side.
 * Enhanced with dark fintech theme and glassmorphism styling.
 * 
 * Requirements validated: 6.1, 6.2, 6.3, 6.4
 */

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
  valueColor?: string
}

function StatCard({ title, value, icon, iconBgColor, iconColor, valueColor = 'text-fintech-text' }: StatCardProps) {
  return (
    <div className="glass-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-fintech-muted text-sm font-medium mb-2">
            {title}
          </p>
          <p className={`text-3xl font-bold ${valueColor}`}>
            {value}
          </p>
        </div>
        <div className={`${iconBgColor} rounded-full p-3`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  let applications: LoanApplication[] = []
  let error: Error | null = null

  // Fetch all loan applications from Supabase with retry logic
  try {
    applications = await fetchLoanApplications() as LoanApplication[]
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error')
    console.error('Admin dashboard error:', error)
  }

  // Handle database errors
  if (error) {
    return (
      <div className="min-h-screen bg-fintech-dark flex items-center justify-center p-4">
        <div className="glass-card max-w-md border-red-500/30">
          <h2 className="text-red-400 text-xl font-semibold mb-2">
            Database Error
          </h2>
          <p className="text-red-300">
            {error.message}
          </p>
        </div>
      </div>
    )
  }

  const allApplications: LoanApplication[] = applications

  // Calculate statistics
  const totalApplications = allApplications.length
  const highRiskCount = allApplications.filter(
    (app) => app.risk_level === 'High'
  ).length
  
  // Calculate average credit score, handle empty state
  const avgCreditScore = totalApplications > 0
    ? Math.round(
        allApplications.reduce((sum, app) => sum + app.credit_score, 0) / totalApplications
      )
    : 0

  return (
    <div className="min-h-screen bg-fintech-dark p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-fintech-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-fintech-muted text-lg">
            Monitor loan applications and system statistics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Total Applications */}
          <StatCard
            title="Total Applications"
            value={totalApplications}
            iconBgColor="bg-blue-500/20"
            iconColor="text-blue-400"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />

          {/* High Risk Applications */}
          <StatCard
            title="High Risk Applications"
            value={highRiskCount}
            iconBgColor="bg-red-500/20"
            iconColor="text-red-400"
            valueColor="text-red-400"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />

          {/* Average Credit Score */}
          <StatCard
            title="Average Credit Score"
            value={totalApplications > 0 ? avgCreditScore : 'N/A'}
            iconBgColor="bg-emerald-500/20"
            iconColor="text-emerald-400"
            valueColor="text-emerald-400"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
        </div>
        
        {/* Applications Table */}
        {allApplications.length === 0 ? (
          <div className="glass-card text-center py-12">
            <p className="text-fintech-muted text-lg">
              No applications submitted yet.
            </p>
          </div>
        ) : (
          <div className="glass-card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-fintech-text">
                Recent Applications
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-fintech-card/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Income
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Credit Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Loans
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Policies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fintech-muted uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {allApplications.map((app) => {
                    // Format created_at timestamp
                    const submittedDate = new Date(app.created_at).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })

                    // Format income in INR
                    const formattedIncome = new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(app.income)

                    // Get risk level badge color (dark theme)
                    const riskBadgeColor = 
                      app.risk_level === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      app.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'

                    return (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fintech-text">
                          {app.user_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fintech-text">
                          {app.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fintech-text">
                          {formattedIncome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fintech-text">
                          {app.credit_score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fintech-text">
                          {app.sector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${riskBadgeColor}`}>
                            {app.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fintech-text">
                          {app.recommended_loans.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fintech-text">
                          {app.recommended_policies.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fintech-text">
                          {submittedDate}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
