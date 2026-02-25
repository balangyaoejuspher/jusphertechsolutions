export type MonthlyDataPoint = {
  month:      string
  inquiries:  number
  placements: number
  talent:     number
}

export type DashboardStats = {
  totalTalent:     number
  totalInquiries:  number
  totalPlacements: number
  avgMatchTime:    string
  monthlyData:     MonthlyDataPoint[]
  recentActivity:  ActivityItem[]
}

export type ActivityItem = {
  text: string
  time: string
  type: "inquiry" | "talent" | "placement"
}