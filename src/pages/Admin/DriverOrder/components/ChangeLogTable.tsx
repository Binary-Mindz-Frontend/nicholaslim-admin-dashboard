import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { CompetitionLog } from "@/types/driverOrderCompetition";
import { useState } from "react";

interface ChangeLogTableProps {
  logs: CompetitionLog[];
  isLoading?: boolean;
}

export function ChangeLogTable({ logs, isLoading = false }: ChangeLogTableProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Change Log History
          </h2>
          <div className="h-9 w-32 bg-slate-100 rounded-md animate-pulse"></div>
        </div>
        <div className="h-64 bg-slate-100 rounded-lg animate-pulse"></div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Change Log History
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No change logs found for the selected date
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-100">
                <TableHead className="text-left text-xs font-semibold text-slate-900">
                  DATE
                </TableHead>
                <TableHead className="text-left text-xs font-semibold text-slate-900">
                  CHANGED BY
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-900">
                  RANKING (%)
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-900">
                  RATING (%)
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-900">
                  FOLLOWER (%)
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-900">
                  TIMEOUT
                </TableHead>
                <TableHead className="text-right text-xs font-semibold text-slate-900">
                  MAX DRIVERS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, i) => (
                <TableRow
                  key={log.id}
                  className={i === 0 ? "bg-amber-50" : "hover:bg-slate-50"}
                >
                  <TableCell className="text-sm">
                    {formatDate(log.created_at)}
                    {i === 0 && (
                      <span className="ml-2 rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                        (Latest)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">
                    {log.changed_by || "Admin"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-700">
                    {log.rank}%
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-700">
                    {log.rating}%
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-700">
                    {log.followers_weight}%
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-700">
                    {log.challenges_timeout}s
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-700">
                    {log.max_users_to_join}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}