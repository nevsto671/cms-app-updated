import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import TagImport from './TagImport';

const TaggingConfiguration: React.FC = () => {
  const [showImport, setShowImport] = useState(false);

  const tagTypes = [
    {
      type: 'S',
      name: 'Solicitation',
      description: 'For solicitation and procurement request documents',
      example: 'S1, S2, S3...'
    },
    {
      type: 'P', 
      name: 'Procurement',
      description: 'For procurement and purchasing documents',
      example: 'P1, P2, P3...'
    },
    {
      type: 'C',
      name: 'Contract',
      description: 'For contract and agreement documents',
      example: 'C1, C2, C3...'
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Tagging Configuration</h2>
      <Tabs defaultValue="tag-types">
        <TabsList className="mb-4">
          <TabsTrigger value="tag-types">Tag Types</TabsTrigger>
          <TabsTrigger value="sequence">Sequence Rules</TabsTrigger>
          <TabsTrigger value="validation">Validation Rules</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="tag-types">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Tag Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tagTypes.map(tag => (
                <div key={tag.type} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{tag.name} ({tag.type})</h4>
                    <span className="text-sm text-gray-500 font-mono">{tag.example}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tag.description}</p>
                  <div className="bg-gray-50 p-2 rounded text-sm">
                    <span className="font-medium">Format: </span>
                    <code className="font-mono text-blue-600">{tag.type}-[number]</code>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Tag ID Structure</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Tag IDs are automatically generated in the format: <code className="font-mono bg-blue-100 px-1 rounded">TYPE-NUMBER</code></p>
                <p>• Example: <code className="font-mono bg-blue-100 px-1 rounded">S-1</code> for first Solicitation document</p>
                <p>• Numbers are sequential within each type (1, 2, 3...)</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sequence">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sequence Rules</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">Tag numbers are automatically assigned sequentially within each tag type.</p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">Solicitation (S) Example</h4>
                  <div className="flex space-x-2 font-mono text-sm">
                    <span className="bg-blue-100 px-2 py-1 rounded">S-1</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">S-2</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">S-3</span>
                    <span className="text-gray-400">...</span>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium mb-2">Procurement (P) Example</h4>
                  <div className="flex space-x-2 font-mono text-sm">
                    <span className="bg-green-100 px-2 py-1 rounded">P-1</span>
                    <span className="bg-green-100 px-2 py-1 rounded">P-2</span>
                    <span className="bg-green-100 px-2 py-1 rounded">P-3</span>
                    <span className="text-gray-400">...</span>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium mb-2">Contract (C) Example</h4>
                  <div className="flex space-x-2 font-mono text-sm">
                    <span className="bg-purple-100 px-2 py-1 rounded">C-1</span>
                    <span className="bg-purple-100 px-2 py-1 rounded">C-2</span>
                    <span className="bg-purple-100 px-2 py-1 rounded">C-3</span>
                    <span className="text-gray-400">...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Validation Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Tag Type Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Tag type must be S, P, or C</li>
                  <li>• Each type maintains its own sequence</li>
                  <li>• Type cannot be changed after creation</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Tag Number Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Numbers must be between 1 and 999</li>
                  <li>• Numbers are assigned automatically</li>
                  <li>• No gaps allowed in sequence</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Document Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Document title is required</li>
                  <li>• Status must be active or inactive</li>
                  <li>• Created by user is tracked</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Uniqueness Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Tag IDs must be unique</li>
                  <li>• No duplicate type-number combinations</li>
                  <li>• Deleted tags cannot be reused</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="import">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Import/Export Tags</h3>
            <TagImport onComplete={() => setShowImport(false)} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TaggingConfiguration;