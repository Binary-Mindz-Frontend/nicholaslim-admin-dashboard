import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const PromoCodeTable = ({ data, onEdit, onDelete, isLoading }: any) => {
  if (isLoading) return <div className="text-center py-10">Loading...</div>

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold">Code</TableHead>
            <TableHead className="font-bold">Discount</TableHead>
            <TableHead className="font-bold">Expiry Date</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold text-blue-600">{item.promoCode}</TableCell>
              <TableCell>
                {item.discountType === "FIXED" || item.discountType === "FIXED_AMOUNT" ? `$${item.discountValue}` : `${item.discountValue}%`}
              </TableCell>
              <TableCell>{new Date(item.expires_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(item.id, item.promoCode)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PromoCodeTable