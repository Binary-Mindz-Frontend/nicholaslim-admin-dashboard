
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import { paymentsData } from "./data/PaymentsData";
import { usePaymentColumns } from "./PaymentTable/PaymentTable";
import RevenueChart from "@/components/Dashboard/RevenueChart/RevenueChart";
import DashboardStats from "./StatCard/StatCard";
import FilterSection from "@/components/Users/FilterSection/FilterSection";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Payments() {
  const { paymentColumns, payments } = usePaymentColumns(paymentsData);

  const [dateFilter, setDateFilter] = useState("");
  // const [activeFilter, setActiveFilter] = useState("");
  const [allFilter, setAllFilter] = useState("");

  const handleResetFilter = () => {
    setDateFilter("");
    // setActiveFilter("");
    setAllFilter("");
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">Payments & Transactions</h1>
        </div>
        <DashboardStats/>

        <RevenueChart />
        {/* Filter Section */}
        <FilterSection
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        // activeFilter={activeFilter}
        // setActiveFilter={setActiveFilter}
        allFilter={allFilter}
        setAllFilter={setAllFilter}
        handleResetFilter={handleResetFilter}
      />
      </div>

      <CustomTable columns={paymentColumns} data={payments} />
      <div className="flex justify-center my-4">
          <Button className="bg-primary font-semibold text-black flex items-center gap-1">Export data <Download /></Button>
      </div>
    </div>
  );
}
