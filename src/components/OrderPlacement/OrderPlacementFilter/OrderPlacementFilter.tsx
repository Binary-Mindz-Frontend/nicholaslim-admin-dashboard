interface StatusTabFilterProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export default function StatusTabFilter({ 
  activeStatus, 
  onStatusChange 
}: StatusTabFilterProps) {
  const statuses = [
    { label: "All", value: "" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Pending", value: "PENDING" },
    { label: "Progress", value: "PROGRESS" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Failed", value: "FAILED" },
  ];

  return (
    <div className="w-full">
      {/* Desktop/Tablet View - Horizontal Tabs */}
      <div className="hidden sm:block">
        <div className="bg-gray-100 rounded-full p-1.5 flex gap-1 border border-[#2B2B2B]">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => onStatusChange(status.value)}
              className={`
                flex-1 px-4 py-2.5 rounded-full text-sm font-medium 
                transition-all duration-200 whitespace-nowrap border border-yellow-3 00
                ${
                  activeStatus === status.value
                    ? "bg-yellow-50 text-gray-900 shadow-sm border border-yellow-200"
                    : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile View - Scrollable Tabs */}
      <div className="block sm:hidden">
        <div className="bg-gray-100 rounded-full p-1.5">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`
                  shrink-0 px-6 py-2.5 rounded-full text-sm font-medium 
                  transition-all duration-200 whitespace-nowrap
                  ${
                    activeStatus === status.value
                      ? "bg-yellow-50 text-gray-900 shadow-sm border border-yellow-200"
                      : "bg-transparent text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}