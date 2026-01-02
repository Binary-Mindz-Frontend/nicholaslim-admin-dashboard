import { Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/images/logo.svg";
import { useGetOwnProfileQuery } from "@/redux/features/users/usersApi";

const Navbar = () => {
  const { data: user } = useGetOwnProfileQuery("");
  const userName = user?.data?.username;
  const userRole = user?.data?.role.name;
  const userImage = user?.data?.image;

  return (
    <nav className="w-full hidden fixed left-0 top-0 lg:block bg-white border-b border-[#E6EFF5] z-1000">
      <div className="flex items-center px-4 gap-4">
        {/* Left Section - 50% */}
        <div className="flex  items-center gap-6 w-1/2">
          {/* Logo */}
          <div className="shrink-0">
            <img src={logo} className="h-25" alt="" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg ml-24">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for users, orders, drivers..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Right Section - 50% */}
        <div className="flex items-center justify-end gap-16 w-1/2">
          {/* Notification Bell */}
          {/* <button className="relative text-gray-600 hover:text-gray-900 transition">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button> */}

          {/* Mail */}
          {/* <button className="text-gray-600 hover:text-gray-900 transition">
            <Mail className="w-6 h-6" />
          </button> */}

          {/* Profile */}
          <div className="flex items-center gap-3 px-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>

            <Avatar className="w-10 h-10 ring ring-amber-500">
              <AvatarImage
                src={userImage}
                alt={userName}
              />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
