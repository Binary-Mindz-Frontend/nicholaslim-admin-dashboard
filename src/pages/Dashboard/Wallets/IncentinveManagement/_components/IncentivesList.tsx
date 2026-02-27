import Swal from "sweetalert2";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LuPencil } from "react-icons/lu";
import { FiTrash, FiSearch } from "react-icons/fi";
import { FilterX, CalendarIcon } from "lucide-react";
import {
  useGetAllIncentivesQuery,
  useDeleteIncentiveMutation,
  useUpdateIncentiveMutation,
} from "@/redux/features/incentives/incentivesApi";
import UpdateIncentiveModal from "./UpdateIncentiveModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";

interface Incentive {
  id: string;
  incentive_name: string;
  type: string;
  start_date: string;
  end_date: string;
  incentive_amount: number;
  status: string;
}

interface SortConfig {
  key: keyof Incentive | null;
  direction: "asc" | "desc";
}

const IncentivesList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [selectedIncentive, setSelectedIncentive] = useState<any>(null);

  const { data, isLoading, refetch } = useGetAllIncentivesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteIncentive] = useDeleteIncentiveMutation();
  const [updateIncentive] = useUpdateIncentiveMutation();

  const allIncentives: Incentive[] = data?.data?.data ?? [];

  const uniqueStatuses = useMemo<string[]>(() => {
    return [
      ...new Set(allIncentives.map((item: any) => item.status as string)),
    ];
  }, [allIncentives]);

  const uniqueTypes = useMemo<string[]>(() => {
    return [...new Set(allIncentives.map((item: any) => item.type as string))];
  }, [allIncentives]);

  const handleSort = (key: keyof Incentive) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
    setSortConfig({ key: null, direction: "asc" });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...allIncentives];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.incentive_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (item) => new Date(item.start_date) >= startDate,
      );
    }

    if (endDate) {
      filtered = filtered.filter((item) => new Date(item.end_date) <= endDate);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key!];
        let bValue = b[sortConfig.key!];

        if (sortConfig.key === "start_date" || sortConfig.key === "end_date") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    allIncentives,
    searchQuery,
    statusFilter,
    typeFilter,
    startDate,
    endDate,
    sortConfig,
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-[#CAE2B6] text-[#32620B]";
      case "ONGOING":
        return "bg-[#FFFAE6] text-[#FFCC00]";
      case "ENDED":
        return "bg-[#FF4D4F40] text-[#FF4D4F]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleEditIncentive = (item: any) => {
    setSelectedIncentive(item);
  };

  const handleDeleteIncentive = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteIncentive(id).unwrap();
        Swal.fire("Deleted!", "Your incentive has been deleted.", "success");
        refetch();
      } catch {
        Swal.fire("Error!", "Failed to delete incentive.", "error");
      }
    }
  };

  const handleSaveIncentive = async (updatedData: any) => {
    if (!selectedIncentive?.id) return;

    try {
      const payload = {
        id: selectedIncentive.id,
        ...updatedData,
      };

      await updateIncentive(payload).unwrap();
      await refetch();
      Swal.fire("Success!", "Incentive updated successfully.", "success");
      setSelectedIncentive(null);
    } catch {
      Swal.fire("Error!", "Failed to update incentive.", "error");
    }
  };

  const columns = [
    { key: "incentive_name" as const, label: "Incentive Name" },
    { key: "type" as const, label: "Type" },
    { key: "start_date" as const, label: "Start Date" },
    { key: "end_date" as const, label: "End Date" },
    { key: "incentive_amount" as const, label: "Amount" },
    { key: "status" as const, label: "Status" },
  ];

  const totalItems = filteredAndSortedData.length;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {(searchQuery ||
          statusFilter !== "all" ||
          typeFilter !== "all" ||
          startDate ||
          endDate) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <FilterX size={16} />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Label htmlFor="search">Search</Label>
            <div className="relative mt-1">
              <Input
                id="search"
                type="text"
                placeholder="Incentive name or type"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Items per page</Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {(searchQuery ||
          statusFilter !== "all" ||
          typeFilter !== "all" ||
          startDate ||
          endDate) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {typeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                Type: {typeFilter}
                <button
                  onClick={() => setTypeFilter("all")}
                  className="hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                From: {format(startDate, "dd/MM/yyyy")}
                <button
                  onClick={() => setStartDate(undefined)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                To: {format(endDate, "dd/MM/yyyy")}
                <button
                  onClick={() => setEndDate(undefined)}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FFD52B40] border border-[#FFD52B]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left cursor-pointer hover:bg-[#FFD52B60]"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {sortConfig.key === column.key && (
                        <span className="text-xs">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#FF7A0080]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.incentive_name}</td>
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3">{formatDate(item.start_date)}</td>
                    <td className="px-4 py-3">{formatDate(item.end_date)}</td>
                    <td className="px-4 py-3 font-semibold">
                      ${item.incentive_amount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center font-medium text-xs rounded-sm ${getStatusColor(
                          item.status,
                        )} h-7 w-24`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-auto border cursor-pointer border-[#00BFFF] hover:bg-blue-100"
                          onClick={() => handleEditIncentive(item)}
                        >
                          <LuPencil size={16} className="text-[#00BFFF]" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-100"
                          onClick={() => handleDeleteIncentive(item?.id)}
                        >
                          <FiTrash size={16} className="text-[#FF4D4F]" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No incentives found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <div className="flex justify-between items-center px-4 py-3 border-t">
            <div className="text-sm text-gray-500">
              Showing{" "}
              {paginatedData.length ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
              to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
              {totalItems} entries
            </div>

            <TablePagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {selectedIncentive && (
        <UpdateIncentiveModal
          incentive={selectedIncentive}
          onClose={() => setSelectedIncentive(null)}
          onSave={handleSaveIncentive}
        />
      )}
    </div>
  );
};

export default IncentivesList;
