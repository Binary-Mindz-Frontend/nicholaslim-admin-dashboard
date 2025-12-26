import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGetRoleUserPermissionsQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import { hasPermissionForMenu, childRouteToParentMapping } from "@/utils/permissionMapping";
import { menuItems } from "@/components/Shared/Sidebar/MenuItems";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  
  const { data: permissionsData, isLoading } = useGetRoleUserPermissionsQuery(undefined);

  useEffect(() => {
    if (!isLoading && permissionsData) {
      const path = location.pathname.substring(1);
      const pathParts = path.split('/');
      let routeId = pathParts[0];
      
      // Handle root path
      if (!routeId) {
        const hasDashboardAccess = permissionsData?.permissions?.dashboard?.includes("read");
        setHasAccess(!!hasDashboardAccess);
        return;
      }
      
      // Handle dynamic routes (like :id routes)
      const isDynamicRoute = routeId.includes('-') && routeId.split('-').some(part => 
        menuItems.some(item => 
          item.children?.some(child => child.id === part) || item.id === part
        )
      );
      
      if (isDynamicRoute) {
        // Extract the actual route from dynamic path
        const routeParts = routeId.split('-');
        for (let i = 0; i < routeParts.length; i++) {
          const possibleRoute = routeParts.slice(i).join('-');
          const menuItem = menuItems.find(item => 
            item.id === possibleRoute || 
            item.children?.some(child => child.id === possibleRoute)
          );
          if (menuItem) {
            routeId = possibleRoute;
            break;
          }
        }
      }
      
      // Check if this is a child route
      const parentRoute = childRouteToParentMapping[routeId];
      const menuIdToCheck = parentRoute || routeId;
      
      const access = hasPermissionForMenu(menuIdToCheck, permissionsData);
      setHasAccess(access);
    }
  }, [location.pathname, permissionsData, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (hasAccess === false) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;