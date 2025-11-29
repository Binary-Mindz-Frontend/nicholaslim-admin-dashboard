
type FilterField = {
  id: string
  label: string
  type: string
  options: { label: string; value: string }[]
}

export const filterFields: FilterField[] | any = [
    {
      id: "date",
      label: "Date",
      type: "dropdown",
      options: [
        { label: "Today", value: "today" },
        { label: "This Week", value: "week" },
        { label: "This Month", value: "month" },
      ],
    },
    {
      id: "orderType",
      label: "Order Type",
      type: "dropdown",
      options: [
        { label: "All", value: "all" },
        { label: "Express", value: "express" },
        { label: "Standard", value: "standard" },
      ],
    },
    {
      id: "status",
      label: "All",
      type: "dropdown",
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ]
