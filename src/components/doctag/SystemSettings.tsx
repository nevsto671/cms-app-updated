import React, { useState } from 'react';
import { Settings, Mail, Lock, Database, Link, Save, Bell, Shield, RefreshCw } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'storage', label: 'Storage', icon: Database },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'auth', label: 'Authentication', icon: Lock },
            { id: 'integrations', label: 'Integrations', icon: Link },
            { id: 'backup', label: 'Backup & Recovery', icon: RefreshCw },
            { id: 'security', label: 'Security', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">General Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  System Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  defaultValue="DocTag Central"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Time Zone
                </label>
                <select className="w-full border border-gray-200 rounded-lg p-2">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select className="w-full border border-gray-200 rounded-lg p-2">
                  <option>YYYY-MM-DD</option>
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Enable System Notifications</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Storage Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Provider
                </label>
                <select className="w-full border border-gray-200 rounded-lg p-2">
                  <option>Local Storage</option>
                  <option>Amazon S3</option>
                  <option>Google Cloud Storage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  defaultValue="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed File Types
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  defaultValue=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Comma-separated list of file extensions
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Email Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Server
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="smtp.example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="587"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="smtp@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="noreply@example.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;