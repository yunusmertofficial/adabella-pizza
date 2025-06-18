"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Edit,
  ArrowLeft,
  Plus,
  Minus,
  Search,
  Navigation,
  Clock,
  List,
  Store,
  Truck,
  X,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Address {
  id: number;
  title: string;
  fullAddress: string;
  coordinates: { lat: number; lng: number };
  isSelected: boolean;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  workingHours: string;
  distance?: number;
  isOpen: boolean;
}

interface AddressSuggestion {
  id: string;
  text: string;
  latitude?: number;
  longitude?: number;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function DeliveryMethodSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    "method" | "address" | "pickup" | "addressForm"
  >("method");
  const [deliveryMethod, setDeliveryMethod] = useState<"address" | "pickup">(
    "address"
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 41.0082,
    lng: 28.9784,
  });
  const [selectedAddress, setSelectedAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [branchMarkers, setBranchMarkers] = useState<any[]>([]);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([
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
  const [showBranchList, setShowBranchList] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

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

  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Calculate distance between two coordinates
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

  const getSortedBranches = useCallback(() => {
    return branches
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
  }, [branches, selectedLocation]);

  // Leaflet loading
  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(cssLink);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        setIsLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.L) {
      setIsLeafletLoaded(true);
    }
  }, []);

  // Initialize map for pickup
  const initializePickupMap = useCallback(() => {
    if (!window.L || !mapRef.current || map) return;

    const newMap = window.L.map(mapRef.current).setView(
      [selectedLocation.lat, selectedLocation.lng],
      13
    );

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    const userIcon = window.L.divIcon({
      html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>',
      className: "custom-div-icon",
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    const newMarker = window.L.marker(
      [selectedLocation.lat, selectedLocation.lng],
      {
        icon: userIcon,
        draggable: true,
      }
    ).addTo(newMap);

    const newBranchMarkers: any[] = [];
    branches.forEach((branch) => {
      const branchIcon = window.L.divIcon({
        html: `<div style="background-color: ${
          branch.isOpen ? "#ef4444" : "#6b7280"
        }; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; white-space: nowrap;">${
          branch.name
        }</div>`,
        className: "custom-branch-icon",
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      const branchMarker = window.L.marker(
        [branch.coordinates.lat, branch.coordinates.lng],
        {
          icon: branchIcon,
        }
      ).addTo(newMap);

      branchMarker.on("click", () => {
        setSelectedBranch(branch);
      });

      newBranchMarkers.push(branchMarker);
    });

    newMarker.on("dragend", (e: any) => {
      const position = e.target.getLatLng();
      setSelectedLocation({ lat: position.lat, lng: position.lng });
    });

    newMap.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      newMarker.setLatLng([lat, lng]);
    });

    setMap(newMap);
    setMarker(newMarker);
    setBranchMarkers(newBranchMarkers);
  }, [selectedLocation, map, branches]);

  // Initialize map for address
  const initializeAddressMap = useCallback(() => {
    if (!window.L || !mapRef.current || map) return;

    const newMap = window.L.map(mapRef.current).setView(
      [selectedLocation.lat, selectedLocation.lng],
      15
    );

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    const newMarker = window.L.marker(
      [selectedLocation.lat, selectedLocation.lng],
      {
        draggable: true,
      }
    ).addTo(newMap);

    newMarker.on("dragend", (e: any) => {
      const position = e.target.getLatLng();
      setSelectedLocation({ lat: position.lat, lng: position.lng });
      getAddressFromCoordinates(position.lat, position.lng);
    });

    newMap.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      newMarker.setLatLng([lat, lng]);
      getAddressFromCoordinates(lat, lng);
    });

    setMap(newMap);
    setMarker(newMarker);
  }, [selectedLocation, map]);

  // Initialize appropriate map
  useEffect(() => {
    if (isLeafletLoaded && isOpen && !map) {
      if (currentView === "pickup" && !showBranchList) {
        setTimeout(initializePickupMap, 100);
      } else if (currentView === "addressForm") {
        setTimeout(initializeAddressMap, 100);
      }
    }
  }, [
    isLeafletLoaded,
    isOpen,
    currentView,
    showBranchList,
    map,
    initializePickupMap,
    initializeAddressMap,
  ]);

  // Search addresses
  const searchAddresses = useCallback(
    async (query: string) => {
      if (!query || query.length < 2 || !userIsTyping) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&accept-language=tr&countrycodes=tr`
        );

        if (response.ok) {
          const data = await response.json();
          const formattedSuggestions: AddressSuggestion[] = data.map(
            (item: any, index: number) => ({
              id: `${index}`,
              text: item.display_name,
              latitude: Number.parseFloat(item.lat),
              longitude: Number.parseFloat(item.lon),
            })
          );

          setSuggestions(formattedSuggestions);
          setShowSuggestions(formattedSuggestions.length > 0);
        }
      } catch (error) {
        console.error("Address search error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    },
    [userIsTyping]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddresses(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchAddresses]);

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

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(newPos);

          // Update map if it exists
          if (map && marker) {
            map.setView([newPos.lat, newPos.lng], 15);
            marker.setLatLng([newPos.lat, newPos.lng]);
          }

          if (currentView === "addressForm") {
            getAddressFromCoordinates(newPos.lat, newPos.lng);
          }
        },
        (error) => {
          console.error("Location error:", error);
          alert(
            "Konumunuza erişilemedi. Lütfen konum izinlerini kontrol edin."
          );
        }
      );
    }
  }, [currentView, getAddressFromCoordinates, map, marker]);

  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setSearchQuery(suggestion.text);
    if (currentView === "addressForm") {
      setSelectedAddress(suggestion.text);
    }
    setShowSuggestions(false);

    if (suggestion.latitude && suggestion.longitude) {
      const newPos = { lat: suggestion.latitude, lng: suggestion.longitude };
      setSelectedLocation(newPos);

      // Update map if it exists
      if (map && marker) {
        map.setView([newPos.lat, newPos.lng], 13);
        marker.setLatLng([newPos.lat, newPos.lng]);
      }
    }
  };

  const toggleDialog = () => {
    setIsOpen(!isOpen);
    setShowBranchList(false);
    setShowAddressForm(false);
    setEditingAddress(null);
    if (map) {
      map.remove();
      setMap(null);
      setMarker(null);
      setBranchMarkers([]);
    }
  };

  const handleMethodToggle = () => {
    setTempDeliveryMethod(deliveryMethod);
    setTempSelectedBranch(selectedBranch);
    setTempSelectedAddresses(addresses);
    setCurrentView("method");
    setIsOpen(true);
  };

  const handleDeliveryMethodSelect = (method: "address" | "pickup") => {
    setTempDeliveryMethod(method);
    if (method === "address") {
      setCurrentView("address");
    } else {
      setCurrentView("pickup");
    }
  };

  const handleAddressSelect = (address: Address) => {
    setTempSelectedAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isSelected: addr.id === address.id }))
    );
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setSelectedLocation(address.coordinates);
    setSelectedAddress(address.fullAddress);
    setSearchQuery(address.fullAddress);
    setUserIsTyping(false);
    setShowSuggestions(false);
    setSuggestions([]);
    setCurrentView("addressForm");
  };

  const handleSaveAddress = () => {
    if (!selectedAddress) return;

    if (editingAddress) {
      setTempSelectedAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                title: selectedAddress,
                fullAddress: selectedAddress,
                coordinates: selectedLocation,
              }
            : addr
        )
      );
    } else {
      const newAddress: Address = {
        id: Date.now(),
        title: selectedAddress,
        fullAddress: selectedAddress,
        coordinates: selectedLocation,
        isSelected: false,
      };
      setTempSelectedAddresses((prev) => [...prev, newAddress]);
    }

    setCurrentView("address");
    setEditingAddress(null);
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

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

  const sortedBranches = getSortedBranches();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions, suggestionsRef, searchInputRef]);

  return (
    <div className="p-4">
      <div className="flex items-center space-x-3">
        {/* Method Toggle Button */}
        <button
          onClick={handleMethodToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-colors ${
            deliveryMethod === "address"
              ? "bg-white border-gray-300 hover:border-gray-400"
              : "bg-white border-gray-300 hover:border-gray-400"
          }`}
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
          {/* Delivery Method Selection */}
          {currentView === "method" && (
            <div className="relative flex flex-col h-full">
              <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
                <div className="w-5"></div>
                <DialogTitle className="text-center flex-1 text-xl font-bold text-blue-600">
                  Merhaba!
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleDialog}
                  className="p-0 h-auto"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-lg">
                    Siparişini nasıl almak istersin?
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Address Delivery */}
                  <div
                    className="relative p-4 border-2 border-green-200 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => handleDeliveryMethodSelect("address")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-800 text-lg">
                            Adrese Teslim
                          </h3>
                          <p className="text-green-600 text-sm">
                            Siparişini adresine getirelim.
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-green-600" />
                    </div>
                  </div>

                  {/* Pickup */}
                  <div
                    className="relative p-4 border-2 border-blue-200 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleDeliveryMethodSelect("pickup")}
                  >
                    <div className="absolute top-2 right-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Gel Al'a Özel İndirimler!
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Store className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-800 text-lg">
                            Beklemeden Gel Al
                          </h3>
                          <p className="text-blue-600 text-sm">
                            Sıra beklemeden şubeden teslim al.
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>İster restoranda ye</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>İster paket teslim al</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>

                  {/* Member Login */}
                  <div className="relative p-4 border-2 border-gray-200 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            Üye Girişi / Üye Ol
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Giriş yap / üye ol ve avantajlardan faydalanı
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address List View */}
          {currentView === "address" && (
            <div className="flex flex-col h-full">
              <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView("method")}
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
                    onClick={() => {
                      setEditingAddress(null);
                      setSelectedAddress("");
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                      setUserIsTyping(false);
                      setCurrentView("addressForm");
                    }}
                  >
                    Yeni Adres Ekle
                  </Button>

                  <div className="space-y-3">
                    {tempSelectedAddresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          address.isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAddressSelect(address)}
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
                                setEditingAddress(address);
                                setSelectedLocation(address.coordinates);
                                setSelectedAddress(address.fullAddress);
                                setSearchQuery(address.fullAddress);
                                setUserIsTyping(false);
                                setShowSuggestions(false);
                                setSuggestions([]);
                                setCurrentView("addressForm");
                              }}
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pb-4">
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                      onClick={() => {
                        const selectedAddr = tempSelectedAddresses.find(
                          (addr) => addr.isSelected
                        );
                        if (selectedAddr) {
                          setSelectedLocation(selectedAddr.coordinates);
                          setDeliveryMethod(tempDeliveryMethod);
                          setAddresses(tempSelectedAddresses);
                          if (map && marker) {
                            map.setView(
                              [
                                selectedAddr.coordinates.lat,
                                selectedAddr.coordinates.lng,
                              ],
                              15
                            );
                            marker.setLatLng([
                              selectedAddr.coordinates.lat,
                              selectedAddr.coordinates.lng,
                            ]);
                          }
                        }
                        toggleDialog();
                      }}
                    >
                      Seçili Adres ile Devam Et
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Form */}
          {currentView === "addressForm" && (
            <div className="relative flex flex-col h-full">
              <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView("address")}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <DialogTitle className="text-center flex-1 text-lg font-medium">
                  {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                </DialogTitle>
                <div className="w-5"></div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Adres ara..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setUserIsTyping(true);
                      }}
                      onFocus={() => {
                        if (userIsTyping && suggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                    />

                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
                      >
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            <div className="flex items-start space-x-3">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-900 leading-relaxed">
                                {suggestion.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={getCurrentLocation}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Konumumu Bul
                  </Button>

                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <div ref={mapRef} className="w-full h-full" />

                    {!isLeafletLoaded && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                        <MapPin className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Harita yükleniyor...
                        </p>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-[1000]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 bg-white shadow-md"
                        onClick={handleZoomIn}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 bg-white shadow-md"
                        onClick={handleZoomOut}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedAddress && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedAddress}</p>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">
                        !
                      </span>
                    </div>
                      <p className="text-sm text-orange-800">
                        Siparişiniz seçtiğiniz adrese teslim edilecektir.
                      </p>
                  </div>

                  <div className="pb-4">
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                      onClick={() => {
                        if (!selectedAddress) return;

                        if (editingAddress) {
                          setTempSelectedAddresses((prev) =>
                            prev.map((addr) =>
                              addr.id === editingAddress.id
                                ? {
                                    ...addr,
                                    title: selectedAddress,
                                    fullAddress: selectedAddress,
                                    coordinates: selectedLocation,
                                  }
                                : addr
                            )
                          );
                        } else {
                          const newAddress: Address = {
                            id: Date.now(),
                            title: selectedAddress,
                            fullAddress: selectedAddress,
                            coordinates: selectedLocation,
                            isSelected: false,
                          };
                          setTempSelectedAddresses((prev) => [
                            ...prev,
                            newAddress,
                          ]);
                        }

                        setCurrentView("address");
                        setEditingAddress(null);
                      }}
                      disabled={!selectedAddress}
                    >
                      {editingAddress
                        ? "Adresi Güncelle"
                        : "Bu Adresle Devam Et"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pickup View */}
          {currentView === "pickup" && (
            <div className="relative flex flex-col h-full">
              <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView("method")}
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
                  <div className="p-4 space-y-4">
                    <Button
                      variant="ghost"
                      className="mb-4 p-0 h-auto"
                      onClick={() => setShowBranchList(false)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Haritaya Dön
                    </Button>

                    <div className="space-y-3">
                      {sortedBranches.map((branch) => (
                        <div
                          key={branch.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            tempSelectedBranch?.id === branch.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setTempSelectedBranch(branch)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium text-gray-900">
                                  {branch.name}
                                </h3>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {branch.distance?.toFixed(1)} KM
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {branch.address}
                              </p>
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
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 pb-0">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Örn. Maslak Mh. Yelkovan Sk."
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setUserIsTyping(true);
                          }}
                          onFocus={() => {
                            if (userIsTyping && suggestions.length > 0) {
                              setShowSuggestions(true);
                            }
                          }}
                        />

                        {/* Search Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                          <div
                            ref={suggestionsRef}
                            className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
                          >
                            {suggestions.map((suggestion) => (
                              <div
                                key={suggestion.id}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() =>
                                  handleSuggestionSelect(suggestion)
                                }
                              >
                                <div className="flex items-start space-x-3">
                                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-900 leading-relaxed">
                                    {suggestion.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {isSearching && (
                          <div className="absolute right-3 top-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          </div>
                        )}
                      </div>
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

                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      <div ref={mapRef} className="w-full h-full" />

                      {!isLeafletLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Harita yükleniyor...
                          </p>
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-[1000]">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 bg-white shadow-md"
                          onClick={handleZoomIn}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 bg-white shadow-md"
                          onClick={handleZoomOut}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="absolute top-4 right-4 z-[1000]">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0 bg-white shadow-md"
                          onClick={getCurrentLocation}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="px-4">
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {sortedBranches.slice(0, 4).map((branch) => (
                          <div
                            key={branch.id}
                            className={`flex-shrink-0 w-64 p-3 border rounded-lg cursor-pointer transition-colors ${
                              tempSelectedBranch?.id === branch.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setTempSelectedBranch(branch)}
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
                                <span className="text-xs text-gray-600">
                                  {branch.workingHours}
                                </span>
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
                        ))}
                      </div>
                    </div>

                    <div className="p-4">
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                        disabled={!tempSelectedBranch}
                        onClick={() => {
                          if (tempSelectedBranch) {
                            setSelectedLocation(tempSelectedBranch.coordinates);
                            setDeliveryMethod(tempDeliveryMethod);
                            setSelectedBranch(tempSelectedBranch);
                            if (map && marker) {
                              map.setView(
                                [
                                  tempSelectedBranch.coordinates.lat,
                                  tempSelectedBranch.coordinates.lng,
                                ],
                                15
                              );
                              marker.setLatLng([
                                tempSelectedBranch.coordinates.lat,
                                tempSelectedBranch.coordinates.lng,
                              ]);
                            }
                          }
                          toggleDialog();
                        }}
                      >
                        Seçili şube ile devam et
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
