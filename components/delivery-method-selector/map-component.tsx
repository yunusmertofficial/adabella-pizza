"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { MapPin, Plus, Minus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Branch } from "@/types/delivery-method-selector";

interface MapComponentProps {
  center: { lat: number; lng: number };
  onLocationChange: (lat: number, lng: number) => void;
  type: "address" | "pickup";
  branches?: Branch[];
  onBranchSelect?: (branch: Branch) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export function MapComponent({
  center,
  onLocationChange,
  type,
  branches = [],
  onBranchSelect,
}: MapComponentProps) {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [branchMarkers, setBranchMarkers] = useState<any[]>([]);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

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

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!window.L || !mapRef.current || map) return;

    const zoom = type === "address" ? 15 : 13;
    const newMap = window.L.map(mapRef.current).setView(
      [center.lat, center.lng],
      zoom
    );

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    // Create marker based on type
    let newMarker;
    if (type === "pickup") {
      const userIcon = window.L.divIcon({
        html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>',
        className: "custom-div-icon",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      newMarker = window.L.marker([center.lat, center.lng], {
        icon: userIcon,
        draggable: true,
      }).addTo(newMap);
    } else {
      newMarker = window.L.marker([center.lat, center.lng], {
        draggable: true,
      }).addTo(newMap);
    }

    // Add branch markers for pickup type
    const newBranchMarkers: any[] = [];
    if (type === "pickup" && branches.length > 0) {
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
          if (onBranchSelect) {
            onBranchSelect(branch);
          }
        });

        newBranchMarkers.push(branchMarker);
      });
    }

    // Event listeners
    newMarker.on("dragend", (e: any) => {
      const position = e.target.getLatLng();
      onLocationChange(position.lat, position.lng);
    });

    newMap.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      onLocationChange(lat, lng);
      newMarker.setLatLng([lat, lng]);
    });

    setMap(newMap);
    setMarker(newMarker);
    setBranchMarkers(newBranchMarkers);
  }, [center, map, type, branches, onLocationChange, onBranchSelect]);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (isLeafletLoaded && !map) {
      setTimeout(initializeMap, 100);
    }
  }, [isLeafletLoaded, map, initializeMap]);

  // Update map location when center changes
  useEffect(() => {
    if (map && marker) {
      map.setView([center.lat, center.lng], map.getZoom());
      marker.setLatLng([center.lat, center.lng]);
    }
  }, [center, map, marker]);

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onLocationChange(newPos.lat, newPos.lng);
          if (map && marker) {
            map.setView([newPos.lat, newPos.lng], 15);
            marker.setLatLng([newPos.lat, newPos.lng]);
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
  };

  return (
    <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />

      {!isLeafletLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <MapPin className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Harita yükleniyor...</p>
        </div>
      )}

      {/* Zoom Controls */}
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

      {/* Current Location Button */}
      {type === "pickup" && (
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
      )}
    </div>
  );
}
