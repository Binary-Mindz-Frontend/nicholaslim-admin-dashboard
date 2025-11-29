import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userProfileSchema, UserProfileType } from "./userProfile.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Camera, Star, Files, Rss, ArrowLeft, Medal } from "lucide-react";

export default function EditDriverProfile() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [profileImage, setProfileImage] = useState<string | null>(null);

    // React Hook Form setup
    const form = useForm<UserProfileType>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {} as UserProfileType,
    });

    const { register, handleSubmit, reset, watch, formState } = form;

    // Load Fake User Data
    useEffect(() => {
        if (!id) return;

        const fakeUser: UserProfileType = {
            id,
            firstName: "Henry",
            lastName: "Johnson",
            email: "henry@gmail.com",
            phone: "01700000000",
            dob: "26/07/2000",
            gender: "Male",
            emergencyContact: "01987654321",
            driverId: "DRV-001",

            address: "House #10, Road #3",
            city: "Dhaka",
            state: "Dhaka",
            postal: "1207",

            rating: "4.8",
            followers: "150",
            deliveries: "250",
            cancellations: "2",
            incentives: "20000",

            drivingLicense: "DL-123456789",
            dlIssueDate: "2022-01-01",
            dlExpiryDate: "2030-01-01",

            vehiclePlate1: "DHAKA METRO",
            vehicleType: "Bike",
            vehiclePlate2: "22-12345",
            model: "Yamaha FZS",
            registrationDate: "2021-01-01",
            vehicleLog: "LOG-54544",
            vehicleIssueDate: "2021-02-01",
            vehicleExpiryDate: "2030-02-01",

            policyNumber: "POL-5542",
            policyIssue: "2021-05-01",
            policyExpiry: "2031-05-01",

            bank: "DBBL",
            accountNumber: "1234567890123",
        };

        reset(fakeUser);
    }, [id, reset]);

    const formData = watch();

    // Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileImage(URL.createObjectURL(file));
    };

    const onSubmit = (data: UserProfileType) => {
        console.log("UPDATED DRIVER:", data);
    };

    const allFields: { key: keyof UserProfileType; label: string }[] = [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email Address" },
        { key: "phone", label: "Phone Number" },
        { key: "dob", label: "Date of Birth" },
        { key: "gender", label: "Gender" },
        { key: "emergencyContact", label: "Emergency Contact" },
        { key: "driverId", label: "Driver ID" },

        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "postal", label: "Postal Code" },

        { key: "drivingLicense", label: "Driving License Number" },
        { key: "dlIssueDate", label: "License Issue Date" },
        { key: "dlExpiryDate", label: "License Expiry Date" },

        { key: "vehiclePlate1", label: "Vehicle Number Plate 1" },
        { key: "vehiclePlate2", label: "Vehicle Number Plate 2" },
        { key: "vehicleType", label: "Vehicle Type" },
        { key: "model", label: "Vehicle Model" },
        { key: "registrationDate", label: "Registration Date" },
        { key: "vehicleLog", label: "Vehicle Log Number" },
        { key: "vehicleIssueDate", label: "Vehicle Issue Date" },
        { key: "vehicleExpiryDate", label: "Vehicle Expiry Date" },

        { key: "policyNumber", label: "Policy Number" },
        { key: "policyIssue", label: "Policy Issue Date" },
        { key: "policyExpiry", label: "Policy Expiry Date" },

        { key: "bank", label: "Bank Name" },
        { key: "accountNumber", label: "Account Number" },
    ];

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
                    <Button variant="outline" className="flex gap-2 border text-black">
                        <Files size={16} /> Upload
                    </Button>
                    <Button variant="outline" className="flex gap-2 text-black border">
                        <Files size={16} /> Download
                    </Button>
                </div>

                {/* Profile Image */}
                <div className="flex justify-center">
                    <label className="cursor-pointer mt-8 sm:mt-0">
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={32} className="text-gray-500" />
                            )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>

                {/* Rating Section */}
                <div className="text-center mt-4">
                    <p
                        className="
                            flex flex-wrap justify-center items-center 
                            gap-3 sm:gap-4 
                            text-base sm:text-lg font-medium text-center
                        "
                    >
                        <span className="flex items-center gap-1">
                            <Star size={20} className="text-yellow-500" />
                            {formData.rating}/5
                        </span>

                        <span className="flex items-center gap-1">
                            <Medal size={20} />
                            Bronze
                        </span>

                        <span className="flex items-center gap-1">
                            <Rss size={20} />
                            {formData.followers} Followers
                        </span>
                    </p>


                    <p className="mt-2 text-black font-medium text-base md:text-xl lg:text-2xl">
                        Total Deliveries: {formData.deliveries}
                    </p>
                    <p className="text-red-500 font-medium text-base md:text-xl lg:text-2xl my-2">
                        Total Cancellations: {formData.cancellations}
                    </p>
                    <p className="text-black font-medium text-base md:text-xl lg:text-2xl">
                        Total Incentives: {formData.incentives}
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
                    >
                        Save Changes
                    </Button>
                </div>

            </div>
        </div>
    );
}
