import { menuItems, MenuItem } from "@/components/Shared/Sidebar/MenuItems";

export const getTitleFromPath = (path: string): string | null => {
  const normalizedPath = path === "/" ? path : path.replace(/\/$/, "");

  const findExact = (items: MenuItem[]): string | null => {
    for (const item of items) {
      if (item.route === normalizedPath) return item.label;
      if (item.children) {
        const found = findExact(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const exactMatch = findExact(menuItems);
  if (exactMatch) return exactMatch;

  const findPrefix = (items: MenuItem[]): { label: string; length: number } | null => {
    let bestMatch: { label: string; length: number } | null = null;

    const traverse = (currentItems: MenuItem[]) => {
      for (const item of currentItems) {
        if (item.route && item.route !== "/" && normalizedPath.startsWith(item.route)) {
          if (!bestMatch || item.route.length > bestMatch.length) {
            bestMatch = { label: item.label, length: item.route.length };
          }
        }
        if (item.children) {
          traverse(item.children);
        }
      }
    };

    traverse(items);
    return bestMatch;
  };

  const prefixMatch = findPrefix(menuItems);
  if (prefixMatch) return prefixMatch.label;

  const fallbacks: Record<string, string> = {
    "/login": "Login",
    "/forgot-password": "Forgot Password",
    "/verify-otp": "Verify OTP",
    "/reset-password": "Reset Password",
  };

  return fallbacks[normalizedPath] || null;
};
