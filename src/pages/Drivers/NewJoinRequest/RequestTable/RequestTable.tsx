import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { useGetRiderProfilesQuery, useUpdateRiderProfileMutation } from "@/redux/features/drivers/driversApi";
import { Eye, MoreVertical } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // For showing toast messages
import { PopoverArrow } from "@radix-ui/react-popover";

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

export const useRequestColumns = (params: UseRequestColumnsParams = {}) => {
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [updateRiderProfile] = useUpdateRiderProfileMutation(); // Hook to update rider profile

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

  const handleUpdateStatus = async (id: number, newStatus: string) => {
  try {
    const updatedData = {
      verificationFromAdmin: newStatus,  // Remove "raider_" prefix
    };

    const response = await updateRiderProfile({ id, data: updatedData }).unwrap();

    if (response.success) {
      toast.success(`Status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update status");
    }
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update status");
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
        <div className="flex items-center space-x-2">
          {/* Eye Icon */}
          <button className="p-1 text-gray-600 hover:text-gray-800">
            <Eye className="h-5 w-5" />
          </button>

          {/* Three Dot Button for Actions */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="p-1 text-gray-600 hover:text-gray-800">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-36">
              <PopoverArrow />
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(row.id, "APPROVED")}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(row.id, "REJECTED")}
                >
                  Reject
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
  ];

  return { requestColumns, requests, isLoading, isError, totalItems };
};
