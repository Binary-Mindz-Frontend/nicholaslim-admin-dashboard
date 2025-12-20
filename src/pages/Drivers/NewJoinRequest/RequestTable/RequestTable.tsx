import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { useGetRiderProfilesQuery, useVerifyRiderProfileMutation } from "@/redux/features/drivers/driversApi";
import { Eye, MoreVertical,  Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // For showing toast messages

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Declare the TRequest and Registration interfaces directly here
interface TRequest {
  id: number;
  raiderId: number;
  raider_name: string;
  contact_number: string;
  requestedDate: string;
  verificationStatus: string;
  raider_verificationFromAdmin: string;
}

interface UseRequestColumnsParams {
  page?: number;
  limit?: number;
  raiderId?: number;
  raider_name?: string;
}

type RiderVerificationStatus = "APPROVED" | "REJECTED";

export const useRequestColumns = (params: UseRequestColumnsParams = {}) => {
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [verifyRiderProfile] =
  useVerifyRiderProfileMutation();

  // Build query params - only include defined values
  const queryParams: UseRequestColumnsParams = {
    page: params.page || 1,
    limit: params.limit || 10,
  };

  if (params.raiderId !== undefined) {
    queryParams.raiderId = params.raiderId;
  }
  if (params.raider_name) {
    queryParams.raider_name = params.raider_name;
  }

  // Fetch the data using useGetRiderProfilesQuery hook with filtered params
  const { data, isLoading, isError } = useGetRiderProfilesQuery(queryParams);
  console.log("Fetched pagination data:", data?.data?.data

  );
  // Effect to update requests data when query result changes
  useEffect(() => {
    if (data?.data?.data) {
      // Filter the data to only show PENDING verification requests
      const filteredRequests = data.data.data.filter((request: TRequest) =>
        request.raider_verificationFromAdmin === "PENDING"
      );
      setRequests(filteredRequests); // Set filtered requests
      setTotalItems(data.data.pagination?.total || 0);
    }
  }, [data]);

  const handleUpdateStatus = async (
    id: string | number,
    status: RiderVerificationStatus
  ) => {
    try {
      // We pass the object keys exactly as expected by your API mutation:
      // raiderId (the path param) and verify (the path param)
      await verifyRiderProfile({
        raiderId: id,
        verify: status,
      }).unwrap();

      toast.success(`Rider has been ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };


  // Define columns for the request data
  const requestColumns: Column<TRequest>[] = [
    {
      header: "Driver ID",
      accessor: "id",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline">
          D{row.id}
        </a>
      ),
    },
    {
      header: "Name",
      accessor: "raider_name",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline">
          {row.raider_name || "N/A"}
        </a>
      ),
    },
    {
      header: "Contact",
      accessor: "contact_number",
      cell: (row) => (
        <span>
          {row.contact_number ? row.contact_number.slice(0, 2) + "******" + row.contact_number.slice(-2) : "N/A"}
        </span>
      ),
    },
    {
      header: "Requested Date",
      accessor: "requestedDate",
      cell: (row) => {
        const date = new Date(row.requestedDate);
        const formatted = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return <span>{formatted}</span>;
      },
    },
    {
      header: "Verification Status",
      accessor: "verificationStatus",
      cell: () => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          PENDING
        </span>
      ),
    },
    {
  header: "Action",
  cell: (row) => (
    <div className="flex items-center gap-2">
     
      {/* 3 Dot Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => console.log("View rider", row.id)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleUpdateStatus(row.id, "APPROVED")}
            className="flex items-center gap-2 text-green-600"
          >
            <Check className="h-4 w-4" />
            Accept
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleUpdateStatus(row.id, "REJECTED")}
            className="flex items-center gap-2 text-red-600"
          >
            <X className="h-4 w-4" />
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}

  ];

  return { requestColumns, requests, isLoading, isError, totalItems };
};
