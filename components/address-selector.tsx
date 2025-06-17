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

export default function AddressSelector() {
  const [isOpen, setIsOpen] = useState(false);
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
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: "Kayabaşı, Şehit Semih Balaban Cd, İstanbul / Başakşehir",
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

  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [userIsTyping, setUserIsTyping] = useState(false);

  // Leaflet yükleme
  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      // CSS yükle
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(cssLink);

      // JavaScript yükle
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

  // Haritayı başlat
  const initializeMap = useCallback(() => {
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

    // Marker sürüklendiğinde
    newMarker.on("dragend", (e: any) => {
      const position = e.target.getLatLng();
      setSelectedLocation({ lat: position.lat, lng: position.lng });
      getAddressFromCoordinates(position.lat, position.lng);
    });

    // Haritaya tıklandığında
    newMap.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      newMarker.setLatLng([lat, lng]);
      getAddressFromCoordinates(lat, lng);
    });

    setMap(newMap);
    setMarker(newMarker);
  }, [selectedLocation, map]);

  // Harita konumunu güncelle
  const updateMapLocation = useCallback(
    (lat: number, lng: number) => {
      if (map && marker) {
        map.setView([lat, lng], 15);
        marker.setLatLng([lat, lng]);
      }
    },
    [map, marker]
  );

  // Leaflet yüklendiğinde haritayı başlat
  useEffect(() => {
    if (isLeafletLoaded && showAddressForm && !map) {
      setTimeout(initializeMap, 100);
    }
  }, [isLeafletLoaded, showAddressForm, map, initializeMap]);

  // Konum değiştiğinde haritayı güncelle
  useEffect(() => {
    updateMapLocation(selectedLocation.lat, selectedLocation.lng);
  }, [selectedLocation, updateMapLocation]);

  // Dominos API ile adres arama
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
          `https://gateway-external.dominos.com.tr/api/v1/store-address/StoreAddress/autoSuggestion?latitude=${
            selectedLocation.lat
          }&longitude=${selectedLocation.lng}&words=${encodeURIComponent(
            query
          )}&limit=10`
        );

        if (response.ok) {
          const data = await response.json();

          const formattedSuggestions: AddressSuggestion[] = data
            .filter((item: any[]) => Array.isArray(item) && item.length > 8)
            .map((item: any[], index: number) => ({
              id: `${index}`,
              text: item[0] || "",
              latitude: item[8] || null,
              longitude: item[7] || null,
            }))
            .filter(
              (suggestion: AddressSuggestion) => suggestion.text.trim() !== ""
            );

          setSuggestions(formattedSuggestions);
          setShowSuggestions(formattedSuggestions.length > 0);
        } else {
          console.error("API hatası:", response.status);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Adres arama hatası:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    },
    [selectedLocation, userIsTyping]
  );

  // Arama sorgusu değiştiğinde
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddresses(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchAddresses]);

  // Dışarı tıklandığında önerileri gizle
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
  }, []);

  // Koordinatlardan adres al
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
        console.error("Reverse geocoding hatası:", error);
      }
    },
    []
  );

  // Mevcut konumu bul
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(newPos);
          getAddressFromCoordinates(newPos.lat, newPos.lng);
        },
        (error) => {
          console.error("Konum alınamadı:", error);
          alert(
            "Konumunuza erişilemedi. Lütfen konum izinlerini kontrol edin."
          );
        }
      );
    } else {
      alert("Tarayıcınız konum hizmetlerini desteklemiyor.");
    }
  }, [getAddressFromCoordinates]);

  // Öneri seçildiğinde
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setSearchQuery(suggestion.text);
    setSelectedAddress(suggestion.text);
    setShowSuggestions(false);

    if (suggestion.latitude && suggestion.longitude) {
      const newPos = { lat: suggestion.latitude, lng: suggestion.longitude };
      setSelectedLocation(newPos);
    }
  };

  const toggleDialog = () => {
    setIsOpen(!isOpen);
    setShowAddressForm(false);
    setEditingAddress(null);
    // Haritayı temizle
    if (map) {
      map.remove();
      setMap(null);
      setMarker(null);
    }
  };

  const handleAddressSelect = (address: Address) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isSelected: addr.id === address.id }))
    );
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setSelectedLocation(address.coordinates);
    setSelectedAddress(address.fullAddress);
    setSearchQuery(address.fullAddress);
    setUserIsTyping(false); // Önemli: kullanıcı henüz yazmaya başlamadı
    setShowSuggestions(false);
    setSuggestions([]);
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (!selectedAddress) return;

    if (editingAddress) {
      setAddresses((prev) =>
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
      setAddresses((prev) => [...prev, newAddress]);
    }

    setShowAddressForm(false);
    setEditingAddress(null);
  };

  // Zoom kontrolleri
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

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
          <MapPin className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium">Adrese Teslim</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {addresses.find((addr) => addr.isSelected)?.title ||
              "Adres seçiniz"}
          </span>
          <Button variant="ghost" size="sm" onClick={toggleDialog}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md z-[9999] md:max-w-md lg:max-w-md p-0 gap-0 w-full h-full sm:h-auto sm:w-auto max-h-screen overflow-hidden flex flex-col">
          {showAddressForm ? (
            <div className="relative flex flex-col h-full">
              <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddressForm(false)}
                  className="p-0 h-auto"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <DialogTitle className="text-center flex-1 text-lg font-medium">
                  {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                </DialogTitle>
                <div className="w-5"></div> {/* Boş alan için */}
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {/* Arama Çubuğu */}
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

                    {/* Arama Önerileri */}
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

                    {/* Yükleniyor göstergesi */}
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>

                  {/* Konumumu Bul Butonu */}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={getCurrentLocation}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Konumumu Bul
                  </Button>

                  {/* Leaflet Harita */}
                  <div className="relative h-64 sm:h-64 md:h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <div ref={mapRef} className="w-full h-full" />

                    {!isLeafletLoaded && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                        <MapPin className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Harita yükleniyor...
                        </p>
                      </div>
                    )}

                    {/* Zoom Kontrolleri */}
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

                  {/* Seçilen Adres */}
                  {selectedAddress && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedAddress}</p>
                    </div>
                  )}

                  {/* Uyarı Mesajı */}
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-orange-600 text-xs font-bold">
                        !
                      </span>
                    </div>
                    <p className="text-sm text-orange-800">
                      Şiparisiniz seçtiğiniz adrese teslim edilecektir.
                    </p>
                  </div>

                  {/* Kaydet Butonu */}
                  <div className="pb-4">
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
                      onClick={handleSaveAddress}
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
          ) : (
            <div className="flex flex-col h-full">
              <DialogHeader className="flex flex-row items-center justify-center p-4 border-b flex-shrink-0 relative">
                <DialogTitle className="text-lg font-medium">
                  Adreslerim
                </DialogTitle>
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
                      setShowAddressForm(true);
                    }}
                  >
                    Yeni Adres Ekle
                  </Button>

                  <div className="space-y-3">
                    {addresses.map((address) => (
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
                                handleEditAddress(address);
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
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium">
                      Seçili Adres ile Devam Et
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
