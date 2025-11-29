
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { requestData } from "./data/RequestData";
import { useRequestColumns } from "./RequestTable/RequestTable";





export default function  NewJoinRequest() {
  const { requestColumns, requests } = useRequestColumns(requestData);
  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">New Delivery Man Join Request</h1>
        </div>

        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Category List</span>
            <span className="bg-secondary text-gray-700 px-3 py-2 rounded-full text-base font-medium border border-[#969696]">
              10
            </span>
          </div>
        </div>
      </div>

      <CustomTable columns={requestColumns} data={requests} />


    </div>
  );
}