
import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { TDriver } from "@/pages/Drivers/data/DriverData";


export const useDriverColumns = (initialData: TDriver[]) => {
  const [drivers] = useState<TDriver[]>(initialData); // No ESLint warning

  const driverColumns: Column<TDriver>[] = [
   
    {
      header: "Driver ID",
      accessor: "id",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline">
          {row.id}
        </a>
      ),
    },

    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline">
          {row.name}
        </a>
      ),
    },

    {
      header: "Contact",
      accessor: "contact",
      cell: (row) => (
        <span>{row.contact.slice(0, 2) + "******"}</span>
      ),
    },

    {
      header: "Zone",
      accessor: "zone",
    },

    {
      header: "Total Orders",
      accessor: "totalOrders",
    },

    {
      header: "Driver Onboarding Type",
      accessor: "onboardingType",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${
              row.onboardingType === "Assigned by Admin"
                ? "bg-yellow-300 text-black"
                : "bg-gray-300 text-black"
            }
          `}
        >
          {row.onboardingType}
        </span>
      ),
    },

    {
      header: "Availability Status",
      accessor: "availability",
      cell: (row) => (
        <div>
          <p className="font-semibold">
            {row.availability.status === "Assigned Order"
              ? `Assigned Order : ${row.availability.assignedOrderCount}`
              : "Currently Available"}
          </p>

          <p className="text-xs text-gray-500">
            Active Status : {row.availability.activeStatus}
          </p>
        </div>
      ),
    },

    // {
    //   header: "Action",
    //   cell: (row) => <DriverAction row={row} />,
    // },
  ];

  return { driverColumns, drivers };
};
