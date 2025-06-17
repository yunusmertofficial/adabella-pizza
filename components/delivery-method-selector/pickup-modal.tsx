"use client";

import { useState } from "react";
import { ArrowLeft, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapComponent } from "./map-component";
import { BranchList } from "./branch-list";
import { BranchCard } from "./branch-card";
import { AddressSuggestion, Branch } from "@/types/delivery-method-selector";
import { SearchInput } from "./search-input";

interface PickupModalProps {
  branches: Branch[];
  selectedLocation: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
  tempSelectedBranch: Branch | null;
  onBranchSelect: (branch: Branch) => void;
  onBack: () => void;
  onConfirm: (branch: Branch) => void;
}

export function PickupModal({
  branches,
  selectedLocation,
  onLocationChange,
  tempSelectedBranch,
  onBranchSelect,
  onBack,
  onConfirm,
}: PickupModalProps) {
  const [showBranchList, setShowBranchList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Calculate distance and sort branches
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedBranches = branches
    .map((branch) => ({
      ...branch,
      distance: calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        branch.coordinates.lat,
        branch.coordinates.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  const handleConfirm = () => {
    if (tempSelectedBranch) {
      onConfirm(tempSelectedBranch);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-0 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <DialogTitle className="text-center flex-1 text-lg font-medium">
          Teslimat Yöntemini Belirle
        </DialogTitle>
        <div className="w-5"></div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto">
        {showBranchList ? (
          <BranchList
            branches={sortedBranches}
            selectedBranch={tempSelectedBranch}
            onBranchSelect={onBranchSelect}
            onBack={() => setShowBranchList(false)}
          />
        ) : (
          <div className="space-y-4">
            <div className="p-4 pb-0">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSuggestionSelect={(suggestion) => {
                  if (suggestion.latitude && suggestion.longitude) {
                    onLocationChange({
                      lat: suggestion.latitude,
                      lng: suggestion.longitude,
                    });
                  }
                }}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                isSearching={isSearching}
                placeholder="Örn. Maslak Mh. Yelkovan Sk."
              />
            </div>

            <div className="px-4">
              <Button
                variant="outline"
                className="w-full justify-center py-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() => setShowBranchList(true)}
              >
                <List className="mr-2 h-4 w-4" />
                Listeden Seç
              </Button>
            </div>

            <MapComponent
              center={selectedLocation}
              onLocationChange={(lat: number, lng: number) => {
                onLocationChange({
                  lat: lat,
                  lng: lng,
                });
              }}
              type="pickup"
              branches={branches}
              onBranchSelect={onBranchSelect}
            />

            <div className="px-4">
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {sortedBranches.slice(0, 4).map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    isSelected={tempSelectedBranch?.id === branch.id}
                    onSelect={() => onBranchSelect(branch)}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="p-4">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                disabled={!tempSelectedBranch}
                onClick={handleConfirm}
              >
                Seçili şube ile devam et
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
