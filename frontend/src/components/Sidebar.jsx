import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, Sparkles, LayoutDashboard } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 border-r h-screen sticky top-0 hidden lg:flex flex-col bg-[#101831] border-[#2563EB]/30">
      <div className="p-5 border-b border-[#2563EB]/30">
        <Link to="/home" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-white" />
          <span className="text-3xl font-bold font-mono text-white tracking-wider">
            Streamify
          </span>
        </Link>
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
      <div className="p-4 border-t mt-auto border-[#2563EB]/30">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
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
  );
};
export default Sidebar;
