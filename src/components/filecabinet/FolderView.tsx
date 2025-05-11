import React, { useState } from 'react';
import ActionDetailsInterface from './ActionDetailsInterface';
import ContractCategoriesInterface from './ContractCategoriesInterface';

interface FolderViewProps {
  branchId: string;
  branchName: string;
  onBack: () => void;
}

const FolderView: React.FC<FolderViewProps> = ({ branchId, branchName, onBack }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  if (selectedAction) {
    return (
      <ActionDetailsInterface
        actionId={selectedAction}
        onBack={() => setSelectedAction(null)}
      />
    );
  }

  if (selectedVendor) {
    return (
      <ContractCategoriesInterface
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