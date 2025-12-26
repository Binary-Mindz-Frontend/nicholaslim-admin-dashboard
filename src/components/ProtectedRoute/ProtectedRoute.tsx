import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGetRoleUserPermissionsQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import { hasPermissionForMenu, extractBaseRoute, childRouteToParentMapping } from "@/utils/permissionMapping";

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
      
      // Handle root path
      if (!path) {
        const hasDashboardAccess = permissionsData?.permissions?.dashboard?.includes("read");
        setHasAccess(!!hasDashboardAccess);
        return;
      }
      
      // Extract base route (remove parameters)
      const baseRoute = extractBaseRoute(path);
      
      // Find parent menu for the base route
      const parentRoute = childRouteToParentMapping[baseRoute] || childRouteToParentMapping[path];
      const menuIdToCheck = parentRoute || baseRoute;
      
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