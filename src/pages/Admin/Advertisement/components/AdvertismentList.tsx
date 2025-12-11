/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  useGetAdvertisementsQuery,
  useUpdateAdvertisementMutation,
  useUpdateStatusMutation,
} from "@/redux/features/advertise/advertiseApi";
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import UpdateAdvertiseModal from "./updateAdvertiseModal";

export default function AdvertisementsTable({
  activeTab,
}: {
  activeTab: "USER" | "RAIDER";
}) {
  const { data, isLoading } = useGetAdvertisementsQuery(undefined);
  const [updateStatus] = useUpdateStatusMutation(); // hook from RTK Query
  const [updateAdvertisement] = useUpdateAdvertisementMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedAd, setSelectedAd] = useState<any>(null);

  if (isLoading) return <p>Loading...</p>;

  const ads = data?.data?.data || [];

  // Filter the ads based on the activeTab (USER or RAIDER)
  const filteredAds = ads.filter((ad: any) => ad.create_for === activeTab);

  // Pagination
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle status
  const handleToggleStatus = async (ad: any) => {
    try {
      await updateStatus({ id: ad.id, status: !ad.status }).unwrap();
      console.log(`Status updated for ad ${ad.id}`);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleEdit = (ad: any) => {
    setSelectedAd(ad);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAd(null);
  };

  const handleUpdate = async (updatedAd: any) => {
    try {
      await updateAdvertisement(updatedAd).unwrap();
      Swal.fire("Updated!", "Your advertisement has been updated.", "success");
      setShowModal(false); // Close modal on successful update
    } catch (error) {
      Swal.fire(
        "Error!",
        "There was a problem updating the advertisement.",
        "error"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#FFD52B]">
        <thead className="bg-[#FFFAE6]">
          <tr>
            <th className="px-4 py-2 border border-[#FFD52B]">ID</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Title</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Start Date</th>
            <th className="px-4 py-2 border border-[#FFD52B]">End Date</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Status</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAds.map((ad: any) => (
            <tr key={ad.id} className="text-center">
              <td className="px-4 py-2 border border-[#FF7A00]">{ad.id}</td>
              <td className="px-4 py-2 border">{ad.ad_title}</td>
              <td className="px-4 py-2 border">
                {new Date(ad.start_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">
                {new Date(ad.end_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">
                <Switch
                  checked={ad.status}
                  onClick={() => handleToggleStatus(ad)}
                  className={`${
                    ad.status ? "bg-green-500" : "bg-red-500"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                />
                <span className="ml-2">
                  {ad.status ? "Active" : "Deactive"}
                </span>
              </td>
              <td className="px-4 py-2 border space-x-2">
                <Button
                  className="cursor-pointer"
                  onClick={() => handleEdit(ad)}
                >
                  <Edit />
                </Button>
                <Button variant="destructive" className="cursor-pointer">
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4 items-center">
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2 bg-[#FFFAE6]">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {showModal && selectedAd && (
        <UpdateAdvertiseModal show={showModal} onClose={handleCloseModal}>
          <h2>Edit Advertisement</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(selectedAd);
            }}
            className="space-y-4"
          >
            {/* Title Input */}
            <div className="flex flex-col">
              <label
                htmlFor="title"
                className="text-lg font-semibold text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={selectedAd.ad_title}
                onChange={(e) =>
                  setSelectedAd((prev: any) => ({
                    ...prev,
                    ad_title: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter advertisement title"
              />
            </div>

            {/* Start Date Input */}
            <div className="flex flex-col">
              <label
                htmlFor="startDate"
                className="text-lg font-semibold text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={new Date(selectedAd.start_date).toLocaleDateString(
                  "en-CA"
                )}
                onChange={(e) =>
                  setSelectedAd((prev: any) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* End Date Input */}
            <div className="flex flex-col">
              <label
                htmlFor="endDate"
                className="text-lg font-semibold text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={new Date(selectedAd.end_date).toLocaleDateString(
                  "en-CA"
                )}
                onChange={(e) =>
                  setSelectedAd((prev: any) => ({
                    ...prev,
                    end_date: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-all"
              >
                Save
              </Button>
            </div>
          </form>
        </UpdateAdvertiseModal>
      )}
    </div>
  );
}
