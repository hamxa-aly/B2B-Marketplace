import { BarChart3, DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { StatCard } from './StatCard'

export default function DashboardHome() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$54,239",
      icon: <DollarSign className="h-5 w-5" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Total Sales",
      value: "1,234",
      icon: <ShoppingCart className="h-5 w-5" />,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Active Orders",
      value: "32",
      icon: <Package className="h-5 w-5" />,
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Total Products",
      value: "450",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Total Followers",
      value: "2,345",
      icon: <Users className="h-5 w-5" />,
      trend: { value: 5, isPositive: true }
    }
  ]

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[#ffffff]">Dashboard Overview</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>
    </div>
  )
}

