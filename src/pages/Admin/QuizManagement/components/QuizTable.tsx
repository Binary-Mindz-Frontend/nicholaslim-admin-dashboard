import { useState, useEffect } from "react";
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
  Search,
  Loader2
} from "lucide-react";
import { useGetAllQuizResultsQuery } from "@/redux/features/questions/questionsApi";
import { FilterParams, QuizResult, QuizResultsResponse } from "../types";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ViewDetailsModal from "./ViewDetailsModal";

export default function QuizAttemptsTable() {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 9,
    sortBy: "completed_at",
    sortOrder: "desc"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRaiderId, setSelectedRaiderId] = useState<number | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { 
    data: quizResultsResponse, 
    isLoading, 
    refetch,
    error 
  } = useGetAllQuizResultsQuery(filters);

  const resultsData = quizResultsResponse as QuizResultsResponse;
  const quizResults = resultsData?.data?.data || [];
  const pagination = resultsData?.data || { page: 1, limit: 9, total: 0 };

  const getStatus = (score: number): string => {
    if (score >= 70) return "Passed";
    if (score >= 40) return "Completed";
    return "Failed";
  };

  const filteredResults = quizResults.filter(result => {
    if (statusFilter !== "all") {
      const status = getStatus(result.score);
      if (status !== statusFilter) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const raiderId = result.raiderId.toString();
      const quizTitle = result.quiz?.title?.toLowerCase() || "";
      return raiderId.includes(query) || quizTitle.includes(query);
    }

    return true;
  });

  const handleFilterChange = (key: keyof FilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleNumberInput = (key: keyof FilterParams, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    if (numValue === undefined || !isNaN(numValue)) {
      handleFilterChange(key, numValue);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setFilters(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 9,
      sortBy: "completed_at",
      sortOrder: "desc"
    });
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const getStatusColor = (score: number) => {
    const status = getStatus(score);
    switch (status) {
      case "Passed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "Completed":
        return "bg-teal-100 text-teal-800 border-teal-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (result: QuizResult) => {
    setSelectedRaiderId(result.raiderId);
    setIsViewModalOpen(true);
  };

  const handleDeleteResult = (id: number) => {
    setSelectedResultId(id);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Error loading quiz results. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <div className="">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Filter By
                </span>

                <Input
                  type="number"
                  placeholder="Min Score"
                  className="w-32"
                  value={filters.minScore || ""}
                  onChange={(e) => handleNumberInput("minScore", e.target.value)}
                  min="0"
                  max="100"
                />

                <Input
                  type="number"
                  placeholder="Max Score"
                  className="w-32"
                  value={filters.maxScore || ""}
                  onChange={(e) => handleNumberInput("maxScore", e.target.value)}
                  min="0"
                  max="100"
                />

                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    className="w-40"
                    value={filters.fromDate || ""}
                    onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                  />
                  <span className="text-gray-400">to</span>
                  <Input
                    type="date"
                    className="w-40"
                    value={filters.toDate || ""}
                    onChange={(e) => handleFilterChange("toDate", e.target.value)}
                  />
                </div>

                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 cursor-pointer"
                  onClick={handleResetFilters}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Filter
                </Button>
              </div>

              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search by Raider ID or Quiz Title..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-yellow-50 border-b-2 border-gray-300">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Raider ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Quiz Title
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                          Score
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                          Correct Answers
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                          Total Attempts
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                          Completed Date
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
                      {filteredResults.length > 0 ? (
                        filteredResults.map((result) => (
                          <tr
                            key={result.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 text-blue-600 font-medium">
                              R-{result.raiderId}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {result.quiz?.title || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-gray-900">
                              {result.score}%
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700">
                              {result.correct_answers}/{result.total_questions}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700">
                              {result.attempt_count}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700">
                              {formatDate(result.completed_at)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-4">
                                <button 
                                  onClick={() => handleViewDetails(result)}
                                  className="p-2 rounded-lg hover:bg-green-50 transition cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="w-5 h-5 text-green-600" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteResult(result.id)}
                                  className="p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                  title="Delete Result"
                                >
                                  <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <Badge className={getStatusColor(result.score)}>
                                  {getStatus(result.score)}
                                </Badge>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                            No quiz results found. Try adjusting your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {pagination.total > 0 && (
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {((pagination.page - 1) * pagination.limit) + 1}-
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page <= 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              variant={pagination.page === pageNum ? "default" : "outline"}
                              className={`cursor-pointer ${pagination.page === pageNum ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : ''}`}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedResultId(null);
        }}
        resultId={selectedResultId || 0}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          setSelectedResultId(null);
        }}
        refetch={refetch}
      />

      <ViewDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedRaiderId(null);
        }}
        raiderId={selectedRaiderId || 0}
      />
    </>
  );
}