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
import OrderList from "@/pages/Orders/OrderList/OrderList";
import SupportAndDisputes from "@/pages/SupportAndDisputes/SupportAndDisputes";
import ViewSupport from "@/pages/SupportAndDisputes/ViewSupport/ViewSupport";
import Payments from "@/pages/Payments/Payments";
import Livemap from "@/pages/LiveMap/LiveMap";
import Notifications from "@/pages/Notifications/Notifications";
import ContentManagementApp from "@/pages/Admin/ContentManagement/ContentManagement";
import PlatformFeeManagement from "@/pages/Admin/PlatformFeeManagement/PlatformFeeManagement";
import Advertisement from "@/pages/Admin/Advertisement/Advertisement";
import CreateOrEditQuiz from "@/pages/Admin/QuizManagement/CreateOrEditQuiz";
import Orders from "@/pages/Reports/Orders/Orders";
import DriverPerformance from "@/pages/Reports/DriverPerformance/DriverPerformance";
import CustomerReport from "@/pages/Reports/CustomerReport/CustomerReport";
import Kpis from "@/pages/Reports/Kpis/Kpis";
import Coins from "@/pages/Reports/Coins/Coins";
import Incentive from "@/pages/Reports/Incentives/Incentives";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard/>,
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
				element: <DriverList/>,
			},
			{
				path: "driver-list/:id",
				element: <EditDriverProfile />,
			},
			{
				path: "add-new-driver",
				element: <AddNewDriver/>,
			},
			{
				path: "new-join-request",
				element: <NewJoinRequest />,
			},
			{
				path: "order-list",
				element: <OrderList />,
			},
			{
				path: "support",
				element: <SupportAndDisputes/>,
			},
			{
				path: "support/view/:id",
				element: <ViewSupport />,
			},
			{
				path: "payments",
				element: <Payments />,
			},
			{
				path: "live-map",
				element: <Livemap />,
			},
			{
				path: "notifications",
				element: <Notifications />,
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
        element: <ContentManagementApp />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "driver-performance",
        element: <DriverPerformance />,
      },
      {
        path: "customer-report",
        element: <CustomerReport />,
      },
      {
        path: "kpi",
        element: <Kpis />,
      },
      {
        path: "kpi",
        element: <Kpis />,
      },
      {
        path: "coins",
        element: <Coins />,
      },
      {
        path: "incentives",
        element: <Incentive />,
      },
     
    ],
  },

]);

export default routes;
