import React, { useState, useCallback, useRef } from 'react';
import Sidebar from './navigation/Sidebar';
import Header from './navigation/Header';
import { Bell, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [sidebarLocked, setSidebarLocked] = useState(true);
  const holdTimerRef = useRef<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    if (!sidebarLocked && !isHolding) {
      setSidebarOpen(!sidebarOpen);
    }
  }, [sidebarLocked, sidebarOpen, isHolding]);

  const handleMouseDown = useCallback(() => {
    setIsHolding(true);
    holdTimerRef.current = window.setTimeout(() => {
      setSidebarLocked(true);
      setSidebarOpen(true);
      setIsHolding(false);
    }, 1000);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
  }, []);

  const handleUnlock = useCallback(() => {
    setSidebarLocked(false);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed z-20 inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition-transform duration-150 ease-in-out ${
          sidebarOpen ? 'w-48' : 'w-14'
        }`}
      >
        <Sidebar isCollapsed={!sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header 
          toggleSidebar={handleSidebarToggle} 
          sidebarOpen={sidebarOpen}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          isLocked={sidebarLocked}
          isHolding={isHolding}
          onUnlock={handleUnlock}
        />

        {/* Notification Banner */}
        {showNotification && (
          <div className="px-4 py-2">
            <div className="bg-gray-100 text-gray-800 px-4 py-3 flex items-center justify-between rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <Bell size={16} className="text-gray-600 shrink-0" />
                <span className="text-sm">System maintenance scheduled for May 10, 2025 at 2:00 AM UTC. <a href="#" className="text-blue-600 hover:text-blue-800 underline">Learn more</a></span>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-gray-600 hover:text-gray-800 focus:outline-none shrink-0">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="px-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;