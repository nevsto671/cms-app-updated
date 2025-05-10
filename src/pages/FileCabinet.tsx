import React, { useState } from 'react';
import BranchSelectionInterface from '../components/filecabinet/BranchSelectionInterface';
import FolderView from '../components/filecabinet/FolderView';

const FileCabinet: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<{ id: string; name: string } | null>(null);

  const handleBranchSelect = (branchId: string, branchName: string) => {
    setSelectedBranch({ id: branchId, name: branchName });
  };

  if (selectedBranch) {
    return (
      <div className="h-full">
        <FolderView
          branchId={selectedBranch.id}
          branchName={selectedBranch.name}
          onBack={() => setSelectedBranch(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <BranchSelectionInterface onBranchSelect={handleBranchSelect} />
    </div>
  );
};

export default FileCabinet;