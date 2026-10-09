import { useState, useEffect } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { useGetGoinReqestRiderProfilesQuery, useVerifyRiderProfileMutation } from "@/redux/features/drivers/driversApi";
import { Eye, MoreVertical, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast"; // For showing toast messages
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import VerifyRiderModal from "../components/VerifyRiderModal";

interface TRegistration {
  raider_name: string;
  contact_number: string;
  vehicle_type: string;
  created_at: string;
  email_address?: string;
  // ... add other fields as needed
}

interface TRequest {
  id: number;
  raider_status: string;
  raider_verificationFromAdmin: string;
  created_at: string;
  registrations: TRegistration[];
}

interface UseRequestColumnsParams {
  page?: number;
  limit?: number;
  raiderId?: number;
  raider_name?: string;
  loginType?: string;
  raiderVerificationFromAdmin?: string;
  search?: string;
}

type RiderVerificationStatus = "APPROVED" | "REJECTED";

export const useRequestColumns = (params: UseRequestColumnsParams = {}) => {
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [verifyRiderProfile, { isLoading: isVerifying }] =
    useVerifyRiderProfileMutation();
  const navigate = useNavigate();

  // Verify Modal state
  const [verifyModal, setVerifyModal] = useState<{
    isOpen: boolean;
    riderId: string | number | null;
    verifyStatus: RiderVerificationStatus;
    driverName?: string;
  }>({
    isOpen: false,
    riderId: null,
    verifyStatus: "REJECTED",
    driverName: "",
  });

  // Build query params
  const queryParams: UseRequestColumnsParams = {
    page: params.page || 1,
    limit: params.limit || 10,
    loginType: "DIRECT_SIGNIN",
  };

  if (params.raiderVerificationFromAdmin !== undefined) {
    queryParams.raiderVerificationFromAdmin = params.raiderVerificationFromAdmin;
  }
  if (params.raiderId !== undefined) {
    queryParams.raiderId = params.raiderId;
  }
  if (params.raider_name) {
    queryParams.raider_name = params.raider_name;
  }
  if (params.search) {
    queryParams.search = params.search;
  }

  const { data, isLoading, isError } = useGetGoinReqestRiderProfilesQuery(queryParams);

  useEffect(() => {
    if (data?.data?.data) {
      setRequests(data.data.data);
      setTotalItems(data.data.pagination?.total || 0);
    }
  }, [data]);

  const handleOpenVerifyModal = (
    id: string | number,
    status: RiderVerificationStatus,
    registrations: TRegistration[]
  ) => {
    if (!registrations || registrations.length === 0) {
      toast.error("User not registered. Cannot approve/reject.");
      return;
    }

    const name = registrations[0]?.raider_name || `Driver #${id}`;
    setVerifyModal({
      isOpen: true,
      riderId: id,
      verifyStatus: status,
      driverName: name,
    });
  };

  const handleConfirmVerify = async (modalData: {
    reason: string;
    notificationChannel: "EMAIL" | "SMS" | "BOTH" | "NONE";
    notifyEmail: boolean;
    notifySms: boolean;
  }) => {
    if (!verifyModal.riderId) return;

    try {
      const res = await verifyRiderProfile({
        raiderId: verifyModal.riderId,
        verify: verifyModal.verifyStatus,
        reason: modalData.reason,
        notificationChannel: modalData.notificationChannel,
        notifyEmail: modalData.notifyEmail,
        notifySms: modalData.notifySms,
      }).unwrap();

      toast.success(
        res?.message || `Rider has been ${verifyModal.verifyStatus.toLowerCase()} successfully`
      );
      setVerifyModal((prev) => ({ ...prev, isOpen: false }));
    } catch (error: any) {
      console.error("Verification failed:", error);
      toast.error(error?.data?.message || "Failed to update status. Please try again.");
    }
  };


  // Define columns for the request data
  const requestColumns: Column<TRequest>[] = [
    {
      header: "Driver ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium  ">D{row.id}</span>
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
      header: "Email",
      width: "300px",
      cell: (row) => {
        const email = row.registrations?.[0]?.email_address;
        if (!email) return <span>N/A</span>;
        // Masking logic
        return <span style={{ wordBreak: "break-all", display: "block" }}>{email}</span>;
      },
    },
    {
      header: "Contact",
      cell: (row) => {
        const contact = row.registrations?.[0]?.contact_number;
        if (!contact) return <span>N/A</span>;
        // Masking logic
        return <span>{contact}</span>;
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
      header: "Registered",
      accessor: "registrations",
      cell: (row) => (
        <span className="font-medium  ">{row?.registrations?.length === 0 ? "NO" : "Yes"}</span>
      ),
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
              <DropdownMenuItem onClick={() => navigate(`/join-request/${row.id}`)}>
                <Eye className="h-4 w-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOpenVerifyModal(row.id, "APPROVED", row.registrations)}
                className="text-green-600 cursor-pointer"
              >
                <Check className="h-4 w-4 mr-2" /> Accept
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOpenVerifyModal(row.id, "REJECTED", row.registrations)}
                className="text-red-600 cursor-pointer"
              >
                <X className="h-4 w-4 mr-2" /> Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const VerifyModalComponent = () => (
    <VerifyRiderModal
      isOpen={verifyModal.isOpen}
      onClose={() => setVerifyModal((prev) => ({ ...prev, isOpen: false }))}
      onConfirm={handleConfirmVerify}
      verifyStatus={verifyModal.verifyStatus}
      driverName={verifyModal.driverName}
      isLoading={isVerifying}
    />
  );

  return { requestColumns, requests, isLoading, isError, totalItems, VerifyModalComponent };
};
