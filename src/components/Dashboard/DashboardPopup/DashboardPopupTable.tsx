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

const DashboardPopupTable = ({ data, onEdit, onDelete, isLoading }: any) => {
  if (isLoading)
    return <div className="text-center py-10 text-lg">Loading popups...</div>;
  if (!data?.length)
    return (
      <div className="text-center py-10 text-gray-500">No popups found.</div>
    );

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold">Title</TableHead>
            <TableHead className="font-bold">Description</TableHead>
            <TableHead className="font-bold">Redirect Link</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="max-w-[250px] truncate">
                {item.desc || "N/A"}
              </TableCell>
              <TableCell className="text-blue-500 truncate max-w-[200px]">
                {item.redirect_link || "No Link"}
              </TableCell>
              <TableCell>
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="text-blue-600 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 cursor-pointer"
                    onClick={() => onDelete(item.id, item.title)}
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

export default DashboardPopupTable;
