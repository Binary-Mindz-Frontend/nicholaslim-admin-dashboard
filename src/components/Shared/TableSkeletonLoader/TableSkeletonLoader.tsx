import { Skeleton } from "@/components/ui/skeleton";


const TableSkeletonLoader = () => {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white pb-10">
      <table className="-z-10 mb-5 w-full rounded-2xl border border-[#e9eefc] select-none dark:border-[#101417]">
        <thead className="bg-light-primary-bg dark:bg-dark-primary-bg">
          <tr>
            <th className="w-32 rounded-t-2xl border border-[#e9eefc] px-4 py-4 text-left dark:border-[#101417]">
              <Skeleton className="h-6 w-32" />
            </th>
            <th className="border border-[#e9eefc] px-4 py-2 text-left dark:border-[#101417]">
              <Skeleton className="h-6 w-32" />
            </th>
            <th className="border border-[#e9eefc] px-4 py-2 text-left dark:border-[#101417]">
              <Skeleton className="h-6 w-40" />
            </th>
            <th className="border border-[#e9eefc] px-4 py-2 text-left dark:border-[#101417]">
              <Skeleton className="h-6 w-24" />
            </th>
            <th className="border border-[#e9eefc] px-4 py-2 text-left dark:border-[#101417]">
              <Skeleton className="h-6 w-20" />
            </th>
          </tr>
        </thead>
        <tbody className="rounded-2xl">
          {[...Array(9)].map((_, index) => (
            <tr
              key={index}
              className="hover:bg-light-primary-bg dark:hover:bg-dark-primary-bg"
            >
              <td className="w-32 border border-[#e9eefc] px-4 py-2 dark:border-[#101417]">
                <Skeleton className="h-16 w-16" />
              </td>
              <td className="border border-[#e9eefc] px-4 py-2 dark:border-[#101417]">
                <Skeleton className="h-6 w-32" />
              </td>
              <td className="border border-[#e9eefc] px-4 py-2 dark:border-[#101417]">
                <Skeleton className="h-6 w-40" />
              </td>
              <td className="border border-[#e9eefc] px-4 py-2 dark:border-[#101417]">
                <Skeleton className="h-6 w-24" />
              </td>
              <td className="border border-[#e9eefc] px-4 py-2 dark:border-[#101417]">
                <Skeleton className="h-6 w-20" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeletonLoader;
