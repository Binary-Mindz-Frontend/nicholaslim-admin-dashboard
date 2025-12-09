import FilterSection from "@/components/Users/FilterSection/FilterSection";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoinSummaryChart from "./CoinsChart/CoinSummaryChart";
import CoinsByActivityChart from "./CoinsChart/CoinsByActivityChart";
import CoinsAnalytics from "./CoinsAnalytics/CoinsAnalytics";

export default function Coins() {
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
                {/* Header Section */}
                <div className="pt-2 sm:py-2">
                    <h1 className="text-black text-2xl font-bold">Reports & Analytics </h1>
                    <p className="text-base text-[#6B6B6B]">Overview of daily performance, earnings, and user activity</p>
                </div>


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
            
            {/* Coins Analytics Section  */}
            <CoinsAnalytics />

            {/* Coins chart  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CoinSummaryChart />
                <CoinsByActivityChart />
            </div>

            {/* Export Report Section  */}
            <div className="w-full bg-white p-6 my-5 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-10">
                <div>
                    <h2 className="text-lg font-semibold">Download Reports</h2>
                    <p className="text-sm text-gray-500">
                        Export comprehensive analytics reports
                    </p>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF Report
                </Button>
            </div>
        </div>
    );
}