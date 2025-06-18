"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapComponent } from "./map-component";
import { Address, AddressSuggestion } from "@/types/delivery-method-selector";
import { SearchInput } from "./search-input";

interface AddressFormModalProps {
  onBack: () => void;
  onSave: (addresses: Address[]) => void;
  selectedLocation: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

export function AddressFormModal({
  onBack,
  onSave,
  selectedLocation,
  onLocationChange,
}: AddressFormModalProps) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

  // Get address from coordinates
  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=tr`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.display_name) {
            setSelectedAddress(data.display_name);
          }
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      }
    },
    []
  );

  const handleSave = () => {
    if (!selectedAddress) return;

    const newAddress: Address = {
      id: Date.now(),
      title: selectedAddress,
      fullAddress: selectedAddress,
      coordinates: selectedLocation,
      isSelected: false,
    };

    onSave([newAddress]); // This would be updated to handle existing addresses
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
          Yeni Adres Ekle
        </DialogTitle>
        <div className="w-5"></div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSuggestionSelect={(suggestion) => {
              setSelectedAddress(suggestion.text);
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
            placeholder="Adres ara..."
          />

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const newPos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    };
                    onLocationChange(newPos);
                    getAddressFromCoordinates(newPos.lat, newPos.lng);
                  },
                  (error) => {
                    console.error("Location error:", error);
                    alert(
                      "Konumunuza erişilemedi. Lütfen konum izinlerini kontrol edin."
                    );
                  }
                );
              }
            }}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Konumumu Bul
          </Button>

          <MapComponent
            center={selectedLocation}
            onLocationChange={(lat, lng) => {
              onLocationChange({ lat, lng });
              getAddressFromCoordinates(lat, lng);
            }}
            type="address"
          />

          {selectedAddress && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">{selectedAddress}</p>
            </div>
          )}

          <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-orange-600 text-xs font-bold">!</span>
            </div>
              <p className="text-sm text-orange-800">
                Siparişiniz seçtiğiniz adrese teslim edilecektir.
              </p>
          </div>

          <div className="pb-4">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
              onClick={handleSave}
              disabled={!selectedAddress}
            >
              Bu Adresle Devam Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
