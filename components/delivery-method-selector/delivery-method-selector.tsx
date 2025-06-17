"use client";
import { useState } from "react";
import { Store, Truck, Edit } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MethodSelectionModal } from "./method-selection-modal";
import { AddressListModal } from "./address-list-modal";
import { AddressFormModal } from "./address-form-modal";
import { PickupModal } from "./pickup-modal";
import { Branch, Address } from "@/types/delivery-method-selector";

export default function DeliveryMethodSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    "method" | "address" | "pickup" | "addressForm"
  >("method");
  const [deliveryMethod, setDeliveryMethod] = useState<"address" | "pickup">(
    "address"
  );
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 41.0082,
    lng: 28.9784,
  });

  const [branches] = useState<Branch[]>([
    {
      id: 1,
      name: "ISTANBUL KAYASEHIR",
      address:
        "Merkez Kayaşehir Avm G 7 Cad. A Blok No:9 Dükkan No:142 Kayabaşı Başakşehir İstanbul",
      coordinates: { lat: 41.0082, lng: 28.9784 },
      workingHours: "10:00 - 00:45",
      isOpen: true,
    },
    {
      id: 2,
      name: "ISTANBUL KAYASEHIR FENERTEPE",
      address: "Kayabaşı Mah. Akzambak Sok. İstanbul Sitesi B Bl Blok No:1D",
      coordinates: { lat: 41.0122, lng: 28.9824 },
      workingHours: "10:00 - 03:00",
      isOpen: true,
    },
    {
      id: 3,
      name: "ISTANBUL BASAKSEHIR MERKEZ",
      address: "Başakşehir Merkez Mahallesi 5. Etap Bulvarı No:15/A",
      coordinates: { lat: 41.0902, lng: 28.8084 },
      workingHours: "09:00 - 02:00",
      isOpen: true,
    },
    {
      id: 4,
      name: "ISTANBUL IKITELLI",
      address: "İkitelli Organize Sanayi Bölgesi Atatürk Bulvarı No:45",
      coordinates: { lat: 41.0542, lng: 28.7784 },
      workingHours: "10:30 - 01:30",
      isOpen: false,
    },
  ]);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(
    branches[0]
  );

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: "İstanbul Başakşehir Güvercintepe",
      fullAddress: "Kayabaşı, Şehit Semih Balaban Cd, İstanbul / Başakşehir",
      coordinates: { lat: 41.0082, lng: 28.9784 },
      isSelected: true,
    },
    {
      id: 2,
      title: "Güvercintepe, İstanbul / Başakşehir",
      fullAddress: "Güvercintepe, İstanbul / Başakşehir",
      coordinates: { lat: 41.0122, lng: 28.9824 },
      isSelected: false,
    },
  ]);

  const [tempDeliveryMethod, setTempDeliveryMethod] = useState<
    "address" | "pickup"
  >("address");
  const [tempSelectedBranch, setTempSelectedBranch] = useState<Branch | null>(
    null
  );
  const [tempSelectedAddresses, setTempSelectedAddresses] = useState<Address[]>(
    []
  );

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleMethodToggle = () => {
    setTempDeliveryMethod(deliveryMethod);
    setTempSelectedBranch(selectedBranch);
    setTempSelectedAddresses(addresses);
    setCurrentView("method");
    setIsOpen(true);
  };

  const handleConfirmSelection = (
    method: "address" | "pickup",
    selectedAddr?: Address,
    selectedBr?: Branch,
    newAddresses?: Address[]
  ) => {
    setDeliveryMethod(method);

    if (method === "address" && selectedAddr && newAddresses) {
      setSelectedLocation(selectedAddr.coordinates);
      setAddresses(newAddresses);
    } else if (method === "pickup" && selectedBr) {
      setSelectedLocation(selectedBr.coordinates);
      setSelectedBranch(selectedBr);
    }

    toggleDialog();
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-3">
        {/* Method Toggle Button */}
        <button
          onClick={handleMethodToggle}
          className="flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-gray-300 hover:border-gray-400 bg-white transition-colors"
        >
          {deliveryMethod === "address" ? (
            <>
              <Truck className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-gray-900">
                Adrese Teslim
              </span>
            </>
          ) : (
            <>
              <Store className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-gray-900">
                Beklemeden Gel Al
              </span>
            </>
          )}
        </button>

        {/* Current Selection */}
        <button
          onClick={() => {
            setCurrentView(deliveryMethod);
            setIsOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <span className="text-sm text-gray-700">
            {deliveryMethod === "address"
              ? addresses.find((addr) => addr.isSelected)?.title ||
                "Adres seçiniz"
              : selectedBranch?.name.replace("ISTANBUL ", "") + " Şubesi" ||
                "Şube seçiniz"}
          </span>
          <Edit className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md z-[9999] md:max-w-md lg:max-w-md p-0 gap-0 w-full h-full sm:h-auto sm:w-auto max-h-screen overflow-hidden flex flex-col">
          {currentView === "method" && (
            <MethodSelectionModal
              onClose={toggleDialog}
              onSelectMethod={(method) => {
                setTempDeliveryMethod(method);
                setCurrentView(method);
              }}
            />
          )}

          {currentView === "address" && (
            <AddressListModal
              addresses={tempSelectedAddresses}
              onBack={() => setCurrentView("method")}
              onAddressSelect={(updatedAddresses) =>
                setTempSelectedAddresses(updatedAddresses)
              }
              onAddNew={() => setCurrentView("addressForm")}
              onConfirm={(selectedAddr, newAddresses) =>
                handleConfirmSelection(
                  "address",
                  selectedAddr,
                  undefined,
                  newAddresses
                )
              }
            />
          )}

          {currentView === "addressForm" && (
            <AddressFormModal
              onBack={() => setCurrentView("address")}
              onSave={(newAddresses) => {
                setTempSelectedAddresses(newAddresses);
                setCurrentView("address");
              }}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
          )}

          {currentView === "pickup" && (
            <PickupModal
              branches={branches}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              tempSelectedBranch={tempSelectedBranch}
              onBranchSelect={setTempSelectedBranch}
              onBack={() => setCurrentView("method")}
              onConfirm={(selectedBr) =>
                handleConfirmSelection("pickup", undefined, selectedBr)
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
