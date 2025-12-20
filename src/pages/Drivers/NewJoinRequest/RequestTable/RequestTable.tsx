import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import {useGetGoinReqestRiderProfilesQuery , useVerifyRiderProfileMutation } from "@/redux/features/drivers/driversApi";
import { Eye, MoreVertical,  Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // For showing toast messages

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface TRegistration {
  raider_name: string;
  contact_number: string;
  vehicle_type: string;
  created_at: string;
  // ... add other fields as needed
}
// Declare the TRequest and Registration interfaces directly here
interface TRequest {
  id: number;
  raider_status: string;
  raider_verificationFromAdmin: string;
  created_at: string; // This is your "Requested Date"
  registrations: TRegistration[]; // This is an array
}

interface UseRequestColumnsParams {
  page?: number;
  limit?: number;
  raiderId?: number;
  raider_name?: string;
  loginType?: string;  
  raiderVerificationFromAdmin?: string;  
}

type RiderVerificationStatus = "APPROVED" | "REJECTED";

export const useRequestColumns = (params: UseRequestColumnsParams = {}) => {
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [verifyRiderProfile] =
  useVerifyRiderProfileMutation();

  // Build query params - only include defined values
  const queryParams = {
    page: params.page || 1,
    limit: params.limit || 10,
    raiderId: params.raiderId,
    raider_name: params.raider_name,
    loginType: "DIRECT_SIGNIN",  
    raiderVerificationFromAdmin: "PENDING",  
  };

  if (params.raiderId !== undefined) {
    queryParams.raiderId = params.raiderId;
  }
  if (params.raider_name) {
    queryParams.raider_name = params.raider_name;
  }

  // Fetch the data using useGetRiderProfilesQuery hook with filtered params
  const { data, isLoading, isError } = useGetGoinReqestRiderProfilesQuery(queryParams);
  console.log("Fetched pagination data:", data?.data?.data);
 

  useEffect(() => {
    if (data?.data?.data) {
      setRequests(data.data.data); 
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
        <span className="font-medium text-blue-600">D{row.id}</span>
      ),
    },
    {
      header: "Name",
      cell: (row) => {
        // Safe access to the first registration object
        const reg = row.registrations?.[0];
        return <span>{reg?.raider_name || "N/A"}</span>;
      },
    },
    {
      header: "Contact",
      cell: (row) => {
        const contact = row.registrations?.[0]?.contact_number;
        if (!contact) return <span>N/A</span>;
        // Masking logic
        return <span>{contact.slice(0, 3)}****{contact.slice(-3)}</span>;
      },
    },
    {
      header: "Requested Date",
      cell: (row) => {
        // Use outer created_at if inner one isn't available
        const dateStr = row.registrations?.[0]?.created_at || row.created_at;
        if (!dateStr) return <span>N/A</span>;
        
        const date = new Date(dateStr);
        return <span>{date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}</span>;
      },
    },
    {
      header: "Vehicle Type",
      cell: (row) => (
        <span className="uppercase text-xs font-semibold">
          {row.registrations?.[0]?.vehicle_type || "N/A"}
        </span>
      ),
    },
    {
      header: "Verification Status",
      cell: (row) => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {row.raider_verificationFromAdmin}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => console.log("View", row.id)}>
                <Eye className="h-4 w-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleUpdateStatus(row.id, "APPROVED")}
                className="text-green-600"
              >
                <Check className="h-4 w-4 mr-2" /> Accept
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleUpdateStatus(row.id, "REJECTED")}
                className="text-red-600"
              >
                <X className="h-4 w-4 mr-2" /> Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return { requestColumns, requests, isLoading, isError, totalItems };
};
