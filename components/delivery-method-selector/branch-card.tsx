"use client";

import { Branch } from "@/types/delivery-method-selector";
import { Clock } from "lucide-react";

interface BranchCardProps {
  branch: Branch;
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}

export function BranchCard({
  branch,
  isSelected,
  onSelect,
  compact = false,
}: BranchCardProps) {
  if (compact) {
    return (
      <div
        className={`flex-shrink-0 w-64 p-3 border rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {branch.name}
          </h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded flex-shrink-0">
            {branch.distance?.toFixed(1)} KM
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {branch.address}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-600">{branch.workingHours}</span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
              branch.isOpen
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {branch.isOpen ? "AÇIK" : "KAPALI"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-gray-900">{branch.name}</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {branch.distance?.toFixed(1)} KM
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Çalışma Saati: {branch.workingHours}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              branch.isOpen
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {branch.isOpen ? "AÇIK" : "KAPALI"}
          </span>
        </div>
      </div>
    </div>
  );
}
