


import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
// import { useNavigate } from "react-router-dom";

interface Coin {
  id: number
  eventTrigger: string
  coinAmount: number
  expiryDuration: number
}

interface CoinSystemTableProps {
  onEdit: (row: Coin) => void
}

const wallet : Coin[] = [
  { id: 1, eventTrigger: "Ang Mo Kio", coinAmount: 15, expiryDuration: 100},
  { id: 2, eventTrigger: "Punggol", coinAmount: 15, expiryDuration: 100,},
  { id: 3, eventTrigger: "Bishan", coinAmount: 15, expiryDuration: 100,},
  { id: 4, eventTrigger: "Yishun", coinAmount: 15, expiryDuration: 90,},
  { id: 5, eventTrigger: "Serangoon", coinAmount: 15, expiryDuration: 100,  },
  { id: 6, eventTrigger: "Ang Mo Kio", coinAmount: 15, expiryDuration: 100,  },
  { id: 7, eventTrigger: "Punggol", coinAmount: 15, expiryDuration: 100, },
  { id: 8, eventTrigger: "Punggol", coinAmount: 15, expiryDuration: 60,  },
  { id: 9, eventTrigger: "Punggol", coinAmount: 15, expiryDuration: 85, },
  { id: 10, eventTrigger: "Clementi", coinAmount: 15, expiryDuration: 95,  },
]

const CoinSystemTable: React.FC<CoinSystemTableProps> = ({ onEdit }) => {
    // const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 21

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayData = wallet.slice(startIndex, endIndex)


  const columns = [
     
    {
      key: "eventTrigger" as const,
      label: "EVENT TRIGGER",
    },
    {
      key: "coinAmount" as const,
      label: "COIN AMMOUNT",
       render: (value: number) => `${value} Coins`,
    },
    {
      key: "expiryDuration" as const,
      label: "EXPIRY DURATION",
      render: (value: number) => `${value} Days`,
    },
  {
  label: "ACTION",
  render: (_: any, row: Coin) => (
    <div className="flex gap-2">

      {/* EDIT */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(row)}
        className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
      >
        <LuPencil size={16} className="text-[#00BFFF]" />
      </Button>

      {/* DELETE */}
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

export default CoinSystemTable
