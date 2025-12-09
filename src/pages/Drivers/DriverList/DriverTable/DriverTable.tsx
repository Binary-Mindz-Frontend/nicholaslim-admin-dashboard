/* eslint-disable react-hooks/exhaustive-deps */

// import { useState } from "react";
// import { Column } from "@/components/Dashboard/DataTable/DataTable";
// import { TDriver } from "../../data/DriverData";
// import DriverAction from "../DriverAction/DriverAction";

// export const useDriverColumns = (initialData: TDriver[]) => {
//   const [drivers] = useState<TDriver[]>(initialData); // No ESLint warning

//   const driverColumns: Column<TDriver>[] = [
   
//     {
//       header: "Driver ID",
//       accessor: "id",
//       cell: (row) => (
//         <a href="#" className="text-blue-600 underline">
//           {row.id}
//         </a>
//       ),
//     },

//     {
//       header: "Name",
//       accessor: "name",
//       cell: (row) => (
//         <a href="#" className="text-blue-600 underline">
//           {row.name}
//         </a>
//       ),
//     },

//     {
//       header: "Contact",
//       accessor: "contact",
//       cell: (row) => (
//         <span>{row.contact.slice(0, 2) + "******"}</span>
//       ),
//     },

//     {
//       header: "Zone",
//       accessor: "zone",
//     },

//     {
//       header: "Total Orders",
//       accessor: "totalOrders",
//     },

//     {
//       header: "Driver Onboarding Type",
//       accessor: "onboardingType",
//       cell: (row) => (
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-medium
//             ${
//               row.onboardingType === "Assigned by Admin"
//                 ? "bg-yellow-300 text-black"
//                 : "bg-gray-300 text-black"
//             }
//           `}
//         >
//           {row.onboardingType}
//         </span>
//       ),
//     },

//     {
//       header: "Availability Status",
//       accessor: "availability",
//       cell: (row) => (
//         <div>
//           <p className="font-semibold">
//             {row.availability.status === "Assigned Order"
//               ? `Assigned Order : ${row.availability.assignedOrderCount}`
//               : "Currently Available"}
//           </p>

//           <p className="text-xs text-gray-500">
//             Active Status : {row.availability.activeStatus}
//           </p>
//         </div>
//       ),
//     },

//     {
//       header: "Action",
//       cell: (row) => <DriverAction row={row} />,
//     },
//   ];

//   return { driverColumns, drivers };
// };

import { useState, useEffect, useCallback } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import DriverAction from "../DriverAction/DriverAction";
import { useGetRiderProfilesMutation } from "@/redux/features/drivers/driversApi";
import { debounce } from "lodash";

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
}

interface UseDriverColumnsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  raiderId?: number;
  raider_name?: string;
  raiderVerificationFromAdmin?: string;
}

export const useDriverColumns = (params: UseDriverColumnsParams = {}) => {
  const [drivers, setDrivers] = useState<TDriver[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Use mutation hook for POST request
  const [getRiderProfiles, { isLoading, isError }] = useGetRiderProfilesMutation();


  const fetchDrivers = useCallback(
    debounce(async (fetchParams: UseDriverColumnsParams) => {
      try {
        const result = await getRiderProfiles({
          page: fetchParams.page || 1,
          limit: fetchParams.limit || 10,
          sortBy: fetchParams.sortBy || "created_at",
          sortOrder: fetchParams.sortOrder || "desc",
          raiderId: fetchParams.raiderId,
          raider_name: fetchParams.raider_name,
          raiderVerificationFromAdmin: fetchParams.raiderVerificationFromAdmin,
        }).unwrap();

        if (result?.data) {
          setDrivers(result.data);
          setTotalItems(result?.meta?.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    }, 500), // Wait 500ms after user stops typing
    [getRiderProfiles]
  );

  // Fetch driver data when params change
  useEffect(() => {
    fetchDrivers(params);
    
    // Cleanup function to cancel pending debounced calls
    return () => {
      fetchDrivers.cancel();
    };
  }, [params.page, params.limit, params.sortBy, params.sortOrder, params.raiderId, params.raider_name, params.raiderVerificationFromAdmin, fetchDrivers]);
  // Define columns for the driver data
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
      header: "Raider ID",
      accessor: "userId",
      cell: (row) => (
        <span className="font-medium">
          {row.userId}
        </span>
      ),
    },
    {
      header: "Name",
      accessor: "registrations",
      cell: (row) => (
        <a href="#" className="text-blue-600 underline">
          {row.registrations?.[0]?.raider_name || "N/A"}
        </a>
      ),
    },
    {
      header: "Contact",
      accessor: "registrations",
      cell: (row) => {
        const contact = row.registrations?.[0]?.contact_number || "";
        return (
          <span>
            {contact ? contact.slice(0, 2) + "******" + contact.slice(-2) : "N/A"}
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
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.raider_verificationFromAdmin === "APPROVED"
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
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.LoginType === "Admin"
              ? "bg-yellow-300 text-black"
              : "bg-gray-300 text-black"
          }`}
        >
          {row.LoginType === "Admin" ? "Assigned by Admin" : "Self Registered"}
        </span>
      ),
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
      cell: (row) => <DriverAction row={row as any} />,
    },
  ];

  return { driverColumns, drivers, isLoading, isError, totalItems };
};