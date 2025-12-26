import { useState, useEffect } from "react";
import { ChevronDown, Layout, Menu, X } from "lucide-react";
import { menuItems } from "./MenuItems";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetRoleUserPermissionsQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import { hasPermissionForMenu } from "@/utils/permissionMapping";

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["dashboard"])
  );
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);

  const { data: roleBasedAccessControlData } = useGetRoleUserPermissionsQuery(undefined);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    if (currentPath) {
      setActiveItem(currentPath);
      const parentItem = findParentItem(currentPath);
      if (parentItem && parentItem !== currentPath) {
        setExpandedItems(prev => new Set(prev).add(parentItem));
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (roleBasedAccessControlData?.permissions) {
      const filteredItems = menuItems.filter(item => {
        if (item.id === "login") return true;
        
        const hasPermission = hasPermissionForMenu(item.id, roleBasedAccessControlData);
        
        if (!hasPermission) return false;
        
        if (item.children && item.children.length > 0) {
          item.children = item.children.filter(child => {
            console.log(child)
            return hasPermissionForMenu(item.id, roleBasedAccessControlData);
          });
          
          return item.children.length > 0;
        }
        
        return true;
      });
      
      setFilteredMenuItems(filteredItems);
    }
  }, [roleBasedAccessControlData]);

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
    
    if (id === "login") {
      handleLogout();
      return;
    }
    
    if (hasChildren && !isChild) {
      toggleExpand(id);
    } else {
      navigateToPage(id);
    }
    
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const navigateToPage = (pageId: string) => {
    if (pageId === "login") return;
    
    // Check if this is a parent menu without children navigation
    const menuItem = menuItems.find(item => item.id === pageId);
    if (menuItem?.children && menuItem.children.length > 0) {
      // Navigate to first child
      navigate(`/${menuItem.children[0].id}`);
    } else {
      navigate(`/${pageId}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderMenuItems = (items: typeof menuItems, level: number = 0) => {
    return items.map((item) => {
      const isExpanded = expandedItems.has(item.id);
      const hasChildren = !!(item.children && item.children.length > 0);
      const isItemActive = item.id === activeItem;
      const isChildActive = hasChildren && item.children?.some(child => child.id === activeItem);
      const isLogoutButton = item.id === "login";

      return (
        <div key={item.id} className="">
          <button
            onClick={() => handleItemClick(item.id, hasChildren, level > 0)}
            className={`w-full flex items-center cursor-pointer gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors relative group ${
              isLogoutButton 
                ? "bg-red-50 hover:bg-red-100 text-red-600" 
                : isItemActive || isChildActive
                  ? "bg-primary text-slate-900" 
                  : "text-slate-700 hover:bg-slate-100"
            } ${level > 0 ? 'ml-4' : ''}`}
          >
            {(isItemActive || isChildActive) && level === 0 && !isLogoutButton && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
            )}
            
            {isLogoutButton && level === 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-lg" />
            )}

            <span className={`shrink-0 ${isLogoutButton ? 'text-red-600' : ''}`}>
              {item.icon}
            </span>
            <span className={`flex-1 text-left ${isLogoutButton ? 'text-red-600 font-semibold' : ''}`}>
              {item.label}
            </span>

            {hasChildren && !isLogoutButton && (
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {hasChildren && isExpanded && !isLogoutButton && (
            <div className={`mt-1 space-y-1 ${level === 0 ? 'ml-4 border-l border-slate-200 pl-4' : 'ml-2 pl-2'}`}>
              {item.children?.map((child) => {
                const isChildItemActive = child.id === activeItem;
                
                return (
                  <button
                    key={child.id}
                    onClick={() => handleItemClick(child.id, false, true)}
                    className={`w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
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

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between lg:justify-start gap-2 mb-4">
        <button
          onClick={closeSidebar}
          className="lg:hidden p-1 rounded-md hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      <nav className="space-y-1">
        {renderMenuItems(filteredMenuItems)}
      </nav>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 border-b border-slate-200 p-4 z-50 shadow-sm bg-white">
        <div className="flex items-center justify-between">
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

      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/90 bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:top-25 md:pb-32 left-0 h-full lg:min-h-screen overflow-y-auto no-scrollbar
          w-75 shadow-md bg-white p-4
          transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <SidebarContent />
      </aside>

      <div className="lg:hidden h-16" />
    </>
  );
}