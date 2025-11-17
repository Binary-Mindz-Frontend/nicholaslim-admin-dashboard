import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import CreateRoll from "@/pages/Admin/CreateRoll/CreateRoll";
import AddRemovePermission from "@/pages/Admin/AddRemovePermission/AddRemovePermission";
import UsersApp from "@/pages/Users/UsersApp/UsersApp";
import UsersWebportal from "@/pages/Users/UsersWebportal/UsersWebportal";
import AddNewUser from "@/pages/Users/AddNewUser/AddNewUser";


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
				path: "users-web-portal",
				element: <UsersWebportal />,
			},
			{
				path: "add-new-user",
				element: <AddNewUser />,
			},


			
		],
	},
]);

export default routes;
