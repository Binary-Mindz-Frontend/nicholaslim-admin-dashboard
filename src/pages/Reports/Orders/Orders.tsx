// import FilterSection from "@/components/Users/FilterSection/FilterSection";
// import { useState } from "react";
import { useGetReportAndAnalyticsStatsQuery } from "@/redux/features/reportAndAnalytics/reportAndAnalyticsApi";
import OverviewSection from "./OverviewSection/OverViewSection";

export default function Orders() {
  // const [dateFilter, setDateFilter] = useState("");
  // // const [activeFilter, setActiveFilter] = useState("");
  // const [allFilter, setAllFilter] = useState("");

  // const handleResetFilter = () => {
  //     setDateFilter("");
  //     // setActiveFilter("");
  //     setAllFilter("");
  // };

  const { data: reportStatsData } = useGetReportAndAnalyticsStatsQuery("");

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">
            Reports & Analytics{" "}
          </h1>
          {/* <p className="text-base text-[#6B6B6B]">Overview of daily performance, earnings, and user activity</p> */}
        </div>

        {/* <FilterSection
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    // activeFilter={activeFilter}
                    // setActiveFilter={setActiveFilter}
                    allFilter={allFilter}
                    setAllFilter={setAllFilter}
                    handleResetFilter={handleResetFilter}
                /> */}

        <OverviewSection data={reportStatsData} />
      </div>
    </div>
  );
}
