/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Upload, Calendar } from "lucide-react";
import { useUploadFileMutation } from "@/redux/features/fileUpload/fileuploadApi";
import { useCreateAdvertisementMutation } from "@/redux/features/advertise/advertiseApi";
import toast from "react-hot-toast";

export default function CreateNewCampaign() {
  const [campaignTitle, setCampaignTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [uploadFile] = useUploadFileMutation();
  const [createAdvertisement] = useCreateAdvertisementMutation();

  // submit handler
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignTitle || !startDate || !endDate || !uploadedFile) {
      alert("Please fill in all fields and upload a file.");
      return;
    }

    try {
      // 1️⃣ Upload file
      const uploadRes: any = await uploadFile(uploadedFile);

      const uploadedUrl = uploadRes?.data?.data?.[0];
      if (!uploadedUrl) {
        alert("File upload failed!");
        return;
      }

      // 2️⃣ Prepare payload
      const payload = {
        create_for: "USER",
        ad_title: campaignTitle,
        ad_image: uploadedUrl,
        start_date: new Date(startDate)?.toISOString(),
        end_date: new Date(endDate)?.toISOString(),
      };

      // 3️⃣ Create advertisement
      const result: any = await createAdvertisement(payload);
      console.log(result?.data)

      if (result?.data?.success) {
        toast.success(result?.data?.message);
      } else {
        toast.error(result?.error?.data?.message || "Failed to create campaign");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  // file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploadedFile(e.target.files[0]);
    } else {
      setUploadedFile(null);
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-md">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Create New Campaign
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
              placeholder="Enter title for notification"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          {/* Upload Box */}
          <div className="pt-4">
            <label
              htmlFor="file-upload"
              className="block w-full text-center border-2 border-dashed border-gray-300 rounded-2xl p-10 cursor-pointer hover:border-blue-400 transition-colors"
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
                  Click to Upload Photo Or Video
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  (Max. File size: 25 MB)
                </p>

                {uploadedFile && (
                  <p className="text-green-600 text-sm mt-2 font-semibold">
                    File uploaded: {uploadedFile.name}
                  </p>
                )}
              </div>
            </label>
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
                  onFocus={(e) => (e.target.type = "datetime-local")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Enter date & time"
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-800 mb-4">
                Ending Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  onFocus={(e) => (e.target.type = "datetime-local")}
                  onBlur={(e) => (e.target.type = "text")}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Enter date & time"
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-12 rounded-xl text-xl shadow-lg transition-colors w-full md:w-auto cursor-pointer"
            >
              Create new Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
