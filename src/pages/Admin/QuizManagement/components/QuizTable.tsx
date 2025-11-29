import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  RotateCcw,
} from "lucide-react";

interface Attempt {
  id: string;
  driverId: string;
  name: string;
  score: number;
  totalAttempts: number;
  status: "Passed" | "Failed" | "Pending" | "Completed";
}

const mockData: Attempt[] = [
  {
    id: "1",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 10,
    totalAttempts: 2,
    status: "Passed",
  },
  {
    id: "2",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 10,
    totalAttempts: 1,
    status: "Passed",
  },
  {
    id: "3",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 10,
    totalAttempts: 1,
    status: "Passed",
  },
  {
    id: "4",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 0,
    totalAttempts: 0,
    status: "Pending",
  },
  {
    id: "5",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 0,
    totalAttempts: 0,
    status: "Pending",
  },
  {
    id: "6",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 10,
    totalAttempts: 3,
    status: "Passed",
  },
  {
    id: "7",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 2,
    totalAttempts: 2,
    status: "Failed",
  },
  {
    id: "8",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 10,
    totalAttempts: 2,
    status: "Completed",
  },
  {
    id: "9",
    driverId: "D1088",
    name: "Christine Brooks",
    score: 8,
    totalAttempts: 1,
    status: "Failed",
  },
];

export default function QuizAttemptsTable() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const paginatedData = mockData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Passed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Completed":
        return "bg-teal-100 text-teal-800 border-teal-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className=" md:py-8">
      <div className="">
        {/* FILTERING SECTION - 100% MATCH TO YOUR IMAGE */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Side - All Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter By
              </span>

              {/* Date Filter */}
              <Select defaultValue="date">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Order Type Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filter Button */}
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filter
              </Button>
            </div>

            {/* Right Side - Search */}
            <Input
              type="search"
              placeholder="Search..."
              className="w-full lg:w-64"
            />
          </div>
        </div>

        {/* TABLE - Exact Match */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-50 border-b-2 border-gray-300">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Driver ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                    Scored
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                    Total Attempts
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                    ACTION
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-blue-600 font-medium">
                      {row.driverId}
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">
                      {row.score}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      {row.totalAttempts}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-green-50 transition">
                          <Eye className="w-5 h-5 text-green-600" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 transition">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Badge className={getStatusColor(row.status)}>
                          {row.status}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">Showing 1-9 of 78</div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
