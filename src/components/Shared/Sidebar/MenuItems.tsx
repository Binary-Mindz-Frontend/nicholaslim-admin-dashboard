import {
  
  Shield,
  Users,
  Truck,
  Package,
  Heart,
  DollarSign,
  Layout,
  CheckCircle,
  LayoutGrid,
  FileText,
  Tag,
  Tv,
  HelpCircle,
  CircleDollarSign,
  Wallet,
  Bike,
  BarChart,
  Bell,
  Map,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  isExpanded?: boolean;
}
export const menuItems: MenuItem[] = [
    {
      id: "",
      label: "Dashboard",
      icon: <Layout className="w-5 h-5" />,
    },
    {
      id: "admin",
      label: "Admin",
      icon: <Shield className="w-5 h-5" />,
      children: [
        {
          id: "create-edit-role",
          label: "Create/Edit Role",
          icon: null,
        },
        {
          id: "add-remove-permission",
          label: "Add/Remove Permission",
          icon: null,
        },
      ],
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="w-5 h-5" />,
      children: [
        {
          id: "users-app",
          label: "Users-App",
          icon: null,
        },
        {
          id: "users-web-portal",
          label: "Users-Web Portal",
          icon: null,
        },
        {
          id: "add-new-user",
          label: "Add new User",
          icon: null,
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
          label: "Driver list",
          icon: null,
        },
        {
          id: "add-new-driver",
          label: "Add new Driver",
          icon: null,
        },
        {
          id: "new-join-request",
          label: "New Join Request",
          icon: null,
        },
      ],
    },
    {
      id: "order",
      label: "Order",
      icon: <Package className="w-5 h-5" />,
      children:[
        {
          id:"order-list",
          label:"order-list",
          icon:null,
        },
        {
          id:"order-track",
          label:"order-track",
          icon:null,
        }
      ]
    },
    {
      id: "support",
      label: "Support & Dispute",
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: "payments",
      label: "Payments & Transactions",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "live-map",
      label: "Live Map / Fleet Tracking",
      icon: <Map className="w-5 h-5" />,
    },

    {
      id: "notifications",
      label: "Notifications & Communication",
      icon: <Bell className="w-5 h-5" />,
    },

    {
      id: "reports",
      label: "Reports & Analytics",
      icon: <BarChart className="w-5 h-5" />,
    },

    {
      id: "vehicle-management",
      label: "Vehicle Type & Pricing Model Management",
      icon: <Bike className="w-5 h-5" />,
      children: [
        { id: "service-area", label: "Service area", icon: null },
        { id: "vehicle-types", label: "Vehicle types", icon: null },
        { id: "policy-management", label: "Policy Management", icon: null },
        { id: "types-of-delivery", label: "Types of Delivery", icon: null },
      ],
    },

    {
      id: "wallet",
      label: "Wallet",
      icon: <Wallet className="w-5 h-5" />,
      children: [
        { id: "wallet-user", label: "User", icon: null },
        { id: "wallet-driver", label: "Driver", icon: null },
        {
          id: "incentive-management",
          label: "Incentive Management",
          icon: null,
        },
      ],
    },

    {
      id: "coin-system",
      label: "Coin System",
      icon: <CircleDollarSign className="w-5 h-5" />,
    },

    {
      id: "quiz",
      label: "Quiz",
      icon: <HelpCircle className="w-5 h-5" />,
      children: [
        { id: "quiz-create-edit", label: "Create/Edit", icon: null },
        { id: "quiz-track-drivers", label: "Track Drivers", icon: null },
      ],
    },

    {
      id: "advertisement",
      label: "Advertisement",
      icon: <Tv className="w-5 h-5" />,
    },

    {
      id: "platform-fee",
      label: "Platform fee",
      icon: <Tag className="w-5 h-5" />,
    },

    {
      id: "content-management",
      label: "Content Management",
      icon: <FileText className="w-5 h-5" />,
      
    },

    {
      id: "driver-order-competition",
      label: "Driver Order Competition",
      icon: <Users className="w-5 h-5" />,
    },

    {
      id: "customer-order-confirmation",
      label: "Customer Order Confirmation",
      icon: <CheckCircle className="w-5 h-5" />,
    },

    {
      id: "order-placement",
      label: "Order Placement",
      icon: <LayoutGrid className="w-5 h-5" />,
      children: [
        { id: "order", label: "Order", icon: null },
        { id: "live-order-tracking", label: "Live Order Tracking", icon: null },
        { id: "order-history", label: "Order History", icon: null },
        { id: "payment-options", label: "Payment Options", icon: null },
      ],
    },
  ];