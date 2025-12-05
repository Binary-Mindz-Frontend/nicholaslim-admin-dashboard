"use client"

import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const BulkOrdersTable = () => {
  const [currentPage, setCurrentPage] = useState(1)

  // Sample data
  const orders = Array(10).fill({
    id: "#1088",
    name: "Harry Jason",
    contact: "65******",
    address: "657 Ang Mo Kio Ave 9, S560657",
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="">
        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-200 transition-colors ${
                      index % 2 === 0 ? "bg-yellow-50" : "bg-white"
                    } hover:bg-yellow-100`}
                  >
                    <td className="px-6 py-4 text-sm text-slate-700">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{order.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{order.contact}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{order.address}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination and Status Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">Showing 1-10 of 999</div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-600 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 text-slate-600 hover:bg-yellow-50 rounded-md transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-center text-red-600 font-medium text-sm">
            "197/200 Orders Successfully Created, 3 Failed due to Address Errors"
          </p>
        </div>
      </div>
    </div>
  )
}

export default BulkOrdersTable
