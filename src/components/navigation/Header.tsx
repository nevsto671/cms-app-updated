import React from 'react';
import { Search, Settings, Menu, HelpCircle, LogOut, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  isLocked: boolean;
  isHolding: boolean;
  onUnlock: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  sidebarOpen, 
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  isLocked,
  isHolding,
  onUnlock
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // First clear local storage
      const STORAGE_KEY = 'sb-auth';
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(`${STORAGE_KEY}-event-queue`);
      window.localStorage.removeItem(`${STORAGE_KEY}-token`);

      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Error during Supabase signout:', error);
        // Continue with navigation even if server signout fails
      }

      // Always navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Ensure we still navigate to login even if there's an error
      navigate('/login');
    }
  };

  return (
    <header className="bg-[#1c1f26] border-b border-[#2a2f3a] z-30">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white focus:outline-none lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 lg:ml-0 flex items-center">
            {isLocked ? (
              <button
                onClick={onUnlock}
                className="text-gray-400 hover:text-white focus:outline-none hidden lg:flex items-center mr-2 z-50 relative group cursor-pointer"
                title="Click to unlock sidebar"
              >
                <div className="flex items-center">
                  <Menu size={20} />
                </div>
              </button>
            ) : (
              <button
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white focus:outline-none hidden lg:flex items-center mr-2 z-50 relative group cursor-pointer"
                title="Hold to lock sidebar"
              >
                <div className="flex items-center">
                  <Menu size={20}/>
                </div>
                {isHolding && (
                  <div className="absolute left-0 top-0 w-full h-full">
                    <div className="absolute left-0 top-0 w-full h-full bg-blue-500 opacity-20 rounded transition-all duration-1000 animate-pulse" />
                  </div>
                )}
              </button>
            )}
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">
              Home
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Action Lookup..."
              className="bg-[#2a2f3a] border-0 pl-4 pr-10 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-light focus:bg-[#353b47] text-white placeholder-gray-400 transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>

          <button className="text-gray-400 hover:text-white p-1">
            <HelpCircle size={20} />
          </button>

          <button className="text-gray-400 hover:text-white p-1">
            <Info size={20} />
          </button>

          <button className="text-gray-400 hover:text-white p-1">
            <Settings size={20} />
          </button>

          <div className="border-l border-[#2a2f3a] h-6 mx-2"></div>

          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white p-1 transition-colors duration-200"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;