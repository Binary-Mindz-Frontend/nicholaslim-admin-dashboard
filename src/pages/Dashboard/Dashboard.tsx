import CustomAreaChart from '@/components/Dashboard/CustomLineChart/CustomLineChart'
import OrderDetailsTable from '@/components/Dashboard/OrderDetailsTable/OrderDetailsTable'
import OrderInsight from '@/components/Dashboard/OrderInsight/OrderInsight'
import RealTimeFleetMap from '@/components/Dashboard/RealTimeFleetMap/RealTimeFleetMap'
import RevenueChart from '@/components/Dashboard/RevenueChart/RevenueChart'


const Dashboard = () => {
  return (
    <div>
      <OrderInsight/>
      <CustomAreaChart/>
      <RevenueChart/>
      <RealTimeFleetMap/>
      <OrderDetailsTable/>

    </div>
  )
}

export default Dashboard