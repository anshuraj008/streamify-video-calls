import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore";

const Layout = ({ children, showSidebar = false }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode 
        ? 'bg-gradient-to-br from-white via-gray-50 to-white' 
        : 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
    }`}>
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
