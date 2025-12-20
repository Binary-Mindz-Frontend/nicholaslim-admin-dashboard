
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useGetRiderProfileByIdQuery } from "@/redux/features/drivers/driversApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, ArrowLeft, AlertCircle } from "lucide-react";

export default function ViewJoinRequest() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isNotRegistered, setIsNotRegistered] = useState(false);

    const { data: response, isLoading: isFetching, isError } = useGetRiderProfileByIdQuery(
        Number(id),
        { skip: !id }
    );

    const { register, reset } = useForm();

    useEffect(() => {
        // Look for data inside response.data.data or response.data
        const actualData = response?.data; 
        
        if (actualData) {
            // CHECK: Does the registrations array exist and have data?
            if (actualData.registrations && actualData.registrations.length > 0) {
                const registration = actualData.registrations[0];
                setIsNotRegistered(false);
                reset(registration); // Fill form with registration data
                
                if (registration.driver_photos?.[0]) {
                    setProfileImage(registration.driver_photos[0]);
                }
            } else {
                // If registrations array is empty
                setIsNotRegistered(true);
            }
        }
    }, [response, reset]);

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium">Loading Rider Details...</p>
            </div>
        );
    }

    // SHOW THIS IF NO REGISTRATION DATA FOUND
    if (isNotRegistered || isError) {
        return (
            <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA] min-h-screen">
                <h1 onClick={() => navigate(-1)} className="flex items-center gap-1 cursor-pointer text-2xl font-semibold text-gray-900">
                    <ArrowLeft /> Back
                </h1>
                <div className="flex flex-col items-center justify-center border rounded-xl py-20 bg-white shadow-sm">
                    <AlertCircle size={64} className="text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Not Registered</h2>
                    <p className="text-gray-500 mt-2">This rider has a login account but has not submitted registration details yet.</p>
                    <Button className="mt-6 bg-blue-600" onClick={() => navigate(-1)}>Return to List</Button>
                </div>
            </div>
        );
    }

    const displayFields = [
        { key: "raider_name", label: "Full Name" },
        { key: "contact_number", label: "Phone Number" },
        { key: "email_address", label: "Email Address" },
        { key: "vehicle_type", label: "Vehicle Type" },
        { key: "vehicle_plate_number", label: "Plate Number" },
        { key: "driving_license_number", label: "License Number" },
        { key: "bank_name", label: "Bank Name" },
        { key: "account_number", label: "Account Number" },
    ];

    return (
        <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
            <h1 onClick={() => navigate(-1)} className="flex items-center gap-1 cursor-pointer text-2xl font-semibold text-gray-900">
                <ArrowLeft /> View Join Request
            </h1>

            <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
                <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden">
                        {profileImage ? (
                            <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <Camera size={32} className="text-gray-500" />
                        )}
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {displayFields.map(({ key, label }) => (
                        <div key={key}>
                            <Label className="text-sm font-semibold pb-2">{label}</Label>
                            <Input 
                                {...register(key)} 
                                readOnly 
                                className="bg-gray-50 border-gray-200 cursor-default focus-visible:ring-0" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}