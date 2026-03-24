/* eslint-disable react-hooks/exhaustive-deps */

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Camera, Star, Files, Rss } from "lucide-react";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { useGetUserTypeByIdQuery } from "@/redux/features/usersTypes/usersTypesApi";

// // ------------------ TYPES ------------------
// export interface UserProfileType {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   dob: string;
//   gender: string;
//   emergencyContact: string;
//   driverId: string;
//   address: string;
//   city: string;
//   state: string;
//   postal: string;
//   rating: number;
//   followers: number;
//   deliveries: number;
//   cancellations: number;
//   incentives: string;

//   drivingLicense: string;
//   dlIssueDate: string;
//   dlExpiryDate: string;

//   vehiclePlate1: string;
//   vehicleType: string;
//   vehiclePlate2: string;
//   model: string;
//   registrationDate: string;
//   vehicleLog: string;
//   vehicleIssueDate: string;
//   vehicleExpiryDate: string;

//   policyNumber: string;
//   policyIssue: string;
//   policyExpiry: string;

//   bank: string;
//   accountNumber: string;
// }

// export default function UserProfile() {
//   const { id } = useParams();
//   const { data: userData, isLoading, isError } = useGetUserTypeByIdQuery(id); // Fetch user data by ID
//   const [formData, setFormData] = useState<UserProfileType | null>(null);
//   const [profileImage, setProfileImage] = useState<string | null>(null); // Profile image state

// console.log("Fetched user data:", userData); // Check the structure of the response

//   useEffect(() => {
//     if (userData && userData.data) {
//       setFormData(userData.data); // Set the fetched user data into the formData state
//     }
//   }, [userData]);

//   if (isLoading) return <p>Loading user data...</p>;
//   if (isError || !formData) return <p>Error fetching user data.</p>;

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const imageURL = URL.createObjectURL(file);
//     setProfileImage(imageURL); // Update profile image
//   };

//   // Form field change handler
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const name = e.target.name as keyof UserProfileType;
//     const value = e.target.value;

//     setFormData((prev) => {
//       if (!prev) return prev;
//       const updated = { ...prev, [name]: value } as UserProfileType;
//       return updated;
//     });
//   };

//   const handleEdit = () => {
//     // Handle profile update logic
//     console.log("Updated User:", formData);
//   };

//   const handleDelete = () => {
//     // Handle delete logic
//     console.log("User Deleted:", id);
//   };

//   const getStringValue = (key: keyof UserProfileType): string =>
//     String(formData[key] ?? "");

//   // Form field groups
//   const baseFields = [
//     ["firstName", "First Name"],
//     ["lastName", "Last Name"],
//     ["email", "Email Address"],
//     ["phone", "Phone Number"],
//     ["dob", "Date of Birth"],
//     ["gender", "Gender"],
//     ["emergencyContact", "Emergency Contact"],
//     ["driverId", "Driver ID"],
//     ["address", "Address"],
//     ["city", "City"],
//     ["state", "State"],
//     ["postal", "Zip / Postal Code"],
//   ] as Array<[keyof UserProfileType, string]>; // Base fields for the form

//   const drivingLicenseFields = [
//     ["drivingLicense", "Driving License Number"],
//     ["dlIssueDate", "Issue Date"],
//     ["dlExpiryDate", "Expiry Date"],
//   ] as Array<[keyof UserProfileType, string]>; // Driving License fields

//   const vehicleFields = [
//     ["vehiclePlate1", "Vehicle Number Plate"],
//     ["vehicleType", "Vehicle Type"],
//     ["vehiclePlate2", "Vehicle Number Plate"],
//     ["model", "Model"],
//     ["registrationDate", "Registration Date"],
//     ["vehicleLog", "Vehicle Log Number"],
//     ["vehicleIssueDate", "Issue Date"],
//     ["vehicleExpiryDate", "Expiry Date"],
//   ] as Array<[keyof UserProfileType, string]>; // Vehicle fields

//   const insuranceFields = [
//     ["policyNumber", "Vehicle Policy Number"],
//     ["policyIssue", "Issue Date"],
//     ["policyExpiry", "Expiry Date"],
//   ] as Array<[keyof UserProfileType, string]>; // Insurance fields

//   const bankFields = [
//     ["bank", "Bank"],
//     ["accountNumber", "Account Number"],
//   ] as Array<[keyof UserProfileType, string]>; // Bank details fields

//   return (
//     <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
//       <h1 className="text-2xl font-semibold text-gray-900">User Profile</h1>

//       <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
//         {/* UPLOAD / DOWNLOAD */}
//         <div className="absolute top-6 right-6 flex gap-3">
//           <Button variant="outline" className="flex gap-2 border border-green text-black">
//             <Files size={16} /> Upload
//           </Button>
//           <Button variant="outline" className="flex gap-2 text-black border border-blue-500">
//             <Files size={16} /> Download
//           </Button>
//         </div>

//         {/* PROFILE IMAGE */}
//         <div className="flex justify-center">
//           <label className="cursor-pointer mt-8 sm:mt-0">
//             <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden">
//               {profileImage ? (
//                 <img
//                   src={profileImage}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <Camera className="text-gray-500" size={32} />
//               )}
//             </div>

//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleImageUpload}
//             />
//           </label>
//         </div>

//         {/* RATING */}
//         <div className="text-center mt-4">
//           <p className="flex justify-center items-center gap-2 text-lg font-medium">
//             <Star className="text-yellow-500" size={20} />
//             {formData.rating}/5 <Rss />
//             <span className="text-gray-700">{formData.followers} Followers</span>
//           </p>
//           <p className="mt-1 text-gray-800 font-medium">
//             Total Deliveries : {formData.deliveries}
//           </p>
//           <p className="text-red-500 font-medium">
//             Total Cancellations : {formData.cancellations}
//           </p>
//           <p className="text-gray-800 font-medium">
//             Total Incentives : {formData.incentives}
//           </p>
//         </div>

//         {/* MAIN FORM */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
//           {baseFields.map(([key, label]) => (
//             <div key={key}>
//               <Label className="text-sm font-semibold pb-2">{label}</Label>
//               <Input name={key} value={getStringValue(key)} onChange={handleChange} />
//             </div>
//           ))}

//           {drivingLicenseFields.map(([key, label]) => (
//             <div key={key}>
//               <Label className="text-sm font-semibold pb-2">{label}</Label>
//               <Input name={key} value={getStringValue(key)} onChange={handleChange} />
//             </div>
//           ))}

//           {vehicleFields.map(([key, label]) => (
//             <div key={key}>
//               <Label className="text-sm font-semibold pb-2">{label}</Label>
//               <Input name={key} value={getStringValue(key)} onChange={handleChange} />
//             </div>
//           ))}

//           {insuranceFields.map(([key, label]) => (
//             <div key={key}>
//               <Label className="text-sm font-semibold pb-2">{label}</Label>
//               <Input name={key} value={getStringValue(key)} onChange={handleChange} />
//             </div>
//           ))}

//           {bankFields.map(([key, label]) => (
//             <div key={key}>
//               <Label className="text-sm font-semibold pb-2">{label}</Label>
//               <Input name={key} value={getStringValue(key)} onChange={handleChange} />
//             </div>
//           ))}
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex flex-col justify-center gap-4 mt-10">
//           <Button
//             className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-5 text-lg rounded-lg self-center"
//             onClick={handleEdit}
//           >
//             Edit Profile
//           </Button>

//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold px-10 py-5 text-lg rounded-lg self-center">
//                 Delete Account
//               </Button>
//             </AlertDialogTrigger>

//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action cannot be undone.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>

//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction
//                   className="bg-red-500"
//                   onClick={handleDelete}
//                 >
//                   Confirm Delete
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </div>
//     </div>
//   );
// }

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, ArrowLeft, X } from "lucide-react";
// Import the update mutation
import {
  useGetUserTypeByIdQuery,
  useUpdateUserTypeMutation,
} from "@/redux/features/usersTypes/usersTypesApi";
import {
  useAddaddUserToRoleMutation,
  useGetRoleBasedAccessControlQuery,
  useRemoveUserFromRoleMutation,
} from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";


// ------------------ API RESPONSE TYPE ------------------
interface ApiUserData {
  id: number;
  username: string;
  email: string;
  phone: string;


}

// ------------------ COMPONENT STATE TYPE ------------------
export interface UserProfileType {
  id: string;
  username: string;
  email: string;
  phone: string;
}

// ------------------ PHONE INPUT COMPONENT ------------------
const COUNTRY_CODES = [
  { code: "+65", label: "🇸🇬 +65", country: "SG" },
  { code: "+60", label: "🇲🇾 +60", country: "MY" },
  { code: "+91", label: "🇮🇳 +91", country: "IN" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const PhoneInput = ({
  value,
  onChange,
  placeholder = "XXXX XXXX",
  error,
  disabled,
}: PhoneInputProps) => {
  const selectedCountry =
    COUNTRY_CODES.find((c) => value.startsWith(c.code)) || COUNTRY_CODES[0];

  const localValue = value.startsWith(selectedCountry.code)
    ? value.slice(selectedCountry.code.length).trimStart()
    : value;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    onChange(`${newCode}${localValue ? " " + localValue : ""}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9\s]/g, "");
    onChange(`${selectedCountry.code}${raw ? " " + raw : ""}`);
  };

  return (
    <div>
      <div
        className={`flex items-center w-full border rounded bg-[#FFFAE6] focus-within:border-yellow-400 overflow-hidden ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      >
        <select
          value={selectedCountry.code}
          onChange={handleCountryChange}
          disabled={disabled}
          className="flex items-center gap-1.5 px-2 py-2 bg-[#FFFAE6] border-r border-gray-300 text-sm font-semibold text-gray-700 whitespace-nowrap outline-none cursor-pointer shrink-0"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-3 py-2 focus:outline-none text-sm bg-transparent"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ------------------ COMPONENT LOGIC ------------------
export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine mode from URL (e.g., /users-app/1?mode=view)
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get("mode") === "edit";

  const { data: userData, isLoading, isError, refetch } = useGetUserTypeByIdQuery(id);
  console.log(userData, "userData");
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserTypeMutation();

  const [formData, setFormData] = useState<Partial<UserProfileType>>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  // console.log("Fetched user data:", userData);
  const { data: roleData = [] } = useGetRoleBasedAccessControlQuery({ limit: 1000 });
  const [addUserToRole] = useAddaddUserToRoleMutation();
  const [removeUserFromRole] = useRemoveUserFromRoleMutation();
  console.log(roleData, "roleData");

  const [userRoles, setUserRoles] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (userData && userData.data && !isSyncing) {
      const apiData = userData.data as ApiUserData;

      const initialFormData: UserProfileType = {
        id: String(apiData.id),
        username: apiData.username,
        email: apiData.email,
        phone: apiData.phone,
      };

      if (!isEditMode || !formData.id) {
        setFormData(initialFormData);
        setUserRoles(userData?.data?.roles || []);
      }
    }
  }, [userData, isEditMode, isSyncing]);

  console.log(userData, 'userData')

  if (isLoading)
    return <p className="text-center p-10">Loading user data...</p>;

  if (isError)
    return (
      <p className="text-center p-10 text-red-500">Error fetching user data.</p>
    );

  if (!userData?.data) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setProfileImage(imageURL);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode) return; // Prevent changes in view mode
    const name = e.target.name as keyof UserProfileType;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    if (
      !formData.id ||
      !formData.username ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatePayload = {
      username: formData.username.trim(),
      email: formData.email,
      phone: formData.phone,
    };

    setIsSyncing(true);
    try {
      const response = await updateUser({
        id: formData.id,
        updatedData: updatePayload,
      }).unwrap();
      toast.success(response?.message || "User updated successfully! 🎉");

      const existingRoleIds: number[] = (userData?.data?.roles || []).map(
        (r: { id: number }) => r.id
      );
      const currentRoleIds = userRoles.map((r) => r.id);

      const rolesToAdd = userRoles.filter(
        (r) => !existingRoleIds.includes(r.id)
      );
      const rolesToRemove = (userData?.data?.roles || []).filter(
        (r: { id: number }) => !currentRoleIds.includes(r.id)
      );

      for (const role of rolesToAdd) {
        await addUserToRole({ roleId: role.id, userId: Number(id) }).unwrap();
      }

      for (const role of rolesToRemove) {
        await removeUserFromRole({
          roleId: role.id,
          userId: Number(id),
        }).unwrap();
      }
      await refetch();
      navigate(-1);
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage =
        apiError?.data?.message || "Failed to update user profile.";
      toast.error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStringValue = (key: keyof UserProfileType): string =>
    String(formData[key] ?? "");

  const baseFields = [
    ["username", "Full Name"],
    ["email", "Email Address"],
    ["phone", "Phone Number"],
  ] as Array<[keyof UserProfileType, string]>;

  // const handleRoleChange = async (value: string) => {
  //   const role = (roleData?.data ?? roleData)?.find(
  //     (r: { id: number }) => r.id === Number(value)
  //   );
  //   if (!role) return;

  //   // Avoid duplicate chips
  //   const alreadyAdded = userRoles.some((r) => r.id === role.id);
  //   if (alreadyAdded) {
  //     toast.error(`${role.name} is already assigned.`);
  //     setSelectedRole("");
  //     return;
  //   }

  //   // Optimistically add the chip
  //   setUserRoles((prev) => [...prev, { id: role.id, name: role.name }]);
  //   setSelectedRole(""); // reset select immediately

  //   toast.loading(`Assigning role ${role.name}...`);
  //   try {
  //     const response = await addUserToRole({
  //       roleId: Number(value),
  //       userId: Number(id),
  //     }).unwrap();
  //     toast.dismiss();
  //     if (response.success) {
  //       toast.success(response.message || "Role assigned successfully!");
  //     } else {
  //       // rollback on unexpected non-success
  //       setUserRoles((prev) => prev.filter((r) => r.id !== role.id));
  //       toast.error(response.message || "Failed to assign role");
  //     }
  //   } catch (error: any) {
  //     // rollback on error
  //     setUserRoles((prev) => prev.filter((r) => r.id !== role.id));
  //     toast.dismiss();
  //     toast.error(error?.data?.message || "Failed to assign role");
  //   }
  // };

  const handleRoleChange = (value: string) => {
    const role = (roleData?.data ?? roleData)?.find(
      (r: { id: number }) => r.id === Number(value)
    );
    if (!role) return;

    const alreadyAdded = userRoles.some((r) => r.id === role.id);
    if (alreadyAdded) {
      toast.error(`${role.name} is already assigned.`);
      setSelectedRole("");
      return;
    }

    // Just update local state, no API call
    setUserRoles((prev) => [...prev, { id: role.id, name: role.name }]);
    setSelectedRole("");
  };

  const handleRemoveRole = (roleId: number) => {
    setUserRoles((prev) => prev.filter((role) => role.id !== roleId));
  };


  console.log(roleData?.data, 'roleData')

  return (
    <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
      <h1 className="text-2xl font-semibold text-gray-900">
        {isEditMode ? "Edit User Profile" : "User Profile"}
      </h1>

      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
        <div className="absolute top-6 left-6">
          <Button
            variant="ghost"
            className="bg-white cursor-pointer rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="text-black" size={20} />
          </Button>
        </div>

        {/* <div className="absolute top-6 right-6 flex gap-3"> 
                    <Button variant="outline" className="flex gap-2 text-black border border-blue-500 hover:bg-blue-50">
                        <Files size={16} /> Download
                    </Button>
                </div> */}

        {/* PROFILE IMAGE SECTION */}
        <div className="flex flex-col items-center justify-center">
          <label
            className={`${isEditMode ? "cursor-pointer" : "cursor-default"} mt-8 sm:mt-0`}
          >
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="text-gray-500" size={32} />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={!isEditMode}
            />
          </label>
        </div>

        {/* RATING & STATS */}
        <div className="text-center mt-4">
          <p className="flex justify-center items-center gap-2 text-lg font-medium">
            {/* <Star className="text-yellow-500" size={20} />
                         {userData?.data?.avg_customerRating} /5  */}
            {/* <span className="text-gray-700"> Followers</span> */}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-gray-800 font-medium">Total Complete : </p>
            <p className="text-red-500 font-medium">Total Cancellations : </p>
            {/* <p className="text-gray-800 font-medium">Total Incentives : </p> */}
          </div>
          {/* EXTRA BUTTONS (ONLY IN VIEW MODE) */}
          {!isEditMode && (
            <div className="flex justify-center gap-3 mt-6">
              <Button
                onClick={() => navigate(`/favourite-drivers/${id}`)}
                variant="outline"
                className="flex gap-2 text-black bg-[#FFEA96] hover:bg-[#FFEA96] cursor-pointer"
              >
                Favourite Drivers
              </Button>
              <Button
                onClick={() => navigate(`/order-history/${id}`)}
                variant="outline"
                className="flex gap-2 text-black bg-[#FFEA96] hover:bg-[#FFEA96] cursor-pointer"
              >
                Orders History
              </Button>
            </div>
          )}
        </div>

        {/* MAIN FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          {baseFields.map(([key, label]) => (
            <div key={key}>
              <Label className="text-sm font-semibold pb-2">{label}</Label>
              {key === "phone" && isEditMode ? (
                <PhoneInput
                  value={formData.phone || ""}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, phone: val }))
                  }
                  disabled={isSyncing}
                />
              ) : (
                <Input
                  name={key}
                  value={getStringValue(key)}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  className={
                    !isEditMode
                      ? "bg-gray-50 border-gray-200 cursor-default focus:ring-0"
                      : "focus:ring-orange-500 outline-none transition-all focus:ring-2"
                  }
                />
              )}
            </div>
          ))}
          {/* ROLE SECTION */}
          <div className="col-span-1">
            <Label className="text-sm font-semibold pb-2">
              {isEditMode ? "Roles" : "Assigned Roles"}
            </Label>

            {/* Role select — only in edit mode */}
            {isEditMode && (
              <Select
                value={selectedRole}
                onValueChange={handleRoleChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role to add" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {roleData?.data?.map(
                    (role: { id: number; name: string; isActive: boolean }) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}

            {/* Role chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {userRoles.length > 0 ? (
                userRoles.map((role) => (
                  <div
                    key={role.id}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                  >
                    {role.name}
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role.id)}
                        className="hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-yellow-200"
                      >
                        <X size={14} className="stroke-3" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No roles assigned</p>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS (ONLY IN EDIT MODE) */}
        {isEditMode && (
          <div className="flex flex-col justify-center gap-4 mt-10">
            <Button
              className="w-full cursor-pointer sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 text-lg rounded-lg self-center"
              onClick={handleEdit}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
