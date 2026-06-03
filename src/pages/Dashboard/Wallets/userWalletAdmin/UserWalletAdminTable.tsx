/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown, LuX } from "react-icons/lu";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import {
  useUserGetWalletAdminQuery,
  useAdjustWalletBalanceMutation,
} from "@/redux/features/wallet/walletApi";
import { FiSearch } from "react-icons/fi";
import CustomPagination from "@/components/Shared/CustomPagination/CustomPagination";
import toast from "react-hot-toast";

// Enums
enum AdjustmentAction {
  ADD_CREDIT_FUNDS = "ADD_CREDIT_FUNDS",
  DEDUCT_MINUS_FUNDS = "DEDUCT_MINUS_FUNDS",
}

// Added PenaltyType Enum
enum PenaltyType {
  LATE_ARRIVAL = "LATE_ARRIVAL",
  SAFETY_VIOLATION = "SAFETY_VIOLATION",
  CANCELED_TRIP = "CANCELED_TRIP",
  OTHER = "OTHER",
}

interface Wallet {
  id: number;
  username: string;
  email: string;
  totalWalletBalance: number;
  currentWalletBalance: number;
}

const UserWalletAdminTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceSort, setBalanceSort] = useState<"asc" | "desc">("desc");
  const [startDate] = useState("");
  const [endDate] = useState("");

  // --- Modal & Adjustment State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    adjustmentAction: "" as AdjustmentAction | "",
    amount: 0,
    orderId: "",
    reason: "ADMIN_CORRECTION",
    penaltyType: PenaltyType.OTHER, // Initialized with Enum
    additionalNotes: "",
    isConfirmedByAdmin: true,
    isNotify: true,
  });

  const { data } = useUserGetWalletAdminQuery({
    role: "USER",
    search: searchQuery || undefined,
    page: currentPage,
    limit: itemsPerPage,
    balanceSort: balanceSort,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [adjustBalance, { isLoading: isSubmitting }] =
    useAdjustWalletBalanceMutation();

  const handleOpenModal = (row: Wallet, action?: AdjustmentAction) => {
    setSelectedWallet(row);
    setFormData({
      adjustmentAction: action || "",
      amount: null as any,
      orderId: "",
      reason: "ADMIN_CORRECTION",
      penaltyType: PenaltyType.OTHER,
      additionalNotes: "",
      isConfirmedByAdmin: true,
      isNotify: true,
    });
    setIsModalOpen(true);
    setShowPreview(false);
  };

  const handleFinalSubmit = async () => {
    if (!selectedWallet || !formData.adjustmentAction) return;
    try {
      const payload = {
        userId: selectedWallet.id,
        ...formData,
        // Only send penaltyType if it's a deduction
        penaltyType:
          formData.adjustmentAction === AdjustmentAction.DEDUCT_MINUS_FUNDS
            ? formData.penaltyType
            : undefined,
        status: "PENDING",
      };
      const res = await adjustBalance(payload).unwrap();
      // console.log("Adjustment Response:", res.data.message);
      // console.log("Adjustment Response 2nd:", res.message);
      toast.success(res.message || "Wallet adjusted successfully");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  // ... (Keep columns and search filters the same)
  const columns = [
    { key: "id" as const, label: "User Id" },
    {
      key: "username" as const,
      label: "Username",
      render: (val: string, row: Wallet) => (
        <span
          className="text-[#00BFFF] cursor-pointer hover:underline font-medium"
          onClick={() => handleOpenModal(row)}
        >
          {val}
        </span>
      ),
    },
    { key: "email" as const, label: "Email" },
    {
      key: "currentWalletBalance" as const,
      label: "Current Wallet Balance",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "totalWalletBalance" as const,
      label: "Total Wallet Balance",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      label: "Action",
      render: (_: any, row: Wallet) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              handleOpenModal(row, AdjustmentAction.DEDUCT_MINUS_FUNDS)
            }
            variant="outline"
            size="sm"
            className="h-8 border-red-600 text-red-600 hover:bg-red-50"
          >
            Deduct Funds
          </Button>
          <Button
            onClick={() =>
              handleOpenModal(row, AdjustmentAction.ADD_CREDIT_FUNDS)
            }
            variant="outline"
            size="sm"
            className="h-8 border-green-600 text-green-600 hover:bg-green-50"
          >
            Credit Funds
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters Section */}
      <div className="flex justify-between flex-wrap gap-3">
        <div className="relative flex-1 max-w-xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by username, email or phone..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BFFF]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <LuArrowUpDown className="text-gray-400 shrink-0" size={15} />
          <select
            value={balanceSort}
            onChange={(e) => {
              setBalanceSort(e.target.value as "asc" | "desc");
              setCurrentPage(1);
            }}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#00BFFF] cursor-pointer"
          >
            <option value="desc">Balance: High → Low</option>
            <option value="asc">Balance: Low → High</option>
          </select>
        </div>
      </div>

      <SCustomTable columns={columns} data={data?.data || []} />

      <CustomPagination
        currentPage={currentPage}
        totalItems={data?.total || 0}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-md w-full max-w-lg shadow-2xl overflow-hidden border border-gray-300">
            <div className="p-3 border-b bg-white flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-tight text-gray-800">
                PERFORM BALANCE ADJUSTMENT for user ID {selectedWallet?.id} (
                {selectedWallet?.username})
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <LuX size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {!showPreview ? (
                <>
                  <div className="p-4 border rounded-md space-y-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase">
                      Adjustment Action
                    </label>
                    <select
                      className="w-full border rounded-md p-2 text-sm bg-gray-50 focus:ring-1 focus:ring-blue-400 outline-none"
                      value={formData.adjustmentAction}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adjustmentAction: e.target.value as AdjustmentAction,
                        })
                      }
                    >
                      <option value="">Select an option...</option>
                      <option value={AdjustmentAction.ADD_CREDIT_FUNDS}>
                        Add/Credit Funds
                      </option>
                      <option value={AdjustmentAction.DEDUCT_MINUS_FUNDS}>
                        Deduct/Minus Funds
                      </option>
                    </select>
                  </div>

                  <div className="p-4 border rounded-md space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-700 uppercase border-b pb-1">
                      Adjustment Details (Pre-Submit)
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600">
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amount: Number(e.target.value),
                              })
                            }
                            className="w-full border rounded-md pl-7 pr-3 py-2 text-sm outline-none focus:border-red-300"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600">
                          Trip/Order ID{" "}
                          <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.orderId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              orderId: e.target.value,
                            })
                          }
                          className="w-full border rounded-md mt-1 px-3 py-2 text-sm outline-none"
                          placeholder="e.g. 1234567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600">
                            Reason for Adjustment{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full border rounded-md mt-1 p-2 text-sm outline-none"
                            value={formData.reason}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                reason: e.target.value,
                              })
                            }
                          >
                            <option value="REFUND">Refund</option>
                            <option value="ADMIN_CORRECTION">
                              Admin Correction
                            </option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>

                        {/* CONDITIONAL PENALTY TYPE SELECT */}
                        {formData.adjustmentAction ===
                          AdjustmentAction.DEDUCT_MINUS_FUNDS && (
                          <div>
                            <label className="block text-[11px] font-medium text-red-600">
                              Penalty Type{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              className="w-full border border-red-200 rounded-md mt-1 p-2 text-sm outline-none bg-red-50"
                              value={formData.penaltyType}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  penaltyType: e.target.value as PenaltyType,
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
                              <option value={PenaltyType.OTHER}>Other</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-gray-600">
                          Additional Notes{" "}
                          <span className="text-gray-400">(new, optional)</span>
                        </label>
                        <textarea
                          value={formData.additionalNotes}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              additionalNotes: e.target.value,
                            })
                          }
                          className={`w-full border rounded-md mt-1 p-2 text-sm outline-none resize-none ${formData.adjustmentAction === AdjustmentAction.DEDUCT_MINUS_FUNDS ? "h-[90px]" : "h-[42px]"}`}
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 pt-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isConfirmedByAdmin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isConfirmedByAdmin: e.target.checked,
                            })
                          }
                          className="mt-1 accent-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Confirmed by Admin{" "}
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isNotify}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isNotify: e.target.checked,
                            })
                          }
                          className="mt-1 accent-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700 leading-tight">
                            Auto-trigger notification to user/driver
                          </p>
                          <p className="text-[10px] text-gray-500 leading-tight">
                            Checking this will automatically send an instant
                            Push Notification and In-App message.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                /* Summary Preview Section */
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-md space-y-2 text-sm">
                  <p className="font-bold border-b pb-1 mb-2">
                    SUMMARY PREVIEW
                  </p>
                  <p>
                    <strong>Action:</strong>{" "}
                    {formData.adjustmentAction?.replace(/_/g, " ")}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${formData.amount}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {formData.orderId || "N/A"}
                  </p>
                  <p>
                    <strong>Reason:</strong> {formData.reason}
                  </p>

                  {/* PENALTY TYPE IN PREVIEW */}
                  {formData.adjustmentAction ===
                    AdjustmentAction.DEDUCT_MINUS_FUNDS && (
                    <p className="text-red-600">
                      <strong>Penalty:</strong>{" "}
                      {formData.penaltyType.replace(/_/g, " ")}
                    </p>
                  )}

                  <p>
                    <strong>Notification:</strong>{" "}
                    {formData.isNotify ? "Enabled" : "Disabled"}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 flex gap-2">
              {!showPreview ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white cursor-pointer"
                    onClick={() => setShowPreview(true)}
                    disabled={
                      !formData.adjustmentAction || formData.amount <= 0
                    }
                  >
                    Next: Review Preview
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowPreview(false)}
                  >
                    Go Back
                  </Button>
                  <Button
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Adjustment"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWalletAdminTable;
