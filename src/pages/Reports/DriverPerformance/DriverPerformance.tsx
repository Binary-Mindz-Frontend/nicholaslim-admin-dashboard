import FilterSection from "@/components/Users/FilterSection/FilterSection";
import { useState } from "react";
import DriverPerformanceChart from "./DriverChart/DriverChart";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useDriverColumns } from "./DriverTable/DriverTable";
import { driversData } from "./data/DriverData";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DriverPerformance() {
    const [dateFilter, setDateFilter] = useState("");
    // const [activeFilter, setActiveFilter] = useState("");
    const [allFilter, setAllFilter] = useState("");

    const handleResetFilter = () => {
        setDateFilter("");
        // setActiveFilter("");
        setAllFilter("");
    };

    const columns = useDriverColumns();

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
                {/* Header  */}
                <div className="w-full my-10 sm:flex sm:justify-between sm:items-center">

                    <div className="flex items-center justify-between sm:justify-between pb-3">
                        <h2 className="text-base font-semibold">Driver Performance</h2>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">

                        {/* SEARCH INPUT */}
                        <div className="relative w-full sm:w-[180px]">
                            <Input
                                placeholder="Search Driver..."
                                className="h-9 pr-10 border-gray-300 text-sm rounded-md"
                            />
                            <Search
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>

                        {/* DRIVER SELECT */}
                        <Select defaultValue="all">
                            <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm border-gray-300">
                                <SelectValue placeholder="All Drivers" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Drivers</SelectItem>
                                <SelectItem value="top">Top Drivers</SelectItem>
                                <SelectItem value="new">New Drivers</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* MONTH SELECT */}
                        <Select defaultValue="this-month">
                            <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm border-gray-300">
                                <SelectValue placeholder="This Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="last-month">Last Month</SelectItem>
                                <SelectItem value="3-months">Last 3 Months</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                </div>

                {/* Chart  */}
                <DriverPerformanceChart />

            </div>
            <h1 className="text-base sm:text-xl font-bold mt-10 mb-5">Driver Performance Details</h1>
            <CustomTable columns={columns} data={driversData} />

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