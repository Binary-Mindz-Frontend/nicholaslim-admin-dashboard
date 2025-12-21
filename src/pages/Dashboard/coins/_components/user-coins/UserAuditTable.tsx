// UserAuditTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface UserCoinData {
  id: number;
  username: string;
  total_coin_acc: number;
  current_coin_balance: number;
  email?: string;
  phone?: string;
}

interface UserAuditTableProps {
  data: UserCoinData[];
  isLoading?: boolean;
  searchQuery?: string;
}

const UserAuditTable: React.FC<UserAuditTableProps> = ({
  data,
  isLoading = false,
  searchQuery = "",
}) => {
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-50 hover:bg-yellow-50">
              <TableHead className="font-semibold text-gray-900">User ID</TableHead>
              <TableHead className="font-semibold text-gray-900">Username</TableHead>
              <TableHead className="font-semibold text-gray-900">Email</TableHead>
              <TableHead className="font-semibold text-gray-900">Total Coins Accumulated</TableHead>
              <TableHead className="font-semibold text-gray-900">Current Coin Balance</TableHead>
              <TableHead className="font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-lg mb-2">No users found</div>
                    <p className="text-sm text-gray-400">
                      {searchQuery ? 'Try a different search term' : 'Start by searching for users'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>
                    {searchQuery ? highlightText(row.username, searchQuery) : row.username}
                  </TableCell>
                  <TableCell>
                    {searchQuery && row.email ? highlightText(row.email, searchQuery) : (row.email || "N/A")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-yellow-600">
                        {row.total_coin_acc.toLocaleString()}
                      </span>
                      <span className="text-gray-500">coins</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">
                        {row.current_coin_balance.toLocaleString()}
                      </span>
                      <span className="text-gray-500">coins</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => {
                        // Navigate to user detail page or open modal
                        console.log("View user details:", row.id);
                      }}
                    >
                      View Details
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserAuditTable;