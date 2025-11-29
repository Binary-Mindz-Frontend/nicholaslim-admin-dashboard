
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi";
import TablePagination from "../../../_components/TablePagination";

import { StatusSwitch } from "./StatusSwitch";
import SCustomTable from "../../../_components/CutomTable";

interface Vehicle {
  id: number
  vehicleType: string
  maxPayload: number
  baseRate : number
  Dimensions: string
  status: "Active" | "Inactive"
}

const data : Vehicle[] = [
  { id: 1, vehicleType: "Ang Mo Kio", maxPayload: 15, baseRate : 100, status: "Active" , Dimensions: "1.8m x 0.8m"},
  { id: 2, vehicleType: "Punggol", maxPayload: 15, baseRate : 100, status: "Active" , Dimensions: "1.8m x 0.8m" },
  { id: 3, vehicleType: "Bishan", maxPayload: 15, baseRate : 100, status: "Active", Dimensions: "1.8m x 0.8m" },
  { id: 4, vehicleType: "Yishun", maxPayload: 15, baseRate : 90, status: "Inactive" , Dimensions: "1.8m x 0.8m"},
  { id: 5, vehicleType: "Serangoon", maxPayload: 15, baseRate : 100, status: "Inactive" , Dimensions: "1.8m x 0.8m"},
  { id: 6, vehicleType: "Ang Mo Kio", maxPayload: 15, baseRate : 100, status: "Active" , Dimensions: "1.8m x 0.8m"},
  { id: 7, vehicleType: "Punggol", maxPayload: 15, baseRate : 100, status: "Active" , Dimensions: "1.8m x 0.8m"},
  { id: 8, vehicleType: "Punggol", maxPayload: 15, baseRate : 60, status: "Active" , Dimensions: "1.8m x 0.8m"},
  { id: 9, vehicleType: "Punggol", maxPayload: 15, baseRate : 85, status: "Active" , Dimensions: "1.8m x 0.8m"},
  { id: 10, vehicleType: "Clementi", maxPayload: 15, baseRate : 95, status: "Active" , Dimensions: "1.8m x 0.8m"},
]

const VTtablesData: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 21

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayData = data.slice(startIndex, endIndex)


const columns = [
  {
    key: "vehicleType" as const,
    label: "Vehicle Type",
  },
  {
    key: "maxPayload" as const,
    label: "Max Payload",
    render: (maxPayload: number) => `${maxPayload} KG`

  },
  {
    key: "Dimensions" as const,
    label: "Dimensions",
    render: (Dimensions: string) => `${Dimensions}`,
  },
  {
    key: "baseRate" as const,
    label: "Base Rate",
    render: (value: number) => `$${value}`,
  },
  {
    key: "actions" as const,
    label: "Actions",
    render: (_: any, row: Vehicle) => (
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
  },
 {
  key: "status" as const,
  label: "Status",
  render: (_: any, row: Vehicle) => (
    <StatusSwitch
      status={row.status}
      onChange={(newStatus) => {
        // Update backend or table state
        console.log(`${row.vehicleType} is now ${newStatus}`);
      }}
    />
  ),
}


];

  return (

       <div>
         <SCustomTable data={displayData} columns={columns}  />
        <TablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
       </div>

  )
}

export default VTtablesData
