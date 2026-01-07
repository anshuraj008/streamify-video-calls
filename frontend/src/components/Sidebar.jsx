import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, Sparkles, LayoutDashboard, XIcon } from "lucide-react";
import { useEffect } from "react";

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  // Close sidebar when route changes on mobile
  useEffect(() => {
    onClose();
  }, [currentPath]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 h-screen fixed lg:sticky top-0 z-50 lg:z-auto
          flex flex-col bg-[#101831] transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
          lg:flex
        `}
      >
      <div className="p-5 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <ShipWheelIcon className="size-9 text-white relative z-10 group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <span className="text-3xl font-bold font-mono text-white tracking-wider">
            Streamify
          </span>
        </Link>
        
        {/* Close button - Only visible on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden btn btn-ghost btn-circle btn-sm"
          aria-label="Close menu"
        >
          <XIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <a
          href="/"
          className="btn btn-ghost justify-start w-full gap-3 px-3 normal-case text-white hover:bg-[#1E3A8A]/50"
        >
          <LayoutDashboard className="size-5 text-white" />
          <span>Dashboard</span>
        </a>

        <Link
          to="/home"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case text-white hover:bg-[#1E3A8A]/50 ${
            currentPath === "/home" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-white" />
          <span>Home</span>
        </Link>

        <Link
          to="/new"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case text-white hover:bg-[#1E3A8A]/50 ${
            currentPath === "/new" ? "btn-active" : ""
          }`}
        >
          <Sparkles className="size-5 text-white" />
          <span>New</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case text-white hover:bg-[#1E3A8A]/50 ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-white" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
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
          <div className="flex-1">
            <p className="font-semibold text-sm text-white">{authUser?.fullName}</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="size-2 rounded-full bg-green-400 inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
};
export default Sidebar;
