import React, { useState, useEffect } from 'react';
import { BarChart, Activity, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SystemDashboard: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [systemHealth, setSystemHealth] = useState(98);

  useEffect(() => {
    const getActiveUsers = async () => {
      // Get users active in last 30 minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .gt('last_activity', thirtyMinutesAgo.toISOString());

      if (error) {
        console.error('Error fetching active users:', error);
        return;
      }

      setActiveUsers(data?.length || 0);
    };

    const getDocumentCount = async () => {
      const { count, error } = await supabase
        .from('doctag_documents')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching document count:', error);
        return;
      }

      setTotalDocuments(count || 0);
    };

    // Initial fetch
    getActiveUsers();
    getDocumentCount();

    // Poll for updates every minute
    const interval = setInterval(() => {
      getActiveUsers();
      getDocumentCount();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Health</h3>
            <Activity className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">{systemHealth}%</div>
          <p className="text-gray-600 text-sm mt-2">All systems operational</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Documents</h3>
            <BarChart className="text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-500">{totalDocuments.toLocaleString()}</div>
          <p className="text-gray-600 text-sm mt-2">Managed documents</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Users</h3>
            <Zap className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-500">{activeUsers}</div>
          <p className="text-gray-600 text-sm mt-2">Currently online</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Tasks</h3>
            <AlertCircle className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500">{pendingTasks}</div>
          <p className="text-gray-600 text-sm mt-2">Requires attention</p>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">User uploaded new document</p>
                <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
          <h3 className="font-medium text-blue-700">Upload Documents</h3>
          <p className="text-sm text-blue-600 mt-1">Add new files to the system</p>
        </button>

        <button className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
          <h3 className="font-medium text-green-700">Create Workflow</h3>
          <p className="text-sm text-green-600 mt-1">Design document routing</p>
        </button>

        <button className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
          <h3 className="font-medium text-purple-700">Generate Report</h3>
          <p className="text-sm text-purple-600 mt-1">View system analytics</p>
        </button>
      </div>
    </div>
  );
};

export default SystemDashboard;