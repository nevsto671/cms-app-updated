import React, { useState } from 'react';
import { Search, Filter, Download, BarChart2, Package, Database, RefreshCw, Printer, FileText, Bot, Sparkles, MessageSquare } from 'lucide-react';

const MarketResearchAutomationSystem = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [yearRange] = useState([2000, 2024]);
  const [showReport, setShowReport] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock report data
  const reportData = {
    title: "Market Research Analysis Report",
    date: new Date().toLocaleDateString(),
    summary: "This report provides a comprehensive analysis of market research findings for the selected items.",
    sections: [
      {
        title: "Price Analysis",
        content: "Analysis of price trends and variations across different contracts and time periods."
      },
      {
        title: "Vendor Analysis",
        content: "Comparison of vendors, their performance, and market share."
      },
      {
        title: "Contract Analysis",
        content: "Analysis of contract terms, conditions, and historical performance."
      }
    ]
  };

  // Add AI assistance function
  const generateAIContent = async () => {
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setAiSuggestion("Based on the market analysis, we recommend focusing on consolidated purchasing across agencies to leverage volume discounts. Historical data shows potential savings of 15-20% through this approach.");
      setIsGenerating(false);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Mock search function
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockResults = [
        {
          itemId: 1,
          sin: "33411",
          itemNo: "A-123456",
          description: "Dell Latitude 5420 Laptop, Intel Core i7-1185G7, 16GB RAM, 512GB SSD",
          mfrName: "Dell Technologies",
          mfrItemNo: "LAT-5420-i7-16-512",
          dealerName: "GovConnection Inc.",
          dealerItemNo: "GC-DL5420-001",
          contractNo: "GS-35F-0921P",
          agencyName: "Department of Defense",
          contractName: "IT Hardware Schedule",
          price: 1249.99,
          quantity: 1,
          unitOfMeasure: "EA",
          unitPrice: 1249.99,
          awardDate: "2023-03-15",
          matchType: "Exact Match"
        },
        {
          itemId: 2,
          sin: "33411",
          itemNo: "B-789012",
          description: "Dell Latitude 5420 Laptop, Intel Core i7-1185G7, 16GB RAM, 512GB SSD",
          mfrName: "Dell Technologies",
          mfrItemNo: "LAT-5420-i7-16-512",
          dealerName: "CDW Government LLC",
          dealerItemNo: "CDWG-5852471",
          contractNo: "GS-35F-0119Y",
          agencyName: "Department of Homeland Security",
          contractName: "IT Schedule 70",
          price: 1199.99,
          quantity: 1,
          unitOfMeasure: "EA",
          unitPrice: 1199.99,
          awardDate: "2023-02-28",
          matchType: "Exact Match"
        }
      ];
      
      setSearchResults(mockResults);
      setLoading(false);
    }, 1000);
  };
  
  // Handle selection of an item
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    
    // Simulate API call for similar items
    setTimeout(() => {
      // Mock similar items
      const mockSimilarItems = [
        {
          itemId: 4,
          sin: "33411",
          itemNo: "D-456789",
          description: "Dell Latitude 5430 Laptop, Intel Core i7-1195G7, 16GB RAM, 512GB SSD",
          mfrName: "Dell Technologies",
          mfrItemNo: "LAT-5430-i7-16-512",
          dealerName: "GovConnection Inc.",
          dealerItemNo: "GC-DL5430-001",
          contractNo: "GS-35F-0921P",
          price: 1299.99,
          similarity: 0.95,
          differences: "Newer model (5430 vs 5420), Faster processor (i7-1195G7 vs i7-1185G7)"
        }
      ];
      
      setSimilarItems(mockSimilarItems);
    }, 500);
  };
  
  // Add item to comparison list
  const addToCompare = (item) => {
    if (!compareList.some(i => i.itemId === item.itemId)) {
      setCompareList([...compareList, item]);
    }
  };
  
  // Remove item from comparison list
  const removeFromCompare = (itemId) => {
    setCompareList(compareList.filter(item => item.itemId !== itemId));
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  // AI Assistant Section Component
  const aiAssistantSection = (
    <div className="border-t mt-8 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
        <button
          onClick={generateAIContent}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isGenerating 
              ? 'bg-gray-100 text-gray-400'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4" />
              Generate Insights
            </>
          )}
        </button>
      </div>

      {aiSuggestion && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h4 className="text-sm font-medium text-purple-800 mb-2">AI-Generated Insights</h4>
              <p className="text-purple-900">{aiSuggestion}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">Interactive Analysis</h4>
        </div>
        <textarea
          className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Ask the AI assistant for specific analysis or insights..."
          disabled={isGenerating}
        />
        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with search bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Market Research Automation System (MRAS)</h1>
        
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by part number, description, contract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Fields</option>
            <option value="manufacturer">Manufacturer Part #</option>
            <option value="dealer">Dealer Part #</option>
            <option value="description">Description</option>
            <option value="contract">Contract #</option>
          </select>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
        
        {/* View mode toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Database className="h-4 w-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Package className="h-4 w-4" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                viewMode === 'comparison'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              Comparison View
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                viewMode === 'analytics'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              Analytics View
            </button>
            <button
              onClick={() => setViewMode('report')}
              className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                viewMode === 'report'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              Report View
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="text-sm text-gray-600">
              Year Range: {yearRange[0]} - {yearRange[1]}
            </div>
            <button
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md border border-gray-200 text-sm flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md border border-gray-200 text-sm flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {viewMode === 'report' ? (
          <div className="w-full overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              {/* Report Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{reportData.title}</h1>
                  <p className="text-gray-600">Generated on {reportData.date}</p>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Report
                </button>
              </div>

              {/* Report Content */}
              <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
                {/* Executive Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Executive Summary</h2>
                  <p className="text-gray-600">{reportData.summary}</p>
                </div>

                {/* Report Sections */}
                <div className="space-y-8">
                  {reportData.sections.map((section, index) => (
                    <div key={index} className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3>
                      <p className="text-gray-600">{section.content}</p>
                      
                      {/* Example visualization placeholder */}
                      <div className="mt-4 h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                        Visualization {index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="border-t mt-8 pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Consider consolidating purchases across contracts for better pricing</li>
                    <li>Evaluate vendor performance metrics for future procurement decisions</li>
                    <li>Monitor price trends for optimal purchase timing</li>
                  </ul>
                </div>

                {/* AI Assistant Section */}
                {aiAssistantSection}

                {/* Print-specific styles */}
                <style type="text/css" media="print">
                  {`
                    @page {
                      margin: 2cm;
                    }
                    .no-print {
                      display: none;
                    }
                  `}
                </style>
              </div>
            </div>
          </div>
        ) : viewMode === 'comparison' ? (
          // Comparison View
          <div className="w-full overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Item Comparison ({compareList.length} items)
              </h2>
              
              <button
                onClick={() => setCompareList([])}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            </div>
            
            {compareList.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Items to Compare</h3>
                <p className="text-gray-500 mb-4">
                  Add items to your comparison list by clicking "Add to Compare" button on search results.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Attributes</th>
                      {compareList.map((item) => (
                        <th key={item.itemId} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-800 normal-case">{item.description.substring(0, 30)}...</div>
                            <div className="flex justify-between">
                              <span className="text-xs font-normal">{item.mfrItemNo}</span>
                              <button
                                onClick={() => removeFromCompare(item.itemId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Manufacturer</td>
                      {compareList.map((item) => (
                        <td key={`mfr-${item.itemId}`} className="px-4 py-3 text-sm text-gray-800">{item.mfrName}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Manufacturer Part #</td>
                      {compareList.map((item) => (
                        <td key={`mfrpart-${item.itemId}`} className="px-4 py-3 text-sm font-mono text-gray-800">{item.mfrItemNo}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">Price</td>
                      {compareList.map((item, index) => (
                        <td key={`price-${item.itemId}`} className="px-4 py-3 text-sm font-bold text-gray-800">
                          {formatCurrency(item.price)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : viewMode === 'analytics' ? (
          // Analytics View
          <div className="w-full overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Market Analytics
              </h2>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100">
                  Export Analysis
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Trends (24 Year History)</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  Price Trend Chart Visualization
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Historical price trends for selected items across 24 years of contract data.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contract Distribution by Agency</h3>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  Agency Distribution Chart
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Distribution of contracts by agency for similar items.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Left panel: search results */}
            <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Search Results ({searchResults.length})
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">No items found matching your search criteria.</p>
                  <p className="text-sm text-gray-400">Try broadening your search terms or adjusting your filters.</p>
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-4">
                  {searchResults.map((item) => (
                    <div 
                      key={item.itemId}
                      className={`border rounded-md p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedItem?.itemId === item.itemId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-gray-800">{item.description}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.matchType === 'Exact Match' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.matchType}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Manufacturer:</span>{' '}
                          <span className="text-gray-800">{item.mfrName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Mfr Part #:</span>{' '}
                          <span className="font-mono text-gray-800">{item.mfrItemNo}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dealer:</span>{' '}
                          <span className="text-gray-800">{item.dealerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dealer Part #:</span>{' '}
                          <span className="font-mono text-gray-800">{item.dealerItemNo}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-lg font-bold text-gray-800">
                          {formatCurrency(item.price)}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCompare(item);
                            }}
                            className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100"
                          >
                            + Add to Compare
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mfr Part #</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchResults.map((item) => (
                        <tr 
                          key={item.itemId}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedItem?.itemId === item.itemId ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.description.substring(0, 40)}...</div>
                            <div className="text-xs text-gray-500">{item.mfrName}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900">{item.mfrItemNo}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCompare(item);
                              }}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100"
                            >
                              + Compare
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Right panel: selected item details */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedItem ? (
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{selectedItem.description}</h2>
                    
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">SIN:</span>{' '}
                        <span className="text-gray-800">{selectedItem.sin}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Manufacturer:</span>{' '}
                        <span className="text-gray-800">{selectedItem.mfrName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Mfr Part #:</span>{' '}
                        <span className="font-mono text-gray-800">{selectedItem.mfrItemNo}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Dealer:</span>{' '}
                        <span className="text-gray-800">{selectedItem.dealerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Dealer Part #:</span>{' '}
                        <span className="font-mono text-gray-800">{selectedItem.dealerItemNo}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>{' '}
                        <span className="font-bold text-gray-800">{formatCurrency(selectedItem.price)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => addToCompare(selectedItem)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        Add to Comparison
                      </button>
                    </div>
                  </div>
                  
                  {/* Similar items section */}
                  <div className="mb-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">Similar Items ({similarItems.length})</h3>
                    
                    {similarItems.length === 0 ? (
                      <p className="text-gray-500 text-sm">No similar items found.</p>
                    ) : (
                      <div className="space-y-3">
                        {similarItems.map((item) => (
                          <div key={item.itemId} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{item.description}</h4>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">Similarity:</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                  {(item.similarity * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-2">
                              <div>
                                <span className="text-gray-500">Mfr Part #:</span>{' '}
                                <span className="font-mono text-gray-800">{item.mfrItemNo}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Price:</span>{' '}
                                <span className="font-bold text-gray-800">{formatCurrency(item.price)}</span>
                              </div>
                            </div>
                            
                            <div className="text-xs bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800 mb-2">
                              <span className="font-medium">Differences:</span> {item.differences}
                            </div>
                            
                            <div className="flex justify-end">
                              <button
                                onClick={() => addToCompare(item)}
                                className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100"
                              >
                                + Add to Compare
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md mx-auto p-6 bg-gray-50 rounded-lg">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Item Selected</h3>
                    <p className="text-gray-500 mb-4">
                      Select an item from the search results to view detailed information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketResearchAutomationSystem;