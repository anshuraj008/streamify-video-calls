import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, Sparkles } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isDarkMode } = useThemeStore();

  return (
    <aside className={`w-64 border-r h-screen sticky top-0 transition-colors hidden lg:flex flex-col ${
      isDarkMode 
        ? 'bg-white border-gray-300' 
        : 'bg-gray-900 border-gray-800'
    }`}>
      <div className={`p-5 border-b transition-colors ${
        isDarkMode ? 'border-gray-300' : 'border-gray-800'
      }`}>
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            Streamify
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          } ${isDarkMode ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-100 hover:bg-gray-800'}`}
        >
          <HomeIcon className={`size-5 opacity-70 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
          <span>Home</span>
        </Link>

        <Link
          to="/new"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/new" ? "btn-active" : ""
          } ${isDarkMode ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-100 hover:bg-gray-800'}`}
        >
          <Sparkles className={`size-5 opacity-70 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
          <span>New</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          } ${isDarkMode ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-100 hover:bg-gray-800'}`}
        >
          <BellIcon className={`size-5 opacity-70 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className={`p-4 border-t mt-auto transition-colors ${
        isDarkMode ? 'border-gray-300' : 'border-gray-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-sm transition-colors ${
              isDarkMode ? 'text-gray-900' : 'text-gray-200'
            }`}>{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
