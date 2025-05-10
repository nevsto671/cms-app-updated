import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import SystemDashboard from '../components/doctag/SystemDashboard';
import DocumentManagement from '../components/doctag/DocumentManagement';
import UserAdministration from '../components/doctag/UserAdministration';
import TaggingConfiguration from '../components/doctag/TaggingConfiguration';
import SystemSettings from '../components/doctag/SystemSettings';
import WorkflowDesigner from '../components/doctag/WorkflowDesigner';
import ReportsAnalytics from '../components/doctag/ReportsAnalytics';
import AuditCompliance from '../components/doctag/AuditCompliance';

const DocTagCentral: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', label: 'System Dashboard', component: SystemDashboard },
    { id: 'documents', label: 'Document Management', component: DocumentManagement },
    { id: 'users', label: 'User Administration', component: UserAdministration },
    { id: 'tagging', label: 'Tagging Configuration', component: TaggingConfiguration },
    { id: 'settings', label: 'System Settings', component: SystemSettings },
    { id: 'workflows', label: 'Workflow Designer', component: WorkflowDesigner },
    { id: 'reports', label: 'Reports & Analytics', component: ReportsAnalytics },
    { id: 'audit', label: 'Audit & Compliance', component: AuditCompliance }
  ];

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || SystemDashboard;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">DocTag Central</h1>
        <p className="text-gray-600">Comprehensive document management and tagging system</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 p-4 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default DocTagCentral;