import React, { useState } from 'react';
import { ChevronLeft, FileText, File, Link, DollarSign, Briefcase, CheckSquare, ChevronDown } from 'lucide-react';

interface DocumentTypesInterfaceProps {
  onBack: () => void;
  vendorName: string;
  folderId: string;
}

const DocumentTypesInterface: React.FC<DocumentTypesInterfaceProps> = ({ 
  onBack, 
  vendorName,
  folderId 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [isFinancialExpanded, setIsFinancialExpanded] = useState(true);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);

  // Mock data for demonstration
  const actionDetails = {
    actionType: 'Purchase',
    actionId: 'ACT-001',
    orderId: 'ORD-5892',
    modId: 'MOD-21',
    state: 'CA',
    status: 'Completed',
    receipt: 'Yes',
    goals: 'Cost reduction',
    title: 'Contract Title',
    committed: '$0.00',
    budgeted: '$0.00',
    totalCost: '$0.00'
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm flex flex-col">
      {/* Header Labels */}
      <div className="bg-[#EBF5FF] px-4 py-2 grid grid-cols-8 gap-4 text-sm text-gray-600">
        <div>Action Type</div>
        <div>Action ID</div>
        <div>Order #</div>
        <div>Mod #</div>
        <div>State</div>
        <div>Status</div>
        <div>Receipt</div>
        <div>Goals</div>
      </div>

      {/* Action Type Header */}
      <div 
        className="bg-[#EBF5FF] px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#E2F0FF]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <ChevronDown 
            size={20} 
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
          <span className="font-medium">Purchase</span>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          {/* Action Details Grid */}
          <div className="px-4 py-2 grid grid-cols-8 gap-4 items-center text-sm border-b border-gray-200">
            <div>{actionDetails.actionType}</div>
            <div className="text-blue-600">{actionDetails.actionId}</div>
            <div>{actionDetails.orderId}</div>
            <div>{actionDetails.modId}</div>
            <div>{actionDetails.state}</div>
            <div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {actionDetails.status}
              </span>
            </div>
            <div>{actionDetails.receipt}</div>
            <div>{actionDetails.goals}</div>
          </div>

          {/* Title Section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="mb-2">
              <label className="text-sm text-gray-600">Title:</label>
              <span className="ml-2">{actionDetails.title}</span>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <label className="text-sm text-gray-600">Committed:</label>
                <span className="ml-2 font-medium">{actionDetails.committed}</span>
              </div>
              <div>
                <label className="text-sm text-gray-600">Budgeted:</label>
                <span className="ml-2 font-medium">{actionDetails.budgeted}</span>
              </div>
              <div>
                <label className="text-sm text-gray-600">Total Cost:</label>
                <span className="ml-2 font-medium">{actionDetails.totalCost}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 border-b border-gray-200">
            <div className="flex space-x-1">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => {
                  setActiveTab('overview');
                  setIsOverviewExpanded(!isOverviewExpanded);
                }}
                icon={<FileText size={16} />}
                label="Overview"
                isOverviewTab={true}
                isOverviewExpanded={isOverviewExpanded}
              />
              <TabButton
                active={activeTab === 'dataValues'}
                onClick={() => setActiveTab('dataValues')}
                icon={<File size={16} />}
                label="Data Values"
              />
              <TabButton
                active={activeTab === 'connectedActions'}
                onClick={() => setActiveTab('connectedActions')}
                icon={<Link size={16} />}
                label="Connected Actions (0)"
              />
              <TabButton
                active={activeTab === 'funding'}
                onClick={() => setActiveTab('funding')}
                icon={<DollarSign size={16} />}
                label="Funding (0)"
              />
              <TabButton
                active={activeTab === 'items'}
                onClick={() => setActiveTab('items')}
                icon={<File size={16} />}
                label="Items (0)"
              />
              <TabButton
                active={activeTab === 'briefcase'}
                onClick={() => setActiveTab('briefcase')}
                icon={<Briefcase size={16} />}
                label="Briefcase (0)"
              />
              <TabButton
                active={activeTab === 'documents'}
                onClick={() => setActiveTab('documents')}
                icon={<File size={16} />}
                label="Documents (0)"
              />
              <TabButton
                active={activeTab === 'milestones'}
                onClick={() => setActiveTab('milestones')}
                icon={<CheckSquare size={16} />}
                label="Milestones"
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6 p-6">
                {/* General Information Section */}
                <div className={`bg-gray-50 rounded-lg ${isOverviewExpanded ? '' : 'p-4'}`}>
                  {isOverviewExpanded && (
                    <>
                      <h3 className="text-lg font-semibold mb-4">General Information</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="block text-sm text-gray-600">Action Type</label>
                          <div className="font-medium">{actionDetails.actionType}</div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Order #</label>
                          <div className="font-medium">{actionDetails.orderId}</div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Action ID</label>
                          <div className="font-medium text-blue-600">{actionDetails.actionId}</div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Status</label>
                          <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {actionDetails.status}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Title</label>
                          <div className="font-medium">{actionDetails.title}</div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Receipt</label>
                          <div className="font-medium">{actionDetails.receipt}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Financial Information Section */}
                <div className={`bg-gray-50 rounded-lg ${isFinancialExpanded ? '' : 'p-4'}`}>
                  {isFinancialExpanded && (
                    <>
                      <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <label className="block text-sm text-gray-600">Committed</label>
                          <div className="font-medium">{actionDetails.committed}</div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Budgeted</label>
                          <div className="font-medium">{actionDetails.budgeted}</div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Total Cost</label>
                          <div className="font-medium">{actionDetails.totalCost}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Notes Section */}
                <div className={`bg-gray-50 rounded-lg ${isNotesExpanded ? '' : 'p-4'}`}>
                  {isNotesExpanded && (
                    <>
                      <h3 className="text-lg font-semibold mb-4">Notes</h3>
                      <p className="text-gray-600 italic">No notes have been added to this action.</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isOverviewTab?: boolean;
  isOverviewExpanded?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ 
  active, 
  onClick, 
  icon, 
  label,
  isOverviewTab,
  isOverviewExpanded 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 ${
      active
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    <input 
      type="checkbox" 
      checked={isOverviewTab ? isOverviewExpanded : active} 
      readOnly 
      className="h-3 w-3" 
    />
    {icon}
    <span>{label}</span>
  </button>
);

export default DocumentTypesInterface;