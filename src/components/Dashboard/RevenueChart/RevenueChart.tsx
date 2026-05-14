'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const data = [
  { month: 'Jan', '2025': 12000, '2024': 28000 },
  { month: 'Feb', '2025': 18000, '2024': 30000 },
  { month: 'Mar', '2025': 19000, '2024': 12000 },
  { month: 'Apr', '2025': 22000, '2024': 35000 },
  { month: 'May', '2025': 28000, '2024': 32000 },
  { month: 'Jun', '2025': 38753, '2024': 32000 },
  { month: 'Jul', '2025': 28000, '2024': 22000 },
  { month: 'Aug', '2025': 21000, '2024': 25000 },
  { month: 'Sept', '2025': 18000, '2024': 35000 },
  { month: 'Oct', '2025': 22000, '2024': 12657 },
  { month: 'Nov', '2025': 26000, '2024': 28000 },
  { month: 'Dec', '2025': 32000, '2024': 38000 },
]

export default function RevenueChart() {
  // const [activePoint, setActivePoint] = useState<string | null>(null)

  return (
   
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-border mt-8 p-2 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-base sm:text-xl md:text-3xl font-semibold text-foreground">Total Revenue</h1>
            <div className="flex items-center gap-6">
              {/* Legend */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-foreground font-medium">2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-foreground font-medium">2024</span>
                </div>
              </div>
              {/* Dropdown */}
              <button className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-secondary">
                Select date
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data} margin={{ top: 30, right: 30, left: 60, bottom: 60 }}>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={true} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#999', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 40000]}
                  ticks={[10000, 20000, 30000, 40000]}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fill: '#999', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                  }}
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0]
                      return (
                        <div className="relative">
                          <div
                            className={`px-3 py-1 rounded text-white text-sm font-medium ${
                              dataPoint.dataKey === '2025' ? 'bg-blue-500' : 'bg-red-500'
                            }`}
                          >
                            $ {dataPoint?.value?.toLocaleString() || 0}
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />

                {/* Reference lines for highlighted points */}
                <ReferenceLine x="Jun" stroke="#0ea5e9" strokeDasharray="5 5" opacity={0.3} />
                <ReferenceLine x="Oct" stroke="#ef4444" strokeDasharray="5 5" opacity={0.3} />

                {/* Lines */}
                <Line
                  type="natural"
                  dataKey="2025"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="natural"
                  dataKey="2024"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Custom data point indicators */}
            <div className="absolute left-[50%] top-[40%] transform -translate-x-1/2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md"></div>
            </div>
            <div className="absolute right-[15%] top-[55%]">
              <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-md"></div>
            </div>
          </div>

          {/* Month dots */}
          <div className="flex justify-between px-12 mt-4">
            {data.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-2 h-2 rounded-full mb-2 ${
                    item.month === 'Jun' || item.month === 'Oct' ? 'bg-blue-500' : 'bg-gray-300'
                  } ${item.month === 'Oct' ? 'bg-red-500' : ''}`}
                ></div>
                <span className="text-xs text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  )
}
