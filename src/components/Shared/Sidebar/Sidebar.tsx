import { useState, useEffect } from "react";
import { ChevronDown, Layout, Menu, X } from "lucide-react";
import { menuItems } from "./MenuItems";
import { useNavigate, useLocation } from "react-router-dom"; // If using React Router

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["dashboard"])
  );
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // For navigation - if using React Router
  const navigate = useNavigate();
  const location = useLocation();

  // Sync active item with current route
  useEffect(() => {
    const currentPath = location.pathname.replace('/', '');
    if (currentPath) {
      setActiveItem(currentPath);
      // Expand parent if this is a child route
      const parentItem = findParentItem(currentPath);
      if (parentItem && parentItem !== currentPath) {
        setExpandedItems(prev => new Set(prev).add(parentItem));
      }
    }
  }, [location.pathname]);

  // Helper function to find parent item for a child
  const findParentItem = (childId: string): string | null => {
    for (const item of menuItems) {
      if (item.children) {
        const child = item.children.find(child => child.id === childId);
        if (child) return item.id;
      }
    }
    return null;
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (id: string, hasChildren: boolean, isChild: boolean = false) => {
    setActiveItem(id);
    
    if (hasChildren && !isChild) {
      toggleExpand(id);
    } else {
      // Navigate to the page - replace with your navigation method
      navigateToPage(id);
    }
    
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const navigateToPage = (pageId: string) => {
    // If using React Router
    navigate(`/${pageId}`);
    
    // If using regular links, you could use:
    // window.location.href = `/${pageId}`;
    
    // If using state management for page content:
    // setCurrentPage(pageId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Recursive function to render menu items (for potential nested children)
  const renderMenuItems = (items: typeof menuItems, level: number = 0) => {
    return items.map((item) => {
      const isExpanded = expandedItems.has(item.id);
      const hasChildren = item.children && item.children.length > 0;
      const isItemActive = item.id === activeItem;
      const isChildActive = hasChildren && item.children?.some(child => child.id === activeItem);

      return (
        <div key={item.id} className="">
          {/* Parent Item */}
          <button
            onClick={() => handleItemClick(item.id, hasChildren, level > 0)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors relative group ${
              isItemActive || isChildActive
                ? "bg-primary text-slate-900" 
                : "text-slate-700 hover:bg-slate-100"
            } ${level > 0 ? 'ml-4' : ''}`}
          >
            {(isItemActive || isChildActive) && level === 0 && (
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
            <div className={`mt-1 space-y-1 ${level === 0 ? 'ml-4 border-l border-slate-200 pl-4' : 'ml-2 pl-2'}`}>
              {item.children?.map((child) => {
                const isChildItemActive = child.id === activeItem;
                
                return (
                  <button
                    key={child.id}
                    onClick={() => handleItemClick(child.id, false, true)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                      isChildItemActive
                        ? "text-yellow-600 font-medium bg-yellow-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {child.icon ? (
                      <span className="shrink-0">{child.icon}</span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    )}
                    <span>{child.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  // Sidebar content component to avoid duplication
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between lg:justify-start gap-2 mb-8">
        {/* <div className="flex items-center gap-2">
          <div className="w-5 h-5">
            <Layout className="w-5 h-5 text-slate-900" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        </div> */}
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
        {renderMenuItems(menuItems)}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 z-40 shadow-sm">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-slate-900" />
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
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
          fixed lg:static top-0 left-0 h-full lg:h-screen
          w-71 bg-slate-50 border-r border-slate-200 p-4
          transform transition-transform duration-300 ease-in-out z-50
          overflow-y-auto
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