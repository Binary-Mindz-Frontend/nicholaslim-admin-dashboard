import OrderInsight from "@/components/Dashboard/OrderInsight/OrderInsight";
import RealTimeFleetMap from "@/components/Dashboard/RealTimeFleetMap/RealTimeFleetMap";
import RevenueChart from "../Payments/StatCard/RevenueChart";
import { useGetTransactionGraphQuery } from "@/redux/features/transactions/transactionsApi";
import { useState } from "react";
import OrderHistory from "../OrderPlacement/OrderHistory/OrderHistory";

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [years] = useState<number[]>(
    Array.from({ length: 5 }, (_, i) => currentYear - i)
  );
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  
    const { data: transactionGraphData, isLoading: graphLoading } =
      useGetTransactionGraphQuery(selectedYear);

  return (
    <div className="px-8 sm:px-0">
      <OrderInsight />
      {/* <CustomAreaChart/> */}
      <RevenueChart
        graphData={transactionGraphData?.data}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        isLoading={graphLoading}
        years={years}
      />
      <RealTimeFleetMap />
      {/* <OrderDetailsTable /> */}
      <OrderHistory />
    </div>
  );
};

export default Dashboard;
