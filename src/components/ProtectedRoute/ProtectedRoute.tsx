// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useGetRoleUserPermissionsQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
// import { hasPermissionForMenu, extractBaseRoute, childRouteToParentMapping } from "@/utils/permissionMapping";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const location = useLocation();
//   const [hasAccess, setHasAccess] = useState<boolean | null>(null);

//   const { data: permissionsData, isLoading } = useGetRoleUserPermissionsQuery(undefined);

//   useEffect(() => {
//     if (!isLoading && permissionsData) {
//       const path = location.pathname.substring(1);

//       // Handle root path
//       if (!path) {
//         const hasDashboardAccess = permissionsData?.permissions?.dashboard?.includes("read");
//         setHasAccess(!!hasDashboardAccess);
//         return;
//       }

//       // Extract base route (remove parameters)
//       const baseRoute = extractBaseRoute(path);

//       // Find parent menu for the base route
//       const parentRoute = childRouteToParentMapping[baseRoute] || childRouteToParentMapping[path];
//       const menuIdToCheck = parentRoute || baseRoute;

//       const access = hasPermissionForMenu(menuIdToCheck, permissionsData);
//       setHasAccess(access);
//     }
//   }, [location.pathname, permissionsData, isLoading]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
//       </div>
//     );
//   }

//   if (hasAccess === false) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGetRoleUserPermissionsQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import {
  hasPermissionForMenu,
  extractBaseRoute,
  childRouteToParentMapping,
} from "@/utils/permissionMapping";
import Forbidden from "@/pages/Forbidden/Forbidden";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const {
    data: permissionsData,
    isLoading,
    error,
  } = useGetRoleUserPermissionsQuery(undefined);

  // Check if user is authenticated (has token)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && permissionsData) {
      const path = location.pathname.substring(1);

      // Handle root path
      if (!path) {
        const hasDashboardAccess =
          permissionsData?.permissions?.dashboard?.includes("read");
        setHasAccess(!!hasDashboardAccess);
        return;
      }

      // Extract base route (remove parameters)
      const baseRoute = extractBaseRoute(path);

      // Find parent menu for the base route as fallback
      const parentRoute =
        childRouteToParentMapping[baseRoute] || childRouteToParentMapping[path];

      // Check the exact route first, then fallback to checking the parent concept
      const access = hasPermissionForMenu(baseRoute, permissionsData) ||
        (parentRoute ? hasPermissionForMenu(parentRoute, permissionsData) : false);

      setHasAccess(access);
    }
  }, [location.pathname, permissionsData, isLoading]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // If there's an error or no permissions data, show forbidden
  if (error || !permissionsData) {
    return (
      <Forbidden message="Unable to verify permissions. Please try again later." />
    );
  }

  // If access is explicitly denied, show forbidden page
  if (hasAccess === false) {
    return <Forbidden />;
  }

  // If still determining access, show loading
  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Access granted
  return <>{children}</>;
};

export default ProtectedRoute;