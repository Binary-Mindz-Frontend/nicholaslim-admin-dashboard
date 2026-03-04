/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ChevronDown, Layout, Menu, X } from "lucide-react";
import { menuItems, MenuItem } from "./MenuItems";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetRoleUserPermissionsQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import {
  hasPermissionForMenu,
  shouldShowParentMenu,
} from "@/utils/permissionMapping";

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["dashboard"]),
  );
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);

  const { data: roleBasedAccessControlData } =
    useGetRoleUserPermissionsQuery(undefined);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    if (currentPath) {
      setActiveItem(currentPath);

      // Find and expand parent menus of the current active item
      const findAndExpandParents = (
        items: MenuItem[],
        targetId: string,
      ): boolean => {
        for (const item of items) {
          if (item.children) {
            // Check if target is a direct child
            const directChild = item.children.find(
              (child) => child.id === targetId,
            );
            if (directChild) {
              setExpandedItems((prev) => new Set(prev).add(item.id));
              return true;
            }

            // Check nested children
            for (const child of item.children) {
              if (child.children) {
                const nestedChild = child.children.find(
                  (nested) => nested.id === targetId,
                );
                if (nestedChild) {
                  setExpandedItems((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(item.id);
                    newSet.add(child.id);
                    return newSet;
                  });
                  return true;
                }
              }
            }
          }
        }
        return false;
      };

      findAndExpandParents(menuItems, currentPath);
    }
  }, [location.pathname]);

  // Filter menu items based on permissions
  useEffect(() => {
    if (roleBasedAccessControlData?.permissions) {
      const filteredItems = filterMenuItems(
        menuItems,
        roleBasedAccessControlData,
      );
      setFilteredMenuItems(filteredItems);
    } else {
      // If no permissions data, show empty menu
      setFilteredMenuItems([]);
    }
  }, [roleBasedAccessControlData]);

  // Recursive function to filter menu items based on permissions
  const filterMenuItems = (
    items: MenuItem[],
    permissionsData: any,
  ): MenuItem[] => {
    return items.reduce((acc: MenuItem[], item) => {
      // Always show logout
      if (item.id === "login") {
        acc.push(item);
        return acc;
      }

      // Check if this item or any of its children should be shown
      if (!shouldShowParentMenu(item, permissionsData)) {
        return acc;
      }

      // Create a copy of the item
      const filteredItem: MenuItem = {
        ...item,
        children: [],
      };

      // Filter children if they exist
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children
          .map((child) => {
            // Check if child itself has permission
            if (hasPermissionForMenu(child.id, permissionsData)) {
              // If child has children, filter them too
              if (child.children && child.children.length > 0) {
                const filteredNestedChildren = child.children.filter(
                  (nestedChild) =>
                    hasPermissionForMenu(nestedChild.id, permissionsData),
                );
                if (filteredNestedChildren.length > 0) {
                  return {
                    ...child,
                    children: filteredNestedChildren,
                  };
                }
              }
              return child;
            }

            // Check nested children
            if (child.children && child.children.length > 0) {
              const filteredNestedChildren = child.children.filter(
                (nestedChild) =>
                  hasPermissionForMenu(nestedChild.id, permissionsData),
              );

              if (filteredNestedChildren.length > 0) {
                return {
                  ...child,
                  children: filteredNestedChildren,
                };
              }
            }

            return null;
          })
          .filter((child): child is MenuItem => child !== null);

        if (filteredChildren.length > 0) {
          filteredItem.children = filteredChildren;
        } else {
          // If no children have permission, don't include this parent
          return acc;
        }
      }

      acc.push(filteredItem);
      return acc;
    }, []);
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

  const handleItemClick = (
    id: string,
    hasChildren: boolean,
    _level: number = 0,
  ) => {
    setActiveItem(id);

    if (id === "login") {
      handleLogout();
      return;
    }

    // If item has children, just toggle expansion
    if (hasChildren) {
      toggleExpand(id);
    } else {
      // Only navigate if it's a leaf node (no children)
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
    navigate(`/${pageId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Recursive function to render menu items with proper nesting
  const renderMenuItems = (items: MenuItem[], level: number = 0) => {
    return items.map((item) => {
      const isExpanded = expandedItems.has(item.id);
      const hasChildren = !!(item.children && item.children.length > 0);
      const isItemActive = item.id === activeItem;
      const isLogoutButton = item.id === "login";

      // Check if any child is active (for highlighting parent)
      const isChildActive =
        hasChildren &&
        item.children?.some((child) => {
          if (child.id === activeItem) return true;
          if (child.children) {
            return child.children.some((nested) => nested.id === activeItem);
          }
          return false;
        });

      return (
        <div key={item.id} className="mb-1">
          {/* Parent Menu Item */}
          <button
            onClick={() => handleItemClick(item.id, hasChildren, level)}
            className={`w-full flex items-center cursor-pointer gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors relative group ${
              isLogoutButton
                ? "bg-red-50 hover:bg-red-100 text-red-600"
                : isItemActive || isChildActive
                  ? "bg-primary text-slate-900"
                  : "text-slate-700 hover:bg-slate-100"
            } ${level > 0 ? "ml-4" : ""}`}
          >
            {(isItemActive || isChildActive) &&
              level === 0 &&
              !isLogoutButton && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
              )}

            {isLogoutButton && level === 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-lg" />
            )}

            <span
              className={`shrink-0 ${isLogoutButton ? "text-red-600" : ""}`}
            >
              {item.icon}
            </span>
            <span
              className={`flex-1 text-left ${isLogoutButton ? "text-red-600 font-semibold" : ""}`}
            >
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

          {/* Children Menu Items */}
          {hasChildren && isExpanded && !isLogoutButton && (
            <div
              className={`mt-1 space-y-1 ${level === 0 ? "ml-4 border-l border-slate-200 pl-4" : "ml-2 pl-2"}`}
            >
              {item.children?.map((child) => {
                const childHasChildren = !!(
                  child.children && child.children.length > 0
                );

                if (childHasChildren) {
                  // Render nested parent (like service-configuration, revenue-configuration, etc.)
                  return renderMenuItems([child], level + 1);
                } else {
                  // Render leaf node (actual route)
                  const isChildActive = child.id === activeItem;

                  return (
                    <button
                      key={child.id}
                      onClick={() =>
                        handleItemClick(child.id, false, level + 1)
                      }
                      className={`w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ml-4 text-left ${
                        isChildActive
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
                }
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
        {filteredMenuItems.length > 0 ? (
          renderMenuItems(filteredMenuItems)
        ) : (
          <div className="text-center text-slate-500 py-4">
            No menu items available
          </div>
        )}
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
