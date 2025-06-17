"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const beverages = [
  {
    id: 7,
    name: "Coca Cola 1L",
    price: 25,
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Soğuk ve ferahlatıcı",
  },
  {
    id: 8,
    name: "Fanta 1L",
    price: 25,
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Portakal aromalı",
  },
  {
    id: 9,
    name: "Sprite 1L",
    price: 25,
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Limon aromalı",
  },
  {
    id: 10,
    name: "Su 0.5L",
    price: 8,
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Doğal kaynak suyu",
  },
  {
    id: 11,
    name: "Ayran 250ml",
    price: 12,
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Geleneksel Türk içeceği",
  },
  {
    id: 12,
    name: "Meyve Suyu 200ml",
    price: 15,
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Çeşitli meyve aromaları",
  },
]

export function BeveragesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({})
  const itemsPerView = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerView >= beverages.length ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, beverages.length - itemsPerView) : prev - 1))
  }

  const addToCart = (beverageId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [beverageId]: (prev[beverageId] || 0) + 1,
    }))
  }

  const updateQuantity = (beverageId: number, change: number) => {
    setCartItems((prev) => {
      const newQuantity = (prev[beverageId] || 0) + change
      if (newQuantity <= 0) {
        const { [beverageId]: removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [beverageId]: newQuantity,
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">İçecekler</h2>
        <div className="hidden md:flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= beverages.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Carousel */}
      <div className="hidden md:block relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {beverages.map((beverage) => {
            const quantity = cartItems[beverage.id] || 0
            return (
              <div key={beverage.id} className="w-1/4 flex-shrink-0 px-2">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={beverage.image || "/placeholder.svg"}
                        alt={beverage.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2">{beverage.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{beverage.description}</p>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-orange-600">{beverage.price} TL</div>
                      <div className="text-sm text-gray-500">{beverage.originalPrice}</div>
                    </div>

                    {quantity === 0 ? (
                      <Button
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                        onClick={() => addToCart(beverage.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Sepete Ekle
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(beverage.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-lg">{quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(beverage.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {beverages.map((beverage) => {
          const quantity = cartItems[beverage.id] || 0
          return (
            <Card key={beverage.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <img
                    src={beverage.image || "/placeholder.svg"}
                    alt={beverage.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{beverage.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{beverage.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-orange-600">{beverage.price} TL</div>
                        <div className="text-xs text-gray-500">{beverage.originalPrice}</div>
                      </div>
                      {quantity === 0 ? (
                        <Button
                          size="sm"
                          className="bg-gray-800 hover:bg-gray-900 text-white"
                          onClick={() => addToCart(beverage.id)}
                        >
                          Sepete Ekle
                        </Button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(beverage.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-semibold">{quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(beverage.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tüm İçecekler Button */}
      <div className="text-center mt-6">
        <Button size="lg" variant="outline" className="px-8">
          Tüm İçecekler
        </Button>
      </div>
    </div>
  )
}
