

import { Sidebar } from "@/components/Shared/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
	return (
		<div className="flex min-h-screen bg-white">
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
				<main className="flex-1 px-8 pt-15   pb-8 md:px-12 lg:pt-8 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
