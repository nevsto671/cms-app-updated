import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaggingConfiguration: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Tagging Configuration</h2>
      <Tabs defaultValue="tag-types">
        <TabsList className="mb-4">
          <TabsTrigger value="tag-types">Tag Types</TabsTrigger>
          <TabsTrigger value="sequence">Sequence Rules</TabsTrigger>
          <TabsTrigger value="validation">Validation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="tag-types">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Tag Types</h3>
            {/* Tag types configuration content */}
          </div>
        </TabsContent>

        <TabsContent value="sequence">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sequence Rules</h3>
            {/* Sequence rules configuration content */}
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Validation Rules</h3>
            {/* Validation rules configuration content */}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TaggingConfiguration;