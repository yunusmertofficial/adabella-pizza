"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BranchCard } from "./branch-card";
import { Branch } from "@/types/delivery-method-selector";

interface BranchListProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onBranchSelect: (branch: Branch) => void;
  onBack: () => void;
}

export function BranchList({
  branches,
  selectedBranch,
  onBranchSelect,
  onBack,
}: BranchListProps) {
  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" className="mb-4 p-0 h-auto" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Haritaya Dön
      </Button>

      <div className="space-y-3">
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            isSelected={selectedBranch?.id === branch.id}
            onSelect={() => onBranchSelect(branch)}
          />
        ))}
      </div>
    </div>
  );
}
