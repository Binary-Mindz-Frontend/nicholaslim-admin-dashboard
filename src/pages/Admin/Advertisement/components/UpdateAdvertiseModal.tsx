/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Upload, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUploadFileMutation } from "@/redux/features/fileUpload/fileuploadApi";
import { useUpdateAdvertisementMutation } from "@/redux/features/advertise/advertiseApi";
import { useRef } from "react";

interface UpdateAdvertiseModalProps {
  show: boolean;
  onClose: () => void;
  ad: any;
}

const UpdateAdvertiseModal: React.FC<UpdateAdvertiseModalProps> = ({
  show,
  onClose,
  ad,
}) => {
  const [campaignTitle, setCampaignTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startDateRef = useRef<HTMLInputElement>(null);
const endDateRef = useRef<HTMLInputElement>(null);

  const [uploadFile] = useUploadFileMutation();
  const [updateAdvertisement] = useUpdateAdvertisementMutation();

  // Prefill data when modal opens
  useEffect(() => {
    if (ad) {
      setCampaignTitle(ad.ad_title);
      setStartDate(ad.start_date.slice(0, 16));
      setEndDate(ad.end_date.slice(0, 16));
    }
  }, [ad]);

  if (!show) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignTitle || !startDate || !endDate) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = ad.ad_image;
      console.log(imageUrl);
      // Upload new file only if selected
      if (uploadedFile) {
        const uploadRes: any = await uploadFile(uploadedFile);
        imageUrl = uploadRes?.data?.data?.[0];

        if (!imageUrl) {
          toast.error("File upload failed");
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        id: ad.id,
        ad_title: campaignTitle,
        ad_image: imageUrl,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      };

      const res: any = await updateAdvertisement(payload);

      if (res?.data?.success) {
        toast.success("Advertisement updated successfully");
        onClose();
      } else {
        toast.error("Failed to update advertisement");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 lg:w-2/6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          Update Advertisement
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
              required
            />
          </div>

          {/* Upload */}
          <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <Upload className="mx-auto text-blue-500 mb-2" />
            <p className="text-blue-500 font-medium">
              Upload new image / video (optional)
            </p>
            {uploadedFile && (
              <p className="text-green-600 mt-2 text-sm">
                Selected: {uploadedFile.name}
              </p>
            )}
          </label>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block font-medium mb-2">Start Date</label>
              <div className="relative">
                <input
                  ref={startDateRef}
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl pr-10"
                />
                <Calendar
                  onClick={() => startDateRef.current?.showPicker()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block font-medium mb-2">End Date</label>
              <div className="relative">
                <input
                  ref={endDateRef}
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl pr-10"
                />
                <Calendar
                  onClick={() => endDateRef.current?.showPicker()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdvertiseModal;
