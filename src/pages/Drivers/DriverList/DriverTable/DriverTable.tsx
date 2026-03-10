import { useState, useEffect } from "react";
import { useGetRiderProfilesQuery } from "@/redux/features/drivers/driversApi";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import DriverAction from "../DriverAction/DriverAction";

// Declare the TDriver and Registration interfaces directly here
interface Registration {
  id: number;
  raiderId: number;
  raider_name: string;
  contact_number: string;
  email_address: string;
  dob: string;
  gender: string;
  driver_photos: string[];
  emergency_contact_name: string;
  emergency_contact_number: string;
  identity_card_number: string;
  nid_front_images: string;
  nid_back_images: string;
  driving_license_number: string;
  driving_license_issue_date: string;
  driving_license_expire_date: string;
  driving_license_front_images: string;
  driving_license_back_images: string;
  vehicle_plate_number: string;
  vehicle_type: string;
  vehicle_brand: string;
  registration_date: string;
  vehicle_front_images: string;
  vehicle_back_images: string;
  vehicle_driver_side_images: string;
  vehicle_passenger_side_images: string;
  vehicle_log_number: string;
  vehicle_log_issue_date: string;
  vehicle_log_expire_date: string;
  vehicle_log_images: string;
  vehicle_policy_number: string;
  vehicle_policy_issue_date: string;
  vehicle_policy_expire_date: string;
  vehicle_policy_images: string;
  current_address: string;
  current_apartment: string;
  current_state_province: string;
  current_city: string;
  current_country: string;
  current_zip_post_code: string;
  permanent_address: string;
  permanent_apartment: string;
  permanent_state_province: string;
  permanent_city: string;
  permanent_country: string;
  permanent_zip_post_code: string;
  bank_name: string;
  account_number: string;
  created_at: string;
  updated_at: string;
  // Add totalRatings field to Registration
}

interface TDriver {
  id: number;
  userId: number;
  is_online: boolean;
  is_available: boolean;
  raider_status: string;
  LoginType: string;
  raider_verificationFromAdmin: string;
  isSuspended: boolean;
  suspendedDuration: number | null;
  suspensionReason: string | null;
  created_at: string;
  updated_at: string;
  registrations: Registration[];
  totalRatings: number;
}

interface UseDriverColumnsParams {
  page?: number;
  limit?: number;
  raiderId?: number;
  raider_name?: string;
  raiderVerificationFromAdmin?: string;
  search?: string;
}

export const useDriverColumns = (params: UseDriverColumnsParams = {}) => {
  const [drivers, setDrivers] = useState<TDriver[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Build query params - only include defined values
  const queryParams: UseDriverColumnsParams = {
    page: params.page || 1,
    limit: params.limit || 10,
  };

  // Only add filters if they have values
  if (params.raiderId !== undefined) {
    queryParams.raiderId = params.raiderId;
  }
  if (params.raider_name) {
    queryParams.raider_name = params.raider_name;
  }
  if (params.raiderVerificationFromAdmin) {
    queryParams.raiderVerificationFromAdmin = params.raiderVerificationFromAdmin;
  }
  if (params.search) {
    queryParams.search = params.search;
  }

  // Fetch the data using useGetRiderProfilesQuery hook with filtered params
  const { data, isLoading, isError, refetch } = useGetRiderProfilesQuery(queryParams);
  useEffect(() => {
    if (data?.data?.data) {
      setDrivers(data?.data?.data);
      setTotalItems(data?.data?.pagination?.total || 0);
    }
  }, [data]);

  console.log("Driver data:", data?.data?.data);
  // Define columns for the driver data
  const driverColumns: Column<TDriver>[] = [
    {
      header: "Driver ID",
      accessor: "id",
      cell: (row) => (
        <p>
          D{row.id}
        </p>
      ),
    },
    {
      header: "Driver Name",
      accessor: "registrations",
      cell: (row) => (
        <p>
          {row.registrations?.[0]?.raider_name || "N/A"}
        </p>
      ),
    },
    {
      header: "Email",
      accessor: "registrations",
      width: "300px",
      cell: (row) => (
        <span style={{ wordBreak: "break-all", display: "block" }}>
          {row.registrations?.[0]?.email_address || "N/A"}
        </span>
      ),
    },
    {
      header: "Suspended Status",
      accessor: "isSuspended",
      cell: (row) => {
        const isSuspended = row.isSuspended;
        const suspendedDuration = row.suspendedDuration;
        const suspensionReason = row.suspensionReason;

        return (
          <div>
            {isSuspended ? (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full">
                Suspended
              </span>
            ) : (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                No
              </span>
            )}
            {isSuspended && (
              <div className="mt-1">
                <p className="text-xs text-gray-500">
                  Suspended for: {suspendedDuration} days
                </p>
                <p className="text-xs text-gray-500">
                  Reason: {suspensionReason || "N/A"}
                </p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Contact",
      accessor: "registrations",
      cell: (row) => {
        const contact = row.registrations?.[0]?.contact_number || "";
        return (
          <span>
            {contact ? contact : "N/A"}
          </span>
        );
      },
    },
    {
      header: "Vehicle Type",
      accessor: "registrations",
      cell: (row) => (
        <span className="capitalize">
          {row.registrations?.[0]?.vehicle_type || "N/A"}
        </span>
      ),
    },
    {
      header: "Verification Status",
      accessor: "raider_verificationFromAdmin",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${row.raider_verificationFromAdmin === "APPROVED"
            ? "bg-green-100 text-green-800"
            : row.raider_verificationFromAdmin === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {row.raider_verificationFromAdmin}
        </span>
      ),
    },
    {
      header: "Onboarding Type",
      accessor: "LoginType",
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${row.LoginType === "ADMIN_SIGNIN"
            ? "bg-yellow-300 text-black"
            : "bg-gray-300 text-black"
            }`}
        >
          {row.LoginType === "ADMIN_SIGNIN" ? "Assigned by Admin" : "Self Registered"}
        </span>
      ),
    },
    {
      header: "User Rating",
      accessor: "totalRatings",

    },
    {
      header: "Availability Status",
      accessor: "is_available",
      cell: (row) => (
        <div>
          <p className="font-semibold">
            {row.is_available ? (
              <span className="text-green-600">Available</span>
            ) : (
              <span className="text-orange-600">Unavailable</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            Online: {row.is_online ? "Yes" : "No"}
          </p>
          {row.isSuspended && (
            <p className="text-xs text-red-500">Suspended</p>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (row) => <DriverAction row={row as any} onDeleteSuccess={refetch} />,
    },
  ];

  return { driverColumns, drivers, isLoading, isError, totalItems };
};