/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  Upload,
  Calendar,
  X,
  Image as ImageIcon,
  Tag,
  Bell,
} from "lucide-react";
import { useUploadFileMutation } from "@/redux/features/fileUpload/fileuploadApi";
import { useCreateAdvertisementMutation } from "@/redux/features/advertise/advertiseApi";
import { useGetPromoCodesQuery } from "@/redux/features/promoCode/promoCodeApi";
import { useAddNotificationPromotionMutation } from "@/redux/features/notificationServices/notificationServicesApi";
import toast from "react-hot-toast";

interface CreateNewCampaignProps {
  activeTab: "USER" | "RAIDER";
}

export default function CreateNewCampaign({
  activeTab,
}: CreateNewCampaignProps) {
  const [campaignTitle, setCampaignTitle] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minStartDate, setMinStartDate] = useState("");

  // Promo Code & Delivery Channel State
  const [selectedPromoCode, setSelectedPromoCode] = useState("");
  const [pushNotification, setPushNotification] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);

  const [uploadFile] = useUploadFileMutation();
  const [createAdvertisement] = useCreateAdvertisementMutation();
  const [addNotificationPromotion] = useAddNotificationPromotionMutation();
  const { data: promoResponse } = useGetPromoCodesQuery({});
  const promoCodesList = promoResponse?.data || [];

  // Set minimum start date to current date/time on component mount
  useEffect(() => {
    const now = new Date();
    // Format to YYYY-MM-DDThh:mm for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const minDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    setMinStartDate(minDate);
  }, []);

  // When promo code is selected, auto-fill expiration if available
  const handlePromoCodeSelect = (codeStr: string) => {
    setSelectedPromoCode(codeStr);
    if (!codeStr) return;
    const selectedPromo = promoCodesList.find(
      (p: any) => p.promoCode === codeStr,
    );
    if (selectedPromo && selectedPromo.expires_at && !endDate) {
      try {
        const expDate = new Date(selectedPromo.expires_at);
        const year = expDate.getFullYear();
        const month = String(expDate.getMonth() + 1).padStart(2, "0");
        const day = String(expDate.getDate()).padStart(2, "0");
        const hours = String(expDate.getHours()).padStart(2, "0");
        const minutes = String(expDate.getMinutes()).padStart(2, "0");
        setEndDate(`${year}-${month}-${day}T${hours}:${minutes}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!campaignTitle || !startDate || !endDate || !uploadedFile) {
      toast.error("Please fill in all fields and upload a file.");
      return;
    }

    // Validate start date is greater than or equal to current date
    const currentDate = new Date();
    const selectedStartDate = new Date(startDate);

    if (selectedStartDate < currentDate) {
      toast.error("Start date must be greater than or equal to current date.");
      return;
    }

    // Validate end date is greater than start date
    const selectedEndDate = new Date(endDate);
    if (selectedEndDate <= selectedStartDate) {
      toast.error("End date must be greater than start date.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Upload the file
      const uploadRes: any = await uploadFile(uploadedFile);
      const uploadedUrl = uploadRes?.data?.data?.[0];

      if (!uploadedUrl) {
        toast.error("File upload failed!");
        setIsSubmitting(false);
        return;
      }

      // 2️⃣ Prepare advertisement payload
      const adPayload: any = {
        create_for: activeTab, // "USER" or "RAIDER"
        ad_title: campaignTitle,
        ad_image: uploadedUrl,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        redirect_link: redirectLink,
        ...(selectedPromoCode && { promo_code: selectedPromoCode }),
      };

      // 3️⃣ Create advertisement
      const result: any = await createAdvertisement(adPayload);

      // 4️⃣ Also create promotion broadcast if notification channels selected
      if (pushNotification || inApp || emailNotification || smsNotification) {
        const promoBroadcastPayload = {
          title: campaignTitle,
          message: `Special promotion: ${campaignTitle}${selectedPromoCode ? ` - Use code ${selectedPromoCode}` : ""}`,
          promo_code: selectedPromoCode || undefined,
          target_role: activeTab,
          send_immediately: true,
          expiry_date: new Date(endDate).toISOString(),
          push_notification: pushNotification,
          in_app: inApp,
          email: emailNotification,
          sms: smsNotification,
          image_url: uploadedUrl,
        };

        try {
          await addNotificationPromotion(promoBroadcastPayload).unwrap();
        } catch (notifErr) {
          console.error("Promotion broadcast notification error:", notifErr);
        }
      }

      if (result?.data?.success) {
        toast.success(
          result.data.message || "Campaign and Promotion created successfully!",
        );
        // Reset form
        setCampaignTitle("");
        setStartDate("");
        setEndDate("");
        setUploadedFile(null);
        setFilePreview(null);
        setFileType(null);
        setRedirectLink("");
        setSelectedPromoCode("");
      } else {
        toast.error(
          result?.data?.error?.message || "Failed to create campaign",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj < currentDate) {
      toast.error("Start date must be greater than or equal to current date.");
      // You can choose to clear the field or keep it but show error
      // setStartDate("");
      // return;
    }

    setStartDate(selectedDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = e.target.value;

    // Validate end date only if start date is already set
    if (startDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(selectedEndDate);

      if (endDateObj <= startDateObj) {
        toast.error("End date must be greater than start date.");
        // You can choose to clear the field or keep it but show error
        // setEndDate("");
        // return;
      }
    }

    setEndDate(selectedEndDate);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File size exceeds 25 MB limit!");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Please upload only image or video files!");
        return;
      }

      setUploadedFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);

      // Set file type for rendering
      setFileType(file.type.startsWith("video/") ? "video" : "image");
    } else {
      handleRemoveFile();
    }
  };

  const handleRemoveFile = () => {
    // Clean up object URL to prevent memory leaks
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    setUploadedFile(null);
    setFilePreview(null);
    setFileType(null);

    // Reset file input
    const fileInput = document.getElementById(
      "file-upload",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0];

      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File size exceeds 25 MB limit!");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Please upload only image or video files!");
        return;
      }

      setUploadedFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);

      // Set file type for rendering
      setFileType(file.type.startsWith("video/") ? "video" : "image");
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-md">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8">
        <h2 className="text-3xl text-center font-bold text-gray-900 mb-10">
          Create New Campaign ({activeTab})
        </h2>

        <form onSubmit={handleCreateCampaign} className="space-y-8">
          {/* Campaign Title */}
          <div>
            <label
              htmlFor="campaign-title"
              className="block text-xl font-medium text-gray-800 mb-4"
            >
              Campaign Title
            </label>
            <input
              id="campaign-title"
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              placeholder="Enter title for campaign"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="redirect_link"
              className="block text-xl font-medium text-gray-800 mb-4"
            >
              Redirect link
            </label>
            <input
              id="redirect_link"
              type="text"
              value={redirectLink}
              onChange={(e) => setRedirectLink(e.target.value)}
              placeholder="https://zipbee.sg/promotions/campaign"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          {/* Optional Promo Code Selector */}
          <div>
            <label className="block text-xl font-medium text-gray-800 mb-4 items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              Attach Promo Code (Optional)
            </label>
            <select
              value={selectedPromoCode}
              onChange={(e) => handlePromoCodeSelect(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg bg-white focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer"
            >
              <option value="">-- Select a Promo Code --</option>
              {promoCodesList.map((p: any) => (
                <option key={p.id} value={p.promoCode}>
                  {p.promoCode} —{" "}
                  {p.title ||
                    p.discountDesc ||
                    `${p.discountValue}${p.discountType === "PERCENTAGE" ? "%" : "$"}`}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Selecting a promo code will link it to this campaign and auto-fill
              card discounts.
            </p>
          </div>

          {/* Delivery Channels */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <label className="block text-lg font-bold text-gray-800 mb-3 items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Broadcast Notification Channels
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={inApp}
                  onChange={(e) => setInApp(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                />
                <span className="text-sm font-semibold text-gray-700">
                  In-App Center
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={pushNotification}
                  onChange={(e) => setPushNotification(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Push (FCM)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Email
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-amber-400">
                <input
                  type="checkbox"
                  checked={smsNotification}
                  onChange={(e) => setSmsNotification(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                />
                <span className="text-sm font-semibold text-gray-700">SMS</span>
              </label>
            </div>
          </div>

          {/* Upload Box or Preview */}
          <div className="pt-4">
            {!filePreview ? (
              <label
                htmlFor="file-upload"
                className="block w-full text-center border-2 border-dashed border-gray-300 rounded-2xl p-10 cursor-pointer hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-blue-500 font-medium text-lg">
                    Click to Upload or Drag & Drop
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    (Supports: JPG, PNG, GIF, MP4, MOV • Max: 25 MB)
                  </p>
                </div>
              </label>
            ) : (
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-4">
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 z-10 hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* File Preview */}
                <div className="flex flex-col items-center">
                  {fileType === "image" ? (
                    <div className="relative w-full max-w-md h-64 md:h-80 rounded-xl overflow-hidden">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full max-w-md h-64 md:h-80 rounded-xl overflow-hidden bg-black">
                      <video
                        src={filePreview}
                        className="w-full h-full object-contain"
                        controls
                      />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                      {fileType === "image" ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 bg-blue-500 rounded" />
                      )}
                      <p className="font-medium truncate max-w-xs">
                        {uploadedFile?.name}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {(uploadedFile?.size
                        ? uploadedFile.size / (1024 * 1024)
                        : 0
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="mt-3 text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Remove file
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xl font-medium text-gray-800 mb-4">
                Starting Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={minStartDate}
                  className="w-full px-5 py-4 border border-gray-300 cursor-pointer rounded-xl text-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
                <Calendar className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Start date must be current or future date
              </p>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-800 mb-4">
                Ending Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate || minStartDate}
                  className="w-full px-5 py-4 border border-gray-300 cursor-pointer rounded-xl text-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none cursor-pointer" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                End date must be after start date
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-12 rounded-xl text-xl shadow-lg transition-colors w-full md:w-auto cursor-pointer ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create new Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
