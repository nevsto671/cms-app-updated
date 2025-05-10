import React from 'react';
import { Search } from 'lucide-react';

interface CodeSystem {
  name: string;
  count: number;
  lastUpdated: string;
  color: string;
}

interface CodeRelationship {
  source: string;
  sourceCode: string;
  target: string;
  targetCode: string;
  type: string;
  strength: number;
  count: number;
}

interface Activity {
  title: string;
  description: string;
  date: string;
}

const codeSystems: CodeSystem[] = [
  {
    name: 'NAICS Codes',
    count: 1057,
    lastUpdated: '2022-12-15',
    color: '#3B82F6'
  },
  {
    name: 'PSC Codes',
    count: 6324,
    lastUpdated: '2023-01-18',
    color: '#10B981'
  },
  {
    name: 'SIC Codes',
    count: 1514,
    lastUpdated: '1987-01-01',
    color: '#F97316'
  },
  {
    name: 'SIN Codes',
    count: 315,
    lastUpdated: '2021-11-30',
    color: '#8B5CF6'
  }
];

const recentActivity: Activity[] = [
  {
    title: 'PSC Codes Updated',
    description: '2,165 codes updated from latest federal data',
    date: '2023-01-18'
  },
  {
    title: 'NAICS to PSC Mappings Added',
    description: '1,248 new relationship mappings created',
    date: '2022-12-21'
  },
  {
    title: 'NAICS 2022 Version Imported',
    description: 'Complete refresh of NAICS code database',
    date: '2022-12-15'
  },
  {
    title: 'SIN Codes Updated',
    description: '315 codes refreshed from GSA data',
    date: '2021-11-30'
  }
];

const relationships: CodeRelationship[] = [
  {
    source: 'NAICS',
    sourceCode: '541512',
    target: 'PSC',
    targetCode: 'D302',
    type: 'Equivalent',
    strength: 0.95,
    count: 246
  },
  {
    source: 'NAICS',
    sourceCode: '541330',
    target: 'PSC',
    targetCode: 'R425',
    type: 'Equivalent',
    strength: 0.92,
    count: 187
  }
];

const ClassificationDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Classification Systems Dashboard</h1>
        <p className="text-gray-600">Overview of all code systems and their relationships</p>
      </div>

      {/* Code Systems Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {codeSystems.map((system) => (
          <div key={system.name} className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm text-gray-600">{system.name}</h3>
            <p className="text-3xl font-bold mt-1" style={{ color: system.color }}>
              {system.count.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {system.lastUpdated}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Relationships Visualization */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Code Relationships</h2>
          <p className="text-sm text-gray-600 mb-4">Visualizing connections between different code systems</p>
          
          <div className="h-[400px] relative">
            <svg width="100%" height="100%" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet">
              {/* NAICS Circle */}
              <g transform="translate(150,200)">
                <circle r="80" fill="#EBF5FF" stroke="#3B82F6" strokeWidth="2"/>
                <text textAnchor="middle" dy="5" fill="#3B82F6" fontSize="14" fontWeight="600">NAICS</text>
              </g>
              
              {/* PSC Circle */}
              <g transform="translate(350,200)">
                <circle r="80" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
                <text textAnchor="middle" dy="5" fill="#10B981" fontSize="14" fontWeight="600">PSC</text>
              </g>
              
              {/* SIC Circle */}
              <g transform="translate(150,320)">
                <circle r="60" fill="#FFF7ED" stroke="#F97316" strokeWidth="2"/>
                <text textAnchor="middle" dy="5" fill="#F97316" fontSize="14" fontWeight="600">SIC</text>
              </g>
              
              {/* SIN Circle */}
              <g transform="translate(350,320)">
                <circle r="40" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="2"/>
                <text textAnchor="middle" dy="5" fill="#8B5CF6" fontSize="14" fontWeight="600">SIN</text>
              </g>
              
              {/* Connection Lines */}
              <g>
                {/* NAICS to PSC */}
                <line x1="230" y1="200" x2="270" y2="200" stroke="#94A3B8" strokeWidth="2"/>
                <text x="250" y="190" textAnchor="middle" fill="#64748B" fontSize="12">12,483</text>
                
                {/* NAICS to SIC */}
                <line x1="150" y1="280" x2="150" y2="260" stroke="#94A3B8" strokeWidth="2"/>
                <text x="130" y="270" textAnchor="end" fill="#64748B" fontSize="12">2,701</text>
                
                {/* PSC to SIN */}
                <line x1="350" y1="280" x2="350" y2="260" stroke="#94A3B8" strokeWidth="2"/>
                <text x="370" y="270" textAnchor="start" fill="#64748B" fontSize="12">2,251</text>
                
                {/* SIC to SIN */}
                <line x1="210" y1="320" x2="310" y2="320" stroke="#94A3B8" strokeWidth="2"/>
                <text x="260" y="340" textAnchor="middle" fill="#64748B" fontSize="12">1,892</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Recent Activity</h2>
          <p className="text-sm text-gray-600 mb-4">Latest updates and changes to code systems</p>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Code Relationships */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Top Code Relationships</h2>
        <p className="text-sm text-gray-600 mb-4">Most frequently used code mappings</p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">SOURCE</th>
                <th className="pb-3 font-medium">TARGET</th>
                <th className="pb-3 font-medium">TYPE</th>
                <th className="pb-3 font-medium">STRENGTH</th>
                <th className="pb-3 font-medium">COUNT</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {relationships.map((rel, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600">{rel.source}</span>
                      <span className="text-gray-600">{rel.sourceCode}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-emerald-600">{rel.target}</span>
                      <span className="text-gray-600">{rel.targetCode}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{rel.type}</td>
                  <td className="py-3 text-gray-600">{rel.strength}</td>
                  <td className="py-3 text-gray-600">{rel.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassificationDashboard;