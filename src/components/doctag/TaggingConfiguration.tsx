import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import TagImport from './TagImport';

const TaggingConfiguration: React.FC = () => {
  const [showImport, setShowImport] = useState(false);

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
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Solicitation (S)</h4>
                <p className="text-sm text-gray-600">For solicitation and procurement request documents</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Procurement (P)</h4>
                <p className="text-sm text-gray-600">For procurement and purchasing documents</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2">Contract (C)</h4>
                <p className="text-sm text-gray-600">For contract and agreement documents</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sequence">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sequence Rules</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tag numbers are automatically assigned sequentially within each tag type.</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>• Numbers start from 1 for each tag type</li>
                <li>• Numbers are unique within each tag type</li>
                <li>• No gaps are allowed in the sequence</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Validation Rules</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li>• Tag type must be S, P, or C</li>
                <li>• Tag numbers must be between 1 and 999</li>
                <li>• Document title is required</li>
                <li>• Status must be either active or inactive</li>
              </ul>
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