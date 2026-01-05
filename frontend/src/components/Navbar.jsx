import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { isDarkMode } = useThemeStore();

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className={`border-b sticky top-0 z-30 h-16 flex items-center transition-colors ${
      isDarkMode 
        ? 'bg-white border-gray-300' 
        : 'bg-gray-900 border-gray-800'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/home" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className={`text-3xl font-bold font-mono tracking-wider transition-colors ${
                  isDarkMode 
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'
                    : 'text-primary'
                }`}>
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className={`h-6 w-6 transition-colors ${
                  isDarkMode ? 'text-gray-700' : 'text-gray-300'
                }`} />
              </button>
            </Link>
          </div>

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className={`h-6 w-6 transition-colors ${
              isDarkMode ? 'text-gray-700' : 'text-gray-300'
            }`} />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
