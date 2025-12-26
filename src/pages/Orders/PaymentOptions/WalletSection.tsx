
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import { useGetOwnProfileQuery } from "@/redux/features/users/usersApi";

export default function WalletSection() {
  const { data } = useGetOwnProfileQuery(undefined);

  return (
    <div className="py-6 space-y-6">
      <div className="rounded-2xl p-6">
        <h2 className="text-2xl text-gray-800 mb-6 font-bold">
          Payment Options
        </h2>

        <div className="bg-white rounded-xl p-4 px-6 py-8 text-center">
          <div className="flex justify-center items-center gap-3">
            <div className="p-4 bg-gray-100 rounded-xl">
              <Wallet className="text-gray-700" />
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-600">My Wallet</p>
              <p className="text-3xl font-semibold text-gray-600">
                ${(data?.data?.currentWalletBalance ?? 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 font-bold mt-6 justify-center">
            <Button className="px-10 py-5 font-bold bg-[#FC0] hover:bg-[#FC0] text-yellow-900 rounded-md transition">
              Add Funds
            </Button>

            <div className="relative">
              <Button className="px-10 py-5 font-bold bg-white hover:bg-gray-50 text-gray-700 rounded-md border border-gray-300 transition">
                Redeem Points
              </Button>

              <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {data?.data?.current_coin_balance ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
}
