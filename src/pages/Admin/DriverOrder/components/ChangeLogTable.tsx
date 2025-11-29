// components/driver-competition/ChangeLogTable.tsx
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

const changeLog = [
  {
    date: "17 Oct 2025",
    by: "Admin",
    ranking: 100,
    rating: 10,
    follower: 70,
    timeout: "8s",
    current: true,
  },
  {
    date: "16 Oct 2025",
    by: "Admin",
    ranking: 100,
    rating: 10,
    follower: 80,
    timeout: "10s",
  },
  {
    date: "10 Oct 2025",
    by: "Admin",
    ranking: 90,
    rating: 40,
    follower: 20,
    timeout: "12s",
  },
  {
    date: "06 Oct 2025",
    by: "Admin",
    ranking: 80,
    rating: 10,
    follower: 70,
    timeout: "8s",
  },
  {
    date: "04 Oct 2025",
    by: "Admin",
    ranking: 50,
    rating: 20,
    follower: 16,
    timeout: "10s",
  },
];

export function ChangeLogTable() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Change Log History
        </h2>
        <Button variant="outline" size="sm" className=" cursor-pointer">
          <Calendar className="mr-2 h-4 w-4" />
          Date
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {changeLog.map((log, i) => (
              <TableRow
                key={i}
                className={log.current ? "bg-amber-50" : "hover:bg-slate-50"}
              >
                <TableCell className="text-sm">
                  {log.date}
                  {log.current && (
                    <span className="ml-2 rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                      (Current)
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-slate-700">
                  {log.by}
                </TableCell>
                <TableCell className="text-right text-sm text-slate-700">
                  {log.ranking}%
                </TableCell>
                <TableCell className="text-right text-sm text-slate-700">
                  {log.rating}%
                </TableCell>
                <TableCell className="text-right text-sm text-slate-700">
                  {log.follower}%
                </TableCell>
                <TableCell className="text-right text-sm text-slate-700">
                  {log.timeout}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
