
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi";
// import { LuScanEye } from "react-icons/lu";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import { useNavigate } from "react-router-dom";

interface UserCoin {
  id: number
  name: string
  totalCoinsAccumulated: number
  currentCoinBalance: number

}

const wallet : UserCoin[] = [
  { id: 1, name: "Ang Mo Kio", totalCoinsAccumulated: 15, currentCoinBalance: 100,  },
  { id: 2, name: "Punggol", totalCoinsAccumulated: 15, currentCoinBalance: 100,  },
  { id: 3, name: "Bishan", totalCoinsAccumulated: 15, currentCoinBalance: 100,  },
  { id: 4, name: "Yishun", totalCoinsAccumulated: 15, currentCoinBalance: 90,  },
  { id: 5, name: "Serangoon", totalCoinsAccumulated: 15, currentCoinBalance: 100,  },
  { id: 6, name: "Ang Mo Kio", totalCoinsAccumulated: 15, currentCoinBalance: 100,  },
  { id: 7, name: "Punggol", totalCoinsAccumulated: 15, currentCoinBalance: 100,  },
  { id: 8, name: "Punggol", totalCoinsAccumulated: 15, currentCoinBalance: 60,  },
  { id: 9, name: "Punggol", totalCoinsAccumulated: 15, currentCoinBalance: 85,  },
  { id: 10, name: "Clementi", totalCoinsAccumulated: 15, currentCoinBalance: 95,  },
]

const UserAuditTable: React.FC = () => {
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
    render: (value: number, row: UserCoin) => (
      <span
        onClick={() => navigate(`/coin-system/${row.id}`)}
        className="text-[#0088FF] underline cursor-pointer hover:text-blue-800"
      >
        {value}
      </span>
    ),
  },
  {
    key: "name" as const,
    label: "NAME",
    render: (value: string, row: UserCoin) => (
      <span
        onClick={() => navigate(`/coin-system/${row.id}`)}
        className="text-[#0088FF] underline cursor-pointer hover:text-blue-800"
      >
        {value}
      </span>
    ),
  },
    {
      key: "totalCoinsAccumulated" as const,
      label: "TOTAL COINS ACCUMULATED",
       render: (value: number) => `${value} Coins`,
    },
    {
      key: "currentCoinBalance" as const,
      label: "CURRENT COIN BALANCE",
      render: (value: number) => `${value} Coins`,
    },
   {
  label: "ACTION",
  render: (_: any, row: UserCoin) => (
    <div className="flex gap-2">
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

export default UserAuditTable
