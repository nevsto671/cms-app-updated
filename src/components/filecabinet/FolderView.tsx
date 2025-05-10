import React, { useState } from 'react';
import ContractCategoriesInterface from './ContractCategoriesInterface';
import DocumentTypesInterface from './DocumentTypesInterface';

interface FolderViewProps {
  branchId: string;
  branchName: string;
  onBack: () => void;
}

const FolderView: React.FC<FolderViewProps> = ({ branchId, branchName, onBack }) => {
  const [selectedVendor, setSelectedVendor] = useState<{ id: string; name: string } | null>(null);

  if (selectedVendor) {
    return (
      <DocumentTypesInterface
        onBack={() => setSelectedVendor(null)}
        vendorName={selectedVendor.name}
      />
    );
  }

  return (
    <ContractCategoriesInterface
      onBack={onBack}
      onVendorSelect={(vendorId, vendorName) => setSelectedVendor({ id: vendorId, name: vendorName })}
      branchName={branchName}
    />
  );
};

export default FolderView;