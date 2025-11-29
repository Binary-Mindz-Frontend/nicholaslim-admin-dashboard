import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import CreateRoll from "@/pages/Admin/CreateRoll/CreateRoll";
import AddRemovePermission from "@/pages/Admin/AddRemovePermission/AddRemovePermission";
import UsersApp from "@/pages/Users/UsersApp/UsersApp";
import UsersWebportal from "@/pages/Users/UsersWebportal/UsersWebportal";
import AddNewUser from "@/pages/Users/AddNewUser/AddNewUser";
import UserProfile from "@/pages/Users/UsersApp/EditProfile/UserProfile";
import DriverList from "@/pages/Drivers/DriverList/DriverList";
import AddNewDriver from "@/pages/Drivers/AddNewDriver/AddNewDriver";
import EditDriverProfile from "@/pages/Drivers/DriverList/EditDriverProfile/EditDriverProfile";
import NewJoinRequest from "@/pages/Drivers/NewJoinRequest/NewJoinRequest";
import CreateOrEditQuiz from "@/pages/Admin/QuizManagement/CreateOrEditQuiz";
import Advertisement from "@/pages/Admin/Advertisement/Advertisement";
import PlatformFeeManagement from "@/pages/Admin/PlatformFeeManagement/PlatformFeeManagement";
import ContentManagement from "@/pages/Admin/ContentManagement/ContentManagement";
import Order from "@/pages/OrderPlacement/Order/Order";
import LiveOrderTracking from "@/pages/OrderPlacement/LiveOrderTracking/LiveOrderTracking";
import OrderHistory from "@/pages/OrderPlacement/OrderHistory/OrderHistory";
import SavedOrders from "@/pages/OrderPlacement/SavedOrders/SavedOrders";
import PaymentOptions from "@/pages/OrderPlacement/PaymentOptions/PaymentOptions";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "create-edit-role",
        element: <CreateRoll />,
      },
      {
        path: "add-remove-permission",
        element: <AddRemovePermission />,
      },

      {
        path: "users-app",
        element: <UsersApp />,
      },
      {
        path: "users-app/:id",
        element: <UserProfile />,
      },
      {
        path: "users-web-portal",
        element: <UsersWebportal />,
      },
      {
        path: "add-new-user",
        element: <AddNewUser />,
      },
      {
        path: "driver-list",
        element: <DriverList />,
      },
      {
        path: "driver-list/:id",
        element: <EditDriverProfile />,
      },
      {
        path: "add-new-driver",
        element: <AddNewDriver />,
      },
      {
        path: "new-join-request",
        element: <NewJoinRequest />,
      },

      {
        path: "quiz-create-edit",
        element: <CreateOrEditQuiz />,
      },
      {
        path: "advertisement",
        element: <Advertisement />,
      },
      {
        path: "platform-fee",
        element: <PlatformFeeManagement />,
      },
      {
        path: "content-management",
        element: <ContentManagement />,
      },

      // Order Placement
      {
        path: "order",
        element: <Order/>,
      },
      {
        path: "live-order-tracking",
        element: <LiveOrderTracking/>,
      },
       {
        path: "order-history",
        element: <OrderHistory/>,
      },
      {
        path: "saved-order",
        element: <SavedOrders/>,
      },
      {
        path: "payment-options",
        element: <PaymentOptions/>,
      },
    ],
  },
]);

export default routes;
