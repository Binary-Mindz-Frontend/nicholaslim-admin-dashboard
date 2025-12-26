// DriverTable/DriverTable.tsx
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Star } from "lucide-react";
import { TDriver } from "../data/DriverData";

export const useDriverColumns = (): Column<TDriver>[] => {
  const driverColumns: Column<TDriver>[] = [
    {
      header: "Driver Name",
      accessor: "name",
      cell: (row: TDriver) => (
        <a href="#" className="text-blue-600 underline">
          {row.name}
        </a>
      ),
    },
    {
      header: "Orders",
      accessor: "orders",
      cell: (row: TDriver) => <span>{row.orders}</span>,
    },
    {
      header: "Completed",
      accessor: "completed",
      cell: (row: TDriver) => <span>{row.completed}</span>,
    },
    {
      header: "Cancelled",
      accessor: "cancelled",
      cell: (row: TDriver) => <span>{row.cancelled}</span>,
    },
    {
      header: "Rating",
      accessor: "rating",
      cell: (row: TDriver) => {
        // Safely handle both number and string ratings
        let ratingValue: number;
        let displayRating: string;
        
        if (typeof row.rating === 'number') {
          ratingValue = row.rating;
          displayRating = ratingValue.toFixed(1);
        } else if (typeof row.rating === 'string') {
          // Try to parse the string to a number
          ratingValue = parseFloat(row.rating);
          displayRating = isNaN(ratingValue) ? "0.0" : ratingValue.toFixed(1);
        } else {
          ratingValue = 0;
          displayRating = "0.0";
        }
        
        return (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">
              {displayRating}/5
            </span>
          </div>
        );
      },
    },
    {
      header: "Revenue",
      accessor: "revenue",
      cell: (row: TDriver) => <span>{row.revenue}</span>,
    },
    {
      header: "Complaint",
      accessor: "complaints",
      cell: (row: TDriver) => <span>{row.complaints}</span>,
    },
  ];

  return driverColumns;
};