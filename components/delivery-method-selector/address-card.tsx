"use client";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/delivery-method-selector";

interface AddressCardProps {
  address: Address;
  onSelect: () => void;
  onEdit: () => void;
}

const RadioButton = ({ checked = false }) => (
  <div className="flex items-center justify-center w-5 h-5">
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        checked ? "border-blue-500" : "border-gray-300"
      }`}
    >
      {checked && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
    </div>
  </div>
);

export function AddressCard({ address, onSelect, onEdit }: AddressCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        address.isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 pr-2">
          <p className="text-sm font-medium text-gray-900 break-words">
            {address.title}
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <RadioButton checked={address.isSelected} />
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
