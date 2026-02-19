import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdditionalServiceTableProps {
  data: any[];
  onEdit: (row: any) => void;
  onDelete: (id: number | string, name: string) => void;
  isLoading: boolean;
}

const AdditionalServiceTable = ({
  data,
  onEdit,
  onDelete,
  isLoading,
}: AdditionalServiceTableProps) => {
  if (isLoading)
    return <div className="text-center py-10">Loading services...</div>;
  if (!data?.length)
    return (
      <div className="text-center py-10 text-gray-500">No services found.</div>
    );

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold">Service Name</TableHead>
            <TableHead className="font-bold">Description</TableHead>
            <TableHead className="font-bold">Price/Value</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">
                {service.service_name}
              </TableCell>

              <TableCell className="max-w-[300px] truncate">
                {service.desc || "N/A"}
              </TableCell>

              <TableCell>${service.value}</TableCell>

              <TableCell>
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(service)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(service.id, service.service_name)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdditionalServiceTable;
