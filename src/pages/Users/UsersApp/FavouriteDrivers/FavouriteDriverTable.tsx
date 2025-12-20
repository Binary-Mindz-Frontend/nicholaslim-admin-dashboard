
import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { useGetRaiderAdminDataQuery } from "@/redux/features/drivers/driversApi";

interface TRaiderData {
  id: number;
  raiderId: number;
  raider_name: string;
  contact_number: string;
  email_address: string;
  vehicle_type: string;
  vehicle_plate_number: string;
  // ... add other fields from your response if needed
}

export interface TFavRaider {
  id: number;
  find_by: string;
  is_fav: boolean;
  created_at: string;
  raider: TRaiderData; // The data is here, not in registrations
}
export const useDriverColumns = (params: { raiderId: number }) => {
  const [drivers, setDrivers] = useState<TFavRaider[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const { data, isLoading, isError } = useGetRaiderAdminDataQuery(params.raiderId, {
    skip: !params.raiderId,
  });

  useEffect(() => {
    if (data?.data) {
      // Ensure it's an array for the table
      const result = Array.isArray(data.data) ? data.data : [data.data];
      setDrivers(result);
      setTotalItems(result.length);
    }
  }, [data]);

  const driverColumns: Column<TFavRaider>[] = [
    {
      header: "Raider ID",
      accessor: "raider",
      cell: (row) => (
        <span className="font-bold text-blue-600">
          R{row.raider?.raiderId}
        </span>
      ),
    },
    {
      header: "Raider Name",
      accessor: "raider",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{row.raider?.raider_name}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "raider",
      cell: (row) => (
        <div className="flex flex-col">
         
          <span className="text-xs text-gray-500">{row.raider?.email_address}</span>
        </div>
      ),
    },
    {
      header: "Vehicle Details",
      accessor: "raider",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="capitalize text-sm font-medium">{row.raider?.vehicle_type}</span>
          <span className="text-[10px] text-gray-400 uppercase font-mono">
            {row.raider?.vehicle_plate_number}
          </span>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "raider",
      cell: (row) => (
        <span className="text-sm text-gray-700">
          {row.raider?.contact_number}
        </span>
      ),
    },
    {
      header: "Favourite Status",
      accessor: "is_fav",
      cell: (row) => (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">
          {row.is_fav ? "Favourite" : "Standard"}
        </span>
      ),
    },
    {
      header: "Added Date",
      accessor: "created_at",
      cell: (row) => (
        <span className="text-xs text-gray-500">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return { driverColumns, drivers, isLoading, isError, totalItems };
};