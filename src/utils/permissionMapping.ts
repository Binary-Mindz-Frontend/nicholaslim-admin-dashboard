/* eslint-disable @types/typescript-eslint/no-explicit-any */
import { menuItems } from "@/components/Shared/Sidebar/MenuItems";

interface PermissionMapping {
  [key: string]: string[];
}

// Map menu IDs to backend permission modules
export const menuToPermissionMapping: PermissionMapping = {
  "": ["dashboard"],
  admin: ["rbac"],
  users: ["user"],
  drivers: ["raider"],
  orders: ["order"],
  support: ["support_dispute"],
  payments: ["payment_transaction"],
  "live-map": ["live_map"],
  notifications: ["notification"],
  reports: ["report_analytics"],
  "vehicle-management": ["vechicle_pricing", "destination"],
  wallet: ["wallet"],
  "coin-system": ["coin"],
  quiz: ["quiz"],
  advertisement: ["advertisement"],
  "platform-fee": ["platform_fee"],
  "content-management": ["content_management"],
  "driver-order-competition": ["driver_order_competition"],
  "customer-order-confirmation": ["customer_order_confirmation"],
  "order-placement": ["order_placement"],
  user_profile: ["user_profile"],
  additional: ["admin"],

  // NEW DATA - Add these mappings for the new menu structure
  "system-configuration": [
    "vechicle_pricing",
    "destination",
    "platform_fee",
    "driver_order_competition",
    "quiz",
    "customer_order_confirmation",
    "coin",
  ],
  "service-area": ["vechicle_pricing", "destination"],
  "vehicle-types": ["vechicle_pricing", "destination"],
  "types-of-delivery": ["vechicle_pricing", "destination"],
  "policy-management": ["vechicle_pricing", "destination"],
  "revenue-configuration": ["platform_fee"],
  "driver-configuration": ["driver_order_competition", "quiz"],
  "customer-configuration": ["customer_order_confirmation"],
  "incentive-rewards-configuration": ["coin"],
  "incentive-management": ["coin"],
  promocode: ["coin"],
  "create-edit-role": ["rbac"],
};

// Map child routes to their parent menu IDs
export const childRouteToParentMapping: Record<string, string> = {
  dashboard: "admin",
  "create-edit-role": "admin",
  "add-remove-permission": "admin",
  "users-app": "users",
  "users-web-portal": "users",
  "add-new-user": "users",
  "favourite-drivers": "users",
  "driver-list": "drivers",
  "add-new-driver": "drivers",
  "new-join-request": "drivers",
  "service-area": "vehicle-management",
  "vehicle-types": "vehicle-management",
  "policy-management": "vehicle-management",
  "types-of-delivery": "vehicle-management",
  "report-orders": "reports",
  "driver-performance": "reports",
  "customer-report": "reports",
  kpi: "reports",
  coins: "reports",
  incentives: "reports",
  "wallet-user": "wallet",
  "wallet-driver": "wallet",
  "incentive-management": "wallet",
  order: "order-placement",
  "live-order-tracking": "order-placement",
  "order-history": "order-placement",
  "payment-options": "order-placement",
  "order-list": "orders",
  "quiz-create-edit": "quiz",
  support: "support",
  "users-app/:id": "users",
  "join-request": "drivers",
  "driver-list/:id": "drivers",
  "join-request/:id": "drivers",
  "raider-details": "driver-order-competition",
  "raider-details/:id": "driver-order-competition",
  "wallet-user/:id": "wallet",
  "wallet-driver/:id": "wallet",
  "favourite-drivers/:id": "users",
  "order-history/:id": "users",
  "order/:id": "orders",
  "assign-driver": "orders",
  "assign-driver/:id": "orders",
  "live-order-tracking/:id": "order-placement",
  "support/view/:id": "support",
  "content-management": "content-management",
  "customize-profile": "user_profile",
  "change-password": "user_profile",
  "additional-service": "admin",
  "dashboard-popup": "admin",
  "dashboard-chat": "admin",
  contectinfo: "admin",
  promocode: "admin",

  // NEW DATA - Add these mappings for the new menu structure
  "system-configuration": "system-configuration",
  "service-configuration": "system-configuration",
  // "service-area": "system-configuration",
  // "vehicle-types": "system-configuration",
  // "types-of-delivery": "system-configuration",
  // "policy-management": "system-configuration",
  "revenue-configuration": "system-configuration",
  "platform-fee": "system-configuration",
  "driver-configuration": "system-configuration",
  "driver-order-competition": "system-configuration",
  quiz: "system-configuration",
  "customer-configuration": "system-configuration",
  "customer-order-confirmation": "system-configuration",
  "incentive-rewards-configuration": "system-configuration",
  // "incentive-management": "system-configuration",
  "coin-system": "system-configuration",
  // promocode: "system-configuration",
  admin: "admin",
  // "create-edit-role": "admin",
};

// Extract base route from dynamic route
export const extractBaseRoute = (route: string): string => {
  // Remove query parameters if any
  const cleanRoute = route.split("?")[0];

  // Handle dynamic routes with parameters
  if (cleanRoute.includes("/:")) {
    const parts = cleanRoute.split("/:");
    return parts[0];
  }

  // Handle specific known dynamic patterns
  const dynamicPatterns = [
    /^users-app\/\d+$/,
    /^driver-list\/\d+$/,
    /^wallet-user\/\d+$/,
    /^wallet-driver\/\d+$/,
    /^favourite-drivers\/\d+$/,
    /^order-history\/\d+$/,
    /^order\/\d+$/,
    /^assign-driver\/\d+$/,
    /^live-order-tracking\/\d+$/,
    /^quiz-create-edit\/\d+$/,
    /^join-request\/\d+$/,
    /^raider-details\/\d+$/,
    /^support\/view\/\d+$/,
    /^additional-service\/\d+$/,
    /^dashboard-popup\/\d+$/,
    /^dashboard-chat\/\d+$/,
    /^contectinfo\/\d+$/,
    /^promocode\/\d+$/,
    // Add new dynamic patterns if needed
    /^service-area\/\d+$/,
    /^vehicle-types\/\d+$/,
    /^platform-fee\/\d+$/,
    /^quiz\/\d+$/,
    /^driver-order-competition\/\d+$/,
    /^customer-order-confirmation\/\d+$/,
    /^incentive-management\/\d+$/,
    /^coin-system\/\d+$/,
    /^promocode\/\d+$/,
  ];

  for (const pattern of dynamicPatterns) {
    if (pattern.test(cleanRoute)) {
      return cleanRoute.split("/")[0];
    }
  }

  return cleanRoute;
};

// Helper to check if a route is dynamic
export const isDynamicRoute = (route: string): boolean => {
  const dynamicRoutes = [
    "quiz-create-edit/:id",
    "support/view/:id",
    "users-app/:id",
    "driver-list/:id",
    "join-request/:id",
    "join-request",
    "raider-details/:id",
    "raider-details",
    "wallet-user/:id",
    "wallet-driver/:id",
    "favourite-drivers/:id",
    "order-history/:id",
    "order/:id",
    "assign-driver/:id",
    "live-order-tracking/:id",
    // Add new dynamic routes
    "service-area/:id",
    "vehicle-types/:id",
    "platform-fee/:id",
    "quiz/:id",
    "driver-order-competition/:id",
    "customer-order-confirmation/:id",
    "incentive-management/:id",
    "coin-system/:id",
    "promocode/:id",
  ];

  const cleanRoute = route.split("?")[0];

  return dynamicRoutes.some((dynamicRoute) => {
    const dynamicPattern = dynamicRoute
      .replace(":id", "\\d+")
      .replace(/\//g, "\\/");
    return new RegExp(`^${dynamicPattern}$`).test(cleanRoute);
  });
};

export const hasPermissionForMenu = (
  menuId: string,
  permissionsData: any,
): boolean => {
  if (menuId === "login") return true;

  const baseMenuId = extractBaseRoute(menuId);
  const parentMenuId =
    childRouteToParentMapping[baseMenuId] || childRouteToParentMapping[menuId];
  const finalMenuId = parentMenuId || baseMenuId;

  const permissionModules = menuToPermissionMapping[finalMenuId];

  if (!permissionModules) {
    return false;
  }

  if (!permissionsData?.permissions) {
    return false;
  }

  for (const module of permissionModules) {
    const modulePermissions = permissionsData.permissions[module];

    if (modulePermissions && modulePermissions.length > 0) {
      return true;
    }
  }

  return false;
};

// Get all available menu IDs (parent + child)
export const getAllAvailableRoutes = (permissionsData: any): string[] => {
  const availableRoutes: string[] = [];

  if (!permissionsData?.permissions) return availableRoutes;

  // Add root routes
  Object.keys(menuToPermissionMapping).forEach((menuId) => {
    if (menuId === "login") return;

    const hasPermission = hasPermissionForMenu(menuId, permissionsData);
    if (hasPermission) {
      // Check if this menu has children
      const menuItem = menuItems.find((item) => item.id === menuId);
      if (menuItem?.children && menuItem.children.length > 0) {
        // For the new structure, we need to find the first leaf child (grandchild)
        const findFirstLeafChild = (item: any): string | null => {
          if (item.children && item.children.length > 0) {
            // Check if grandchildren exist
            if (
              item.children[0].children &&
              item.children[0].children.length > 0
            ) {
              return item.children[0].children[0].id;
            }
            return item.children[0].id;
          }
          return item.id;
        };

        const firstRoute = findFirstLeafChild(menuItem);
        if (firstRoute) {
          availableRoutes.push(firstRoute);
        }
      } else if (menuId !== "") {
        // Add the menu itself if it has no children
        availableRoutes.push(menuId);
      }
    }
  });

  return availableRoutes;
};

// Helper function to check if a parent menu should be shown
export const shouldShowParentMenu = (
  menuItem: any,
  permissionsData: any,
): boolean => {
  // If no children, check permission directly
  if (!menuItem.children || menuItem.children.length === 0) {
    return hasPermissionForMenu(menuItem.id, permissionsData);
  }

  // Check if any child has permission (recursively)
  const checkChildren = (children: any[]): boolean => {
    for (const child of children) {
      if (hasPermissionForMenu(child.id, permissionsData)) {
        return true;
      }
      if (child.children && child.children.length > 0) {
        if (checkChildren(child.children)) {
          return true;
        }
      }
    }
    return false;
  };

  return checkChildren(menuItem.children);
};
