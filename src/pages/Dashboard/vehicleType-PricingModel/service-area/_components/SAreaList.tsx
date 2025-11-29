
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import CustomTable from "../../_components/CutomTable"
import TablePagination from "../../_components/TablePagination"
import { FiTrash } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";

interface ServiceArea {
  id: number
  zones: string
  totalZones: number
  coverage: number
  status: "Active" | "Pending"
}

const mockData: ServiceArea[] = [
  { id: 1, zones: "Ang Mo Kio", totalZones: 15, coverage: 100, status: "Active" },
  { id: 2, zones: "Punggol", totalZones: 15, coverage: 100, status: "Active" },
  { id: 3, zones: "Bishan", totalZones: 15, coverage: 100, status: "Active" },
  { id: 4, zones: "Yishun", totalZones: 15, coverage: 90, status: "Pending" },
  { id: 5, zones: "Serangoon", totalZones: 15, coverage: 100, status: "Pending" },
  { id: 6, zones: "Ang Mo Kio", totalZones: 15, coverage: 100, status: "Active" },
  { id: 7, zones: "Punggol", totalZones: 15, coverage: 100, status: "Active" },
  { id: 8, zones: "Punggol", totalZones: 15, coverage: 60, status: "Active" },
  { id: 9, zones: "Punggol", totalZones: 15, coverage: 85, status: "Active" },
  { id: 10, zones: "Clementi", totalZones: 15, coverage: 95, status: "Active" },
]

const SAreaList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 21

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayData = mockData.slice(startIndex, endIndex)

  const handleRowAction = (actionType: string, rowData: ServiceArea, id: number | string) => {
    if (actionType === "edit") {
      console.log("Edit zone:", id, rowData)
      // Add your edit logic here - open modal, navigate, etc.
    } else if (actionType === "delete") {
      console.log("Delete zone:", id, rowData)
      // Add your delete logic here - confirm dialog, API call, etc.
    }
  }

  const columns = [
    {
      key: "zones" as const,
      label: "ZONES",
    },
    {
      key: "totalZones" as const,
      label: "TOTAL ZONES",
    },
    {
      key: "coverage" as const,
      label: "COVERAGE",
      render: (value: number) => `${value}%`,
    },
    {
      key: "status" as const,
      label: "ACTION",
      render: (_: any, row: ServiceArea) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction("edit", row, row.id)}
            className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
          >
            <LuPencil size={16} className="text-[#00BFFF]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRowAction("delete", row, row.id)}
            className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-100"
          >
            <FiTrash size={16} className="text-[#FF4D4F]" />
          </Button>
        </div>
      ),
    },
    {
      key: "status" as const,
      label: "STATUS",
      render: (status: string) => {
        const getStatusColor = (status: string) => {
          if (status === "Active") {
            return " bg-[#32620B50] px-5 py-1"
          }
          return " bg-[#FFEA96] px-4 py-1"
        }
        return (
          <span className={` rounded-sm w-12 h-10 text-xs font-semibold ${getStatusColor(status)}`}>{status}</span>
        )
      },
    },
  ]

  return (
    // <Card>
    //   <CardHeader className="bg-yellow-50 border-b">
    //     {/* <CardTitle className="text-lg">Service Area List</CardTitle> */}
    //   </CardHeader>
    //   <CardContent className="p-0">
       <div>
         <CustomTable data={displayData} columns={columns} onRowAction={handleRowAction} />
        <TablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
       </div>
    //   </CardContent>
    // </Card>
  )
}

export default SAreaList
