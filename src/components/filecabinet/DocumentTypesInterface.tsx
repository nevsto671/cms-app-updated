import React, { useState } from 'react';
import DocumentListInterface from './DocumentListInterface';
import DocumentPreviewInterface from './DocumentPreviewInterface';

interface DocumentTypesInterfaceProps {
  onBack: () => void;
  vendorName: string;
}

const DocumentTypesInterface: React.FC<DocumentTypesInterfaceProps> = ({ onBack, vendorName }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (selectedDocument) {
    return (
      <DocumentPreviewInterface
        documentId={selectedDocument}
        onBack={() => setSelectedDocument(null)}
      />
    );
  }

  if (selectedType) {
    return (
      <DocumentListInterface
        typeName={selectedType}
        onBack={() => setSelectedType(null)}
        onDocumentSelect={setSelectedDocument}
      />
    );
  }

  return (
    <div className="h-full">
      <DocumentTypesInterface
        onBack={onBack}
        onTypeSelect={setSelectedType}
        vendorName={vendorName}
      />
    </div>
  );
};

export default DocumentTypesInterface;