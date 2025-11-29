import Navbar from "@/components/Shared/Navbar/Navbar";
import { Sidebar } from "@/components/Shared/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div>
      <div className="flex min-h-screen ">
      
        {/* Sidebar - Fixed Width */}
        <div className="hidden lg:block max-w-[303px] shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar (Optional) */}
        <div className="lg:hidden">
          <Sidebar />
        </div>

        {/* Main Content - Takes remaining space */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 pt-24 lg:ml-80 pb-8 p-4 md:p-2 lg:pt-30 overflow-y-auto shadow-md bg-[#F5F7FA]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
