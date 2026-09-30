import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface VerifyRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    reason: string;
    notificationChannel: "EMAIL" | "SMS" | "BOTH" | "NONE";
    notifyEmail: boolean;
    notifySms: boolean;
  }) => Promise<void>;
  verifyStatus: "APPROVED" | "REJECTED";
  driverName?: string;
  isLoading?: boolean;
}

export default function VerifyRiderModal({
  isOpen,
  onClose,
  onConfirm,
  verifyStatus,
  driverName,
  isLoading = false,
}: VerifyRiderModalProps) {
  const [reason, setReason] = useState("");
  const [notificationChannel, setNotificationChannel] = useState<
    "EMAIL" | "SMS" | "BOTH" | "NONE"
  >("BOTH");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setNotificationChannel("BOTH");
      setNotifyEmail(true);
      setNotifySms(true);
    }
  }, [isOpen]);

  const handleChannelChange = (channel: "EMAIL" | "SMS" | "BOTH" | "NONE") => {
    setNotificationChannel(channel);
    if (channel === "BOTH") {
      setNotifyEmail(true);
      setNotifySms(true);
    } else if (channel === "EMAIL") {
      setNotifyEmail(true);
      setNotifySms(false);
    } else if (channel === "SMS") {
      setNotifyEmail(false);
      setNotifySms(true);
    } else if (channel === "NONE") {
      setNotifyEmail(false);
      setNotifySms(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verifyStatus === "REJECTED" && !reason.trim()) {
      toast.error("Please provide a rejection reason for the driver.");
      return;
    }

    await onConfirm({
      reason: reason.trim(),
      notificationChannel,
      notifyEmail,
      notifySms,
    });
  };

  const isReject = verifyStatus === "REJECTED";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            {isReject ? (
              <>
                <AlertTriangle className="h-6 w-6 text-red-500" />
                Reject Driver Application
              </>
            ) : (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Approve Driver Application
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {driverName && (
            <p className="text-sm text-gray-600">
              Driver: <span className="font-semibold text-gray-900">{driverName}</span>
            </p>
          )}

          {/* Reason / Comment Textarea */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">
              {isReject ? "Rejection Reason *" : "Approval Note (Optional)"}
            </Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isReject
                  ? "e.g. Driving license photo is blurry. Please provide a clear scan."
                  : "e.g. All documents verified successfully."
              }
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              required={isReject}
            />
            {isReject && (
              <p className="text-xs text-gray-500">
                This reason will be stored in the change log and sent to the driver.
              </p>
            )}
          </div>

          {/* Notification Channel Select */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Notification Channel</Label>
            <select
              value={notificationChannel}
              onChange={(e) =>
                handleChannelChange(
                  e.target.value as "EMAIL" | "SMS" | "BOTH" | "NONE"
                )
              }
              className="w-full px-3 py-2 border rounded-md text-sm bg-white outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="BOTH">Both (Email + SMS)</option>
              <option value="EMAIL">Email Only</option>
              <option value="SMS">SMS Only</option>
              <option value="NONE">None (Do not notify)</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              Send Email
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input
                type="checkbox"
                checked={notifySms}
                onChange={(e) => setNotifySms(e.target.checked)}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
              />
              Send SMS
            </label>
          </div>

          <DialogFooter className="pt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={
                isReject
                  ? "bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                  : "bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer"
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isReject ? (
                "Confirm Rejection"
              ) : (
                "Confirm Approval"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
