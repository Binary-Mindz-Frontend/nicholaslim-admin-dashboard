/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {LuArrowUpDown, LuX } from "react-icons/lu";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
// import { useNavigate } from "react-router-dom";
import {
  useRaiderGetWalletQuery,
  useAdjustWalletBalanceMutation,
} from "@/redux/features/wallet/walletApi";
import { FiSearch } from "react-icons/fi";
import CustomPagination from "@/components/Shared/CustomPagination/CustomPagination";
import toast from "react-hot-toast";

enum AdjustmentAction {
  DEDUCT_MINUS_FUNDS = "DEDUCT_MINUS_FUNDS",
}

enum PenaltyType {
  PENALTY = "PENALTY",
  LATE_ARRIVAL = "LATE_ARRIVAL",
  SAFETY_VIOLATION = "SAFETY_VIOLATION",
  CANCELED_TRIP = "CANCELED_TRIP",
  REFUND = "REFUND",
  ADMIN_CORRECTION = "ADMIN_CORRECTION",
  OTHER = "OTHER",
}

interface Wallet {
  id: number;
  username: string;
  email: string;
  totalWalletBalance: number;
  currentWalletBalance: number;
}

const DriverWalletAdminTable: React.FC = () => {
  // const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceSort, setBalanceSort] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Modal & Adjustment State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // Added for Preview
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    adjustmentAction: AdjustmentAction.DEDUCT_MINUS_FUNDS,
    amount: 0,
    orderId: "",
    penaltyType: PenaltyType.LATE_ARRIVAL,
    additionalNotes: "",
    isConfirmedByAdmin: false,
    isNotify: false,
  });

  const { data } = useRaiderGetWalletQuery({
    role: "RAIDER",
    search: searchQuery || undefined,
    page: currentPage,
    limit: itemsPerPage,
    balanceSort: balanceSort,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [adjustBalance, { isLoading: isSubmitting }] =
    useAdjustWalletBalanceMutation();

  const totalItems = data?.total || 0;
  const displayData = data?.data || [];

  const resetPage = () => setCurrentPage(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    resetPage();
  };

  const handleBalanceSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBalanceSort(e.target.value as "asc" | "desc");
    resetPage();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setBalanceSort("asc");
    setStartDate("");
    setEndDate("");
    resetPage();
  };

  const hasActiveFilters = searchQuery || startDate || endDate;

  // --- Modal Handlers ---
  const handleOpenPayout = (row: Wallet) => {
    setSelectedWallet(row);
    setFormData({
      adjustmentAction: AdjustmentAction.DEDUCT_MINUS_FUNDS,
      amount: 0,
      orderId: "",
      penaltyType: PenaltyType.LATE_ARRIVAL,
      additionalNotes: "",
      isConfirmedByAdmin: false,
      isNotify: false,
    });
    setShowPreview(false);
    setIsModalOpen(true);
  };

  const handleAdjustmentSubmit = async () => {
    if (!formData.isConfirmedByAdmin) {
      return toast.error("Please confirm adjustment by admin");
    }
    try {
       const res = await adjustBalance({
         raiderId: selectedWallet?.id,
         ...formData,
       }).unwrap();
     
      toast.success(res.message || "Wallet adjusted successfully");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const columns = [
    { key: "id" as const, label: "Raider Id" },
    { key: "username" as const, label: "Username" },
    { key: "email" as const, label: "Email" },
    {
      key: "currentWalletBalance" as const,
      label: "Current Wallet Balance",
      render: (value: number) => `$${value}`,
    },
    {
      key: "totalWalletBalance" as const,
      label: "Total Wallet Balance",
      render: (value: number) => `$${value}`,
    },
    {
      key: "totalBalanceUsed" as const,
      label: "Total Balance Used",
      render: (_: any, row: Wallet) =>
        `$${row.totalWalletBalance - row.currentWalletBalance}`,
    },
    {
      label: "Action",
      render: (_: any, row: Wallet) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleOpenPayout(row)}
            variant="outline"
            size="sm"
            className="h-8 border-green-600 text-green-600 hover:bg-green-50"
          >
            Payout
          </Button>
          {/* <Button
            onClick={() => navigate(`/wallet-driver/${row.id}`)}
            variant="ghost"
            size="sm"
            className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
          >
            <LuScanEye size={16} className="text-[#00BFFF]" />
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap items-end gap-3">
        <div className="relative flex-1 max-w-xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by username, email or phone..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BFFF]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <LuArrowUpDown className="text-gray-400 shrink-0" size={15} />
          <select
            value={balanceSort}
            onChange={handleBalanceSortChange}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#00BFFF] cursor-pointer"
          >
            <option value="desc">Balance: High → Low</option>
            <option value="asc">Balance: Low → High</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 border border-red-300 rounded-md px-3 py-2 transition-colors"
          >
            <LuX size={14} />
            Clear
          </button>
        )}
      </div>

      <SCustomTable columns={columns} data={displayData} />

      <CustomPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          resetPage();
        }}
      />

      {/* ── Adjustment Modal (Matches image_b7c657.png) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-md w-full max-w-md shadow-2xl overflow-hidden border border-gray-300">
            <div className="p-3 border-b bg-white flex justify-between items-center">
              <h2 className="text-[11px] font-bold uppercase tracking-tight text-gray-800">
                PERFORM BALANCE ADJUSTMENT for driver ID {selectedWallet?.id} (
                {selectedWallet?.username})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <LuX size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {!showPreview ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Adjustment Action
                    </label>
                    <select
                      className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none"
                      value={formData.adjustmentAction}
                      disabled // Fixed to only one option
                    >
                      <option value={AdjustmentAction.DEDUCT_MINUS_FUNDS}>
                        Deduct/Minus Funds (Penalty)
                      </option>
                    </select>
                  </div>

                  <div className="border rounded-md p-3 space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase border-b pb-1">
                      Adjustment Details (Pre-Submit)
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600">
                          Amount *
                        </label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            className="w-full border rounded-md pl-7 pr-3 py-1.5 text-sm outline-none focus:border-red-300"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amount: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600">
                          Trip/Order ID (Optional)
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-md mt-1 px-3 py-1.5 text-sm outline-none"
                          placeholder="1234567"
                          value={formData.orderId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              orderId: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600">
                          Penalty Type *
                        </label>
                        <select
                          className="w-full border rounded-md mt-1 p-1.5 text-sm outline-none"
                          value={formData.penaltyType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              penaltyType: e.target.value as any,
                            })
                          }
                        >
                          <option value={PenaltyType.LATE_ARRIVAL}>
                            Late Arrival
                          </option>
                          <option value={PenaltyType.SAFETY_VIOLATION}>
                            Safety Violation
                          </option>
                          <option value={PenaltyType.CANCELED_TRIP}>
                            Canceled Trip
                          </option>
                          <option value={PenaltyType.REFUND}>Refund</option>
                          <option value={PenaltyType.ADMIN_CORRECTION}>
                            Admin Correction
                          </option>
                          <option value={PenaltyType.PENALTY}>Penalty</option>
                          <option value={PenaltyType.OTHER}>Other</option>

                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600">
                          Penalty Notes *
                        </label>
                        <textarea
                          className="w-full border rounded-md mt-1 p-1.5 text-sm outline-none h-16 resize-none"
                          placeholder="Required if Penalty Type is 'Other'"
                          value={formData.additionalNotes}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              additionalNotes: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={formData.isConfirmedByAdmin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isConfirmedByAdmin: e.target.checked,
                            })
                          }
                        />
                        <span className="text-[12px] font-medium text-gray-700">
                          Confirmed by Admin *
                        </span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 accent-blue-500"
                          checked={formData.isNotify}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isNotify: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <p className="text-[12px] font-medium text-gray-700 leading-tight">
                            Auto-trigger penalty message to driver
                          </p>
                          <p className="text-[10px] text-gray-400 leading-tight">
                            Checking this will send an instant Push Notification
                            and In-App message.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                /* ── Preview Summary Section ── */
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                    <h3 className="text-sm font-bold text-blue-800 mb-3 uppercase border-b border-blue-200 pb-1">
                      Adjustment Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <p className="text-gray-500 font-medium">Type:</p>
                      <p className="font-bold text-red-600">
                        DEDUCT FUNDS (Penalty)
                      </p>

                      <p className="text-gray-500 font-medium">Amount:</p>
                      <p className="font-bold text-gray-800">
                        ${formData.amount.toFixed(2)}
                      </p>

                      <p className="text-gray-500 font-medium">Penalty Type:</p>
                      <p className="font-bold text-gray-800">
                        {formData.penaltyType.replace("_", " ")}
                      </p>

                      <p className="text-gray-500 font-medium">Order ID:</p>
                      <p className="text-gray-800">
                        {formData.orderId || "N/A"}
                      </p>

                      <p className="text-gray-500 font-medium">Notes:</p>
                      <p className="text-gray-800 italic">
                        {formData.additionalNotes || "No additional notes"}
                      </p>

                      <p className="text-gray-500 font-medium">Notification:</p>
                      <p
                        className={
                          formData.isNotify
                            ? "text-green-600 font-bold"
                            : "text-gray-400"
                        }
                      >
                        {formData.isNotify
                          ? "Enabled (Push & In-App)"
                          : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 text-center italic">
                    Please review carefully before submitting. This action is
                    permanent.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 border-t bg-gray-50 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() =>
                  showPreview ? setShowPreview(false) : setIsModalOpen(false)
                }
              >
                {showPreview ? "Back to Edit" : "Cancel"}
              </Button>
              <Button
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white cursor-pointer"
                onClick={() =>
                  showPreview ? handleAdjustmentSubmit() : setShowPreview(true)
                }
                disabled={
                  isSubmitting || (!showPreview && formData.amount <= 0)
                }
              >
                {showPreview
                  ? isSubmitting
                    ? "Processing..."
                    : "Confirm & Submit"
                  : "Next: View Preview"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverWalletAdminTable;
