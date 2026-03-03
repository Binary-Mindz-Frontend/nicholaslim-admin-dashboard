/* eslint-disable @typescript-eslint/no-explicit-any */
interface PermissionMapping {
  [key: string]: string[];
}

// Map menu IDs to backend permission modules (exactly matching your permissions object)
export const menuToPermissionMapping: PermissionMapping = {
  // Dashboard
  "": ["dashboard"],
  dashboard: ["dashboard"],

  // Admin & RBAC - UPDATED to ensure proper mapping
  admin: ["rbac"],
  "create-edit-role": ["rbac"],
  "add-remove-permission": ["rbac"],
  "roles-permissions": ["rbac"], // Added alias for roles & permissions

  // User Management - CRITICAL: Map both parent and child routes to "user" module
  "users-web-portal": ["user"], // Web users route
  "users-app": ["user"], // Mobile users route
  users: ["user"], // Parent menu item
  user_profile: ["user_profile"],
  "users-app/:id": ["user", "user_profile"],
  "favourite-drivers": ["user"],
  "favourite-drivers/:id": ["user"],
  "order-history/:id": ["user"],
  "add-new-user": ["user"],

  // Driver/Raider Management
  "driver-list": ["raider"],
  drivers: ["raider"],
  "driver-list/:id": ["raider"],
  "add-new-driver": ["raider"],
  "new-join-request": ["raider"],
  "join-request": ["raider"],
  "join-request/:id": ["raider"],
  "raider-details": ["raider"],
  "raider-details/:id": ["raider"],

  // Order Management
  "order-list": ["order"],
  orders: ["order"],
  "assign-driver": ["order"],
  "assign-driver/:id": ["order"],

  // Order Placement
  "order-placement": ["order_placement"],
  order: ["order_placement"],
  "live-order-tracking": ["order_placement"],
  "order-history": ["order_placement"],
  "payment-options": ["order_placement"],
  "order/:id": ["order_placement"],
  "live-order-tracking/:id": ["order_placement"],

  // Support
  "support-dispute": ["support_dispute"],
  support: ["support_dispute"],
  "support/view/:id": ["support_dispute"],

  // Payments & Transactions
  payments: ["payment_transaction"],
  "payment-transactions": ["payment_transaction"],

  // Live Map
  "live-map": ["live_map"],
  "live-map/fleet-tracking": ["live_map"],

  // Notifications
  "push-notification": ["notification"],
  notifications: ["notification"],

  // Reports & Analytics
  "report-orders": ["report_analytics"],
  reports: ["report_analytics", "report_analytics_stats"],
  "driver-performance": ["report_analytics"],
  "customer-report": ["report_analytics"],
  kpi: ["report_analytics_stats"],
  coins: ["report_analytics_stats"],
  incentives: ["report_analytics_stats"],
  "kpi-stats": ["report_analytics_stats"],
  "coin-stats": ["report_analytics_stats"],
  "incentive-analytics": ["report_analytics_stats"],
  "transaction-stats": ["report_analytics_stats"],

  // Vehicle Management
  "vehicle-types": ["destination"],
  "vehicle-management": ["destination"],

  // Wallet
  "wallet-user": ["wallet"],
  wallet: ["wallet"],
  "wallet-driver": ["wallet"],
  "wallet-user/:id": ["wallet"],
  "wallet-driver/:id": ["wallet"],

  // Coin System
  "coin-system": ["coin"],
  "coin-system/:id": ["coin"],

  // Quiz
  "quiz-create-edit": ["quiz"],
  quiz: ["quiz"],
  "quiz/:id": ["quiz"],

  // Advertisement
  advertisement: ["advertisement"],

  // Platform Fee
  "platform-fee": ["platform_fee"],
  "platform-fee/:id": ["platform_fee"],

  // Content Management
  "content-management": ["content_management", "faq"],
  content: ["content_management"],
  "content-management-user": ["content_management"],

  // FAQ
  "faq/:id": ["faq"],
  faq: ["faq"],

  // Driver Order Competition
  "driver-order-competition": ["driver_order_compitition"],
  "driver-order-competition/:id": ["driver_order_compitition"],

  // Customer Order Confirmation
  "customer-order-confirmation": ["customer_order_confirmation"],
  "customer-order-confirmation/:id": ["customer_order_confirmation"],

  // Additional Services
  additional: ["additionl_order_service"],
  "additional-service": ["additionl_order_service"],
  "additional-service/:id": ["additionl_order_service"],

  // System Configuration (Parent) - UPDATED with comprehensive module list
  "system-configuration": [
    "vechicle_pricing",
    "destination",
    "driver_order_compitition",
    "quiz",
    "customer_order_confirmation",
    "coin",
    "service_areas",
    "vehicle_type",
    "delivery_type",
    "policies",
    "revenue_order_config",
    "quizzes",
    "additionl_order_service",
    "driver_incentive",
    "customer_rewards",
    "promo_code",
    "platform_fee",
  ],

  // Service Configuration - UPDATED
  "service-configuration": [
    "service_areas",
    "vehicle_type",
    "delivery_type",
    "policies",
    "vechicle_pricing",
  ],

  // Service Area
  "service-area": ["service_areas"],
  "service-area/:id": ["service_areas"],

  // Vehicle Types
  // "vehicle-types": ["vehicle_type", "vechicle_pricing"],
  "vehicle-types/:id": ["vehicle_type"],

  // Types of Delivery
  "types-of-delivery": ["delivery_type"],
  "types-of-delivery/:id": ["delivery_type"],

  // Policy Management
  "policy-management": ["policies"],
  "policy-management/:id": ["policies"],

  // Revenue Configuration - UPDATED
  "revenue-configuration": ["revenue_order_config", "platform_fee"],
  "platform-fee-config": ["revenue_order_config"],
  // "platform-fee": ["platform_fee"], // Added direct mapping

  // Driver Configuration - UPDATED
  "driver-configuration": [
    "driver_order_compitition",
    "quiz",
    "quizzes",
    "driver_incentive",
  ],

  // Customer Configuration - UPDATED
  "customer-configuration": [
    "additionl_order_service",
    "customer_order_confirmation",
    "customer_rewards",
  ],

  // Incentive & Rewards Configuration - UPDATED
  "incentive-rewards-configuration": [
    "driver_incentive",
    "customer_rewards",
    "promo_code",
  ],

  // Incentive Management
  "incentive-management": ["driver_incentive"],
  "incentive-management/:id": ["driver_incentive"],

  // Promocode
  promocode: ["promo_code"],
  "promocode/:id": ["promo_code"],

  // Contact Info
  contactinfo: ["contact_info"],
  "contactinfo/:id": ["contact_info"],
  contectinfo: ["contact_info"],
  "contectinfo/:id": ["contact_info"],

  // Service Chat
  "service-chat": ["service_chat"],
  "service-chat/:id": ["service_chat"],
  "dashboard-chat": ["service_chat"],
  "dashboard-chat/:id": ["service_chat"],

  // Dashboard Popup
  "dashboard-popup": ["dashboard_popup"],
  "dashboard-popup/:id": ["dashboard_popup"],

  // Referral
  referral: ["referral"],
  "referral/:id": ["referral"],

  // Order Confirmation (specific)
  "order-confirmation": ["order_confirmation"],
  "order-confirmation-rules": ["order_confirmation"],
};

// Map child routes to their parent menu IDs (for sidebar navigation)
export const childRouteToParentMapping: Record<string, string> = {
  // Dashboard
  dashboard: "admin",

  // Admin & RBAC - UPDATED to ensure proper parent mapping
  "create-edit-role": "admin",
  "add-remove-permission": "admin",
  "roles-permissions": "admin",

  // Users - CRITICAL: Map web users route to users parent
  "users-web-portal": "users", // This ensures it appears under Users menu
  "users-app": "users",
  "add-new-user": "users",
  "favourite-drivers": "users",
  "users-app/:id": "users",
  "favourite-drivers/:id": "users",
  "order-history/:id": "users",

  // Drivers
  "driver-list": "drivers",
  "add-new-driver": "drivers",
  "new-join-request": "drivers",
  "join-request": "drivers",
  "join-request/:id": "drivers",
  "driver-list/:id": "drivers",
  "raider-details": "drivers",
  "raider-details/:id": "drivers",

  // Reports
  "report-orders": "reports",
  "driver-performance": "reports",
  "customer-report": "reports",
  kpi: "reports",
  coins: "reports",
  incentives: "reports",
  "kpi-stats": "reports",
  "coin-stats": "reports",
  "incentive-analytics": "reports",
  "transaction-stats": "reports",

  // Wallet
  "wallet-user": "wallet",
  "wallet-driver": "wallet",
  "wallet-user/:id": "wallet",
  "wallet-driver/:id": "wallet",

  // Order Placement
  order: "order-placement",
  "live-order-tracking": "order-placement",
  "order-history": "order-placement",
  "payment-options": "order-placement",
  "order/:id": "order-placement",
  "live-order-tracking/:id": "order-placement",

  // Orders
  "order-list": "orders",
  "assign-driver": "orders",
  "assign-driver/:id": "orders",

  // Quiz
  "quiz-create-edit": "quiz",
  "quiz/:id": "quiz",

  // Support
  support: "support",
  "support/view/:id": "support",
  "support-dispute": "support",

  // Content Management
  "content-management": "content",
  content: "content",
  "content-management-user": "content",

  // User Profile
  "customize-profile": "user_profile",
  "change-password": "user_profile",

  // Additional
  "additional-service": "additional",
  "additional-service/:id": "additional",

  // Dashboard Popup
  "dashboard-popup": "admin",
  "dashboard-popup/:id": "admin",

  // Dashboard Chat
  "dashboard-chat": "service-chat",
  "dashboard-chat/:id": "service-chat",

  // Contact Info
  contectinfo: "contactinfo",
  contactinfo: "contactinfo",
  "contectinfo/:id": "contactinfo",

  // Promocode
  promocode: "promocode",
  "promocode/:id": "promocode",

  // Referral
  referral: "referral",
  "referral/:id": "referral",

  // FAQ
  faq: "content",
  "faq/:id": "content",

  // System Configuration mappings - UPDATED to ensure all sub-items map correctly
  "system-configuration": "system-configuration",
  "service-configuration": "system-configuration",
  "service-area": "service-configuration", // Map to intermediate parent
  "service-area/:id": "service-configuration",
  "vehicle-types": "service-configuration",
  "vehicle-types/:id": "service-configuration",
  "types-of-delivery": "service-configuration",
  "types-of-delivery/:id": "service-configuration",
  "policy-management": "service-configuration",
  "policy-management/:id": "service-configuration",

  "revenue-configuration": "system-configuration",
  "platform-fee": "revenue-configuration", // Map to intermediate parent
  "platform-fee/:id": "revenue-configuration",
  "platform-fee-config": "revenue-configuration",

  "driver-configuration": "system-configuration",
  "driver-order-competition": "driver-configuration", // Map to intermediate parent
  "driver-order-competition/:id": "driver-configuration",
  quiz: "driver-configuration",
  // "quiz/:id": "driver-configuration",

  "customer-configuration": "system-configuration",
  "customer-order-confirmation": "customer-configuration", // Map to intermediate parent
  "customer-order-confirmation/:id": "customer-configuration",

  "incentive-rewards-configuration": "system-configuration",
  "coin-system": "incentive-rewards-configuration", // Map to intermediate parent
  "coin-system/:id": "incentive-rewards-configuration",
  "incentive-management": "incentive-rewards-configuration",
  "incentive-management/:id": "incentive-rewards-configuration",
  // "promocode": "incentive-rewards-configuration",
  // "promocode/:id": "incentive-rewards-configuration",

  // Service Chat under support
  "service-chat": "support",
  "service-chat/:id": "support",
};

// Extract base route from dynamic route
export const extractBaseRoute = (route: string): string => {
  const cleanRoute = route.split("?")[0];

  // Handle dynamic routes with parameters
  if (cleanRoute.includes("/:")) {
    const parts = cleanRoute.split("/:");
    return parts[0];
  }

  // Handle specific known dynamic patterns
  const dynamicPatterns = [
    /^users-app\/\d+$/,
    /^users-web-portal\/\d+$/,
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
    /^referral\/\d+$/,
    /^service-area\/\d+$/,
    /^vehicle-types\/\d+$/,
    /^types-of-delivery\/\d+$/,
    /^policy-management\/\d+$/,
    /^platform-fee\/\d+$/,
    /^quiz\/\d+$/,
    /^driver-order-competition\/\d+$/,
    /^customer-order-confirmation\/\d+$/,
    /^incentive-management\/\d+$/,
    /^coin-system\/\d+$/,
    /^faq\/\d+$/,
    /^service-chat\/\d+$/,
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
    "users-web-portal/:id",
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
    "service-area/:id",
    "vehicle-types/:id",
    "types-of-delivery/:id",
    "policy-management/:id",
    "platform-fee/:id",
    "quiz/:id",
    "driver-order-competition/:id",
    "customer-order-confirmation/:id",
    "incentive-management/:id",
    "coin-system/:id",
    "promocode/:id",
    "referral/:id",
    "faq/:id",
    "service-chat/:id",
    "additional-service/:id",
    "dashboard-popup/:id",
    "dashboard-chat/:id",
    "contectinfo/:id",
  ];

  const cleanRoute = route.split("?")[0];

  return dynamicRoutes.some((dynamicRoute) => {
    const dynamicPattern = dynamicRoute
      .replace(":id", "\\d+")
      .replace(/\//g, "\\/");
    return new RegExp(`^${dynamicPattern}$`).test(cleanRoute);
  });
};

// UPDATED: Improved permission check with better parent-child relationship handling
export const hasPermissionForMenu = (
  menuId: string,
  permissionsData: any,
): boolean => {
  if (menuId === "login") return true;

  const baseMenuId = extractBaseRoute(menuId);

  // Try multiple strategies to find permissions

  // Strategy 1: Direct menuId match
  if (menuToPermissionMapping[menuId]) {
    const permissionModules = menuToPermissionMapping[menuId];
    if (checkPermissionModules(permissionModules, permissionsData)) {
      return true;
    }
  }

  // Strategy 2: Base menuId match
  if (menuToPermissionMapping[baseMenuId]) {
    const permissionModules = menuToPermissionMapping[baseMenuId];
    if (checkPermissionModules(permissionModules, permissionsData)) {
      return true;
    }
  }

  // Strategy 3: Parent mapping
  const parentId =
    childRouteToParentMapping[baseMenuId] || childRouteToParentMapping[menuId];

  if (parentId && menuToPermissionMapping[parentId]) {
    const permissionModules = menuToPermissionMapping[parentId];
    if (checkPermissionModules(permissionModules, permissionsData)) {
      return true;
    }
  }

  // Strategy 4: Check intermediate parents recursively
  if (parentId) {
    const grandParentId = childRouteToParentMapping[parentId];
    if (grandParentId && menuToPermissionMapping[grandParentId]) {
      const permissionModules = menuToPermissionMapping[grandParentId];
      if (checkPermissionModules(permissionModules, permissionsData)) {
        return true;
      }
    }
  }

  return false;
};

// Helper function to check permission modules
const checkPermissionModules = (
  permissionModules: string[],
  permissionsData: any,
): boolean => {
  if (!permissionModules || permissionModules.length === 0) {
    return false;
  }

  if (!permissionsData?.permissions) {
    return false;
  }

  // Check if ANY of the required modules have permissions
  for (const module of permissionModules) {
    const modulePermissions = permissionsData.permissions[module];

    // If this module has permissions, grant access
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
    if (menuId === "login" || menuId === "") return;

    const hasPermission = hasPermissionForMenu(menuId, permissionsData);
    if (hasPermission) {
      availableRoutes.push(menuId);
    }
  });

  return availableRoutes;
};

// UPDATED: Improved parent menu visibility check
export const shouldShowParentMenu = (
  menuItem: any,
  permissionsData: any,
): boolean => {
  // If no children, check permission directly
  if (!menuItem.children || menuItem.children.length === 0) {
    return hasPermissionForMenu(menuItem.id, permissionsData);
  }

  // Check if this parent itself has permissions (for cases where parent has its own module)
  if (hasPermissionForMenu(menuItem.id, permissionsData)) {
    return true;
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

// NEW: Get all backend modules for a specific menu ID (useful for permission toggling)
export const getAllBackendModulesForMenu = (menuId: string): string[] => {
  const directModules = menuToPermissionMapping[menuId] || [];

  // Get modules from parent if this is a child
  const parentId = childRouteToParentMapping[menuId];
  const parentModules = parentId ? menuToPermissionMapping[parentId] || [] : [];

  // Get modules from grandparent
  const grandParentId = parentId
    ? childRouteToParentMapping[parentId]
    : undefined;
  const grandParentModules = grandParentId
    ? menuToPermissionMapping[grandParentId] || []
    : [];

  // Combine all modules and remove duplicates
  return [
    ...new Set([...directModules, ...parentModules, ...grandParentModules]),
  ];
};

// NEW: Check if a menu item has any permissions assigned
export const hasAnyPermissionForMenu = (
  menuId: string,
  selectedPermissions: any[],
): boolean => {
  const backendModules = getAllBackendModulesForMenu(menuId);

  for (const module of backendModules) {
    const hasModulePermission = selectedPermissions.some(
      (p) => p.module === module,
    );
    if (hasModulePermission) return true;
  }

  return false;
};

// NEW: Check if a menu item has all permissions (fully selected)
export const hasAllPermissionsForMenu = (
  menuId: string,
  selectedPermissions: any[],
  moduleActions: Record<string, string[]>,
): boolean => {
  const backendModules = getAllBackendModulesForMenu(menuId);

  for (const module of backendModules) {
    const requiredActions = moduleActions[module] || [];
    const actualPermissions = selectedPermissions.filter(
      (p) => p.module === module,
    );

    if (actualPermissions.length !== requiredActions.length) {
      return false;
    }
  }

  return backendModules.length > 0;
};

// NEW: Check if a menu item has partial permissions (some but not all)
export const hasPartialPermissionsForMenu = (
  menuId: string,
  selectedPermissions: any[],
  moduleActions: Record<string, string[]>,
): boolean => {
  const backendModules = getAllBackendModulesForMenu(menuId);
  let hasSomePermission = false;
  let hasAllPermission = true;

  for (const module of backendModules) {
    const requiredActions = moduleActions[module] || [];
    const actualPermissions = selectedPermissions.filter(
      (p) => p.module === module,
    );

    if (actualPermissions.length > 0) {
      hasSomePermission = true;
    }

    if (actualPermissions.length !== requiredActions.length) {
      hasAllPermission = false;
    }
  }

  return hasSomePermission && !hasAllPermission && backendModules.length > 0;
};
