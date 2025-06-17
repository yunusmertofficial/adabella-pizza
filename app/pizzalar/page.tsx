"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PizzaFilterSidebar } from "@/components/pizza-filter-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Grid, List } from "lucide-react"
import Link from "next/link"

const pizzas = [
  {
    id: 1,
    name: "Margarita Pizza",
    price: 180,
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella peyniri, fesleğen",
    category: "Margarita",
    size: "Orta",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 220,
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, pepperoni",
    category: "Pepperoni",
    size: "Orta",
  },
  {
    id: 3,
    name: "Karışık Pizza",
    price: 250,
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, sucuk, salam, mantar",
    category: "Karışık",
    size: "Orta",
  },
  {
    id: 4,
    name: "Vejeteryan Pizza",
    price: 200,
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, sebzeler",
    category: "Vejeteryan",
    size: "Orta",
  },
  {
    id: 5,
    name: "Ton Balıklı Pizza",
    price: 240,
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, ton balığı, soğan",
    category: "Ton Balıklı",
    size: "Orta",
  },
  {
    id: 6,
    name: "Sucuklu Pizza",
    price: 210,
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, sucuk",
    category: "Sucuklu",
    size: "Orta",
  },
]

export default function PizzalarPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredPizzas, setFilteredPizzas] = useState(pizzas)

  const handleFilterChange = (filters: any) => {
    const filtered = pizzas.filter((pizza) => {
      const priceInRange = pizza.price >= filters.priceRange[0] && pizza.price <= filters.priceRange[1]
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(pizza.category)
      const sizeMatch = filters.sizes.length === 0 || filters.sizes.includes(pizza.size)

      return priceInRange && categoryMatch && sizeMatch
    })

    setFilteredPizzas(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tüm Pizzalar</h1>

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
            <PizzaFilterSidebar isOpen={true} onClose={() => {}} onFilterChange={handleFilterChange} />
          </div>

          {/* Mobile Filter Sidebar */}
          <PizzaFilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
          />

          {/* Products Grid/List */}
          <div className="flex-1 min-h-0">
            <div className="mb-4 text-sm text-gray-600">{filteredPizzas.length} pizza bulundu</div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPizzas.map((pizza) => (
                  <Card key={pizza.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={pizza.image || "/placeholder.svg"}
                          alt={pizza.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      <h3 className="font-semibold text-gray-800 mb-2">{pizza.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{pizza.description}</p>

                      <div className="mb-4">
                        <span className="text-2xl font-bold text-orange-600">{pizza.price} TL</span>
                      </div>

                      <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white" asChild>
                        <Link href={`/urun/${pizza.id}`}>Sipariş Ver</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPizzas.map((pizza) => (
                  <Card key={pizza.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <img
                          src={pizza.image || "/placeholder.svg"}
                          alt={pizza.name}
                          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">{pizza.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{pizza.description}</p>
                              <span className="text-2xl font-bold text-orange-600">{pizza.price} TL</span>
                            </div>
                            <Button className="bg-gray-800 hover:bg-gray-900 text-white" asChild>
                              <Link href={`/urun/${pizza.id}`}>Sipariş Ver</Link>
                            </Button>
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
