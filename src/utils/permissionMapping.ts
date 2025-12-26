import { menuItems } from "@/components/Shared/Sidebar/MenuItems";

interface PermissionMapping {
  [key: string]: string[];
}

// Map menu IDs to backend permission modules
export const menuToPermissionMapping: PermissionMapping = {
  "": ["dashboard"], // Dashboard
  "admin": ["rbac"],
  "users": ["user"],
  "drivers": ["raider"],
  "orders": ["order"],
  "support": ["support_dispute"],
  "payments": ["payment_transaction"],
  "live-map": ["live_map"],
  "notifications": ["notification"],
  "reports": ["report_analytics"],
  "vehicle-management": ["vechicle_pricing", "destination"],
  "wallet": ["wallet"],
  "coin-system": ["coin"],
  "quiz": ["quiz"],
  "advertisement": ["advertisement"],
  "platform-fee": ["platform_fee"],
  "content-management": ["content_management"],
  "driver-order-competition": ["driver_order_competition"],
  "customer-order-confirmation": ["customer_order_confirmation"],
  "order-placement": ["order_placement"]
};

// Map child routes to their parent menu IDs
export const childRouteToParentMapping: Record<string, string> = {
  "create-edit-role": "admin",
  "add-remove-permission": "admin",
  "users-app": "users",
  "users-web-portal": "users",
  "add-new-user": "users",
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
  "kpi": "reports",
  "coins": "reports",
  "incentives": "reports",
  "wallet-user": "wallet",
  "wallet-driver": "wallet",
  "incentive-management": "wallet",
  "order": "order-placement",
  "live-order-tracking": "order-placement",
  "order-history": "order-placement",
  "payment-options": "order-placement",
  "order-list": "orders"
};

export const hasPermissionForMenu = (
  menuId: string, 
  permissionsData: any
): boolean => {
  if (menuId === "login") return true;
  
  // Check if it's a child route
  const parentMenuId = childRouteToParentMapping[menuId];
  const finalMenuId = parentMenuId || menuId;
  
  const permissionModules = menuToPermissionMapping[finalMenuId];
  
  if (!permissionModules) return false;
  
  if (!permissionsData?.permissions) return false;
  
  for (const module of permissionModules) {
    if (permissionsData.permissions[module]?.includes("read")) {
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
  Object.keys(menuToPermissionMapping).forEach(menuId => {
    if (menuId === "login") return;
    
    const hasPermission = hasPermissionForMenu(menuId, permissionsData);
    if (hasPermission) {
      // Check if this menu has children
      const menuItem = menuItems.find(item => item.id === menuId);
      if (menuItem?.children && menuItem.children.length > 0) {
        // Add first child route
        if (menuItem.children[0]?.id) {
          availableRoutes.push(menuItem.children[0].id);
        }
      } else if (menuId !== "") {
        // Add the menu itself if it has no children
        availableRoutes.push(menuId);
      }
    }
  });
  
  return availableRoutes;
};