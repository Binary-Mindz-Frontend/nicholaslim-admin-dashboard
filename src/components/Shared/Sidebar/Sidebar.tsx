import { useState } from "react";
import { ChevronDown, Layout, Menu, X } from "lucide-react";
import { menuItems } from "./MenuItems";

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["admin"])
  );
  const [activeItem, setActiveItem] = useState<string>("admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (id: string, hasChildren: boolean) => {
    setActiveItem(id);
    if (hasChildren) {
      toggleExpand(id);
    }
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Sidebar content component to avoid duplication
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between lg:justify-start gap-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5">
            <Layout className="w-5 h-5 text-slate-900" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={closeSidebar}
          className="lg:hidden p-1 rounded-md hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          const hasChildren = item.children && item.children.length > 0;
          const isItemActive = item.id === activeItem;

          return (
            <div key={item.id} className="">
              {/* Parent Item */}
              <button
                onClick={() => handleItemClick(item.id, hasChildren || false)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors relative group ${
                  isItemActive
                    ? "bg-primary text-slate-900"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isItemActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                )}

                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>

                {hasChildren && (
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Child Items */}
              {hasChildren && isExpanded && (
                <div className="mt-1 space-y-1 ml-4 border-l border-slate-200 pl-4">
                  {item.children?.map((child: any) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setActiveItem(child.id);
                        // Close sidebar on mobile when child item is clicked
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        child.id === activeItem
                          ? "text-yellow-600 font-medium"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-slate-900" />
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full lg:h-auto
          w-71 bg-slate-50 border-r border-slate-200 p-4
          transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Add padding for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
}