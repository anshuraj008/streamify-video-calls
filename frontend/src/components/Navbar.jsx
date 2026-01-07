import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, MenuIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Navbar = ({ onMenuClick, showSidebar = false }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className="border-b sticky top-0 z-30 h-16 flex items-center bg-[#101831] border-[#2563EB]/30">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - ALWAYS VISIBLE IN TOP LEFT */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu - Only on mobile when sidebar should be shown */}
            {showSidebar && (
              <button
                onClick={onMenuClick}
                className="lg:hidden btn btn-ghost btn-circle"
                aria-label="Open menu"
              >
                <MenuIcon className="h-6 w-6 text-white" />
              </button>
            )}
            
            <Link to="/home" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-7 sm:size-9 text-white" />
              <span className="text-xl sm:text-3xl font-bold font-mono tracking-wider text-white">
                Streamify
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-white" />
              </button>
            </Link>
          </div>

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img 
                src={authUser?.profilePic} 
                alt="User Avatar" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'User')}&background=2563EB&color=fff&size=128`;
                }}
              />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={() => logoutMutation()}>
            <LogOutIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
