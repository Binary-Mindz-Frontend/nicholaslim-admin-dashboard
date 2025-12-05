"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
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

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
              onClick={() => {
                setSelectedReason(reason);
                setShowOtherTextarea(false);
              }}
              className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                selectedReason === reason
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        {/* Other Section */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowOtherTextarea(!showOtherTextarea);
              if (!showOtherTextarea) {
                setSelectedReason("Other");
              }
            }}
            className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50"
          >
            Other
            <span
              className={`transition-transform ${
                showOtherTextarea ? "rotate-180" : ""
              }`}
            >
              <ChevronDown />
            </span>
          </button>

          {/* Textarea - Collapsible */}
          {showOtherTextarea && (
            <Textarea
              placeholder="Please Specify"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="w-full mt-3 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 resize-none h-28 text-gray-700 placeholder-gray-400"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full cursor-pointer border-red-500 text-red-500 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            Cancel Order <span>✕</span>
          </Button>

          <Button
            className="w-full bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500"
            onClick={onClose}
          >
            No, do not want to cancel the order
          </Button>
        </div>
      </div>
    </div>
  );
}
