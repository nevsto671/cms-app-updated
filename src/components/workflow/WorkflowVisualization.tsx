import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronDown, Lock, Bot, Sparkles, MessageSquare } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  workloadPercentage: number;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

interface WorkflowStep {
  id: string;
  name: string;
  color: string;
  filters: {
    name: string;
    options: string[];
  }[];
}

interface WorkflowVisualizationProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const teams: Team[] = [
  {
    id: 't1',
    name: 'Technical Review Team',
    members: [
      { id: 'm1', name: 'John Smith', role: 'Lead Engineer', workloadPercentage: 85 },
      { id: 'm2', name: 'Sarah Johnson', role: 'Senior Developer', workloadPercentage: 75 },
      { id: 'm3', name: 'Mike Chen', role: 'Systems Analyst', workloadPercentage: 60 }
    ]
  },
  {
    id: 't2',
    name: 'Contract Management Team',
    members: [
      { id: 'm4', name: 'Lisa Brown', role: 'Contract Manager', workloadPercentage: 90 },
      { id: 'm5', name: 'David Wilson', role: 'Legal Advisor', workloadPercentage: 65 },
      { id: 'm6', name: 'Emily Davis', role: 'Compliance Officer', workloadPercentage: 70 }
    ]
  },
  {
    id: 't3',
    name: 'Quality Assurance Team',
    members: [
      { id: 'm7', name: 'Alex Turner', role: 'QA Lead', workloadPercentage: 80 },
      { id: 'm8', name: 'Rachel Green', role: 'Test Engineer', workloadPercentage: 75 },
      { id: 'm9', name: 'Tom Harris', role: 'Performance Analyst', workloadPercentage: 55 }
    ]
  }
];

const workflowSteps: WorkflowStep[] = [
  {
    id: 'office-assignment',
    name: 'Office Assignment',
    color: 'bg-green-500',
    filters: [
      {
        name: 'Office Type',
        options: [
          'Professional Services',
          'Information Technology',
          'General Supplies',
          'Transportation',
          'Facilities Management'
        ]
      },
      {
        name: 'Location',
        options: ['Headquarters', 'Regional Office', 'Field Office']
      }
    ]
  },
  {
    id: 'branch-assignment',
    name: 'Branch Assignment',
    color: 'bg-red-500',
    filters: [
      {
        name: 'Branch Type',
        options: [
          'Federal Acquisitions',
          'Defense Contracts',
          'Civilian Agencies',
          'Healthcare Services'
        ]
      },
      {
        name: 'Specialization',
        options: ['Technical', 'Administrative', 'Operations', 'Support']
      }
    ]
  },
  {
    id: 'team-assignment',
    name: 'Team Assignment',
    color: 'bg-purple-500',
    filters: [
      {
        name: 'Teams',
        options: teams.map(team => team.name)
      },
      {
        name: 'Workload Threshold',
        options: ['Under 50%', '50% - 75%', 'Over 75%']
      }
    ]
  }
];

const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = React.memo(({ 
  isExpanded, 
  onToggle 
}) => {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleStepClick = useCallback((stepId: string) => {
    setExpandedSteps(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      }
      return [...prev, stepId];
    });
    if (stepId === 'team-assignment') {
      setSelectedTeam(null);
    }
  }, []);

  const toggleFilter = useCallback((stepId: string, filterName: string, option: string) => {
    setSelectedFilters(prev => {
      const key = `${stepId}-${filterName}`;
      const currentFilters = prev[key] || [];
      const newFilters = currentFilters.includes(option)
        ? currentFilters.filter(f => f !== option)
        : [...currentFilters, option];
      
      return {
        ...prev,
        [key]: newFilters
      };
    });
  }, []);

  const getSelectedFiltersCount = useCallback((stepId: string) => {
    return Object.entries(selectedFilters)
      .filter(([key]) => key.startsWith(stepId))
      .reduce((count, [, filters]) => count + filters.length, 0);
  }, [selectedFilters]);

  const clearStepFilters = useCallback((stepId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      Object.keys(newFilters)
        .filter(key => key.startsWith(stepId))
        .forEach(key => delete newFilters[key]);
      return newFilters;
    });
  }, []);

  const getWorkloadColor = useCallback((percentage: number) => {
    if (percentage > 75) return 'text-red-600';
    if (percentage > 50) return 'text-yellow-600';
    return 'text-green-600';
  }, []);

  return (
    <div 
      className={`fixed right-0 top-0 h-screen bg-[#1c1f26] shadow-lg transition-all duration-300 z-50 ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: '400px' }}
    >
      <div className="h-full flex flex-col">
        <div className="sticky top-0 bg-[#1c1f26] z-10 p-4 border-b border-[#2a2f3a]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Workflow Steps</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-[#2a2f3a] rounded-full transition-colors"
            >
              <ChevronDown
                className={`transform transition-transform duration-300 text-gray-400 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                size={20}
              />
            </button>
          </div>

          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search filters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2a2f3a] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1c1f26]">
          <div className="p-4 space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                <button
                  onClick={() => handleStepClick(step.id)}
                  className={`w-full text-left ${step.color} text-white p-4 rounded-lg transition-colors relative group ${
                    expandedSteps.includes(step.id) ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{step.name}</span>
                      {getSelectedFiltersCount(step.id) > 0 && (
                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                          {getSelectedFiltersCount(step.id)} filters
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`transform transition-transform duration-200 ${
                        expandedSteps.includes(step.id) ? 'rotate-180' : ''
                      }`}
                      size={16}
                    />
                  </div>
                </button>

                {expandedSteps.includes(step.id) && (
                  <div className="mt-2 bg-[#2a2f3a] rounded-lg p-4 border border-[#353b47]">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-white">Filters</h3>
                      {getSelectedFiltersCount(step.id) > 0 && (
                        <button
                          onClick={() => clearStepFilters(step.id)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    
                    {step.id === 'team-assignment' ? (
                      <div className="space-y-4">
                        {teams.map(team => (
                          <div key={team.id} className="bg-[#353b47] rounded-lg p-4 border border-[#454b57]">
                            <button
                              onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
                              className="w-full text-left"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-white">{team.name}</h4>
                                <ChevronDown
                                  className={`transform transition-transform duration-200 text-gray-400 ${
                                    selectedTeam === team.id ? 'rotate-180' : ''
                                  }`}
                                  size={16}
                                />
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {team.members.length} members
                              </p>
                            </button>

                            {selectedTeam === team.id && (
                              <div className="mt-3 space-y-2">
                                {team.members.map(member => (
                                  <div key={member.id} className="flex items-center justify-between p-2 bg-[#1c1f26] rounded">
                                    <div>
                                      <p className="font-medium text-sm text-white">{member.name}</p>
                                      <p className="text-xs text-gray-400">{member.role}</p>
                                    </div>
                                    <div className={`text-sm font-medium ${getWorkloadColor(member.workloadPercentage)}`}>
                                      {member.workloadPercentage}% Workflow
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      step.filters.map(filter => (
                        <div key={filter.name} className="mb-4 last:mb-0">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">{filter.name}</h4>
                          <div className="space-y-2">
                            {filter.options.map(option => {
                              const isSelected = (selectedFilters[`${step.id}-${filter.name}`] || []).includes(option);
                              return (
                                <label
                                  key={option}
                                  className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleFilter(step.id, filter.name, option)}
                                    className="rounded border-gray-600 bg-[#353b47] text-blue-500 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-300">{option}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {index < workflowSteps.length - 1 && (
                  <div className="h-4 w-0.5 bg-[#2a2f3a] absolute left-1/2 -bottom-4 transform -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#1c1f26] border-t border-[#2a2f3a] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Total Active Filters:</span>
            <span className="text-sm font-medium text-blue-400">
              {Object.values(selectedFilters).reduce((count, filters) => count + filters.length, 0)}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedFilters({});
              setExpandedSteps([]);
            }}
            className="w-full px-4 py-2 bg-[#2a2f3a] text-gray-300 rounded-lg hover:bg-[#353b47] transition-colors text-sm"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
});

WorkflowVisualization.displayName = 'WorkflowVisualization';

export default WorkflowVisualization;