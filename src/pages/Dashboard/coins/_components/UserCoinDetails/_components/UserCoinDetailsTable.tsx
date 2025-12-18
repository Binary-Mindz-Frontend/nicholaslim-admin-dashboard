// UserCoinDetailsTable.tsx
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { FiTrash } from "react-icons/fi";
// import { LuPencil } from "react-icons/lu";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useGetUserCoinHistoryByIdQuery } from "@/redux/features/coinManagement/coinManagementApi";

interface Transaction {
  id: number;
  userId: number;
  username: string;
  total_coin_acc: string;
  type: string;
  total_coin_apply: string | null;
  current_coin_balance: string | null;
  created_at: string;
  updated_at: string;
}

interface CoinDetails {
  id: number;
  date: string;
  ruleTriggered: string;
  coinsAccumulated: number;
  editedBy: string;
  type: string;
  total_coin_apply: string | null;
}

const UserCoinDetailsTable: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: apiData, isLoading } = useGetUserCoinHistoryByIdQuery(id || "");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getRuleTriggeredFromType = (type: string): string => {
    const typeMap: Record<string, string> = {
      "ACCUMULATION": "Auto Accumulation",
      "MANUAL_ADJUSTMENT": "Manual Adjustment",
      "REDEMPTION": "Coin Redemption",
      "EXPIRATION": "Coin Expiration",
      "APPLICATION": "Coin Application",
    };
    return typeMap[type] || type;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedCoin, setSelectedCoin] = useState<CoinDetails | null>(null);
  const [coinsInput, setCoinsInput] = useState<number>(0);

  const transactions = apiData?.data || [];
  const wallet = transactions.map((item: Transaction) => ({
    id: item.id,
    date: formatDate(item.created_at),
    ruleTriggered: getRuleTriggeredFromType(item.type),
    coinsAccumulated: parseInt(item.total_coin_acc) || 0,
    editedBy: item.type === "ACCUMULATION" ? "System" : "Manual",
    type: item.type,
    total_coin_apply: item.total_coin_apply,
  }));
  
  const totalItems = wallet.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = wallet.slice(startIndex, endIndex);

  // const openEditModal = (row: CoinDetails) => {
  //   setSelectedCoin(row);
  //   setCoinsInput(row.coinsAccumulated);
  //   setIsModalOpen(true);
  // };

  // const saveCoins = () => {
  //   if (selectedCoin) {
  //     refetch();
  //   }
  //   setIsModalOpen(false);
  // };

  // const handleDelete = (id: number) => {
  //   if (window.confirm("Are you sure you want to delete this transaction?")) {
  //     refetch();
  //   }
  // };

  const columns = [
    { 
      key: "date" as const, 
      label: "DATE" 
    },
    { 
      key: "ruleTriggered" as const, 
      label: "RULE TRIGGERED" 
    },
    {
      key: "coinsAccumulated" as const,
      label: "COIN AMOUNT",
      render: (value: number, row: CoinDetails) => {
        if (row.type === "ACCUMULATION") {
          return `+${value} Coins`;
        } else if (row.type === "APPLICATION") {
          return `${value} Coins`;
        }
        return `${value} Coins`;
      },
    },
    {
      key: "editedBy" as const,
      label: "EDITED BY",
      render: (value: string, row: CoinDetails) => {
        if (row.type === "ACCUMULATION") {
          return "System";
        }
        return value;
      },
    },
    // {
    //   label: "ACTION",
    //   render: (_: any, row: CoinDetails) => (
    //     <div className="flex gap-2">
    //       <Button
    //         variant="ghost"
    //         size="sm"
    //         className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
    //         onClick={() => openEditModal(row)}
    //       >
    //         <LuPencil size={16} className="text-[#00BFFF]" />
    //       </Button>
    //       <Button
    //         variant="ghost"
    //         size="sm"
    //         className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-100"
    //         onClick={() => handleDelete(row.id)}
    //       >
    //         <FiTrash size={16} className="text-[#FF4D4F]" />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Loading transaction history...</span>
      </div>
    );
  }

  if (wallet.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-600">No Transaction History</h3>
        <p className="text-gray-500">No coin transactions found for this user.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} transactions
      </div>
      
      <SCustomTable data={displayData} columns={columns} />
      
      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coin Amount</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="coins">Coins Amount</Label>
            <Input
              id="coins"
              type="number"
              value={coinsInput}
              className="focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00]"
              onChange={(e) => setCoinsInput(Number(e.target.value))}
            />
            {/* {selectedCoin && (
              <p className="text-sm text-gray-500">
                Transaction ID: {selectedCoin.id} | Type: {selectedCoin.type}
              </p>
            )} */}
          </div>

          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            {/* <Button 
              className="cursor-pointer bg-[#FFCC00] hover:bg-[#E6B800] text-black"
              onClick={saveCoins}
            >
              Save Changes
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserCoinDetailsTable;