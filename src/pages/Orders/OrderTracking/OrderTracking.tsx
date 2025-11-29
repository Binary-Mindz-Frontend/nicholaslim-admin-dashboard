"use client";

import { useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  name: string;
  address: string;
  date: string;
  category: string;
  status: "Completed" | "Pending" | "Cancelled" | "Ongoing" | "Scheduled";
}

const mockOrders: Order[] = [
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    status: "Completed",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "8587 Frida Ports",
    date: "08 Oct 2025",
    category: "Bulk Order",
    status: "Pending",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "768 Destiny Lake Suite 600",
    date: "08 Oct 2025",
    category: "Standard",
    status: "Completed",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Stacked",
    status: "Cancelled",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Bulk Order",
    status: "Ongoing",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "768 Destiny Lake Suite 600",
    date: "08 Oct 2025",
    category: "Standard",
    status: "Cancelled",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Standard",
    status: "Scheduled",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    status: "Completed",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    status: "Completed",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    case "Ongoing":
      return "bg-gray-100 text-gray-700";
    case "Scheduled":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function OrderTracking() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalItems = 78;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className=" p-3 sm:p-4 md:p-6">
      <div>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Order Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor and manage all active shipments in real-time
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Input
            type="text"
            placeholder="Enter order number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 py-4 md:py-6 bg-yellow-50 border-yellow-200 rounded-full text-sm sm:text-base"
          />
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 sm:px-8 rounded-full text-sm sm:text-base w-full sm:w-auto p-6">
            Track Order
          </Button>
        </div>

       <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-3 my-6 flex flex-wrap items-center gap-3">
            {/* Filter By Label with Icon */}
            <div className="flex items-center gap-2 text-gray-700 font-medium whitespace-nowrap">
              <Filter className="w-4 h-4" />
              <span>Filter By</span>
            </div>

            {/* Date Select */}
            <Select defaultValue="date">
              <SelectTrigger className="w-[130px] sm:w-[140px] h-10 bg-white border-gray-300 rounded-lg font-medium text-gray-700 focus:ring-2 focus:ring-yellow-400">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Order Type Select */}
            <Select defaultValue="all">
              <SelectTrigger className="w-[135px] sm:w-40 h-10 bg-white border-gray-300 rounded-lg font-medium text-gray-700 focus:ring-2 focus:ring-yellow-400">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>

            {/* Status / All Select */}
            <Select defaultValue="all">
              <SelectTrigger className="w-[105px] sm:w-[120px] h-10 bg-white border-gray-300 rounded-lg font-medium text-gray-700 focus:ring-2 focus:ring-yellow-400">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="saved">Saved</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filter Button */}
            <Button
              variant="ghost"
              className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-medium"
            >
              Reset Filter
            </Button>
          </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop table view */}
          <div className="hidden md:block border  overflow-x-auto">
            <table className="w-full">
              <thead className="border border-yellow-400 rounded-xl">
                <tr className="bg-yellow-50 border-b border-gray-200">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    ORDER ID
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    NAME
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    ADDRESS
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    DATE
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    CATEGORY
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    ACTION
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="border border-yellow-700 z-50">
                {mockOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-semibold">
                      {order.id}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                      {order.name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                      {order.address}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                      {order.date}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                      {order.category}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-1.5 sm:p-2 border border-green-400 text-green-600 rounded hover:bg-green-50"
                          title="View"
                        >
                          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button
                          className="p-1.5 sm:p-2 border border-blue-400 text-blue-600 rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                        <button
                          className="p-1.5 sm:p-2 border border-red-400 text-red-600 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full font-medium text-xs ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {mockOrders.map((order, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        ORDER ID
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.id}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full font-medium text-xs ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        NAME
                      </p>
                      <p className="text-sm text-gray-900">{order.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        ADDRESS
                      </p>
                      <p className="text-sm text-gray-700">{order.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500">
                          DATE
                        </p>
                        <p className="text-sm text-gray-700">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">
                          CATEGORY
                        </p>
                        <p className="text-sm text-gray-700">
                          {order.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      className="flex-1 p-2 border border-green-400 text-green-600 rounded hover:bg-green-50 flex items-center justify-center"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="flex-1 p-2 border border-blue-400 text-blue-600 rounded hover:bg-blue-50 flex items-center justify-center"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="flex-1 p-2 border border-red-400 text-red-600 rounded hover:bg-red-50 flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing 1-{itemsPerPage} of {totalItems}
          </p>
          <div className="flex gap-2 justify-center sm:justify-end">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
