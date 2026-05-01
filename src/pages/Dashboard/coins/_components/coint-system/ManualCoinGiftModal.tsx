/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserTypesQuery } from "@/redux/features/usersTypes/usersTypesApi";
import { useGetCoinBasePriceQuery, useCreateCoinGiftMutation } from "@/redux/features/coinManagement/coinManagementApi";
import CustomSelect from "@/components/Shared/CustomSelect/CustomSelect";
import toast from "react-hot-toast";

interface ManualCoinGiftModalProps {
  open: boolean;
  onClose: () => void;
}

const ManualCoinGiftModal: React.FC<ManualCoinGiftModalProps> = ({ open, onClose }) => {
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userList, setUserList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [coins, setCoins] = useState<string>("");
  const [expiration, setExpiration] = useState<string>("30");
  const [reason, setReason] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const { data: userData, isFetching: isUserFetching } = useGetUserTypesQuery({
    page: userPage,
    limit: 10,
    search: userSearch,
  });

  const { data: coinBasePriceData } = useGetCoinBasePriceQuery({});
  const [createCoinGift, { isLoading: isGifting }] = useCreateCoinGiftMutation();

  const basePrice = coinBasePriceData?.data ? parseFloat(coinBasePriceData.data) : 0;

  useEffect(() => {
    if (userData?.data?.data) {
      if (userPage === 1) setUserList(userData.data.data);
      else setUserList((prev) => [...prev, ...userData.data.data]);
    }
  }, [userData, userPage]);

  useEffect(() => {
    if (selectedUser && coins) {
      setMessage(`Hello ${selectedUser.name}, you've been gifted ${coins} coins!`);
    } else {
      setMessage("");
    }
  }, [selectedUser, coins]);

  const handleUserSelect = (_name: string, id: string | number) => {
    const user = userList.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleConfirm = async () => {
    if (!selectedUser || !coins || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        userId: Number(selectedUser.id),
        coins: Number(coins),
        expiresInDays: Number(expiration),
        reason: reason,
        message: message,
      };

      const res = await createCoinGift(payload).unwrap();
      if (res.success) {
        toast.success(res.message || "Coins gifted successfully!");
        onClose();
        resetForm();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to gift coins");
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setCoins("");
    setExpiration("30");
    setReason("");
    setMessage("");
    setUserSearch("");
    setUserPage(1);
  };

  const calculateValue = () => {
    if (!coins || isNaN(parseFloat(coins))) return "0.00";
    return ((basePrice / 100) * parseFloat(coins)).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-white border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">Manual Coin Gift</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-8 max-h-[80vh] overflow-y-auto bg-gray-50/30">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">USER SELECTION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="flex gap-0">
                <CustomSelect
                  placeholder="UserID / Username / Email"
                  options={userList.map((u) => ({
                    id: u.id,
                    name: `${u.name} (ID: ${u.id})`,
                  }))}
                  onValueChange={handleUserSelect}
                  onSearchChange={(q) => {
                    setUserSearch(q);
                    setUserPage(1);
                  }}
                  onScrollEnd={() => setUserPage((p) => p + 1)}
                  isLoading={isUserFetching}
                  value={selectedUser ? selectedUser.name : ""}
                  className="rounded-r-none border-r-0"
                />
              </div>

              {selectedUser && (
                <div className="p-0 space-y-0 relative">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-lg">{selectedUser.name}</span>
                        <span className="text-sm text-gray-400">(UserName)</span>
                      </div>
                      <div className="text-sm text-gray-700 font-medium">ID: {selectedUser.id}</div>
                      <div className="text-sm text-gray-500">{selectedUser.email}</div>
                      <div className="text-sm text-gray-600">Current Balance: <span className="text-orange-500 font-bold">0 coins</span></div>
                      <div className="text-sm text-gray-600">Total Accumulated: <span className="text-orange-500 font-bold">0 coins</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TRANSACTION & NOTIFICATION */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Transaction & Notification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Gifting Amount</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={coins}
                        onChange={(e) => setCoins(e.target.value)}
                        placeholder="coins"
                        className="pr-12 h-11 border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 rounded-lg"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col -gap-1">
                        <ChevronDown className="h-3 w-3 rotate-180 text-gray-400" />
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Value (SGD)</Label>
                    <Input
                      readOnly
                      value={`$${calculateValue()}`}
                      className="h-11 bg-gray-100 border-gray-200 text-gray-600 font-medium rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Expiration</Label>
                  <Select value={expiration} onValueChange={setExpiration}>
                    <SelectTrigger className="h-11 border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 rounded-lg bg-white">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                User Notification Message <span className="text-gray-400 font-normal">(Send on Confirmation)</span>
              </Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hello robin, you've been gifted [X] coins!"
                className="min-h-[120px] border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 rounded-lg p-4 leading-relaxed"
              />
            </div>
          </div>

          {/* REASON/NOTE */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Reason/Note (Internal) <span className="text-red-500 font-bold">(Required)</span>
            </Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Customer Service Compensation, Special Birthday Bonus"
              className="h-11 border-gray-200 focus:ring-yellow-400 focus:border-yellow-400 rounded-lg shadow-sm"
            />
            <div className="text-right">
              <p className="text-[11px] text-gray-500 font-medium italic">
                *User will receive a notification of this gift upon confirmation.*
              </p>
            </div>

          </div>
        </div>

        <DialogFooter className="p-6 bg-white border-t gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 px-8 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isGifting || !selectedUser || !coins || !reason}
            className="h-11 px-8 rounded-lg bg-yellow-400 text-gray-700 hover:bg-yellow-500 font-semibold cursor-pointer"
          >
            {isGifting ? "Processing..." : "Confirm Manual Gift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Internal icon for CustomSelect appearance from image
const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default ManualCoinGiftModal;
