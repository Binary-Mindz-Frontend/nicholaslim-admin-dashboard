import type React from "react"
import SCoverageMap from "./_components/SCoverageMap"
import SAreaList from "./_components/SAreaList"
import { Card, CardContent } from "@/components/ui/card"
import frameOne from "@/assets/images/VTPM/Frame (1).png"
import frameTwo from "@/assets/images/VTPM/Frame (2).png"
import frameThree from "@/assets/images/VTPM/Frame.png"


interface MetricCardProps {
  title: string
  value: number
  icon: string
  color: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => (
  <Card className="w-80 h-35 border-[#6B6B6B60] shadow-lg">
    <CardContent className="py-3 px-4">
      <div className="flex   items-center justify-between">
        <div>
          <p className="text-xl  mb-1">{title}</p>
          <p  style={{ color: color }}className={`text-2xl font-bold text-${color}`}>{value}</p>
        </div>
        <div className="text-gray-400 p-3 bg-[#FFE16B60]  border border-[#FFE16B] rounded-md">
          <img src={icon} alt={title} />
        </div>
      </div>
    </CardContent>
  </Card>
)

const VTPMserviceArea: React.FC = () => {
  return (
    <div className="min-h-screenp-4 md:p-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Areas Configuration</h1>

        <div>
        {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Areas Configuration</h2> */}
        <div className="flex flex-wrap justify-center gap-4 mt-16 mb-8">
          <MetricCard title="Total Zones" value={47} icon={frameThree} color="#0088FF" />
          <MetricCard title="Active Zone" value={41} icon={frameOne} color="#34C759" />
          <MetricCard title="Pending" value={6} icon={frameTwo} color="#FFCC00" />
        </div>
      </div>
        <SCoverageMap />


          <h1 className="text-3xl font-bold text-gray-900 mt-12">Service Area List</h1>
        <SAreaList />
      </div>
    </div>
  )
}

export default VTPMserviceArea
