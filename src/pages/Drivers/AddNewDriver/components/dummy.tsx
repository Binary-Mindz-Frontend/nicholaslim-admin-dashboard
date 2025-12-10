// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import toast from "react-hot-toast";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Camera } from "lucide-react";

// import {
//   userProfileSchema,
//   UserProfileType,
// } from "../DriverList/EditDriverProfile/userProfile.schema";
// import { useAddRiderProfileMutation } from "@/redux/features/drivers/driversApi";

// import UploadBox from "./components/UploadBox";

// export default function AddNewDriver() {
//   // ⭐ Profile Image State + Preview
//   const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
//   const [profilePreview, setProfilePreview] = useState<string | null>(null);

//   // ⭐ Document Upload States
//   const [documents, setDocuments] = useState({
//     nidFront: null as File | null,
//     nidBack: null as File | null,
//     licenseFront: null as File | null,
//     licenseBack: null as File | null,
//     vehicleFront: null as File | null,
//     vehicleBack: null as File | null,
//     driverSide: null as File | null,
//     passengerSide: null as File | null,
//     vehicleLog: null as File | null,
//     vehiclePolicy: null as File | null,
//   });

//   // ⭐ API Mutation
//   const [addRider, { isLoading }] = useAddRiderProfileMutation();

//   // ⭐ Form Setup
//   const form = useForm<UserProfileType>({
//     resolver: zodResolver(userProfileSchema),
//     defaultValues: {
//       raider_name: "",
//       contact_number: "",
//       email_address: "",
//       dob: "",
//       gender: "",
//       driver_photos: [],
//       emergency_contact_name: "",
//       emergency_contact_number: "",
//       identity_card_number: "",
//       nid_front_images: "",
//       nid_back_images: "",
//       driving_license_number: "",
//       driving_license_issue_date: "",
//       driving_license_expire_date: "",
//       driving_license_front_images: "",
//       driving_license_back_images: "",
//       vehicle_plate_number: "",
//       vehicle_type: "",
//       vehicle_brand: "",
//       registration_date: "",
//       vehicle_front_images: "",
//       vehicle_back_images: "",
//       vehicle_driver_side_images: "",
//       vehicle_passenger_side_images: "",
//       vehicle_log_number: "",
//       vehicle_log_issue_date: "",
//       vehicle_log_expire_date: "",
//       vehicle_log_images: "",
//       vehicle_policy_number: "",
//       vehicle_policy_issue_date: "",
//       vehicle_policy_expire_date: "",
//       vehicle_policy_images: "",
//       current_address: "",
//       current_apartment: "",
//       current_state_province: "",
//       current_city: "",
//       current_country: "",
//       current_zip_post_code: "",
//       permanent_address: "",
//       permanent_apartment: "",
//       permanent_state_province: "",
//       permanent_city: "",
//       permanent_country: "",
//       permanent_zip_post_code: "",
//       bank_name: "",
//       account_number: "",
//     },
//   });

//   const { register, handleSubmit, formState } = form;

//   // ⭐ Profile Image Upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;

//     setProfileImageFile(file);
//     if (file) {
//       setProfilePreview(URL.createObjectURL(file));
//     }
//   };

//   // ⭐ Document Upload
//   const handleDocumentChange = (key: string, file: File | null) => {
//     setDocuments((prev) => ({ ...prev, [key]: file }));
//   };

//   // ⭐ On Submit
//   const onSubmit = async (data: UserProfileType) => {
//     try {
//       console.log("📌 FORM DATA:", data);
//       console.log("📌 PROFILE IMAGE:", profileImageFile);
//       console.log("📌 DOCUMENT FILES:", documents);

//       // TODO: Upload images to server and get URLs
//       // For now, using placeholder strings
//       const riderData = {
//         ...data,
//         driver_photos: profileImageFile ? ["uploaded_profile.jpg"] : [],
//         nid_front_images: documents.nidFront ? "nid_front.jpg" : "",
//         nid_back_images: documents.nidBack ? "nid_back.jpg" : "",
//         driving_license_front_images: documents.licenseFront ? "dl_front.jpg" : "",
//         driving_license_back_images: documents.licenseBack ? "dl_back.jpg" : "",
//         vehicle_front_images: documents.vehicleFront ? "vehicle_front.jpg" : "",
//         vehicle_back_images: documents.vehicleBack ? "vehicle_back.jpg" : "",
//         vehicle_driver_side_images: documents.driverSide ? "driver_side.jpg" : "",
//         vehicle_passenger_side_images: documents.passengerSide ? "passenger_side.jpg" : "",
//         vehicle_log_images: documents.vehicleLog ? "log.jpg" : "",
//         vehicle_policy_images: documents.vehiclePolicy ? "policy.jpg" : "",
//       };

//       await addRider(riderData).unwrap();
//       toast.success("Driver added successfully!");
//     } catch (error: any) {
//       console.error("Failed to add driver:", error);
//       toast.error(error?.data?.message || "Failed to add driver");
//     }
//   };

//   // Dropdown Options
//   const genderOptions = ["MALE", "FEMALE", "OTHER"];
//   const stateOptions = [
//     "Dhaka Division",
//     "Chattogram Division",
//     "Khulna Division",
//     "Sylhet Division",
//     "Rajshahi Division",
//     "Barishal Division",
//     "Rangpur Division",
//     "Mymensingh Division",
//   ];
//   const vehicleTypes = ["MOTORCYCLE", "CAR", "PICKUP", "CNG", "TRUCK"];
//   const bankOptions = ["Dutch-Bangla Bank", "BRAC Bank", "Sonali Bank", "City Bank", "IBBL"];
//   const countryOptions = ["Bangladesh", "India", "Pakistan"];

//   // All Fields with NEW schema keys
//   const allFields: { key: keyof UserProfileType; label: string }[] = [
//     { key: "raider_name", label: "Full Name" },
//     { key: "contact_number", label: "Phone Number" },
//     { key: "email_address", label: "Email Address" },
//     { key: "dob", label: "Date of Birth" },
//     { key: "gender", label: "Gender" },
//     { key: "emergency_contact_name", label: "Emergency Contact Name" },
//     { key: "emergency_contact_number", label: "Emergency Contact Number" },
//     { key: "identity_card_number", label: "Identity Card Number" },

//     // Current Address
//     { key: "current_address", label: "Current Address" },
//     { key: "current_apartment", label: "Current Apartment" },
//     { key: "current_city", label: "Current City" },
//     { key: "current_state_province", label: "Current State/Province" },
//     { key: "current_country", label: "Current Country" },
//     { key: "current_zip_post_code", label: "Current Postal Code" },

//     // Permanent Address
//     { key: "permanent_address", label: "Permanent Address" },
//     { key: "permanent_apartment", label: "Permanent Apartment" },
//     { key: "permanent_city", label: "Permanent City" },
//     { key: "permanent_state_province", label: "Permanent State/Province" },
//     { key: "permanent_country", label: "Permanent Country" },
//     { key: "permanent_zip_post_code", label: "Permanent Postal Code" },

//     // Driving License
//     { key: "driving_license_number", label: "Driving License Number" },
//     { key: "driving_license_issue_date", label: "License Issue Date" },
//     { key: "driving_license_expire_date", label: "License Expiry Date" },

//     // Vehicle Information
//     { key: "vehicle_plate_number", label: "Vehicle Plate Number" },
//     { key: "vehicle_type", label: "Vehicle Type" },
//     { key: "vehicle_brand", label: "Vehicle Brand" },
//     { key: "registration_date", label: "Registration Date" },
//     { key: "vehicle_log_number", label: "Vehicle Log Number" },
//     { key: "vehicle_log_issue_date", label: "Vehicle Log Issue Date" },
//     { key: "vehicle_log_expire_date", label: "Vehicle Log Expiry Date" },

//     // Vehicle Policy
//     { key: "vehicle_policy_number", label: "Policy Number" },
//     { key: "vehicle_policy_issue_date", label: "Policy Issue Date" },
//     { key: "vehicle_policy_expire_date", label: "Policy Expiry Date" },

//     // Bank Information
//     { key: "bank_name", label: "Bank Name" },
//     { key: "account_number", label: "Account Number" },
//   ];

//   const isDateField = (field: string) =>
//     field.toLowerCase().includes("date") || field.includes("dob");

//   return (
//     <div className="px-8 sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
//       <h1 className="text-2xl font-semibold text-gray-900 pt-2 sm:pt-0">Add New Driver</h1>

//       <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
//         {/* ⭐ Profile Image */}
//         <div className="flex justify-center">
//           <label className="cursor-pointer mt-8 sm:mt-0">
//             <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border overflow-hidden">
//               {profilePreview ? (
//                 <img
//                   src={profilePreview}
//                   className="w-full h-full object-cover"
//                   alt="Profile"
//                 />
//               ) : (
//                 <Camera size={32} className="text-gray-500" />
//               )}
//             </div>

//             <input
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={handleImageUpload}
//             />
//           </label>
//         </div>

//         {/* ⭐ Form Fields */}
//         <div className="mt-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {allFields.map(({ key, label }) => (
//               <div key={key}>
//                 <Label className="text-sm font-semibold pb-2">{label}</Label>

//                 {/* Gender */}
//                 {key === "gender" && (
//                   <select {...register(key)} className="w-full border bg-secondary rounded p-2">
//                     <option value="">Select Gender</option>
//                     {genderOptions.map((g) => (
//                       <option key={g} value={g}>{g}</option>
//                     ))}
//                   </select>
//                 )}

//                 {/* State/Province */}
//                 {(key === "current_state_province" || key === "permanent_state_province") && (
//                   <select {...register(key)} className="w-full border bg-secondary rounded p-2">
//                     <option value="">Select State</option>
//                     {stateOptions.map((s) => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 )}

//                 {/* Country */}
//                 {(key === "current_country" || key === "permanent_country") && (
//                   <select {...register(key)} className="w-full border bg-secondary rounded p-2">
//                     <option value="">Select Country</option>
//                     {countryOptions.map((c) => (
//                       <option key={c} value={c}>{c}</option>
//                     ))}
//                   </select>
//                 )}

//                 {/* Vehicle Type */}
//                 {key === "vehicle_type" && (
//                   <select {...register(key)} className="w-full border bg-secondary rounded p-2">
//                     <option value="">Select Vehicle Type</option>
//                     {vehicleTypes.map((v) => (
//                       <option key={v} value={v}>{v}</option>
//                     ))}
//                   </select>
//                 )}

//                 {/* Bank */}
//                 {key === "bank_name" && (
//                   <select {...register(key)} className="w-full border bg-secondary rounded p-2">
//                     <option value="">Select Bank</option>
//                     {bankOptions.map((b) => (
//                       <option key={b} value={b}>{b}</option>
//                     ))}
//                   </select>
//                 )}

//                 {/* Date Fields */}
//                 {isDateField(key) &&
//                   ![
//                     "gender",
//                     "current_state_province",
//                     "permanent_state_province",
//                     "current_country",
//                     "permanent_country",
//                     "vehicle_type",
//                     "bank_name",
//                   ].includes(key) && (
//                     <input
//                       type="date"
//                       {...register(key)}
//                       className="w-full border bg-secondary rounded p-2"
//                     />
//                   )}

//                 {/* Normal Input */}
//                 {![
//                   "gender",
//                   "current_state_province",
//                   "permanent_state_province",
//                   "current_country",
//                   "permanent_country",
//                   "vehicle_type",
//                   "bank_name",
//                 ].includes(key) &&
//                   !isDateField(key) && (
//                     <Input className="bg-secondary rounded" {...register(key)} />
//                   )}

//                 {formState.errors[key] && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {formState.errors[key]?.message}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ⭐ Document Upload Sections */}
//         <div className="mt-10 space-y-10">
//           {/* Identity Card */}
//           <div>
//             <h2 className="font-semibold text-lg">Personal Documents</h2>
//             <p className="text-sm text-gray-600">Upload Your Identity Card</p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//               <UploadBox
//                 label="Front side photo of your Identity card"
//                 onChange={(file) => handleDocumentChange("nidFront", file)}
//               />
//               <UploadBox
//                 label="Back side photo of your Identity card"
//                 onChange={(file) => handleDocumentChange("nidBack", file)}
//               />
//             </div>
//           </div>

//           {/* Driving License */}
//           <div>
//             <h2 className="font-semibold text-lg">Driving License</h2>
//             <p className="text-sm text-gray-600">Upload Your License</p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//               <UploadBox
//                 label="Front of Driving License"
//                 onChange={(file) => handleDocumentChange("licenseFront", file)}
//               />
//               <UploadBox
//                 label="Back of Driving License"
//                 onChange={(file) => handleDocumentChange("licenseBack", file)}
//               />
//             </div>
//           </div>

//           {/* Vehicle Photos */}
//           <div>
//             <h2 className="font-semibold text-lg">Vehicle Photos</h2>
//             <p className="text-sm text-gray-600">Upload Your Vehicle Images</p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//               <UploadBox
//                 label="Vehicle Front Side"
//                 onChange={(file) => handleDocumentChange("vehicleFront", file)}
//               />
//               <UploadBox
//                 label="Vehicle Back Side"
//                 onChange={(file) => handleDocumentChange("vehicleBack", file)}
//               />
//               <UploadBox
//                 label="Driver Side"
//                 onChange={(file) => handleDocumentChange("driverSide", file)}
//               />
//               <UploadBox
//                 label="Passenger Side"
//                 onChange={(file) => handleDocumentChange("passengerSide", file)}
//               />
//             </div>
//           </div>

//           {/* Policy & Log */}
//           <div>
//             <h2 className="font-semibold text-lg">Vehicle Documents</h2>
//             <p className="text-sm text-gray-600">
//               Upload Vehicle Log & Policy Documents
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//               <UploadBox
//                 label="Vehicle Log Photo"
//                 onChange={(file) => handleDocumentChange("vehicleLog", file)}
//               />
//               <UploadBox
//                 label="Vehicle Policy Photo"
//                 onChange={(file) => handleDocumentChange("vehiclePolicy", file)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ⭐ Submit Button */}
//         <div className="flex justify-center mt-10">
//           <Button
//             className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-5 text-lg rounded-lg"
//             onClick={handleSubmit(onSubmit)}
//             disabled={isLoading}
//           >
//             {isLoading ? "Adding..." : "Add Now"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }