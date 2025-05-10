import React from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import StatBox from '../components/dashboard/StatBox';
import QuickAction from '../components/dashboard/QuickAction';
import { BarChart3, Users, ClipboardCheck, Calendar, FileCheck, UserCog, LayoutDashboard, Cog, FileText, RefreshCw, FolderSync as Sync, Trash2, Bot, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-2">
      {/* Welcome Section */}
      <div className="bg-primary text-white p-3 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">Welcome, main</h2>
        <p className="text-sm opacity-80 mt-0.5">Last login: 5/7/2025 2:43:44 PM</p>
        
        <div className="flex mt-2 space-x-4">
          <div className="flex items-center">
            <span className="bg-white/90 text-primary rounded-full px-2 py-0.5 text-xs font-medium mr-2">76</span>
            <span className="text-sm">Incoming</span>
          </div>
          <div className="flex items-center">
            <span className="bg-white/90 text-primary rounded-full px-2 py-0.5 text-xs font-medium mr-2">0</span>
            <span className="text-sm">Due</span>
          </div>
          <div className="flex items-center">
            <span className="bg-white/90 text-primary rounded-full px-2 py-0.5 text-xs font-medium mr-2">5</span>
            <span className="text-sm">Reviews</span>
          </div>
        </div>
      </div>

      {/* Central Administration Dashboard */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Central Administration Dashboard</h2>
          <div className="flex space-x-1">
            <button className="p-1 text-gray-500 hover:text-primary transition-colors rounded-md hover:bg-gray-50">
              <RefreshCw size={16} />
            </button>
            <button className="p-1 text-gray-500 hover:text-primary transition-colors rounded-md hover:bg-gray-50">
              <Cog size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
          <MetricCard
            title="Total Active Contracts"
            value="126"
            trend="+12% from last month"
            icon={<FileCheck className="h-5 w-5" />}
            iconBg="primary"
            trendPositive={true}
          />

          <MetricCard
            title="Pending Approvals"
            value="8"
            trend="3 new today"
            icon={<ClipboardCheck className="h-5 w-5" />}
            iconBg="warning"
            trendPositive={false}
          />

          <MetricCard
            title="Expiring within 30 days"
            value="12"
            trend="5 from last week"
            icon={<Calendar className="h-5 w-5" />}
            iconBg="danger"
            trendPositive={false}
          />

          <MetricCard
            title="System Health"
            value="98%"
            trend="+2% improvement"
            icon={<BarChart3 className="h-5 w-5" />}
            iconBg="success"
            trendPositive={true}
          />
        </div>
      </div>

      {/* User Administration Overview */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">User Administration Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          <StatBox
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Total Users"
            value="248"
          />

          <StatBox
            icon={<UserCog className="h-5 w-5 text-primary" />}
            label="Active Admins"
            value="12"
          />

          <StatBox
            icon={<Users className="h-5 w-5 text-primary" />}
            label="New Users (Last 30 days)"
            value="27"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          <button className="flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Cog className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">Manage Admin Groups</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">Configure Permissions</span>
          </button>

          <button className="flex items-center justify-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">View Documentation</span>
          </button>
        </div>
      </div>

      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <MetricCard
          title="Active Workflows"
          value="14"
          trend="3 running now"
          icon={<LayoutDashboard className="h-5 w-5" />}
          iconBg="primary"
        />

        <MetricCard
          title="Workflow Success Rate"
          value="94%"
          trend="+2% improvement"
          icon={<BarChart3 className="h-5 w-5" />}
          iconBg="success"
          trendPositive={true}
        />

        <MetricCard
          title="AI Tasks Queue"
          value="7"
          trend="5 completed today"
          icon={<Bot className="h-5 w-5" />}
          iconBg="accent"
        />

        <MetricCard
          title="AI Processing Time (avg)"
          value="1.2m"
          trend="10% faster than last week"
          icon={<Clock className="h-5 w-5" />}
          iconBg="accent"
          trendPositive={true}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
          <QuickAction
            icon={<BarChart3 size={16} />}
            title="Run Health Check"
            description="Verify system health status"
            variant="primary"
          />

          <QuickAction
            icon={<Sync size={16} />}
            title="Sync Workflows"
            description="Update workflows with latest templates"
            variant="success"
          />

          <QuickAction
            icon={<Trash2 size={16} />}
            title="Clear AI Cache"
            description="Reset AI processing memory"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;