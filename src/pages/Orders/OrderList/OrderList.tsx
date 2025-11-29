
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import { useOrderColumns } from "./OrderTable/OrderTable";
import { ordersData } from "./data/OrderData";
import TrackOrderSection from "./TrackOrderSection/TrackOrderSection";
import FilterSection from "@/components/Admin/FilterSection/FilterSection";

export default function OrderList() {
    const { orderColumns, orders } = useOrderColumns(ordersData);

    const [dateFilter, setDateFilter] = useState("");
    const [activeFilter, setActiveFilter] = useState("");
    const [allFilter, setAllFilter] = useState("");

    const handleResetFilter = () => {
        setDateFilter("");
        setActiveFilter("");
        setAllFilter("");
    };

    return (
        <div className="px-8 sm:p-6 bg-[#F5F7FA]">
            <div className="w-full mx-auto space-y-4 mb-6">

                {/* Header Section */}
                <div className="pt-2 sm:py-2">
                    <h1 className="text-black text-2xl font-bold">All Order</h1>
                </div>

                <TrackOrderSection />

                {/* Filter Section */}
                <FilterSection
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    allFilter={allFilter}
                    setAllFilter={setAllFilter}
                    handleResetFilter={handleResetFilter}
                />
            </div>

            {/* use table component */}
            <CustomTable columns={orderColumns} data={orders} />
        </div>
    );
}
