import { createBrowserRouter, Outlet } from "react-router-dom";
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
import SingleUserWalletDetils from "@/pages/Dashboard/Wallets/userWalletHistory/SingleUserWalletHistory";
import DriverWallet from "@/pages/Dashboard/Wallets/driverWallet/DriverWallet";
// import DriverWalletDetails from "@/pages/Dashboard/Wallets/driverWallet/DriverWalletDetails/DriverWalletDetails";
import IncentiveManagementPage from "@/pages/Dashboard/Wallets/IncentinveManagement/IncentinveManagement";
import CoinPage from "@/pages/Dashboard/coins/CoinPage";
import Advertisement from "@/pages/Admin/Advertisement/Advertisement";
import CreateOrEditQuiz from "@/pages/Admin/QuizManagement/CreateOrEditQuiz";
import PaymentOptionsPage from "@/pages/Orders/PaymentOptions/PaymentOptionsPage";
import DriverOrderCompetition from "@/pages/Admin/DriverOrder/DriverOrder";
import CustomerOrderConfirmation from "@/pages/Admin/CustomerOrder/CustomerOrderConfirmation";
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
// import PaymentOptions from "@/pages/OrderPlacement/PaymentOptions/PaymentOptions";
import OrderConfirmed from "@/pages/OrderConfirmed/OrderConfirmed";
import Login from "@/pages/Login/Login";
import Quiz from "@/pages/Admin/QuizManagement/Quiz";
// import AdminRoute from "./AdminRoute";
import ForgotPassword from "@/pages/ForgotPassword/ForgotPassword";
import VerifyOtp from "@/pages/VerifyOtp/VerifyOtp";
import ResetPassword from "@/pages/ResetPassword/ResetPassword";
import ViewDriverProfile from "@/pages/Drivers/NewJoinRequest/ViewDriverProfile/ViewDriverProfile";
import FavouriteDriversPage from "@/pages/Users/UsersApp/FavouriteDrivers/FavouriteDriversPage";
import OrderHistoryPage from "@/pages/Users/UsersApp/OrderHistory/OrderHistoryPage";
import DriverWalletDetailsTable from "@/pages/Dashboard/Wallets/driverWalletHistory/DriverWalletHistoryTable";
import ViewTrackOrder from "@/pages/Orders/ViewTrackOrder/ViewTrackOrder";
import DriverListTrack from "@/pages/Orders/ViewTrackOrder/components/Driver/DriverList";
import ViewLiveTrackOrder from "@/pages/OrderPlacement/LiveOrderTracking/ViewLiveTrackOrder/ViewLiveTrackOrder";
import OrderHistory from "@/pages/OrderPlacement/OrderHistory/OrderHistory";
import StripeWrapper from "@/pages/Orders/PaymentOptions/StripeWrapper";
import DashboardLayoutWrapper from "@/Layouts/DashboardLayoutWrapper";
import CustomizeProfile from "@/components/Users/Profile/CustomizeProfile";
import ChangePassword from "@/components/Users/Profile/ChangePassword";
import DashboardPopup from "@/pages/Admin/AdditionalServices/DashboardPopup";
import AdditionalService from "@/pages/Admin/AdditionalServices/AdditionalService";
import ContactInfo from "@/pages/Admin/AdditionalServices/ContactInfo";
import PromoCode from "@/pages/Admin/AdditionalServices/PromoCode";
import DashboardChat from "@/pages/Admin/AdditionalServices/DashboardChat";
import NotFound404 from "@/pages/NotFound404/NotFound404";
import SurgePricingRole from "@/pages/SurgePricingRole/SurgePricingRole";
import CreateNotification from "@/pages/CreateNotification/CreateNotification";
import CreateNotificationPromotion from "@/pages/CreateNotificationPromotion/CreateNotificationPromotion";
import NotificationList from "@/pages/NotificationList/NotificationList";
import NotificationPromotionList from "@/pages/NotificationPromotionList/NotificationPromotionList";
import NotificationLogHistory from "@/pages/NotificationLogHistory/NotificationLogHistory";
import DriverTierRole from "@/pages/DriverTierRole/DriverTierRole";
import TitleUpdater from "@/components/Shared/TitleUpdater";
import PaymentCancel from "@/pages/PaymentCancel/PaymentCancel";
import PaymentSuccess from "@/pages/PaymentSuccess/PaymentSuccess";
import UserWalletAdmin from "@/pages/Dashboard/Wallets/userWalletAdmin/UserWalletAdmin";
import DriverWalletAdmin from "@/pages/Dashboard/Wallets/driverWalletAdmin/DriverWalletAdmin";
import GlobalErrorBoundary from "@/components/Shared/GlobalErrorBoundary";
import ETaAndStatusAlerts from "@/pages/ETaAndStatusAlerts/ETaAndStatusAlerts";
import AutomatedAlertRule from "@/pages/AutomatedAlertRule/AutomatedAlertRule";

const RootLayout = () => (
  <>
    <TitleUpdater />
    <Outlet />
  </>
);

const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: "/",
        element: <DashboardLayoutWrapper />,
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
            path: "customize-profile",
            element: <CustomizeProfile />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
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
            path: "join-request/:id",
            element: <ViewDriverProfile />,
          },
          {
            path: "raider-details/:id",
            element: <ViewDriverProfile />,
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
            path: "quiz-create-edit/:id",
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
          // {
          //   path: "content-management-user",
          //   element: <ContentManagementApp />,
          // },
          // {
          //   path: "content-management-driver",
          //   element: <ContentManagementApp />,
          // },
          {
            path: "content-management",
            element: <ContentManagementApp />,
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
            element: <DriverWalletDetailsTable />,
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
          // {
          //   path: "payment-options",
          //   element: <PaymentOptions />,
          // },
          {
            path: "order-confirm",
            element: <OrderConfirmed />,
          },
          {
            path: "favourite-drivers/:id",
            element: <FavouriteDriversPage />,
          },
          {
            path: "order-history/:id",
            element: <OrderHistoryPage />,
          },
          {
            path: "order/:id",
            element: <ViewTrackOrder />,
          },
          {
            path: "assign-driver/:id",
            element: <DriverListTrack />,
          },
          {
            path: "live-order-tracking/:id",
            element: <ViewLiveTrackOrder />,
          },
          {
            path: "add-funds",
            element: <StripeWrapper />,
          },
          {
            path: "additional-service",
            element: <AdditionalService />,
          },
          {
            path: "dashboard-popup",
            element: <DashboardPopup />,
          },
          {
            path: "contactinfo",
            element: <ContactInfo />,
          },
          {
            path: "promocode",
            element: <PromoCode />,
          },
          {
            path: "dashboard-chat",
            element: <DashboardChat />,
          },
          {
            path: "surge-pricing-role",
            element: <SurgePricingRole />,
          },
          {
            path: "notification_management",
            element: <Notifications />,
          },
          {
            path: "create-notification",
            element: <CreateNotification />,
          },
          {
            path: "create-notification-promotion",
            element: <CreateNotificationPromotion />,
          },
          {
            path: "notification-list",
            element: <NotificationList />,
          },
          {
            path: "notification-promotion-list",
            element: <NotificationPromotionList />,
          },
          {
            path: "notification-log-history",
            element: <NotificationLogHistory />,
          },
          {
            path: "driver_tier_role",
            element: <DriverTierRole />,
          },
          {
            path: "user-wallets-admin",
            element: <UserWalletAdmin />,
          },
          {
            path: "driver-wallets-admin",
            element: <DriverWalletAdmin />,
          },
          {
            path: "eta_and_status_alerts",
            element: <ETaAndStatusAlerts />
          },
          {
            path: "automated_alert_rule",
            element: <AutomatedAlertRule />
          }
        ],
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <NotFound404 />,
      },
      {
        path: "/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/cancel",
        element: <PaymentCancel />,
      },
    ],
  },
]);

export default routes;
