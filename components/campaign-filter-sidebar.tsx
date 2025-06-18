"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface CampaignFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}

export function CampaignFilterSidebar({
  isOpen,
  onClose,
  onFilterChange,
}: CampaignFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const campaignTypes = [
    "2'li Kampanya",
    "3'lü Kampanya",
    "Pizza + İçecek",
    "Aile Kampanyası",
    "Öğrenci Kampanyası",
  ];
  const sizes = ["Küçük", "Orta", "Büyük", "X-Large"];

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    }
  };

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      types: selectedTypes,
      sizes: selectedSizes,
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    onFilterChange({
      priceRange: [0, 1000],
      types: [],
      sizes: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[10000] md:relative md:bg-transparent"
      onClick={onClose}
    >
      <div
        className="fixed right-0 top-0 h-full w-full bg-white shadow-lg md:relative md:w-80 md:shadow-none md:z-0 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 md:hidden border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Filtreler</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Fiyat Aralığı */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fiyat Aralığı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{priceRange[0]} TL</span>
                  <span>{priceRange[1]} TL</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kampanya Türleri */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kampanya Türü</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaignTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(checked) =>
                        handleTypeChange(type, checked as boolean)
                      }
                    />
                    <label htmlFor={type} className="text-sm font-medium">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Boyutlar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Boyutlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={(checked) =>
                        handleSizeChange(size, checked as boolean)
                      }
                    />
                    <label htmlFor={size} className="text-sm font-medium">
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Butonlar (footer is placed outside) */}
        </div>
      </div>

      <div className="p-6 border-t space-y-3 sticky bottom-0 bg-white">
        <Button
          onClick={applyFilters}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Filtreleri Uygula
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Filtreleri Temizle
        </Button>
      </div>
    </div>
  );
}
