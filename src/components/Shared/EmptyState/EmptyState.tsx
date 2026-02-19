import { cn } from "@/lib/utils";
import { SearchXIcon } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  title = "No data found",
  description = "There are no records to display at the moment.",
  icon = <SearchXIcon className="h-12 w-12 text-gray-300" />,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-gray-50 p-4">{icon}</div>

      <h3 className="text-lg leading-tight font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 max-w-xs text-sm text-gray-500">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
