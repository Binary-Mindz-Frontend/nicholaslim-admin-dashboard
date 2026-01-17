import React, { useState, useEffect } from "react";
import { Camera, Save, User, Mail, Phone } from "lucide-react";
import { toast } from "react-hot-toast"; // Added toast

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
    useGetUserProfileQuery, 
    useUpdateUserProfileMutation, 
    useUploadFileMutation
} from "@/redux/features/usersTypes/usersTypesApi";

const CustomizeProfile = () => {
    const { data: user, isLoading } = useGetUserProfileQuery("");
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
    const [uploadFile, { isLoading: isUploadingImage }] = useUploadFileMutation();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        image: "",
    });

    useEffect(() => {
        if (user?.data) {
            setFormData({
                username: user.data.username || "",
                email: user.data.email || "",
                phone: user.data.phone || "",
                image: user.data.image || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Remove the manual "new FormData()" logic here because 
    // your RTK Query mutation now handles it for you.

    const toastId = toast.loading("Uploading image...");
    try {
        // Just pass the 'file' directly to the mutation
        const response = await uploadFile(file).unwrap();
        
        if (response.success && response.data && response.data.length > 0) {
            const imageUrl = response.data[0]; 
            setFormData((prev) => ({ ...prev, image: imageUrl }));
            toast.success("Image uploaded successfully!", { id: toastId });
        }
    } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload image.", { id: toastId });
    }
};

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = user?.data?.id;

        if (!userId) {
            toast.error("User ID not found!");
            return;
        }

        try {
            await updateProfile({
                id: userId,
                data: formData
            }).unwrap();
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update profile.");
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Customize Profile</h1>
                    <p className="text-gray-500">Update your personal information and profile picture.</p>
                </div>

                <Card className="bg-white border-[#E6EFF5] shadow-sm overflow-hidden">
                    <form onSubmit={handleUpdate}>
                        <div className="p-8 border-b border-[#E6EFF5] bg-gray-50/50 flex flex-col items-center">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 ring-4 ring-white shadow-lg">
                                    <AvatarImage src={formData.image} alt={formData.username} />
                                    <AvatarFallback className="bg-amber-500 text-white text-3xl font-bold">
                                        {formData.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <label className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full text-white cursor-pointer hover:bg-amber-600 transition-colors shadow-md">
                                    {isUploadingImage ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    ) : (
                                        <Camera className="w-5 h-5" />
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={isUploadingImage}
                                    />
                                </label>
                            </div>
                            <p className="mt-4 text-sm font-medium text-gray-700">Profile Photo</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4 text-amber-500" /> Username
                                    </label>
                                    <input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-[#E6EFF5] rounded-lg focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition-all"
                                        placeholder="Enter username"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-amber-500" /> Email Address
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-[#E6EFF5] rounded-lg focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-amber-500" /> Phone Number
                                    </label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-[#E6EFF5] rounded-lg focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition-all"
                                        placeholder="+88017..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Camera className="w-4 h-4 text-amber-500" /> Photo URL
                                    </label>
                                    <input
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-50 border border-[#E6EFF5] rounded-lg focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition-all"
                                        placeholder="https://cdn..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-[#E6EFF5] flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdating || isUploadingImage}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-8 rounded-lg transition-all shadow-md active:scale-95 disabled:bg-gray-400"
                            >
                                {isUpdating ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {isUpdating ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CustomizeProfile;