/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { userProfileSchema, UserProfileType } from "./userProfile.schema";
import { 
    useGetRiderProfileByIdQuery, 
    useUpdateRiderProfileMutation 
} from "@/redux/features/drivers/driversApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Camera, Star, Files, Rss, ArrowLeft, Medal } from "lucide-react";

export default function EditDriverProfile() {
    const navigate = useNavigate();
    const { id } = useParams();
    

    const [profileImage, setProfileImage] = useState<string | null>(null);
    
    // RTK Query hooks - NOW USING QUERY INSTEAD OF MUTATION
    const { data: driverData, isLoading: isFetching, isError, error } = useGetRiderProfileByIdQuery(
        Number(id),
        { skip: !id } // Skip query if no ID
    );
    
    const [updateRider, { isLoading: isUpdating }] = useUpdateRiderProfileMutation();

    // React Hook Form setup
    const form = useForm<UserProfileType>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {} as UserProfileType,
    });

    const { register, handleSubmit, reset, formState } = form;

    // Populate form when data is fetched
    useEffect(() => {
        if (!driverData) return;

      
        try {
            // Handle different possible response structures
            let registration;
            
            // Case 1: Direct registration data
            if (driverData.registrations && Array.isArray(driverData.registrations)) {
                registration = driverData.registrations[0];
            }
            // Case 2: Data is wrapped in a data property
            else if (driverData.data?.registrations && Array.isArray(driverData.data.registrations)) {
                registration = driverData.data.registrations[0];
            }
            // Case 3: Registration data is at root level
            else if (driverData.raider_name || driverData.contact_number) {
                registration = driverData;
            }
            // Case 4: Data wrapped and registration at root
            else if (driverData.data && (driverData.data.raider_name || driverData.data.contact_number)) {
                registration = driverData.data;
            }

       

            if (!registration) {
                // console.error("No registration data found. Full response:", driverData);
                toast.error("No registration data found for this driver");
                navigate("/driver-list");
                return;
            }

            // Map API data to form schema
            const formData: UserProfileType = {
                raider_name: registration.raider_name || "",
                contact_number: registration.contact_number || "",
                email_address: registration.email_address || "",
                dob: registration.dob || "",
                gender: registration.gender || "",
                driver_photos: registration.driver_photos || [],
                emergency_contact_name: registration.emergency_contact_name || "",
                emergency_contact_number: registration.emergency_contact_number || "",
                identity_card_number: registration.identity_card_number || "",
                nid_front_images: registration.nid_front_images || "",
                nid_back_images: registration.nid_back_images || "",
                driving_license_number: registration.driving_license_number || "",
                driving_license_issue_date: registration.driving_license_issue_date || "",
                driving_license_expire_date: registration.driving_license_expire_date || "",
                driving_license_front_images: registration.driving_license_front_images || "",
                driving_license_back_images: registration.driving_license_back_images || "",
                vehicle_plate_number: registration.vehicle_plate_number || "",
                vehicle_type: registration.vehicle_type || "",
                vehicle_brand: registration.vehicle_brand || "",
                registration_date: registration.registration_date || "",
                vehicle_front_images: registration.vehicle_front_images || "",
                vehicle_back_images: registration.vehicle_back_images || "",
                vehicle_driver_side_images: registration.vehicle_driver_side_images || "",
                vehicle_passenger_side_images: registration.vehicle_passenger_side_images || "",
                vehicle_log_number: registration.vehicle_log_number || "",
                vehicle_log_issue_date: registration.vehicle_log_issue_date || "",
                vehicle_log_expire_date: registration.vehicle_log_expire_date || "",
                vehicle_log_images: registration.vehicle_log_images || "",
                vehicle_policy_number: registration.vehicle_policy_number || "",
                vehicle_policy_issue_date: registration.vehicle_policy_issue_date || "",
                vehicle_policy_expire_date: registration.vehicle_policy_expire_date || "",
                vehicle_policy_images: registration.vehicle_policy_images || "",
                current_address: registration.current_address || "",
                current_apartment: registration.current_apartment || "",
                current_state_province: registration.current_state_province || "",
                current_city: registration.current_city || "",
                current_country: registration.current_country || "",
                current_zip_post_code: registration.current_zip_post_code || "",
                permanent_address: registration.permanent_address || "",
                permanent_apartment: registration.permanent_apartment || "",
                permanent_state_province: registration.permanent_state_province || "",
                permanent_city: registration.permanent_city || "",
                permanent_country: registration.permanent_country || "",
                permanent_zip_post_code: registration.permanent_zip_post_code || "",
                bank_name: registration.bank_name || "",
                account_number: registration.account_number || "",
            };

            reset(formData);
            
            // Set profile image if available
            if (registration.driver_photos?.[0]) {
                setProfileImage(registration.driver_photos[0]);
            }
        } catch (error) {
            console.error("Failed to process driver data:", error);
            toast.error("Failed to load driver data");
        }
    }, [driverData, reset, navigate]);

    // console.log(driverData);

    // Handle error state
    useEffect(() => {
        if (isError) {
            // console.error("Failed to fetch driver:", error);
            toast.error("Driver not found");
            navigate("/driver-list");
        }
    }, [isError, error, navigate]);

    // Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileImage(URL.createObjectURL(file));
    };

    const onSubmit = async (data: UserProfileType) => {
        if (!id) return;

        try {
            await updateRider({
                id: Number(id),
                data: data,
            }).unwrap();

            toast.success("Driver profile updated successfully!");
            navigate("/driver-list");
        } catch (error: any) {
            console.error("Update failed:", error);
            toast.error(error?.data?.message || "Failed to update driver profile");
        }
    };

    const allFields: { key: keyof UserProfileType; label: string }[] = [
        { key: "raider_name", label: "Full Name" },
        { key: "contact_number", label: "Phone Number" },
        { key: "email_address", label: "Email Address" },
        { key: "dob", label: "Date of Birth" },
        { key: "gender", label: "Gender" },
        { key: "emergency_contact_name", label: "Emergency Contact Name" },
        { key: "emergency_contact_number", label: "Emergency Contact Number" },
        { key: "identity_card_number", label: "Identity Card Number" },

        // Current Address
        { key: "current_address", label: "Current Address" },
        { key: "current_apartment", label: "Current Apartment" },
        { key: "current_city", label: "Current City" },
        { key: "current_state_province", label: "Current State/Province" },
        { key: "current_country", label: "Current Country" },
        { key: "current_zip_post_code", label: "Current Postal Code" },

        // Permanent Address
        { key: "permanent_address", label: "Permanent Address" },
        { key: "permanent_apartment", label: "Permanent Apartment" },
        { key: "permanent_city", label: "Permanent City" },
        { key: "permanent_state_province", label: "Permanent State/Province" },
        { key: "permanent_country", label: "Permanent Country" },
        { key: "permanent_zip_post_code", label: "Permanent Postal Code" },

        // Driving License
        { key: "driving_license_number", label: "Driving License Number" },
        { key: "driving_license_issue_date", label: "License Issue Date" },
        { key: "driving_license_expire_date", label: "License Expiry Date" },

        // Vehicle Information
        { key: "vehicle_plate_number", label: "Vehicle Plate Number" },
        { key: "vehicle_type", label: "Vehicle Type" },
        { key: "vehicle_brand", label: "Vehicle Brand" },
        { key: "registration_date", label: "Registration Date" },
        { key: "vehicle_log_number", label: "Vehicle Log Number" },
        { key: "vehicle_log_issue_date", label: "Vehicle Log Issue Date" },
        { key: "vehicle_log_expire_date", label: "Vehicle Log Expiry Date" },

        // Vehicle Policy
        { key: "vehicle_policy_number", label: "Policy Number" },
        { key: "vehicle_policy_issue_date", label: "Policy Issue Date" },
        { key: "vehicle_policy_expire_date", label: "Policy Expiry Date" },

        // Bank Information
        { key: "bank_name", label: "Bank Name" },
        { key: "account_number", label: "Account Number" },
    ];

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">Loading driver data...</p>
            </div>
        );
    }

    return (
        <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
            {/* Back Button */}
            <h1
                onClick={() => navigate(`/driver-list`)}
                className="flex items-center gap-1 cursor-pointer text-2xl font-semibold text-gray-900"
            >
                <ArrowLeft /> Back to Driver List
            </h1>

            <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
                {/* Upload/Download Buttons */}
                <div className="absolute top-6 right-6 flex gap-3">
                    <Button variant="outline" className="flex gap-2 text-black border border-blue-500">
                        <Files size={16} /> Download
                    </Button>
                </div>

                {/* Profile Image */}
                <div className="flex justify-center">
                    <label className="cursor-pointer mt-8 sm:mt-0">
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <Camera size={32} className="text-gray-500" />
                            )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>

                {/* Rating Section */}
                <div className="text-center mt-4">
                    <p className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-base sm:text-lg font-medium text-center">
                        <span className="flex items-center gap-1">
                            <Star size={20} className="text-yellow-500" />
                            4.8/5
                        </span>
                        <span className="flex items-center gap-1">
                            <Medal size={20} />
                            Bronze
                        </span>
                        <span className="flex items-center gap-1">
                            <Rss size={20} />
                            150 Followers
                        </span>
                    </p>
                </div>

                {/* ALL FIELDS IN ONE GRID */}
                <div className="mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {allFields.map(({ key, label }) => (
                            <div key={key}>
                                <Label className="text-sm font-semibold pb-2">{label}</Label>
                                <Input {...register(key)} />

                                {formState.errors[key] && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {formState.errors[key]?.message}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center mt-10">
                    <Button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-5 text-lg rounded-lg"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}