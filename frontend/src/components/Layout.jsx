import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore";
import { useState } from "react";

const Layout = ({ children, showSidebar = false }) => {
  const { isDarkMode } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50' 
        : 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
    }`}>
      <div className="flex">
        {showSidebar && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}

        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} showSidebar={showSidebar} />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
