import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { LuPencil } from "react-icons/lu"
import { FiTrash } from "react-icons/fi"

interface Incentive {
  id: number
  name: string
  type: string
  startDate: string
  endDate: string
  amount: string
  status: "Completed" | "Ongoing" | "Ended"
}

interface IncentivesListProps {
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const IncentivesList: React.FC<IncentivesListProps> = () => {
  const [incentives] = useState<Incentive[]>([
    {
      id: 1,
      name: "Weekly Completion Bonus",
      type: "Performance",
      startDate: "Oct 1, 2025",
      endDate: "Oct 1, 2025",
      amount: "$90",
      status: "Completed",
    },
    {
      id: 2,
      name: "Referral Reward",
      type: "Referral",
      startDate: "Oct 10, 2025",
      endDate: "Oct 1, 2025",
      amount: "$50",
      status: "Ongoing",
    },
    {
      id: 3,
      name: "Early Bird Incentive",
      type: "Time-based",
      startDate: "Oct 15, 2025",
      endDate: "Oct 1, 2025",
      amount: "$15",
      status: "Ended",
    },
  ])

  const getStatusColor = (status: Incentive["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-[#CAE2B6] text-[#32620B]"
      case "Ongoing":
    return "bg-[#FFFAE6] text-[#FFCC00] "
      case "Ended":
        return "bg-[#FF4D4F40] text-[#FF4D4F]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#FFD52B40] border border-[#FFD52B]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Incentive Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Start Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">End Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#FF7A0080]">
            {incentives.map((incentive) => (
              <tr key={incentive.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{incentive.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{incentive.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{incentive.startDate}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{incentive.endDate}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{incentive.amount}</td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                       <Button
                             variant="ghost"
                            size="sm"
                            className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
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
                </td>

                {/* Status badge with fixed width/height */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center font-medium text-xs rounded-sm ${getStatusColor(
                      incentive.status,
                    )} h-7 w-24`}
                  >
                    {incentive.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IncentivesList
