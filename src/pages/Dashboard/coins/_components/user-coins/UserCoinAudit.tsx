import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { FiSearch } from "react-icons/fi";
import {
  useGetAllUsersCoinsHistoryQuery,
  useGetUserCoinHistoryByIdQuery,
} from "@/redux/features/coinManagement/coinManagementApi";
import UserAuditTable from "./UserAuditTable";
import UserCoinHistoryModal from "./UserCoinHistoryModal";

const UserCoinAudit = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useState<{ username?: string }>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        const isNumeric = /^\d+$/.test(query);

        if (isNumeric) {
          setSearchParams({ username: query });
        } else {
          setSearchParams({ username: query });
        }
      } else {
        setSearchParams({});
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const { data: usersCoinHistory, isLoading: isUserCoinHistoryLoading } =
    useGetAllUsersCoinsHistoryQuery(searchParams);

  // Fetch user coin history when a user is selected
  const { data: userCoinHistoryData, isLoading: isUserHistoryLoading } = 
    useGetUserCoinHistoryByIdQuery(selectedUserId!, {
      skip: !selectedUserId
    });

  const handleViewClick = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const allUsersCoinHistory = usersCoinHistory?.data || [];

  const tableData = allUsersCoinHistory.map((user: any) => ({
    id: user.userId || user.id,
    username: user.name || user.username || "N/A",
    total_coin_acc: user.total_coin_acc || user.totalCoins || 0,
    current_coin_balance: user.current_coin_balance || user.currentBalance || 0,
    email: user.email || "N/A",
    phone: user.phone || "N/A",
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  return (
    <div className="mx-6 sm:mx-12 mt-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-16">
          User Coin Audit & Tracking
        </h1>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto md:flex-1">
            <input
              type="text"
              placeholder="Search by Username or Email"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-3 w-full pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-300 ease-in-out"
            />
            <FiSearch
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Showing {tableData.length} result{tableData.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        </div>

        {/* Search Tips */}
        <div className="mt-2 text-sm text-gray-400">
          <p>Tips: Search by username, email, or user ID</p>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Coin Accounts</h2>

          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
            >
              Clear Search
            </button>
          )}
        </div>

        {searchQuery && tableData.length === 0 && !isUserCoinHistoryLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              No users found for "
              <span className="font-semibold">{searchQuery}</span>"
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try searching with a different username or email
            </p>
          </div>
        ) : (
          <UserAuditTable
            data={tableData}
            isLoading={isUserCoinHistoryLoading}
            searchQuery={searchQuery}
            handleViewClick={handleViewClick}
          />
        )}
      </div>

      {/* Stats Section */}
      {tableData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800">Total Users</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {tableData.length}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">
              Total Coins Accumulated
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {tableData.reduce(
                (sum: number, user: any) => sum + user.total_coin_acc,
                0
              )}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">
              Current Total Balance
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {tableData.reduce(
                (sum: number, user: any) => sum + user.current_coin_balance,
                0
              )}
            </p>
          </div>
        </div>
      )}

      {/* User Coin History Modal */}
      <UserCoinHistoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={selectedUserId}
        userCoinHistory={userCoinHistoryData?.data || []}
        isLoading={isUserHistoryLoading}
      />
    </div>
  );
};

export default UserCoinAudit;