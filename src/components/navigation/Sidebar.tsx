import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Monitor, 
  FileText, 
  CheckSquare, 
  Clock, 
  Award, 
  GitBranch, 
  Users, 
  Database, 
  Bell, 
  Calendar,
  Bot,
  ChevronDown,
  ChevronRight,
  Hexagon,
  LayoutDashboard,
  Search,
  BarChart2,
  Folder,
  Archive,
  Tag,
  FileBox,
  Briefcase,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isClassificationOpen, setIsClassificationOpen] = useState(true);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`h-full flex flex-col bg-white text-gray-700 transition-all duration-150 ease-in-out ${isCollapsed ? 'w-14' : 'w-48'}`}>
      {/* Logo */}
      <div className="flex items-center h-16 px-3 bg-[#1c1f26] border-b border-[#2a2f3a]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Hexagon className="h-6 w-6 text-yellow-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#1c1f26] font-bold text-xs">SC</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white">Stack&Craft</span>
              <span className="text-[10px] text-gray-400">System</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="overflow-y-auto flex-1 py-2">
        <nav className="space-y-1">
          <NavItem 
            icon={<Home size={16} />} 
            title="Home" 
            onClick={() => handleNavigation('/')} 
            active={location.pathname === '/'} 
            isCollapsed={isCollapsed}
          />
          
          {!isCollapsed && (
            <>
              <button
                onClick={() => setIsDesktopOpen(!isDesktopOpen)}
                className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
              >
                <Monitor size={16} className="mr-2" />
                <span>My Desktop</span>
                <span className="ml-auto">
                  {isDesktopOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>
              
              {isDesktopOpen && (
                <div className="ml-3 border-l border-gray-200 space-y-1">
                  <NavItem icon={<Bot size={16} />} title="AI Assistant" onClick={() => {}} isCollapsed={isCollapsed} />
                  <NavItem icon={<Bell size={16} />} title="Actions" badge="76" onClick={() => {}} isCollapsed={isCollapsed} />
                  <NavItem icon={<Calendar size={16} />} title="Due" badge="0" onClick={() => {}} isCollapsed={isCollapsed} />
                  <NavItem icon={<CheckSquare size={16} />} title="Reviews" badge="5" onClick={() => {}} isCollapsed={isCollapsed} />
                  <NavItem icon={<Clock size={16} />} title="Recent" onClick={() => {}} isCollapsed={isCollapsed} />
                  <NavItem icon={<Folder size={16} />} title="My Folder" onClick={() => {}} isCollapsed={isCollapsed} />
                  <NavItem 
                    icon={<Archive size={16} />} 
                    title="File Cabinet" 
                    onClick={() => handleNavigation('/file-cabinet')} 
                    active={location.pathname === '/file-cabinet'} 
                    isCollapsed={isCollapsed}
                  />
                </div>
              )}

              <div>
                <button
                  onClick={() => setIsContractOpen(!isContractOpen)}
                  className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                >
                  <Briefcase size={16} className="mr-2" />
                  <span>Contract Administration</span>
                  <span className="ml-auto">
                    {isContractOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </button>
                {isContractOpen && (
                  <div className="ml-3 border-l border-gray-200 space-y-1">
                    <NavItem 
                      icon={<Briefcase size={16} />} 
                      title="Overview" 
                      onClick={() => handleNavigation('/contract-administration')} 
                      active={location.pathname === '/contract-administration'} 
                      isCollapsed={isCollapsed}
                    />
                    <NavItem 
                      icon={<DollarSign size={16} />} 
                      title="Price Analysis" 
                      onClick={() => handleNavigation('/price-analysis')} 
                      active={location.pathname === '/price-analysis'} 
                      isCollapsed={isCollapsed}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsClassificationOpen(!isClassificationOpen)}
                className="w-full flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
              >
                <Database size={16} className="mr-2" />
                <span>Classification</span>
                <span className="ml-auto">
                  {isClassificationOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </button>
              
              {isClassificationOpen && (
                <div className="ml-3 border-l border-gray-200 space-y-1">
                  <NavItem 
                    icon={<LayoutDashboard size={16} />} 
                    title="Dashboard" 
                    onClick={() => handleNavigation('/classification-dashboard')} 
                    active={location.pathname === '/classification-dashboard'} 
                    isCollapsed={isCollapsed}
                  />
                  <NavItem 
                    icon={<LayoutDashboard size={16} />} 
                    title="Workflow Allocator" 
                    onClick={() => handleNavigation('/workflow-allocator')} 
                    active={location.pathname === '/workflow-allocator'} 
                    isCollapsed={isCollapsed}
                  />
                  <NavItem 
                    icon={<Database size={16} />} 
                    title="NAICS" 
                    onClick={() => handleNavigation('/naics-codes')} 
                    active={location.pathname === '/naics-codes'} 
                    isCollapsed={isCollapsed}
                  />
                  <NavItem 
                    icon={<Database size={16} />} 
                    title="PSC" 
                    onClick={() => handleNavigation('/psc-codes')} 
                    active={location.pathname === '/psc-codes'} 
                    isCollapsed={isCollapsed}
                  />
                  <NavItem 
                    icon={<Database size={16} />} 
                    title="SIC" 
                    onClick={() => handleNavigation('/psc-codes/sic')} 
                    active={location.pathname === '/psc-codes/sic'} 
                    isCollapsed={isCollapsed}
                  />
                  <NavItem 
                    icon={<Database size={16} />} 
                    title="SIN" 
                    onClick={() => handleNavigation('/sin-codes')} 
                    active={location.pathname === '/sin-codes'} 
                    isCollapsed={isCollapsed}
                  />
                  <NavItem 
                    icon={<Search size={16} />} 
                    title="Catalog DB" 
                    onClick={() => handleNavigation('/catalog')} 
                    active={location.pathname === '/catalog'} 
                    isCollapsed={isCollapsed}
                  />
                  <NavItem 
                    icon={<BarChart2 size={16} />} 
                    title="MRAS" 
                    onClick={() => handleNavigation('/mras')} 
                    active={location.pathname === '/mras'} 
                    isCollapsed={isCollapsed}
                  />
                </div>
              )}
            </>
          )}
        </nav>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 text-[10px] text-gray-500 border-t border-gray-200">
          <div>v2.3.4</div>
          <div>© 2025 Stack&Craft</div>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  active?: boolean;
  onClick: () => void;
  isCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, title, badge, active, onClick, isCollapsed }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2 text-xs ${
        active 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } transition-colors duration-150 relative group`}
      title={isCollapsed ? title : undefined}
    >
      <span className={isCollapsed ? 'mx-auto' : 'mr-2'}>{icon}</span>
      {!isCollapsed && (
        <>
          <span>{title}</span>
          {badge && (
            <span className="ml-auto bg-gray-100 text-gray-700 text-[10px] py-0.5 px-1.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
      {isCollapsed && badge && (
        <span className="absolute top-0 right-0 -mr-1 -mt-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

export default Sidebar;