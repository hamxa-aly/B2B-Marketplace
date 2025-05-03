export function StatCard({ title, value, icon, trend }) {
    return (
      <div className="rounded-lg bg-[#34383A] p-4 shadow-lg transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="text-[#ffffff]/70 text-sm">{title}</div>
          <div className="text-[#FF7104]">{icon}</div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-[#ffffff]">{value}</div>
            {trend && (
              <div className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  