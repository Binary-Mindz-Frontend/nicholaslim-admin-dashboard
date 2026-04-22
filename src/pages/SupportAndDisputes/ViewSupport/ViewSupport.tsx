/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { ChevronLeft, CircleX } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCloseDisputeCaseMutation,
  useGetDisputeByIdQuery,
  useResolveDisputeMutation,
} from "@/redux/features/disputes/disputesApi";
import { useGetOwnProfileQuery } from "@/redux/features/users/usersApi";
import toast from "react-hot-toast";

const ViewSupport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: disputeData,
    isLoading,
    refetch,
  } = useGetDisputeByIdQuery(id || "");

  const [resolveDispute, { isLoading: isResolving }] =
    useResolveDisputeMutation();
  const [closeDisputeCase, { isLoading: isClosing }] =
    useCloseDisputeCaseMutation();
  const { data: userData } = useGetOwnProfileQuery("");

  const [adjustmentType, setAdjustmentType] = useState("");
  const [amount, setAmount] = useState("");
  const [companyPercentage, setCompanyPercentage] = useState(60);
  const [driverPercentage, setDriverPercentage] = useState(40);

  const dispute = disputeData?.data;
  const adminId = userData?.data?.adminProfiles?.[0]?.id;

  useEffect(() => {
    const amt = Number(amount) || 0;
    if (amt > 0) {
      const totalPercent = companyPercentage + driverPercentage;
      if (totalPercent !== 100) {
        setDriverPercentage(100 - companyPercentage);
      }
    }
  }, [amount, companyPercentage, driverPercentage]);

  useEffect(() => {
    if (dispute?.order?.total_cost && !amount) {
      setAmount(dispute.order.total_cost.toString());
    }
  }, [dispute, amount]);

  const calculateAllocations = () => {
    const amt = Number(amount) || 0;
    const companyAlloc = (amt * companyPercentage) / 100;
    const driverAlloc = (amt * driverPercentage) / 100;
    return { companyAlloc, driverAlloc };
  };

  const { companyAlloc, driverAlloc } = calculateAllocations();

  const handleResolveDispute = async () => {
    if (!adjustmentType || !amount || Number(amount) <= 0) {
      toast.error("Please select adjustment type and enter a valid amount");
      return;
    }

    try {
      const resolveData = {
        disputeId: Number(id),
        refundType: adjustmentType,
        totalAmount: Number(amount),
        companyPercent: companyPercentage,
        riderPercent: driverPercentage,
        adminId: adminId,
      };

      const response = await resolveDispute(resolveData).unwrap();

      if (!response.success) {
        toast.error(response.message || "Failed to resolve dispute");
        console.log(response);
        return;
      }

      toast.success(response.message || "Dispute resolved successfully");
      refetch();

      setAdjustmentType("");
      setAmount("");
      setCompanyPercentage(60);
      setDriverPercentage(40);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resolve dispute");
    }
  };

  const handleCloseCase = async () => {
    if (!id) {
      toast.error("No dispute ID found");
      return;
    }

    try {
      const response = await closeDisputeCase(id).unwrap();

      if (!response.success) {
        toast.error(response.message || "Failed to close dispute case");
        return;
      }

      toast.success(response.message || "Dispute case closed successfully");
      navigate("/support");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to close dispute case");
    }
  };

  const handleCompanyPercentageChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setCompanyPercentage(numValue);
      setDriverPercentage(100 - numValue);
    }
  };

  const formatPriority = (priority: string) => {
    const map: Record<string, string> = {
      HIGH: "High",
      MEDIUM: "Medium",
      LOW: "Low",
    };
    return map[priority] || priority;
  };

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "Pending",
      UNDER_REVIEW: "Under Review",
      AWAITING_INFO: "Awaiting Info",
      RESOLVED: "Resolved",
      REJECTED: "Rejected",
    };
    return map[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "LOW":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 sm:p-6 bg-[#F5F7FA]">
        <div className="w-full mx-auto space-y-4 mb-6">
          <div className="pt-2 sm:py-2">
            <h1 className="text-black text-2xl font-bold">
              Loading Dispute...
            </h1>
          </div>
          <div className="p-2 sm:p-10 md:px-28 space-y-6 bg-white rounded-2xl">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="px-8 sm:p-6 bg-[#F5F7FA]">
        <div className="w-full mx-auto space-y-4 mb-6">
          <div className="pt-2 sm:py-2 flex items-center justify-between">
            <h1 className="text-black text-2xl font-bold">Dispute Not Found</h1>
            <button
              onClick={() => navigate(`/support`)}
              className="flex items-center gap-1 cursor-pointer bg-primary py-2 px-4 rounded-md text-base"
            >
              Close Case <CircleX size={16} />
            </button>
          </div>
          <div className="p-2 sm:p-10 md:px-28 space-y-6 bg-white rounded-2xl">
            <p className="text-red-500 text-center p-10">Case not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        <div className="pt-2 sm:py-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-md border cursor-pointer transition-colors group"
              title="Go Back"
            >
              <ChevronLeft
                size={24}
                className="text-gray-600 group-hover:text-black"
              />
            </button>

            <h1 className="text-black text-2xl font-bold">
              Dispute #{dispute.id.toString().padStart(4, "0")}
            </h1>
          </div>

          <button
            onClick={handleCloseCase}
            disabled={isClosing}
            className="flex items-center gap-1 cursor-pointer bg-primary py-2 px-4 rounded-md text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClosing ? "Closing..." : "Close Case"} <CircleX size={16} />
          </button>
        </div>

        <div className="p-2 sm:p-10 md:px-28 space-y-6 bg-white rounded-2xl">
          <h2 className="text-center text-lg font-semibold">
            Original Complaint
          </h2>

          <div className="border rounded-lg p-6 bg-white shadow">
            <div className="text-sm mb-4">
              <div className="flex items-center justify-between mb-3">
                <p>Case ID</p>
                <p className="font-semibold">
                  DISP#{dispute.id.toString().padStart(4, "0")}
                </p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p>Order ID</p>
                <p className="font-semibold">ORD-{dispute.orderId}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p>Issue Type</p>
                <p>{dispute.issueType.replace(/_/g, " ")}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p>Priority</p>
                <p
                  className={`font-semibold ${getPriorityColor(dispute.priority)}`}
                >
                  {formatPriority(dispute.priority)}
                </p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p>Status</p>
                <p className="font-medium">{formatStatus(dispute.status)}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p>Date Created</p>
                <p>{formatDate(dispute.created_at)}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p>Created By</p>
                <p>{dispute.createdByType || "User"}</p>
              </div>
              <div className="my-5 sm:my-2">
                <hr />
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">Description</p>
              <p className="text-gray-600 mt-1">
                {dispute.description || "No description provided."}
              </p>
            </div>
          </div>

          {dispute.status !== "RESOLVED" && (
            <>
              <h2 className="text-center text-lg font-semibold">
                Financial Adjustment
              </h2>
              <div className="border rounded-lg p-6 bg-white shadow space-y-6">
                <div className="flex flex-col gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">
                        Adjustment Type
                      </label>
                      <Select
                        value={adjustmentType}
                        onValueChange={setAdjustmentType}
                        disabled={dispute.status === "RESOLVED"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select adjustment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL">Full Refund</SelectItem>
                          <SelectItem value="CUSTOM">Custom Refund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium block">
                        Total Order Cost
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md border">
                        <span className="text-lg font-semibold">
                          ${dispute.order?.total_cost || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {adjustmentType && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">
                          Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={dispute.status === "RESOLVED"}
                            className="pl-7"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium block">
                          Company Allocation
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="number"
                                value={companyPercentage}
                                onChange={(e) =>
                                  handleCompanyPercentageChange(e.target.value)
                                }
                                disabled={dispute.status === "RESOLVED"}
                                className="text-center"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                %
                              </span>
                            </div>
                            <span className="text-gray-400">=</span>
                            <div className="flex-1 p-2 bg-blue-50 rounded border">
                              <span className="font-medium">
                                ${companyAlloc.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium block">
                          Driver Allocation
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 flex items-center gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="number"
                                value={driverPercentage}
                                readOnly
                                className="text-center bg-gray-50"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                %
                              </span>
                            </div>
                            <span className="text-gray-400">=</span>
                            <div className="flex-1 p-2 bg-green-50 rounded border">
                              <span className="font-medium">
                                ${driverAlloc.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                        <label className="text-sm font-medium block">
                          Total
                        </label>
                        <div className="p-3 bg-yellow-50 rounded-md border">
                          <span className="text-xl font-bold">
                            ${Number(amount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-6 mt-8 pt-6 border-t">
                  <p className="text-black font-medium">
                    Dispute ID: DISP#{dispute.id.toString().padStart(4, "0")}
                  </p>
                  <button
                    onClick={handleResolveDispute}
                    disabled={
                      isResolving ||
                      dispute.status === "RESOLVED" ||
                      !adjustmentType ||
                      !amount
                    }
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isResolving ? "Processing..." : "Proceed Adjustment"}
                  </button>
                </div>
              </div>
            </>
          )}

          {dispute.evidence && dispute.evidence.length > 0 && (
            <>
              <h3 className="text-center font-semibold text-lg">
                Evidence Attachments
              </h3>
              <div className="border rounded-xl p-6 bg-white shadow">
                <div className="flex gap-6 justify-center sm:justify-start flex-wrap">
                  {dispute.evidence.map(
                    (evidenceItem: string, index: number) => (
                      <div key={index} className="relative">
                        {evidenceItem.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img
                            src={evidenceItem}
                            alt={`Evidence ${index + 1}`}
                            className="w-32 h-32 rounded-xl object-cover border shadow-sm"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-xl border shadow-sm bg-gray-50 flex items-center justify-center p-2">
                            <div className="text-center">
                              <div className="text-gray-500 text-xs mb-1">
                                Evidence {index + 1}
                              </div>
                              <div className="text-xs text-gray-700 wrap-break-word">
                                {evidenceItem.length > 30
                                  ? `${evidenceItem.substring(0, 30)}...`
                                  : evidenceItem}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  {dispute.evidence.length} evidence item(s) attached
                </div>
              </div>
            </>
          )}

          {(dispute.refundType || dispute.refundAmount) && (
            <>
              <h3 className="text-center font-semibold text-lg">
                Refund Information
              </h3>
              <div className="border rounded-xl p-6 bg-white shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dispute.refundType && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Refund Type:</span>
                      <span className="font-medium">{dispute.refundType}</span>
                    </div>
                  )}
                  {dispute.refundAmount && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Refund Amount:</span>
                      <span className="font-medium">
                        ${dispute.refundAmount}
                      </span>
                    </div>
                  )}
                  {dispute.userPercent !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">User Percentage:</span>
                      <span className="font-medium">
                        {dispute.userPercent}%
                      </span>
                    </div>
                  )}
                  {dispute.riderPercent !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rider Percentage:</span>
                      <span className="font-medium">
                        {dispute.riderPercent}%
                      </span>
                    </div>
                  )}
                  {dispute.resolvedBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Resolved By Admin ID:
                      </span>
                      <span className="font-medium">{dispute.resolvedBy}</span>
                    </div>
                  )}
                  {dispute.resolvedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Resolved At:</span>
                      <span className="font-medium">
                        {formatDate(dispute.resolvedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {dispute.status === "RESOLVED" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-green-700 font-semibold text-lg mb-2">
                This dispute has been resolved
              </h3>
              <p className="text-green-600">
                You cannot make further adjustments to a resolved dispute.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSupport;
