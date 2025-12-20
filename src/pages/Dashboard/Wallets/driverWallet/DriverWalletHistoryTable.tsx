



import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";

interface WalletDetails {
  id: number
  name: string
  amount: number
  type: string
  transactionDate: string

}

const wallet : WalletDetails[] = [
  { id: 1, name: "Ang Mo Kio", amount: 15, type: "Payout", transactionDate: "08 Oct 2025" },
  { id: 2, name: "Punggol", amount: 15, type: "Payout", transactionDate: "08 Oct 2025" },
  { id: 3, name: "Bishan", amount: 15, type: "Deduction", transactionDate: "08 Oct 2025" },
  { id: 4, name: "Yishun", amount: 15, type: "Deduction", transactionDate: "08 Oct 2025" },
  { id: 5, name: "Serangoon", amount: 15, type: "Payout", transactionDate: "08 Oct 2025" },
  { id: 6, name: "Ang Mo Kio", amount: 15, type: "Deduction", transactionDate: "08 Oct 2025" },
  { id: 7, name: "Punggol", amount: 15, type: "Payout", transactionDate: "08 Oct 2025" },
  { id: 8, name: "Punggol", amount: 15, type: "Deduction", transactionDate: "08 Oct 2025" },
  { id: 9, name: "Punggol", amount: 15, type: "Payout", transactionDate: "08 Oct 2025" },
  { id: 10, name: "Clementi", amount: 15, type: "Payout", transactionDate: "08 Oct 2025" },
]

const DriverWalletDetailsTable: React.FC = () => {

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 21

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayData = wallet.slice(startIndex, endIndex)



  const columns = [
      {
      key: "id" as const,
      label: "Transaction ID",
    },
    {
      key: "name" as const,
      label: "NAME",
    },
     {
      key: "transactionDate" as const,
      label: "TRANSACTION DATE",
      render: (value: number) => `$${value}`,
    },
    {
      key: "amount" as const,
      label: "AMOUNT",
       render: (value: number) => `$${value}`,
    },   
   {
  label: "ACTION",
  render: () => (
    <div className="flex ">

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
{
  key: "type" as const,
  label: "TYPE",
  render: (status: string) => {
    const colors =
      status === "Deduction"
        ? "bg-[#FF4D4F33] text-[#FF4D4F]"
        : "bg-[#CAE2B6] text-[#2F4F1F]"

    return (
      <span
        className={`inline-flex items-center justify-center 
          ${colors}
          w-[90px] h-[32px]       
          text-xs font-semibold rounded-sm`}
      >
        {status}
      </span>
    )
  },
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

export default DriverWalletDetailsTable
