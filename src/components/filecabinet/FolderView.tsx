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
        onBack={() => setSelectedVendor(null)}
        onVendorSelect={setSelectedVendor}
        branchName={branchName}
      />
    );
  }

  return (
    <ContractCategoriesInterface
      onBack={onBack}
      onVendorSelect={setSelectedVendor}
      branchName={branchName}
    />
  );
};

export default FolderView;