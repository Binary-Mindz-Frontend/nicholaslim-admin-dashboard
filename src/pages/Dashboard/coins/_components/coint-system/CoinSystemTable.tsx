import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CoinData {
  id: number;
  key: string;
  description: string;
  coin_amount: number;
  condition?: {
    maxPerDay?: number;
  };
  expire_days: number;
  coin_value_in_cent: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CoinSystemTableProps {
  data: CoinData[];
  onEdit: (row: CoinData) => void;
  onDelete: (id: number, key: string) => void;
  isLoading?: boolean;
}

const CoinSystemTable: React.FC<CoinSystemTableProps> = ({
  data,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEventTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      FIRST_SIGNUP: "First Signup",
      DAILY_LOGIN: "Daily Login",
      SHARE_ON_SOCIAL: "Share on Social",
      REFERRAL: "Referral",
      COMPLETED_ORDER: "Completed Orders",
    };
    return labels[trigger] || trigger;
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={`${
          isActive
            ? "bg-green-100 text-green-800 hover:bg-green-100"
            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const getConditionText = (condition?: CoinData["condition"]) => {
    if (!condition) return "-";
    
    const parts = [];
    if (condition.maxPerDay !== undefined) {
      parts.push(`Max ${condition.maxPerDay}/day`);
    }
    return parts.join(" • ") || "-";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg border">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-2" />
          <p className="text-gray-600">Loading coin rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-50 hover:bg-yellow-50">
              <TableHead className="font-semibold text-gray-900 min-w-[180px]">
                Event Trigger
              </TableHead>
              <TableHead className="font-semibold text-gray-900 min-w-[120px]">
                Coin Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-900 min-w-[120px]">
                Value (USD)
              </TableHead>
              <TableHead className="font-semibold text-gray-900 min-w-[120px]">
                Expiry Days
              </TableHead>
              <TableHead className="font-semibold text-gray-900 min-w-[150px]">
                Conditions
              </TableHead>
              <TableHead className="font-semibold text-gray-900 min-w-[100px]">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 min-w-[120px]">
                Created At
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center min-w-[120px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-lg mb-2">No coin rewards found</div>
                    <p className="text-sm text-gray-400">
                      Click "Add Coin Reward" to create your first coin reward
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getEventTriggerLabel(row.key)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-yellow-600">
                        {row.coin_amount}
                      </span>
                      <span className="text-gray-500">coins</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(row.coin_value_in_cent)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{row.expire_days}</span>
                      <span className="text-gray-500 text-sm">days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getConditionText(row.condition)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(row.is_active)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDate(row.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(row)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(row.id, row.key)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default CoinSystemTable;