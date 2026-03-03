// /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { menuItems } from "@/components/Shared/Sidebar/MenuItems";

// interface PermissionMapping {
//   [key: string]: string[];
// }

// // Map menu IDs to backend permission modules (exactly matching your permissions object)
// export const menuToPermissionMapping: PermissionMapping = {
//   // Dashboard
//   "": ["dashboard"],

//   // Admin & RBAC
//   admin: ["rbac"],
//   "create-edit-role": ["rbac"],

//   // User Management
//   users: ["user"],
//   user_profile: ["user_profile"],

//   // Driver/Raider Management
//   drivers: ["raider", "my_raider"],

//   // Order Management
//   orders: ["order"],
//   "order-placement": ["order_placement"],

//   // Support
//   support: ["support_dispute"],

//   // Payments & Transactions
//   payments: ["payment_transaction"],

//   // Live Map
//   "live-map": ["live_map"],

//   // Notifications
//   notifications: ["notification"],

//   // Reports & Analytics
//   reports: ["report_analytics", "report_analytics_stats"],

//   // Vehicle Management (Old Structure)
//   "vehicle-management": ["destination"],

//   // Wallet
//   wallet: ["wallet"],

//   // Coin System
//   "coin-system": ["coin"],

//   // Quiz
//   quiz: ["quiz"],

//   // Advertisement
//   advertisement: ["advertisement"],

//   // Platform Fee
//   "platform-fee": ["platform_fee"],

//   // Content Management
//   "content-management": ["content_management", "faq"],

//   // Driver Order Competition
//   "driver-order-competition": ["driver_order_compitition"],

//   // Customer Order Confirmation
//   "customer-order-confirmation": ["customer_order_confirmation"],

//   // Additional
//   additional: ["additionl_order_service"],

//   // System Configuration (Parent)
//   "system-configuration": [
//     "destination",
//     "driver_order_compitition",
//     "quiz",
//     "customer_order_confirmation",
//     "coin",
//     "service_areas",
//     "vehicle_type",
//     "delivery_type",
//     "policies",
//     "revenue_order_config",
//     "quizzes",
//     "additionl_order_service",
//     "driver_incentive",
//     "customer_rewards",
//     "promo_code",
//   ],

//   // Service Configuration
//   "service-configuration": [
//     "service_areas",
//     "vehicle_type",
//     "delivery_type",
//     "policies",
//   ],

//   // Service Area
//   "service-area": ["service_areas"],

//   // Vehicle Types
//   "vehicle-types": ["vehicle_type"],

//   // Types of Delivery
//   "types-of-delivery": ["delivery_type"],

//   // Policy Management
//   "policy-management": ["policies"],

//   // Revenue Configuration
//   "revenue-configuration": ["revenue_order_config"],

//   // Driver Configuration
//   "driver-configuration": ["driver_order_compitition", "quiz", "quizzes"],

//   // Customer Configuration
//   "customer-configuration": [
//     "additionl_order_service",
//     "customer_order_confirmation",
//   ],

//   // Incentive & Rewards Configuration
//   "incentive-rewards-configuration": [
//     "driver_incentive",
//     "customer_rewards",
//     "promo_code",
//   ],

//   // Incentive Management
//   "incentive-management": ["driver_incentive"],

//   // Promocode
//   promocode: ["promo_code"],

//   // Finance Reporting
//   "kpi-stats": ["report_analytics_stats"],
//   "coin-stats": ["report_analytics_stats"],
//   "incentive-analytics": ["report_analytics_stats"],
//   "transaction-stats": ["report_analytics_stats"],

//   // Contact Info
//   contactinfo: ["contact_info"],

//   // Service Chat
//   "service-chat": ["service_chat"],

//   // Dashboard Popup
//   "dashboard-popup": ["dashboard_popup"],

//   // Referral
//   referral: ["referral"],

//   // FAQ
//   faq: ["faq"],
// };

// // Map child routes to their parent menu IDs (for sidebar navigation)
// export const childRouteToParentMapping: Record<string, string> = {
//   // Dashboard
//   dashboard: "admin",

//   // Admin & RBAC
//   "create-edit-role": "admin",
//   "add-remove-permission": "admin",

//   // Users
//   "users-app": "users",
//   "users-web-portal": "users",
//   "add-new-user": "users",
//   "favourite-drivers": "users",
//   "users-app/:id": "users",
//   "favourite-drivers/:id": "users",
//   "order-history/:id": "users",

//   // Drivers
//   "driver-list": "drivers",
//   "add-new-driver": "drivers",
//   "new-join-request": "drivers",
//   "join-request": "drivers",
//   "join-request/:id": "drivers",
//   "driver-list/:id": "drivers",
//   "raider-details": "drivers",
//   "raider-details/:id": "drivers",

//   // Reports
//   "report-orders": "reports",
//   "driver-performance": "reports",
//   "customer-report": "reports",
//   kpi: "reports",
//   coins: "reports",
//   incentives: "reports",
//   "kpi-stats": "reports",
//   "coin-stats": "reports",
//   "incentive-analytics": "reports",
//   "transaction-stats": "reports",

//   // Wallet
//   "wallet-user": "wallet",
//   "wallet-driver": "wallet",
//   "wallet-user/:id": "wallet",
//   "wallet-driver/:id": "wallet",

//   // Order Placement
//   order: "order-placement",
//   "live-order-tracking": "order-placement",
//   "order-history": "order-placement",
//   "payment-options": "order-placement",
//   "order/:id": "order-placement",
//   "live-order-tracking/:id": "order-placement",

//   // Orders
//   "order-list": "orders",
//   "assign-driver": "orders",
//   "assign-driver/:id": "orders",

//   // Quiz
//   "quiz-create-edit": "quiz",
//   "quiz/:id": "quiz",

//   // Support
//   support: "support",
//   "support/view/:id": "support",
//   "support-dispute": "support",

//   // Content Management
//   "content-management": "content-management",
//   content: "content-management",
//   "content-management-user": "content-management",

//   // User Profile
//   "customize-profile": "user_profile",
//   "change-password": "user_profile",

//   // Additional
//   "additional-service": "additional",
//   "additional-service/:id": "additional",

//   // Dashboard Popup
//   "dashboard-popup": "admin",
//   "dashboard-popup/:id": "admin",

//   // Dashboard Chat
//   "dashboard-chat": "service-chat",
//   "dashboard-chat/:id": "service-chat",

//   // Contact Info
//   contectinfo: "contactinfo",
//   contactinfo: "contactinfo",
//   "contectinfo/:id": "contactinfo",

//   // Promocode
//   promocode: "promocode",
//   "promocode/:id": "promocode",

//   // Referral
//   referral: "referral",
//   "referral/:id": "referral",

//   // FAQ
//   faq: "content-management",
//   "faq/:id": "content-management",

//   // System Configuration mappings
//   "system-configuration": "system-configuration",
//   "service-configuration": "system-configuration",
//   "service-area": "system-configuration",
//   "service-area/:id": "system-configuration",
//   "vehicle-types": "system-configuration",
//   "vehicle-types/:id": "system-configuration",
//   "types-of-delivery": "system-configuration",
//   "types-of-delivery/:id": "system-configuration",
//   "policy-management": "system-configuration",
//   "policy-management/:id": "system-configuration",
//   "revenue-configuration": "system-configuration",
//   "platform-fee": "system-configuration",
//   "platform-fee/:id": "system-configuration",
//   "driver-configuration": "system-configuration",
//   "driver-order-competition": "system-configuration",
//   "driver-order-competition/:id": "system-configuration",
//   "customer-configuration": "system-configuration",
//   "customer-order-confirmation": "system-configuration",
//   "customer-order-confirmation/:id": "system-configuration",
//   "incentive-rewards-configuration": "system-configuration",
//   "coin-system": "system-configuration",
//   "coin-system/:id": "system-configuration",
//   "incentive-management": "system-configuration",
//   "incentive-management/:id": "system-configuration",

//   // Service Chat under support
//   "service-chat": "support",
//   "service-chat/:id": "support",
// };

// // Extract base route from dynamic route
// export const extractBaseRoute = (route: string): string => {
//   const cleanRoute = route.split("?")[0];

//   // Handle dynamic routes with parameters
//   if (cleanRoute.includes("/:")) {
//     const parts = cleanRoute.split("/:");
//     return parts[0];
//   }

//   // Handle specific known dynamic patterns
//   const dynamicPatterns = [
//     /^users-app\/\d+$/,
//     /^driver-list\/\d+$/,
//     /^wallet-user\/\d+$/,
//     /^wallet-driver\/\d+$/,
//     /^favourite-drivers\/\d+$/,
//     /^order-history\/\d+$/,
//     /^order\/\d+$/,
//     /^assign-driver\/\d+$/,
//     /^live-order-tracking\/\d+$/,
//     /^quiz-create-edit\/\d+$/,
//     /^join-request\/\d+$/,
//     /^raider-details\/\d+$/,
//     /^support\/view\/\d+$/,
//     /^additional-service\/\d+$/,
//     /^dashboard-popup\/\d+$/,
//     /^dashboard-chat\/\d+$/,
//     /^contectinfo\/\d+$/,
//     /^promocode\/\d+$/,
//     /^referral\/\d+$/,
//     /^service-area\/\d+$/,
//     /^vehicle-types\/\d+$/,
//     /^types-of-delivery\/\d+$/,
//     /^policy-management\/\d+$/,
//     /^platform-fee\/\d+$/,
//     /^quiz\/\d+$/,
//     /^driver-order-competition\/\d+$/,
//     /^customer-order-confirmation\/\d+$/,
//     /^incentive-management\/\d+$/,
//     /^coin-system\/\d+$/,
//     /^faq\/\d+$/,
//     /^service-chat\/\d+$/,
//   ];

//   for (const pattern of dynamicPatterns) {
//     if (pattern.test(cleanRoute)) {
//       return cleanRoute.split("/")[0];
//     }
//   }

//   return cleanRoute;
// };

// // Helper to check if a route is dynamic
// export const isDynamicRoute = (route: string): boolean => {
//   const dynamicRoutes = [
//     "quiz-create-edit/:id",
//     "support/view/:id",
//     "users-app/:id",
//     "driver-list/:id",
//     "join-request/:id",
//     "join-request",
//     "raider-details/:id",
//     "raider-details",
//     "wallet-user/:id",
//     "wallet-driver/:id",
//     "favourite-drivers/:id",
//     "order-history/:id",
//     "order/:id",
//     "assign-driver/:id",
//     "live-order-tracking/:id",
//     "service-area/:id",
//     "vehicle-types/:id",
//     "types-of-delivery/:id",
//     "policy-management/:id",
//     "platform-fee/:id",
//     "quiz/:id",
//     "driver-order-competition/:id",
//     "customer-order-confirmation/:id",
//     "incentive-management/:id",
//     "coin-system/:id",
//     "promocode/:id",
//     "referral/:id",
//     "faq/:id",
//     "service-chat/:id",
//     "additional-service/:id",
//     "dashboard-popup/:id",
//     "dashboard-chat/:id",
//     "contectinfo/:id",
//   ];

//   const cleanRoute = route.split("?")[0];

//   return dynamicRoutes.some((dynamicRoute) => {
//     const dynamicPattern = dynamicRoute
//       .replace(":id", "\\d+")
//       .replace(/\//g, "\\/");
//     return new RegExp(`^${dynamicPattern}$`).test(cleanRoute);
//   });
// };

// export const hasPermissionForMenu = (
//   menuId: string,
//   permissionsData: any,
// ): boolean => {
//   if (menuId === "login") return true;

//   const baseMenuId = extractBaseRoute(menuId);

//   // First try to get parent from mapping
//   let finalMenuId =
//     childRouteToParentMapping[baseMenuId] ||
//     childRouteToParentMapping[menuId] ||
//     baseMenuId;

//   // If the menuId itself is in menuToPermissionMapping, use it directly
//   if (menuToPermissionMapping[menuId]) {
//     finalMenuId = menuId;
//   }

//   const permissionModules = menuToPermissionMapping[finalMenuId];

//   if (!permissionModules) {
//     return false;
//   }

//   if (!permissionsData?.permissions) {
//     return false;
//   }

//   for (const module of permissionModules) {
//     const modulePermissions = permissionsData.permissions[module];

//     if (modulePermissions && modulePermissions.length > 0) {
//       return true;
//     }
//   }

//   return false;
// };

// // Get all available menu IDs (parent + child)
// export const getAllAvailableRoutes = (permissionsData: any): string[] => {
//   const availableRoutes: string[] = [];

//   if (!permissionsData?.permissions) return availableRoutes;

//   // Add root routes
//   Object.keys(menuToPermissionMapping).forEach((menuId) => {
//     if (menuId === "login" || menuId === "") return;

//     const hasPermission = hasPermissionForMenu(menuId, permissionsData);
//     if (hasPermission) {
//       availableRoutes.push(menuId);
//     }
//   });

//   return availableRoutes;
// };

// // Helper function to check if a parent menu should be shown
// export const shouldShowParentMenu = (
//   menuItem: any,
//   permissionsData: any,
// ): boolean => {
//   // If no children, check permission directly
//   if (!menuItem.children || menuItem.children.length === 0) {
//     return hasPermissionForMenu(menuItem.id, permissionsData);
//   }

//   // Check if any child has permission (recursively)
//   const checkChildren = (children: any[]): boolean => {
//     for (const child of children) {
//       if (hasPermissionForMenu(child.id, permissionsData)) {
//         return true;
//       }
//       if (child.children && child.children.length > 0) {
//         if (checkChildren(child.children)) {
//           return true;
//         }
//       }
//     }
//     return false;
//   };

//   return checkChildren(menuItem.children);
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
// import { menuItems } from "@/components/Shared/Sidebar/MenuItems";

interface PermissionMapping {
  [key: string]: string[];
}

// Map menu IDs to backend permission modules (exactly matching your permissions object)
export const menuToPermissionMapping: PermissionMapping = {
  // Dashboard
  "": ["dashboard"],
  dashboard: ["dashboard"],

  // Admin & RBAC
  admin: ["rbac"],
  "create-edit-role": ["rbac"],

  // User Management
  users: ["user"],
  user_profile: ["user_profile"],
  "users-app": ["user"],
  "users-web-portal": ["user"],
  "users-app/:id": ["user", "user_profile"],
  "favourite-drivers/:id": ["user"],
  "order-history/:id": ["user"],
  "add-new-user": ["user"],

  // Driver/Raider Management
  drivers: ["raider"],
  "driver-list": ["raider"],
  "driver-list/:id": ["raider"],
  "add-new-driver": ["raider"],
  "new-join-request": ["raider"],
  "join-request/:id": ["raider"],
  "raider-details/:id": ["raider"],

  // Order Management
  orders: ["order"],
  "order-placement": ["order_placement"],

  // Support
  support: ["support_dispute"],

  // Payments & Transactions
  payments: ["payment_transaction"],

  // Live Map
  "live-map": ["live_map"],

  // Notifications
  notifications: ["notification"],

  // Reports & Analytics
  reports: ["report_analytics", "report_analytics_stats"],

  // Vehicle Management (Old Structure)
  "vehicle-management": ["destination"],

  // Wallet
  wallet: ["wallet"],

  // Coin System
  "coin-system": ["coin"],

  // Quiz
  quiz: ["quiz"],

  // Advertisement
  advertisement: ["advertisement"],

  // Platform Fee
  "platform-fee": ["platform_fee"],

  // Content Management
  "content-management": ["content_management", "faq"],

  // Driver Order Competition
  "driver-order-competition": ["driver_order_compitition"],

  // Customer Order Confirmation
  "customer-order-confirmation": ["customer_order_confirmation"],

  // Additional
  additional: ["additionl_order_service"],

  // System Configuration (Parent)
  "system-configuration": [
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
  ],

  // Service Configuration
  "service-configuration": [
    "service_areas",
    "vehicle_type",
    "delivery_type",
    "policies",
  ],

  // Service Area
  "service-area": ["service_areas"],

  // Vehicle Types
  "vehicle-types": ["vehicle_type"],

  // Types of Delivery
  "types-of-delivery": ["delivery_type"],

  // Policy Management
  "policy-management": ["policies"],

  // Revenue Configuration
  "revenue-configuration": ["revenue_order_config"],

  // Driver Configuration
  "driver-configuration": ["driver_order_compitition", "quiz", "quizzes"],

  // Customer Configuration
  "customer-configuration": [
    "additionl_order_service",
    "customer_order_confirmation",
  ],

  // Incentive & Rewards Configuration
  "incentive-rewards-configuration": [
    "driver_incentive",
    "customer_rewards",
    "promo_code",
  ],

  // Incentive Management
  "incentive-management": ["driver_incentive"],

  // Promocode
  promocode: ["promo_code"],

  // Finance Reporting
  "kpi-stats": ["report_analytics_stats"],
  "coin-stats": ["report_analytics_stats"],
  "incentive-analytics": ["report_analytics_stats"],
  "transaction-stats": ["report_analytics_stats"],

  // Contact Info
  contactinfo: ["contact_info"],

  // Service Chat
  "service-chat": ["service_chat"],

  // Dashboard Popup
  "dashboard-popup": ["dashboard_popup"],

  // Referral
  referral: ["referral"],

  // FAQ
  faq: ["faq"],
};

// Map child routes to their parent menu IDs (for sidebar navigation)
export const childRouteToParentMapping: Record<string, string> = {
  // Dashboard
  dashboard: "admin",

  // Admin & RBAC
  "create-edit-role": "admin",
  "add-remove-permission": "admin",

  // Users
  "users-app": "users",
  "users-web-portal": "users",
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
  "content-management": "content-management",
  content: "content-management",
  "content-management-user": "content-management",

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
  faq: "content-management",
  "faq/:id": "content-management",

  // System Configuration mappings
  "system-configuration": "system-configuration",
  "service-configuration": "system-configuration",
  "service-area": "system-configuration",
  "service-area/:id": "system-configuration",
  "vehicle-types": "system-configuration",
  "vehicle-types/:id": "system-configuration",
  "types-of-delivery": "system-configuration",
  "types-of-delivery/:id": "system-configuration",
  "policy-management": "system-configuration",
  "policy-management/:id": "system-configuration",
  "revenue-configuration": "system-configuration",
  "platform-fee": "system-configuration",
  "platform-fee/:id": "system-configuration",
  "driver-configuration": "system-configuration",
  "driver-order-competition": "system-configuration",
  "driver-order-competition/:id": "system-configuration",
  "customer-configuration": "system-configuration",
  "customer-order-confirmation": "system-configuration",
  "customer-order-confirmation/:id": "system-configuration",
  "incentive-rewards-configuration": "system-configuration",
  "coin-system": "system-configuration",
  "coin-system/:id": "system-configuration",
  "incentive-management": "system-configuration",
  "incentive-management/:id": "system-configuration",

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

// FIXED: Check if user has permission for a specific menu item
export const hasPermissionForMenu = (
  menuId: string,
  permissionsData: any,
): boolean => {
  if (menuId === "login") return true;

  const baseMenuId = extractBaseRoute(menuId);

  // First try to get parent from mapping
  let finalMenuId =
    childRouteToParentMapping[baseMenuId] ||
    childRouteToParentMapping[menuId] ||
    baseMenuId;

  // If the menuId itself is in menuToPermissionMapping, use it directly
  if (menuToPermissionMapping[menuId]) {
    finalMenuId = menuId;
  }

  const permissionModules = menuToPermissionMapping[finalMenuId];

  if (!permissionModules || permissionModules.length === 0) {
    return false;
  }

  if (!permissionsData?.permissions) {
    return false;
  }

  // Check if ALL required modules have at least one permission
  // For a menu item to be accessible, ALL its mapped modules must have permissions
  for (const module of permissionModules) {
    const modulePermissions = permissionsData.permissions[module];

    // If any required module doesn't have permissions, deny access
    if (!modulePermissions || modulePermissions.length === 0) {
      return false;
    }
  }

  // All required modules have permissions
  return true;
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