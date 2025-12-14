import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Loader2 } from "lucide-react"

interface CoinData {
  id: number
  event_triggered: string
  coin_amount: string
  expire_date: string
  coin_value_in_cent: number
  created_at: string
  updated_at: string
}

interface CoinSystemTableProps {
  data: CoinData[]
  onEdit: (row: CoinData) => void
  onDelete: (id: number, eventTrigger: string) => void
  isLoading?: boolean
}

const CoinSystemTable: React.FC<CoinSystemTableProps> = ({ 
  data, 
  onEdit, 
  onDelete, 
  isLoading = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getEventTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      FIRST_SIGNUP: "First Signup",
      DAILY_LOGIN: "Daily Login",
      SHARE_ON_SOCIAL: "Share on Social",
      REFERRAL: "Referral",
      COMPLETED20_ORDER: "Completed 20 Orders"
    }
    return labels[trigger] || trigger
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-yellow-50">
            <TableHead className="font-semibold text-gray-900">Event Trigger</TableHead>
            <TableHead className="font-semibold text-gray-900">Coin Amount</TableHead>
            <TableHead className="font-semibold text-gray-900">Value (USD)</TableHead>
            <TableHead className="font-semibold text-gray-900">Expiry Date</TableHead>
            <TableHead className="font-semibold text-gray-900">Created At</TableHead>
            <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No coin data found. Click "Add Coin" to create one.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {getEventTriggerLabel(row.event_triggered)}
                </TableCell>
                <TableCell>{row.coin_amount} coins</TableCell>
                <TableCell>{formatCurrency(row.coin_value_in_cent)}</TableCell>
                <TableCell>{formatDate(row.expire_date)}</TableCell>
                <TableCell>{formatDate(row.created_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(row)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row.id, getEventTriggerLabel(row.event_triggered))}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
  )
}

export default CoinSystemTable