/* eslint-disable @typescript-eslint/no-explicit-any */
export const contentLogColumns = [
  {
    header: "Date & Version",
    accessor: "createdAt",
    render: (row: any) => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-700">
          {new Date(row.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </span>
        <span className="text-[10px] text-slate-400">Version: {row.version}</span>
      </div>
    ),
  },
  {
    header: "Content Type",
    accessor: "contentType",
    render: (row: any) => (
      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded uppercase">
        {row.contentType.replace(/AND/g, " & ")}
      </span>
    ),
  },
  {
    header: "Description Snippet",
    accessor: "description",
    render: (row: any) => (
      <div className="max-w-[300px] truncate text-xs text-slate-600 italic">
        "{row.description.substring(0, 60)}..."
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "isPublished",
    render: (row: any) => (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        row.isPublished ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
      }`}>
        {row.isPublished ? "PUBLISHED" : "DRAFT"}
      </span>
    ),
  },
  {
    header: "Modified By",
    accessor: "changedByRole",
    render: (row: any) => (
      <div className="text-xs">
        <span className="font-semibold text-slate-700">{row.changedByRole}</span>
        <span className="text-slate-400 ml-1">(ID: {row.changedByUserId})</span>
      </div>
    ),
  },
];