/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { hasPermissionForMenu } from "@/utils/permissionMapping";
import { MenuItem, menuItems } from "@/components/Shared/Sidebar/MenuItems";

export const usePermissionMenu = (permissionsData: any) => {
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!permissionsData) {
      setFilteredMenuItems([]);
      return;
    }

    const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter(item => {
          if (item.id === "login") return true;
          
          const hasPermission = hasPermissionForMenu(item.id, permissionsData);
          
          if (!hasPermission) return false;
          
          if (item.children && item.children.length > 0) {
            const filteredChildren = filterMenuItems(item.children);
            if (filteredChildren.length > 0) {
              item.children = filteredChildren;
              return true;
            }
            return false;
          }
          
          return true;
        })
        .map(item => ({
          ...item,
          children: item.children ? filterMenuItems(item.children) : undefined
        }));
    };

    setFilteredMenuItems(filterMenuItems(menuItems));
  }, [permissionsData]);

  return filteredMenuItems;
};