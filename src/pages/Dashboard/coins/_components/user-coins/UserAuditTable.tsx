import type React from "react"
import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { FiTrash } from "react-icons/fi";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";
import SCustomTable from "@/pages/Dashboard/_components/CutomTable";
import { useNavigate } from "react-router-dom";

interface UserCoin {
  id: number
  name: string
  totalCoinsAccumulated: number
  currentCoinBalance: number
}

interface UserAuditTableProps {
  data?: UserCoin[];
  isLoading?: boolean;
}

const UserAuditTable: React.FC<UserAuditTableProps> = ({ 
  data = [], 
  isLoading = false 
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const wallet = data;
  
  const totalItems = wallet.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = wallet.slice(startIndex, endIndex);

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
    // {
    //   label: "ACTION",
    //   render: () => (
    //     <div className="flex gap-2">
    //       <Button
    //         variant="ghost"
    //         size="sm"
    //         className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-100"
    //       >
    //         <FiTrash size={16} className="text-[#FF4D4F]" />
    //       </Button>
    //     </div>
    //   ),
    // }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Loading user data...</span>
      </div>
    );
  }

  if (wallet.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-600">No User Data</h3>
        <p className="text-gray-500">No user coin history found.</p>
      </div>
    );
  }

  return (
    <div>
      <SCustomTable 
        data={displayData} 
        columns={columns}
      />
      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default UserAuditTable;