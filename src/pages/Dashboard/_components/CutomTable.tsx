import React from "react"

interface Column<T> {
  key?: keyof T | string;
  label: string | React.ReactNode;
  render?: (value: any, row: T) => React.ReactNode;
}


export interface ServiceArea {
  id: number
  zones: string
  totalZones: number
  coverage: number
  status: "Active" | "Pending"
}

interface CustomTableProps<T extends { id?: number | string }> {
  data: T[]
  columns: Column<T>[] 
  rowClassName?: string
  onEdit?: (id: number | string) => void
  onDelete?: (id: number | string) => void
  onRowAction?: (actionType: string, rowData: T, id: number | string) => void
}

const SCustomTable = React.forwardRef<HTMLDivElement, CustomTableProps<any>>(
  ({ data, columns, rowClassName = "" }, ref) => {

    return (
      <div ref={ref} className="w-full overflow-x-auto">
        <table className="w-full ">
          <thead>
            <tr className="bg-[#FFD52B25] border border-[#FFD52B]">
              {columns.map((column) => (
                <th key={String(column.key)} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className={`${index + 1 === data.length ? "border-b-0": "border-b"} border-l-[#FF7A0080] border-r-[#FF7A0080] border-b-[#FF7A0040] border-r border-l  transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 ${rowClassName}`}
              >
                {columns.map((column) => (
                 <td key={String(column.key ?? column.label)} className="px-6 py-4 text-sm text-gray-900">
                    {column.render
                      ? column.render(
                          column.key ? row[column.key] : undefined,  // safe handling
                          row
                        )
                      : column.key
                        ? row[column.key]
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
)

SCustomTable.displayName = "CustomTable"

export default SCustomTable
