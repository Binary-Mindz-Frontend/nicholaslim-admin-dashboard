/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, X, User, Package, Bike } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import logo from "@/assets/images/logo.svg";
import { useGetOwnProfileQuery } from "@/redux/features/users/usersApi";
// import { useGetSearchbarQuery } from "@/redux/features/search/searchApi"; // Adjust the import path
import { useState, useEffect, useRef } from "react";
import { useGetSearchbarQuery } from "@/redux/features/searchbar/searchbarApi";
import { Link, useNavigate } from "react-router-dom"; // Add this import at the top

const Navbar = () => {
  const { data: user } = useGetOwnProfileQuery("");
  const userName = user?.data?.username;
  const userRole = user?.data?.role.name;
  const userImage = user?.data?.image;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Inside your component, add this hook
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch search results
  const { data: searchResults, isLoading } = useGetSearchbarQuery(
    debouncedSearchTerm,
    {
      skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2,
    }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show results when there's a search term
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setShowResults(false);
  };

  const orders = searchResults?.orders || [];
  const users = searchResults?.users || [];
  const raiders = searchResults?.raiders || [];

  const hasResults =
    orders.length > 0 || users.length > 0 || raiders.length > 0;

  return (
    <nav className="w-full hidden fixed left-0 top-0 lg:block bg-white border-b border-[#E6EFF5] z-50">
      <div className="flex items-center px-4 gap-4">
        {/* Left Section - 50% */}
        <div className="flex items-center gap-6 w-1/2">
          {/* Logo */}
          <div className="shrink-0">
            <Link to="/">
              <img src={logo} className="h-25" alt="" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg ml-24 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for users, orders, drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[600px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
                    <p className="mt-3 text-gray-600 font-medium">
                      Searching...
                    </p>
                  </div>
                ) : !hasResults ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-semibold mb-1">
                      No results found
                    </p>
                    <p className="text-sm text-gray-500">
                      Try searching with different keywords
                    </p>
                  </div>
                ) : (
                  <div className="p-3 space-y-6">
                    {/* Orders Section */}
                    {orders.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 px-2">
                          <div className="p-1.5 bg-yellow-100 rounded-lg">
                            <Package className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            Orders
                          </span>
                          <span className="ml-auto px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                            {orders.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {orders.map((order: any) => (
                            <Card
                              key={order.id}
                              onClick={() => {
                                navigate(`/order/${order.id}`);
                                setShowResults(false);
                                setSearchTerm("");
                              }}
                              className="p-4 hover:bg-linear-to-r hover:from-yellow-50 hover:to-transparent cursor-pointer transition-all duration-200 hover:shadow-md hover:border-yellow-300 group"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                      Order #{order.id}
                                    </p>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                                      {order.order_status}
                                    </span>
                                  </div>
                                  {order.total_cost && (
                                    <p className="text-sm font-semibold text-gray-700">
                                      ${parseFloat(order.total_cost).toFixed(2)}
                                    </p>
                                  )}
                                  {order.delivery_type && (
                                    <p className="text-xs text-gray-500">
                                      {order.delivery_type}
                                    </p>
                                  )}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="p-1.5 bg-yellow-100 rounded-lg">
                                    <Package className="w-4 h-4 text-yellow-600" />
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Users Section */}
                    {users.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 px-2">
                          <div className="p-1.5 bg-yellow-100 rounded-lg">
                            <User className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            Users
                          </span>
                          <span className="ml-auto px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                            {users.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {users.map((user: any) => (
                            <Card
                              key={user.id}
                              onClick={() => {
                                navigate(`/users-app/${user.id}?mode=view`);
                                setShowResults(false);
                                setSearchTerm("");
                              }}
                              className="p-4 hover:bg-linear-to-r hover:from-yellow-50 hover:to-transparent cursor-pointer transition-all duration-200 hover:shadow-md hover:border-yellow-300 group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="w-12 h-12 ring-2 ring-yellow-200 group-hover:ring-yellow-400 transition-all">
                                    <AvatarImage
                                      src={user.image}
                                      alt={user.username}
                                    />
                                    <AvatarFallback className="bg-linear-to-br from-yellow-400 to-yellow-600 text-white font-bold">
                                      {user.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.is_active && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors truncate">
                                    {user.username}
                                  </p>
                                  <p className="text-sm text-gray-600 truncate">
                                    {user.email}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                      {user.role?.name}
                                    </span>
                                  </div>
                                </div>
                                {user.phone && (
                                  <div className="text-xs text-gray-500 font-medium hidden md:block">
                                    {user.phone}
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                  
                    {/* Raiders Section */}
                    {raiders.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 px-2">
                          <div className="p-1.5 bg-yellow-100 rounded-lg">
                            <Bike className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            Raiders
                          </span>
                          <span className="ml-auto px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                            {raiders.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {raiders.map((raider: any) => {
                            const registration = raider.registrations?.[0];
                            const raiderName =
                              registration?.raider_name || "Unknown";
                            const raiderEmail =
                              registration?.email_address || "";
                            const raiderPhone =
                              registration?.contact_number || "";
                            const raiderPhoto =
                              registration?.driver_photos?.[0] || null;

                            return (
                              <Card
                                key={raider.id}
                                onClick={() => {
                                  navigate(`/join-request/${raider.id}`);
                                  setShowResults(false);
                                  setSearchTerm("");
                                }}
                                className="p-4 hover:bg-linear-to-r hover:from-yellow-50 hover:to-transparent cursor-pointer transition-all duration-200 hover:shadow-md hover:border-yellow-300 group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <Avatar className="w-12 h-12 ring-2 ring-yellow-200 group-hover:ring-yellow-400 transition-all">
                                      <AvatarImage
                                        src={raiderPhoto}
                                        alt={raiderName}
                                      />
                                      <AvatarFallback className="bg-linear-to-br from-yellow-400 to-yellow-600 text-white font-bold">
                                        {raiderName?.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    {raider.is_online && (
                                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                    {!raider.is_online &&
                                      raider.is_available && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full"></div>
                                      )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors truncate">
                                        {raiderName}
                                      </p>
                                      {raider.rank && (
                                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                                          {raider.rank}
                                        </span>
                                      )}
                                    </div>
                                    {raiderEmail && (
                                      <p className="text-sm text-gray-600 truncate">
                                        {raiderEmail}
                                      </p>
                                    )}
                                    {raiderPhone && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {raiderPhone}
                                      </p>
                                    )}
                                    {registration?.vehicle_type && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        🏍️ {registration.vehicle_brand} -{" "}
                                        {registration.vehicle_plate_number}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    {raider.raider_status && (
                                      <span
                                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                          raider.raider_status === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : raider.raider_status ===
                                              "IN_ACTIVE"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {raider.raider_status}
                                      </span>
                                    )}
                                    {raider.raider_verificationFromAdmin && (
                                      <span
                                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                          raider.raider_verificationFromAdmin ===
                                          "APPROVED"
                                            ? "bg-green-100 text-green-700"
                                            : raider.raider_verificationFromAdmin ===
                                              "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {raider.raider_verificationFromAdmin}
                                      </span>
                                    )}
                                    {raider.is_online && (
                                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                                        ONLINE
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - 50% */}
        <div className="flex items-center justify-end gap-16 w-1/2">
          {/* Profile */}
          <div className="flex items-center gap-3 px-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>

            <Avatar className="w-10 h-10 ring ring-amber-500">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
