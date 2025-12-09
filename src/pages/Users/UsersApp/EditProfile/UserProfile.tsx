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

import toast from "react-hot-toast"; // Import toast
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 👈 Added useNavigate

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Star, Files, Rss, ArrowLeft } from "lucide-react";
// 👈 Import the update mutation
import { useGetUserTypeByIdQuery, useUpdateUserTypeMutation } from "@/redux/features/usersTypes/usersTypesApi";

// ------------------ API RESPONSE TYPE (Simplified for clarity) ------------------
interface ApiUserData {
    id: number;
    username: string;
    email: string;
    phone: string;
    // ... other fields
}

// ------------------ COMPONENT STATE TYPE (Simplified) ------------------
export interface UserProfileType {
    id: string;
    username: string;
    email: string;
    phone: string;
}

// ------------------ COMPONENT LOGIC ------------------
export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate(); // 👈 Initialize useNavigate hook

    const { data: userData, isLoading, isError } = useGetUserTypeByIdQuery(id);
    // 👈 Initialize the update mutation hook
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserTypeMutation();
    
    const [formData, setFormData] = useState<Partial<UserProfileType>>({});
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // ------------------ CORE LOGIC: DATA MAPPING ------------------
    useEffect(() => {
        if (userData && userData.data) {
            const apiData = userData.data as ApiUserData;

            // 1. Set username directly from API response
            const initialFormData: UserProfileType = {
                id: String(apiData.id), 
                username: apiData.username, // Set the username directly
                email: apiData.email,
                phone: apiData.phone,
            };

            setFormData(initialFormData); // Update formData state with the username
        }
    }, [userData]);

    if (isLoading) return <p>Loading user data...</p>;
    if (isError || !formData.id) return <p>Error fetching user data or data is missing.</p>;

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);
        setProfileImage(imageURL);
    };

    // Form field change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof UserProfileType;
        const value = e.target.value;

        setFormData((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, [name]: value } as UserProfileType;
            return updated;
        });
    };

    // ------------------ UPDATED: HANDLE UPDATE LOGIC WITH TOAST ------------------
    const handleEdit = async () => {
        if (!formData.id || !formData.username || !formData.email || !formData.phone) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // 1. Construct the API payload
        const updatePayload = {
            username: formData.username.trim(),
            email: formData.email,
            phone: formData.phone,
        };

        console.log("Sending Payload:", updatePayload);

        try {
            // 2. Call the mutation
            const response = await updateUser({ id: formData.id, updatedData: updatePayload }).unwrap();
            
            // 3. Show SUCCESS toast
            toast.success(response?.message || "User updated successfully! 🎉");
            
            // 4. Navigate back to the previous page on success
            navigate(-1); 
            
        } catch (error) {
            // Handle API error structure (assuming it returns an object with a data/error field)
            const apiError = error as { data?: { message?: string } };
            const errorMessage = apiError?.data?.message || "Failed to update user profile.";
            
            // 5. Show ERROR toast
            toast.error(errorMessage);
            console.error("Failed to update user:", error);
        }
    };

    const getStringValue = (key: keyof UserProfileType): string =>
        String(formData[key] ?? "");

    // ------------------ ONLY THE REQUIRED FIELDS ------------------
    const baseFields = [
        ["username", "Full Name"],
        ["email", "Email Address"],
        ["phone", "Phone Number"],
    ] as Array<[keyof UserProfileType, string]>; // Removed firstName and lastName
    // ----------------------------------------------------------------

    return (
        <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
            <h1 className="text-2xl font-semibold text-gray-900">User Profile</h1>

            <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
                <div className="absolute top-6 left-6">
            {/* Button to navigate back */}
            <Button 
                className="bg-white cursor-pointer" 
                onClick={() => navigate(-1)} // Trigger navigate on click
            >
                <ArrowLeft className="text-black" size={20} />
            </Button>
        </div>
                {/*  DOWNLOAD */}
                <div className="absolute top-6 right-6 flex gap-3"> 
                    <Button variant="outline" className="flex gap-2 text-black border border-blue-500">
                        <Files size={16} /> Download
                    </Button>
                </div>

                {/* PROFILE IMAGE */}
                <div className="flex justify-center">
                    <label className="cursor-pointer mt-8 sm:mt-0">
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
                        />
                    </label>
                </div>

                {/* RATING */}
                <div className="text-center mt-4">
                    <p className="flex justify-center items-center gap-2 text-lg font-medium">
                        <Star className="text-yellow-500" size={20} />
                         /5 <Rss />
                        <span className="text-gray-700">  Followers</span>
                    </p>
                    <p className="mt-1 text-gray-800 font-medium">
                        Total Deliveries :  
                    </p>
                    <p className="text-red-500 font-medium">
                        Total Cancellations :  
                    </p>
                    <p className="text-gray-800 font-medium">
                        Total Incentives :  
                    </p>
                </div>

                {/* MAIN FORM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                    {/* Iterate over the required fields */}
                    {baseFields.map(([key, label]) => (
                        <div key={key}>
                            <Label className="text-sm font-semibold pb-2">{label}</Label>
                            <Input name={key} value={getStringValue(key)} onChange={handleChange} />
                        </div>
                    ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col justify-center gap-4 mt-10">
                    <Button
                        className="w-full cursor-pointer sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-5 text-lg rounded-lg self-center"
                        onClick={handleEdit}
                        disabled={isUpdating} 
                    >
                        {isUpdating ? 'Updating...' : 'Update Profile'} 
                    </Button>
                </div>
            </div>
        </div>
    );
}
