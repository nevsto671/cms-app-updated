import React, { useState } from 'react';
import { GripVertical, ChevronRight, ChevronDown } from 'lucide-react';

interface Industry {
  id: string;
  code: string;
  title: string;
  children?: Industry[];
  isExpanded?: boolean;
}

const initialIndustries: Industry[] = [
  {
    id: '1',
    code: '54',
    title: 'Professional, Scientific, and Technical Services',
    children: [
      {
        id: '1.1',
        code: '541',
        title: 'Professional and Technical Services',
        children: [
          {
            id: '1.1.1',
            code: '5415',
            title: 'Computer Systems Design and Related Services'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    code: '52',
    title: 'Finance and Insurance',
    children: [
      {
        id: '2.1',
        code: '523',
        title: 'Securities, Commodity Contracts, and Investments'
      }
    ]
  }
];

const RoutingTable: React.FC = () => {
  const [industries, setIndustries] = useState(initialIndustries);
  const [draggedItem, setDraggedItem] = useState<Industry | null>(null);

  const toggleExpand = (id: string) => {
    setIndustries(prevIndustries => {
      const updateIndustry = (items: Industry[]): Industry[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, isExpanded: !item.isExpanded };
          }
          if (item.children) {
            return { ...item, children: updateIndustry(item.children) };
          }
          return item;
        });
      };
      return updateIndustry(prevIndustries);
    });
  };

  const handleDragStart = (e: React.DragEvent, industry: Industry) => {
    setDraggedItem(industry);
    e.dataTransfer.setData('text/plain', industry.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.classList.contains('droppable')) {
      target.classList.add('bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove('bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    target.classList.remove('bg-blue-50');

    if (draggedItem) {
      // Here we would update the routing structure
      console.log(`Moved ${draggedItem.code} to ${targetId}`);
    }
    setDraggedItem(null);
  };

  const renderIndustry = (industry: Industry, level: number = 0) => {
    return (
      <div key={industry.id} className="border-b border-gray-100 last:border-0">
        <div 
          className={`flex items-center py-2 px-${level * 4} hover:bg-gray-50 ${level === 0 ? 'bg-gray-50' : ''}`}
          draggable={level > 0}
          onDragStart={(e) => handleDragStart(e, industry)}
        >
          <div className="w-8 flex justify-center">
            {industry.children && (
              <button onClick={() => toggleExpand(industry.id)} className="text-gray-500 hover:text-gray-700">
                {industry.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </div>
          
          {level > 0 && (
            <div className="w-8 flex justify-center cursor-move">
              <GripVertical size={16} className="text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 flex items-center gap-4">
            <span className="font-mono text-blue-600">{industry.code}</span>
            <span className="text-gray-700">{industry.title}</span>
          </div>
        </div>

        {industry.children && industry.isExpanded && (
          <div className="droppable" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, industry.id)}>
            {industry.children.map(child => renderIndustry(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">NAICS Industry Routing</h2>
        <p className="text-sm text-gray-600">Drag and drop industries to reorganize the routing structure</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {industries.map(industry => renderIndustry(industry))}
      </div>
    </div>
  );
};

export default RoutingTable;