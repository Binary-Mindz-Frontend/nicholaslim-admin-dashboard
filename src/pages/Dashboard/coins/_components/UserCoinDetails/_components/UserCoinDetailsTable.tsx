import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
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

interface CoinDetails {
  date: string;
  id: number;
  ruleTriggered: string;
  coinsAccumulated: number;
  editedBy: "Admin" | "Finance";
}

const wallet: CoinDetails[] = [
  { id: 1, ruleTriggered: "Ang Mo Kio", coinsAccumulated: 15, editedBy: "Admin", date: "10 Oct 2025" },
  { id: 2, ruleTriggered: "Punggol", coinsAccumulated: 15, editedBy: "Finance", date: "10 Oct 2025" },
  { id: 3, ruleTriggered: "Bishan", coinsAccumulated: 15, editedBy: "Finance", date: "10 Oct 2025" },
  { id: 4, ruleTriggered: "Yishun", coinsAccumulated: 15, editedBy: "Admin", date: "10 Oct 2025" },
  { id: 5, ruleTriggered: "Serangoon", coinsAccumulated: 15, editedBy: "Admin", date: "10 Oct 2025" },
  { id: 6, ruleTriggered: "Ang Mo Kio", coinsAccumulated: 15, editedBy: "Finance", date: "10 Oct 2025" },
  { id: 7, ruleTriggered: "Punggol", coinsAccumulated: 15, editedBy: "Admin", date: "10 Oct 2025" },
  { id: 8, ruleTriggered: "Punggol", coinsAccumulated: 15, editedBy: "Finance", date: "10 Oct 2025" },
  { id: 9, ruleTriggered: "Punggol", coinsAccumulated: 15, editedBy: "Finance", date: "10 Oct 2025" },
  { id: 10, ruleTriggered: "Clementi", coinsAccumulated: 15, editedBy: "Admin", date: "10 Oct 2025" },
];

const UserCoinDetailsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 21;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = wallet.slice(startIndex, endIndex);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinDetails | null>(null);
  const [coinsInput, setCoinsInput] = useState<number>(0);

  const openEditModal = (row: CoinDetails) => {
    setSelectedCoin(row);
    setCoinsInput(row.coinsAccumulated);
    setIsModalOpen(true);
  };

  const saveCoins = () => {
    if (selectedCoin) {
      selectedCoin.coinsAccumulated = coinsInput;
      // If using state, you'd update the state array here
      // setWallet(prev => prev.map(c => c.id === selectedCoin.id ? {...c, coinsAccumulated: coinsInput} : c))
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: "date" as const, label: "DATE" },
    { key: "ruleTriggered" as const, label: "RULE TRIGGERED" },
    {
      key: "coinsAccumulated" as const,
      label: "COIN AMMOUNT",
      render: (value: number) => `+${value} Coins`,
    },
    {
      key: "editedBy" as const,
      label: "EDITED BY",
      render: (value: string) => `${value}`,
    },
    {
      label: "ACTION",
      render: (_: any, row: CoinDetails) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
            onClick={() => openEditModal(row)}
          >
            <LuPencil size={16} className="text-[#00BFFF]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-100"
          >
            <FiTrash size={16} className="text-[#FF4D4F]" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
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
            <DialogTitle>Edit Coins</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="coins">Coins</Label>
            <Input
              id="coins"
              type="number"
              value={coinsInput}
              className=" focus:!ring-1 focus:!ring-[#FFCC00] focus:!border-[#FFCC00] "
              onChange={(e) => setCoinsInput(Number(e.target.value))}
            />
          </div>

          <DialogFooter className="mt-4 ">
            <Button className=" cursor-pointer hover:text-black" onClick={saveCoins}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserCoinDetailsTable;
