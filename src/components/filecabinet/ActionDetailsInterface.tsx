import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, FileText, RefreshCw, Trash2, FolderMove, BarChart2, Folder, DollarSign, FileBox, Link, Briefcase, Calendar, CheckSquare } from 'lucide-react';

interface ActionDetailsInterfaceProps {
  onBack: () => void;
  actionId?: string;
}

const ActionDetailsInterface: React.FC<ActionDetailsInterfaceProps> = ({ onBack, actionId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOverviewChecked, setIsOverviewChecked] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#1c1f26] text-white px-4 py-3 flex items-center rounded-t-lg">
        <button
          onClick={onBack}
          className="mr-3 hover:bg-[#2a2f3a] p-1 rounded transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg">File Cabinet | Office 1 | Company A | Action Type - 36-3code-offer</h1>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm">
            <FileText size={16} />
            New
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm">
            <RefreshCw size={16} />
            Replicate
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm">
            <Trash2 size={16} />
            Delete
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm">
            <FolderMove size={16} />
            Move
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm">
            <BarChart2 size={16} />
            Reports
          </button>
        </div>
      </div>

      {/* Folder Section */}
      <div className="bg-blue-50 border-b border-gray-200">
        <div className="px-4 py-2 flex items-center">
          <ChevronDown size={16} className="text-gray-600 mr-2" />
          <Folder size={16} className="text-blue-600 mr-2" />
          <span className="font-medium text-gray-900">36-3code-offer</span>
          <span className="ml-4 text-sm text-green-600">New folder created</span>
        </div>
      </div>

      {/* Contract Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-600">Title:</span>
            <span className="ml-2 font-medium">Contract Title</span>
          </div>
          <div className="flex gap-6">
            <div>
              <span className="text-gray-600">Committed:</span>
              <span className="ml-2 font-medium">$0.00</span>
            </div>
            <div>
              <span className="text-gray-600">Budgeted:</span>
              <span className="ml-2 font-medium">$0.00</span>
            </div>
            <div>
              <span className="text-gray-600">Total Cost:</span>
              <span className="ml-2 font-medium">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex justify-between">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-r border-gray-200 flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-white border-b-2 border-blue-500' : 'hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={isOverviewChecked}
              onChange={(e) => setIsOverviewChecked(e.target.checked)}
              className="rounded border-gray-300"
            />
            Overview
          </button>
          <TabButton icon={FileBox} label="Data Values" count={0} isActive={activeTab === 'data'} onClick={() => setActiveTab('data')} />
          <TabButton icon={Link} label="Connected Actions" count={0} isActive={activeTab === 'connected'} onClick={() => setActiveTab('connected')} />
          <TabButton icon={DollarSign} label="Funding" count={0} isActive={activeTab === 'funding'} onClick={() => setActiveTab('funding')} />
          <TabButton icon={FileText} label="Items" count={0} isActive={activeTab === 'items'} onClick={() => setActiveTab('items')} />
          <TabButton icon={Briefcase} label="Briefcase" count={0} isActive={activeTab === 'briefcase'} onClick={() => setActiveTab('briefcase')} />
          <TabButton icon={FileText} label="Documents" count={0} isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
          <TabButton icon={Calendar} label="Milestones" isActive={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')} />
        </div>
        <div className="flex border-l border-gray-200">
          <button className="px-2 py-1 hover:bg-gray-50 border-r border-gray-200">
            <ChevronUp size={16} />
          </button>
          <button className="px-2 py-1 hover:bg-gray-50">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="flex-1 overflow-auto bg-gray-50 p-4 space-y-4">
          <Section title="General Information">
            <InfoRow label="Action Type" value="Purchase" />
            <InfoRow label="Action ID" value="ACT-001" valueClassName="text-blue-600" />
            <InfoRow label="Title" value="Contract Title" />
            <InfoRow label="Order #" value="ORD-5892" />
            <InfoRow label="Status" value="Completed" valueClassName="text-green-600" />
            <InfoRow label="Receipt" value="Yes" />
          </Section>

          <Section title="Financial Information">
            <InfoRow label="Committed" value="$0.00" />
            <InfoRow label="Budgeted" value="$0.00" />
            <InfoRow label="Total Cost" value="$0.00" />
          </Section>

          <Section title="Notes">
            <div className="p-4 text-gray-600 italic">
              No notes have been added to this action.
            </div>
          </Section>
        </div>
      )}
    </div>
  );
};

interface TabButtonProps {
  icon?: React.FC<{ size?: number }>;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 border-r border-gray-200 flex items-center gap-2 whitespace-nowrap ${
      isActive ? 'bg-white border-b-2 border-blue-500' : 'hover:bg-gray-50'
    }`}
  >
    {Icon && <Icon size={16} />}
    {label}
    {count !== undefined && ` (${count})`}
  </button>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <div className="px-4 py-2 border-b border-gray-200 font-medium text-gray-800">
      {title}
    </div>
    <div className="divide-y divide-gray-100">
      {children}
    </div>
  </div>
);

interface InfoRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueClassName = '' }) => (
  <div className="px-4 py-3 flex">
    <div className="w-32 text-gray-600">{label}</div>
    <div className={valueClassName}>{value}</div>
  </div>
);

export default ActionDetailsInterface;