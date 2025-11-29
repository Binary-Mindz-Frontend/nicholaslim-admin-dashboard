import { useState, useMemo } from "react";
import { Filter, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type OrderStatus = "Active" | "Completed" | "Cancelled" | "Saved";
type OrderType = "Express" | "Standard";

interface Order {
  id: string;
  name: string;
  address: string;
  date: string;
  category: OrderType;
  amount: string;
  status: OrderStatus;
}

const mockOrders: Order[] = [
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    amount: "$24.00",
    status: "Active",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "8587 Frida Ports",
    date: "08 Oct 2025",
    category: "Standard",
    amount: "$24.00",
    status: "Completed",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    amount: "$24.00",
    status: "Completed",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "8587 Frida Ports",
    date: "08 Oct 2025",
    category: "Standard",
    amount: "$24.00",
    status: "Active",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    amount: "$24.00",
    status: "Saved",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "8587 Frida Ports",
    date: "08 Oct 2025",
    category: "Standard",
    amount: "$24.00",
    status: "Cancelled",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    amount: "$24.00",
    status: "Cancelled",
  },
  {
    id: "#1088",
    name: "Christine Brooks",
    address: "8587 Frida Ports",
    date: "08 Oct 2025",
    category: "Standard",
    amount: "$24.00",
    status: "Saved",
  },
  // Add more if needed...
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Saved: "bg-blue-100 text-blue-800",
};

const filterTabs = [
  "All",
  "Active",
  "Completed",
  "Cancelled",
  "Saved",
] as const;
type FilterTab = (typeof filterTabs)[number];

export default function OrderHistory() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") return mockOrders;
    return mockOrders.filter((order) => order.status === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <div className="md:p-10 ">
        <h2 className=" text-2xl font-semibold text-gray-800 mb-6">
          Order History
        </h2>

        {/* Filter Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:border md:border-gray-500 p-1.5 rounded-full">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-6 py-3 cursor-pointer rounded-full border  font-medium text-sm whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? "bg-[#FFFAE6] border-yellow-300 text-yellow-900 shadow-sm"
                  : "bg-white border  text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Row */}
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFFAE6] border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Address
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Action
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr
                    key={`${order.id}-${index}`}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-5 text-sm font-medium text-blue-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {order.address}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {order.category}
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button className="text-green-600 hover:text-green-800">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-medium ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <div>Showing 1-9 of 78</div>
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <div>Showing 1-9 of 78</div>

              <div className="flex items-center gap-3">
                {/* Previous Button */}
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Next Button */}
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
