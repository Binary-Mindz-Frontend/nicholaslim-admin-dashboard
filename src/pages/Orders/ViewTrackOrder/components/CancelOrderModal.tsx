"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void; // Added onConfirm
  isLoading: boolean;                 // Added isLoading
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [showOtherTextarea, setShowOtherTextarea] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    "Changed my mind",
    "Too expensive for me",
    "Ordered by mistake",
  ];

  const handleConfirmClick = () => {
    // Determine the final reason string to send to the API
    const finalReason = selectedReason === "Other" ? otherReason : (selectedReason || "No reason provided");
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-8 md:p-10">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Are you sure you want to cancel?
        </h2>
        <p className="text-center text-gray-500 mb-8">
          You may have to start all over again.
        </p>

        {/* Reason Buttons */}
        <div className="space-y-3 mb-6">
          {reasons.map((reason) => (
            <button
              key={reason}
              disabled={isLoading}
              onClick={() => {
                setSelectedReason(reason);
                setShowOtherTextarea(false);
              }}
              className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                selectedReason === reason
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {reason}
            </button>
          ))}
        </div>

        {/* Other Section */}
        <div className="mb-6">
          <button
            disabled={isLoading}
            onClick={() => {
              setShowOtherTextarea(!showOtherTextarea);
              setSelectedReason("Other");
            }}
            className={`w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-900 rounded-lg hover:bg-gray-50 border-2 ${
              selectedReason === "Other" ? "border-blue-500 bg-blue-50" : "border-transparent"
            }`}
          >
            Other
            <span className={`transition-transform ${showOtherTextarea ? "rotate-180" : ""}`}>
              <ChevronDown />
            </span>
          </button>

          {showOtherTextarea && (
            <Textarea
              placeholder="Please Specify"
              value={otherReason}
              disabled={isLoading}
              onChange={(e) => setOtherReason(e.target.value)}
              className="w-full mt-3 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 resize-none h-28 text-gray-700"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            disabled={isLoading || !selectedReason}
            className="w-full py-6 border-red-500 text-red-500 hover:bg-red-50 font-bold transition-all flex items-center justify-center gap-2"
            onClick={handleConfirmClick}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>Confirm Cancel Order <span>✕</span></>
            )}
          </Button>

          <Button
            disabled={isLoading}
            className="w-full py-6 bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500"
            onClick={onClose}
          >
            No, do not want to cancel
          </Button>
        </div>
      </div>
    </div>
  );
}