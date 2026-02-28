export type MonthlyDataPoint = {
  month: string
  inquiries: number
  placements: number
  talent: number
  revenue: number
}

export type ActivityItem = {
  type: "inquiry" | "placement" | "talent" | "invoice"
  text: string
  time: string
  meta?: string
}

export type DashboardStats = {
  totalTalent: number
  vettedTalent: number
  totalInquiries: number
  openInquiries: number
  totalPlacements: number
  activePlacements: number
  totalClients: number
  newClientsThisMonth: number
  totalRevenue: number
  pendingRevenue: number
  pendingInvoices: number
  monthlyData: MonthlyDataPoint[]
  recentActivity: ActivityItem[]
  avgMatchTime: string
}