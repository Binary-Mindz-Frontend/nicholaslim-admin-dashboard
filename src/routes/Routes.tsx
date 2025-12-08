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
import VTPMserviceArea from "@/pages/Dashboard/vehicleType-PricingModel/service-area/VTPMserviceArea";
import VehicleTypes from "@/pages/Dashboard/vehicleType-PricingModel/vehicle-types/VehicleTypes";
import AddVehiclePage from "@/pages/Dashboard/vehicleType-PricingModel/vehicle-types/addVehicleTypes/AddVehiclePage";
import PolicyManagementPage from "@/pages/Dashboard/vehicleType-PricingModel/policy-management/PolicyManagement";
import SupportAndDisputes from "@/pages/SupportAndDisputes/SupportAndDisputes";
import ViewSupport from "@/pages/SupportAndDisputes/ViewSupport/ViewSupport";
import Payments from "@/pages/Payments/Payments";
import Livemap from "@/pages/LiveMap/LiveMap";
import Notifications from "@/pages/Notifications/Notifications";
import ContentManagementApp from "@/pages/Admin/ContentManagement/ContentManagement";
import PlatformFeeManagement from "@/pages/Admin/PlatformFeeManagement/PlatformFeeManagement";
import DeliveryTypesPage from "@/pages/Dashboard/vehicleType-PricingModel/types-of-delivery/TypesOfDelivery";
import UserWallet from "@/pages/Dashboard/Wallets/userWallet/UserWallet";
import SingleUserWalletDetils from "@/pages/Dashboard/Wallets/userWallet/UserWalletDetails/SingleUserWalletDetils";
import DriverWallet from "@/pages/Dashboard/Wallets/driverWallet/DriverWallet";
import DriverWalletDetails from "@/pages/Dashboard/Wallets/driverWallet/DriverWalletDetails/DriverWalletDetails";
import IncentiveManagementPage from "@/pages/Dashboard/Wallets/IncentinveManagement/IncentinveManagement";
import CoinPage from "@/pages/Dashboard/coins/CoinPage";
import Advertisement from "@/pages/Admin/Advertisement/Advertisement";
import CreateOrEditQuiz from "@/pages/Admin/QuizManagement/CreateOrEditQuiz";
import OrderTracking from "@/pages/Orders/OrderTracking/OrderTracking";
import OrderHistory from "@/pages/Orders/OrderHistory/OrderHistory";
import PaymentOptionsPage from "@/pages/Orders/PaymentOptions/PaymentOptionsPage";
import DriverOrderCompetition from "@/pages/Admin/DriverOrder/DriverOrder";
import CustomerOrderConfirmation from "@/pages/Admin/CustomerOrder/CustomerOrderConfirmation";
import UserCoinDetails from "@/pages/Dashboard/coins/_components/UserCoinDetails/UserCoinDetails";
import OrderList from "@/pages/Orders/OrderList/OrderList";
import Orders from "@/pages/Reports/Orders/Orders";
import DriverPerformance from "@/pages/Reports/DriverPerformance/DriverPerformance";
import CustomerReport from "@/pages/Reports/CustomerReport/CustomerReport";
import Kpis from "@/pages/Reports/Kpis/Kpis";
import Coins from "@/pages/Reports/Coins/Coins";
import Incentive from "@/pages/Reports/Incentives/Incentives";
import Order from "@/pages/OrderPlacement/Order/Order";
import LiveOrderTracking from "@/pages/OrderPlacement/LiveOrderTracking/LiveOrderTracking";
// import OrderHistory from "@/pages/OrderPlacement/OrderHistory/OrderHistory";
import SavedOrders from "@/pages/OrderPlacement/SavedOrders/SavedOrders";
import PaymentOptions from "@/pages/OrderPlacement/PaymentOptions/PaymentOptions";
import OrderConfirmed from "@/pages/OrderConfirmed/OrderConfirmed";
import Login from "@/pages/Login/Login";
import Quiz from "@/pages/Admin/QuizManagement/Quiz";

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
        path: "service-area",
        element: <VTPMserviceArea />,
      },
      {
        path: "vehicle-types",
        element: <VehicleTypes />,
      },
      {
        path: "types-of-delivery",
        element: <DeliveryTypesPage />,
      },
      {
        path: "vehicle-pricing-page",
        element: <AddVehiclePage />,
      },
      {
        path: "policy-management",
        element: <PolicyManagementPage />,
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
        path: "order-list",
        element: <OrderList />,
      },
      {
        path: "support",
        element: <SupportAndDisputes />,
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
  path: "quiz",
  element: <Quiz />,
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
        path: "live-order-tracking",
        element: <OrderTracking />,
      },
      {
        path: "order-history",
        element: <OrderHistory />,
      },
      {
        path: "payment-options",
        element: <PaymentOptionsPage />,
      },
      {
        path: "driver-order-competition",
        element: <DriverOrderCompetition />,
      },
      {
        path: "customer-order-confirmation",
        element: <CustomerOrderConfirmation />,
      },
      {
        path: "wallet-user",
        element: <UserWallet />,
      },
      {
        path: "wallet-user/:id",
        element: <SingleUserWalletDetils />,
      },
      {
        path: "wallet-driver",
        element: <DriverWallet />,
      },
      {
        path: "wallet-driver/:id",
        element: <DriverWalletDetails />,
      },
      {
        path: "incentive-management",
        element: <IncentiveManagementPage />,
      },
      {
        path: "coin-system",
        element: <CoinPage />,
      },
      {
        path: "coin-system/:id",
        element: <UserCoinDetails />,
      },
      {
        path: "report-orders",
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

      // Order Placement
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "live-order-tracking",
        element: <LiveOrderTracking />,
      },
      {
        path: "order-history",
        element: <OrderHistory />,
      },
      {
        path: "saved-order",
        element: <SavedOrders />,
      },
      {
        path: "payment-options",
        element: <PaymentOptions />,
      },
      {
        path: "order-confirm",
        element: <OrderConfirmed />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  }
]);

export default routes;
