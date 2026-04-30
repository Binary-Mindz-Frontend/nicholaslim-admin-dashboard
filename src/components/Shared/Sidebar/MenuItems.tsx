import {
  Shield,
  Users,
  Truck,
  Package,
  Layout,
  LayoutGrid,
  FileText,
  Tag,
  HelpCircle,
  Wallet,
  BarChart,
  Map,
  LogOut,
  MonitorCog,
  Bell,
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  isExpanded?: boolean;
  route?: string;
  hidden?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    id: "",
    label: "Dashboard",
    icon: <Layout className="w-5 h-5" />,
    route: "/",
  },

  {
    id: "system-configuration",
    label: "System Configuration",
    icon: <MonitorCog className="w-5 h-5" />,
    children: [
      {
        id: "service-configuration",
        label: "Service Configuration",
        icon: null,
        children: [
          {
            id: "service-area",
            label: "Service Areas",
            icon: null,
            route: "/service-area",
          },
          {
            id: "vehicle-types",
            label: "Vehicle Types",
            icon: null,
            route: "/vehicle-types",
          },
          {
            id: "types-of-delivery",
            label: "Delivery Types",
            icon: null,
            route: "/types-of-delivery",
          },
          {
            id: "surge-pricing-role",
            label: "Surge Pricing Role",
            icon: null,
            route: "/surge-pricing-role",
          },
          {
            id: "policy-management",
            label: "Policies",
            icon: null,
            route: "/policy-management",
          },
        ],
      },
      {
        id: "revenue-configuration",
        label: "Revenue Configuration",
        icon: null,
        children: [
          {
            id: "platform-fee",
            label: "Commission Rules (platform fees)",
            icon: null,
            route: "/platform-fee",
          },
        ],
      },
      {
        id: "driver-configuration",
        label: "Driver Configuration",
        icon: null,
        children: [
          {
            id: "driver-order-competition",
            label: "Driver Competition Rules",
            icon: null,
            route: "/driver-order-competition",
          },
          {
            id: "driver_tier_role",
            label: "Driver Tier Roles",
            icon: null,
            route: "/driver_tier_role",
          },
          {
            id: "quiz",
            label: "Quizzes",
            icon: null,
            route: "/quiz",
          },
        ],
      },
      {
        id: "customer-configuration",
        label: "Customer Configuration",
        icon: null,
        children: [
          {
            id: "customer-order-confirmation",
            label: "Order Confirmation Rules",
            icon: null,
            route: "/customer-order-confirmation",
          },
          {
            id: "additional-service",
            label: "Additional Services",
            icon: null,
            route: "/additional-service",
          },
        ],
      },
      {
        id: "incentive-rewards-configuration",
        label: "Incentive & Rewards Configuration",
        icon: null,
        children: [
          {
            id: "incentive-management",
            label: "Driver Incentives (performance bonus rules)",
            icon: null,
            route: "/incentive-management",
          },
          {
            id: "coin-system",
            label: "Customer Rewards (coins management)",
            icon: null,
            route: "/coin-system",
          },
          {
            id: "promocode",
            label: "Promo Codes",
            icon: null,
            route: "/promocode",
          },
        ],
      },
    ],
  },

  {
    id: "admin",
    label: "Administration",
    icon: <Shield className="w-5 h-5" />,
    children: [
      {
        id: "create-edit-role",
        label: "Roles & Permissions",
        icon: null,
        route: "/create-edit-role",
      },
    ],
  },

  {
    id: "users",
    label: "Users",
    icon: <Users className="w-5 h-5" />,
    children: [
      {
        id: "users-web-portal",
        label: "Web Users",
        icon: null,
        route: "/users-web-portal",
      },
      {
        id: "users-app",
        label: "Mobile Users",
        icon: null,
        route: "/users-app",
      },
    ],
  },

  {
    id: "drivers",
    label: "Drivers",
    icon: <Truck className="w-5 h-5" />,
    children: [
      {
        id: "driver-list",
        label: "Drivers",
        icon: null,
        route: "/driver-list",
      },
      {
        id: "new-join-request",
        label: "Join Requests",
        icon: null,
        route: "/new-join-request",
      },
    ],
  },

  {
    id: "orders",
    label: "Orders",
    icon: <Package className="w-5 h-5" />,
    children: [
      {
        id: "order-list",
        label: "Orders",
        icon: null,
        route: "/order-list",
      },
    ],
  },

  {
    id: "wallet",
    label: "Wallets & Payments",
    icon: <Wallet className="w-5 h-5" />,
    children: [
      {
        id: "wallet-user",
        label: "User wallets",
        icon: null,
        route: "/wallet-user",
      },
      {
        id: "wallet-driver",
        label: "Driver wallets",
        icon: null,
        route: "/wallet-driver",
      },
    ],
  },

  {
    id: "finance-reporting",
    label: "Finance Reporting",
    icon: <BarChart className="w-5 h-5" />,
    children: [
      {
        id: "coins",
        label: "Customer Rewards & Redemptions",
        icon: null,
        route: "/coins",
      },
      {
        id: "incentives",
        label: "Driver Incentive Tracking",
        icon: null,
        route: "/incentives",
      },
      {
        id: "kpi",
        label: "Revenue & Driver Performance",
        icon: null,
        route: "/kpi",
      },
      {
        id: "payments",
        label: "Transactions (revenue, commissions, refunds)",
        icon: null,
        route: "/payments",
      },
    ],
  },

  {
    id: "reports",
    label: "Reports & Analytics",
    icon: <BarChart className="w-5 h-5" />,
    children: [
      {
        id: "report-orders",
        label: "Orders",
        icon: null,
        route: "/report-orders",
      },
      {
        id: "customer-report",
        label: "Customer Reports",
        icon: null,
        route: "/customer-report",
      },
      {
        id: "driver-performance",
        label: "Driver Performance",
        icon: null,
        route: "/driver-performance",
      },
    ],
  },

  {
    id: "live-fleet-tracking",
    label: "Live Fleet Tracking",
    icon: <Map className="w-5 h-5" />,
    children: [
      {
        id: "live-map",
        label: "Live Map",
        icon: null,
        route: "/live-map",
      },
    ],
  },

  {
    id: "notification_management",
    label: "Notification Management",
    icon: <Bell className="w-5 h-5" />,
    children: [
      {
        id: "notifications",
        label: "Create Notification",
        icon: null,
        route: "/notifications",
      },
      {
        id: "create-notification-promotion",
        label: "Create Notification Promotion",
        icon: null,
        route: "/create-notification-promotion",
      },
      {
        id: "notification-list",
        label: "Notification List",
        icon: null,
        route: "/notification-list",
      },
      {
        id: "notification-promotion-list",
        label: "Notification Promotion List",
        icon: null,
        route: "/notification-promotion-list",
      },
      {
        id: "notification-log-history",
        label: "Notification Log History",
        icon: null,
        route: "/notification-log-history",
      },
    ],
  },

  {
    id: "support-communication",
    label: "Support & Communication",
    icon: <HelpCircle className="w-5 h-5" />,
    children: [
      {
        id: "contactinfo",
        label: "Contact Info",
        icon: null,
        route: "/contactinfo",
      },
      {
        id: "support",
        label: "Support & Dispute",
        icon: null,
        route: "/support",
      },
      {
        id: "dashboard-chat",
        label: "Service Chat",
        icon: null,
        route: "/dashboard-chat",
      },
      // {
      //   id: "notifications",
      //   label: "Push Notification",
      //   icon: null,
      //   route: "/notifications",
      // },
    ],
  },

  {
    id: "marketing",
    label: "Marketing & Engagement",
    icon: <Tag className="w-5 h-5" />,
    children: [
      {
        id: "advertisement",
        label: "Advertisements",
        icon: null,
        route: "/advertisement",
      },
      {
        id: "dashboard-popup",
        label: "Dashboard Popups",
        icon: null,
        route: "/dashboard-popup",
      },
    ],
  },

  {
    id: "content",
    label: "Content Management",
    icon: <FileText className="w-5 h-5" />,
    children: [
      {
        id: "content-management",
        label: "Mobile Content",
        icon: null,
        route: "/content-management",
      },
    ],
  },

  {
    id: "order-placement",
    label: "Order Management",
    icon: <LayoutGrid className="w-5 h-5" />,
    children: [
      {
        id: "order",
        label: "Order Placement",
        icon: null,
        route: "/order",
      },
      {
        id: "live-order-tracking",
        label: "Live Order Tracking",
        icon: null,
        route: "/live-order-tracking",
      },
      {
        id: "order-history",
        label: "Order History",
        icon: null,
        route: "/order-history",
      },
      {
        id: "payment-options",
        label: "Payment Options",
        icon: null,
        route: "/payment-options",
      },
    ],
  },

  {
    id: "login",
    label: "Logout",
    icon: <LogOut className="w-5 h-5" />,
    route: "/login",
  },
];
