/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  useDeleteAdvertisementMutation,
  useGetAdvertisementsQuery,
  useUpdateStatusMutation,
} from "@/redux/features/advertise/advertiseApi";
import { ChevronLeft, ChevronRight, Edit, Trash, BarChart2 } from "lucide-react";
import Swal from "sweetalert2";
import UpdateAdvertiseModal from "./UpdateAdvertiseModal";
import { adRedirectUrl, formatCtr, metricsFromAd } from "../adMetrics";

interface AdvertisementsTableProps {
  activeTab: "USER" | "RAIDER";
  selectedAdId?: string;
  onSelectAd?: (id: string) => void;
}

export default function AdvertisementsTable({
  activeTab,
  selectedAdId,
  onSelectAd,
}: AdvertisementsTableProps) {
  const { data, isLoading } = useGetAdvertisementsQuery(undefined);
  const [updateStatus] = useUpdateStatusMutation(); // hook from RTK Query
  const [deleteAdvertisement] = useDeleteAdvertisementMutation();
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

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This advertisement will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res: any = await deleteAdvertisement(id);

      if (res?.data?.success) {
        Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
      } else {
        Swal.fire("Failed!", "Delete operation failed.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };


  

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#FFD52B]">
        <thead className="bg-[#FFFAE6]">
          <tr>
            <th className="px-4 py-2 border border-[#FFD52B]">ID</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Title</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Redirect Link</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Impressions</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Clicks</th>
            <th className="px-4 py-2 border border-[#FFD52B]">CTR</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Start Date</th>
            <th className="px-4 py-2 border border-[#FFD52B]">End Date</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Status</th>
            <th className="px-4 py-2 border border-[#FFD52B]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAds.map((ad: any) => {
            const isSelected = String(ad.id) === String(selectedAdId);
            const metrics = metricsFromAd(ad);
            const redirectUrl = adRedirectUrl(ad.redirect_link);

            return (
              <tr
                key={ad.id}
                className={`text-center transition-colors ${
                  isSelected ? "bg-amber-100/70 font-medium" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-4 py-2 border border-[#FF7A00]">
                  <div className="flex items-center justify-center gap-1">
                    <span>{ad.id}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border font-medium text-slate-900">{ad.ad_title}</td>
                <td className="px-4 py-2 border max-w-xs truncate">
                  {redirectUrl ? (
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-block truncate max-w-[180px]"
                      title={redirectUrl}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {ad.redirect_link}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 border font-semibold text-slate-700">
                  {metrics.impressions.toLocaleString()}
                </td>
                <td className="px-4 py-2 border font-semibold text-slate-700">
                  {metrics.clicks.toLocaleString()}
                </td>
                <td className="px-4 py-2 border font-bold text-amber-600">
                  {formatCtr(metrics.ctr)}
                </td>
                <td className="px-4 py-2 border text-xs">
                  {new Date(ad.start_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border text-xs">
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
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    title="View Analytics for this Ad"
                    onClick={() => {
                      onSelectAd?.(String(ad.id));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span className="text-xs hidden md:inline ml-1">Stats</span>
                  </Button>
                  <Button
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleEdit(ad)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleDelete(ad.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
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
        <UpdateAdvertiseModal
          show={showModal}
          onClose={handleCloseModal}
          ad={selectedAd}
        />
      )}
    </div>
  );
}
