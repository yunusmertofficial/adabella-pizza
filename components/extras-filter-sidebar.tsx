"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

interface ExtrasFilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange: (filters: any) => void
}

export function ExtrasFilterSidebar({ isOpen, onClose, onFilterChange }: ExtrasFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

  const categories = ["İçecek", "Ekstra", "Tatlı", "Salata", "Aperatif"]
  const sizes = ["Küçük", "Orta", "Büyük", "250ml", "500ml", "1L", "1.5L"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size])
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    }
  }

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      sizes: selectedSizes,
    })
  }

  const clearFilters = () => {
    setPriceRange([0, 100])
    setSelectedCategories([])
    setSelectedSizes([])
    onFilterChange({
      priceRange: [0, 100],
      categories: [],
      sizes: [],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] md:relative md:bg-transparent" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-full bg-white shadow-lg md:relative md:w-80 md:shadow-none md:z-0 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 min-h-full">
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-xl font-bold">Filtreler</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
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
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]} TL</span>
                    <span>{priceRange[1]} TL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kategoriler */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kategoriler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <label htmlFor={category} className="text-sm font-medium">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Boyutlar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Boyut/Hacim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={size}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                      />
                      <label htmlFor={size} className="text-sm font-medium">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Butonlar */}
            <div className="space-y-3">
              <Button onClick={applyFilters} className="w-full bg-red-600 hover:bg-red-700">
                Filtreleri Uygula
              </Button>
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Filtreleri Temizle
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
