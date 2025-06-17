"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExtrasFilterSidebar } from "@/components/extras-filter-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Grid, List, Minus, Plus } from "lucide-react"

const extras = [
  {
    id: 1,
    name: "Coca Cola 1L",
    price: 25,
    image: "/placeholder.svg?height=200&width=200",
    description: "Soğuk ve ferahlatıcı",
    category: "İçecek",
    size: "1L",
  },
  {
    id: 2,
    name: "Fanta 1L",
    price: 25,
    image: "/placeholder.svg?height=200&width=200",
    description: "Portakal aromalı",
    category: "İçecek",
    size: "1L",
  },
  {
    id: 3,
    name: "Garlic Bread",
    price: 35,
    image: "/placeholder.svg?height=200&width=200",
    description: "Sarımsaklı ekmek",
    category: "Ekstra",
    size: "Orta",
  },
  {
    id: 4,
    name: "Chicken Wings",
    price: 45,
    image: "/placeholder.svg?height=200&width=200",
    description: "Baharatlı tavuk kanatları",
    category: "Ekstra",
    size: "6 Adet",
  },
  {
    id: 5,
    name: "Ayran 250ml",
    price: 12,
    image: "/placeholder.svg?height=200&width=200",
    description: "Geleneksel Türk içeceği",
    category: "İçecek",
    size: "250ml",
  },
  {
    id: 6,
    name: "Patates Kızartması",
    price: 30,
    image: "/placeholder.svg?height=200&width=200",
    description: "Çıtır çıtır patates",
    category: "Ekstra",
    size: "Orta",
  },
]

export default function EkstralarPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredExtras, setFilteredExtras] = useState(extras)
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({})

  const handleFilterChange = (filters: any) => {
    const filtered = extras.filter((extra) => {
      const priceInRange = extra.price >= filters.priceRange[0] && extra.price <= filters.priceRange[1]
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(extra.category)
      const sizeMatch = filters.sizes.length === 0 || filters.sizes.includes(extra.size)

      return priceInRange && categoryMatch && sizeMatch
    })

    setFilteredExtras(filtered)
  }

  const addToCart = (extraId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [extraId]: (prev[extraId] || 0) + 1,
    }))
  }

  const updateQuantity = (extraId: number, change: number) => {
    setCartItems((prev) => {
      const newQuantity = (prev[extraId] || 0) + change
      if (newQuantity <= 0) {
        const { [extraId]: removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [extraId]: newQuantity,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Ekstralar & İçecekler</h1>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)} className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <ExtrasFilterSidebar isOpen={true} onClose={() => {}} onFilterChange={handleFilterChange} />
          </div>

          {/* Mobile Filter Sidebar */}
          <ExtrasFilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
          />

          {/* Products Grid/List */}
          <div className="flex-1 min-h-0">
            <div className="mb-4 text-sm text-gray-600">{filteredExtras.length} ürün bulundu</div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExtras.map((extra) => (
                  <Card key={extra.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={extra.image || "/placeholder.svg"}
                          alt={extra.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      <h3 className="font-semibold text-gray-800 mb-2">{extra.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{extra.description}</p>

                      <div className="mb-4">
                        <span className="text-2xl font-bold text-orange-600">{extra.price} TL</span>
                      </div>

                      {cartItems[extra.id] > 0 ? (
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(extra.id, -1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold text-lg">{cartItems[extra.id]}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(extra.id, 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                          onClick={() => addToCart(extra.id)}
                        >
                          Sipariş Ver
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExtras.map((extra) => (
                  <Card key={extra.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <img
                          src={extra.image || "/placeholder.svg"}
                          alt={extra.name}
                          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">{extra.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{extra.description}</p>
                              <span className="text-2xl font-bold text-orange-600">{extra.price} TL</span>
                            </div>
                            {cartItems[extra.id] > 0 ? (
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => updateQuantity(extra.id, -1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="font-semibold">{cartItems[extra.id]}</span>
                                <Button variant="outline" size="sm" onClick={() => updateQuantity(extra.id, 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-gray-800 hover:bg-gray-900 text-white"
                                onClick={() => addToCart(extra.id)}
                              >
                                Sipariş Ver
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
