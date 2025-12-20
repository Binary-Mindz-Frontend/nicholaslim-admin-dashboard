/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi";
import { LuScanEye } from "react-icons/lu";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import { useNavigate } from "react-router-dom";

interface Wallet {
  id: number
  name: string
  currentBalance: number
  totalBalanceAdded: number
  totalBalanceUsed: number

}

const wallet : Wallet[] = [
  { id: 1, name: "Ang Mo Kio", currentBalance: 15, totalBalanceAdded: 100, totalBalanceUsed: 50 },
  { id: 2, name: "Punggol", currentBalance: 15, totalBalanceAdded: 100, totalBalanceUsed: 50 },
  { id: 3, name: "Bishan", currentBalance: 15, totalBalanceAdded: 100, totalBalanceUsed: 50 },
  { id: 4, name: "Yishun", currentBalance: 15, totalBalanceAdded: 90, totalBalanceUsed: 50 },
  { id: 5, name: "Serangoon", currentBalance: 15, totalBalanceAdded: 100, totalBalanceUsed: 50 },
  { id: 6, name: "Ang Mo Kio", currentBalance: 15, totalBalanceAdded: 100, totalBalanceUsed: 50 },
  { id: 7, name: "Punggol", currentBalance: 15, totalBalanceAdded: 100, totalBalanceUsed: 50 },
  { id: 8, name: "Punggol", currentBalance: 15, totalBalanceAdded: 60, totalBalanceUsed: 50 },
  { id: 9, name: "Punggol", currentBalance: 15, totalBalanceAdded: 85, totalBalanceUsed: 50 },
  { id: 10, name: "Clementi", currentBalance: 15, totalBalanceAdded: 95, totalBalanceUsed: 50 },
]

const UserWalletTable: React.FC = () => {
    const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 21

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayData = wallet.slice(startIndex, endIndex)



  const columns = [
      {
      key: "id" as const,
      label: "User Id",
    },
    {
      key: "name" as const,
      label: "NAME",
    },
    {
      key: "currentBalance" as const,
      label: "CURRENT BALANCE",
       render: (value: number) => `$${value}`,
    },
    {
      key: "totalBalanceAdded" as const,
      label: "TOTAL BALANCE ADDED",
      render: (value: number) => `$${value}`,
    },
    {
      key: "totalBalanceUsed" as const,
      label: "TOTAL BALANCE USED",
      render: (value: number) => `$${value}`,
    },
   {
  label: "ACTION",
  render: (_: any, row: Wallet) => (
    <div className="flex gap-2">

      <Button
      onClick={()=> navigate(`/wallet-user/${row.id}`)}
        variant="ghost"
        size="sm"
        className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
      >
        <LuScanEye size={16} className="text-[#00BFFF]" />
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
}

    
  ]

  return (
       <div>
         <SCustomTable data={displayData} columns={columns}
          />
        <TablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
       </div>
  )
}

export default UserWalletTable
