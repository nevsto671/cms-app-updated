import React, { useState } from 'react';
import ContractCategoriesInterface from './ContractCategoriesInterface';
import DocumentTypeFolders from './DocumentTypeFolders';

interface FolderViewProps {
  branchId: string;
  branchName: string;
  onBack: () => void;
}

const FolderView: React.FC<FolderViewProps> = ({ branchId, branchName, onBack }) => {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  if (selectedVendor) {
    return (
      <DocumentTypeFolders
        vendorId={selectedVendor}
        onBack={() => setSelectedVendor(null)}
      />
    );
  }

  return (
    <ContractCategoriesInterface
      onBack={onBack}
      onVendorSelect={(vendorId) => setSelectedVendor(vendorId)}
      branchName={branchName}
    />
  );
};

export default FolderView;