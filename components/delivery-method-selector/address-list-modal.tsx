"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddressCard } from "./address-card";
import { Address } from "@/types/delivery-method-selector";

interface AddressListModalProps {
  addresses: Address[];
  onBack: () => void;
  onAddressSelect: (addresses: Address[]) => void;
  onAddNew: () => void;
  onConfirm: (selectedAddress: Address, addresses: Address[]) => void;
}

export function AddressListModal({
  addresses,
  onBack,
  onAddressSelect,
  onAddNew,
  onConfirm,
}: AddressListModalProps) {
  const handleAddressSelect = (addressId: number) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isSelected: addr.id === addressId,
    }));
    onAddressSelect(updatedAddresses);
  };

  const handleConfirm = () => {
    const selectedAddress = addresses.find((addr) => addr.isSelected);
    if (selectedAddress) {
      onConfirm(selectedAddress, addresses);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
          Adreslerim
        </DialogTitle>
        <div className="w-5"></div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <Button
            variant="outline"
            className="w-full justify-center py-3 border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={onAddNew}
          >
            Yeni Adres Ekle
          </Button>

          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onSelect={() => handleAddressSelect(address.id)}
                onEdit={() => {
                  /* Handle edit */
                }}
              />
            ))}
          </div>

          <div className="pb-4">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
              onClick={handleConfirm}
            >
              Seçili Adres ile Devam Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
