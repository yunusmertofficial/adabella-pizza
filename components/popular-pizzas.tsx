"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const pizzas = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: "180 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella peyniri, fesleğen",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: "220 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, pepperoni",
  },
  {
    id: 3,
    name: "Karışık Pizza",
    price: "250 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, sucuk, salam, mantar",
  },
  {
    id: 4,
    name: "Vejeteryan Pizza",
    price: "200 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, sebzeler",
  },
  {
    id: 5,
    name: "Ton Balıklı Pizza",
    price: "240 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, ton balığı, soğan",
  },
  {
    id: 6,
    name: "Sucuklu Pizza",
    price: "210 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    description: "Domates sosu, mozzarella, sucuk",
  },
]

export function PopularPizzas() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerView >= pizzas.length ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, pizzas.length - itemsPerView) : prev - 1))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Popüler Pizzalar</h2>
        <div className="hidden md:flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= pizzas.length}
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
          {pizzas.map((pizza) => (
            <div key={pizza.id} className="w-1/4 flex-shrink-0 px-2">
              <Card className="h-full hover:shadow-lg transition-shadow">
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
                    <div className="text-2xl font-bold text-orange-600">{pizza.price}</div>
                    <div className="text-sm text-gray-500">{pizza.originalPrice}</div>
                  </div>

                  <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white" asChild>
                    <Link href={`/urun/${pizza.id}`}>Sipariş Ver</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {pizzas.map((pizza) => (
          <Card key={pizza.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <img
                  src={pizza.image || "/placeholder.svg"}
                  alt={pizza.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{pizza.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pizza.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-orange-600">{pizza.price}</div>
                      <div className="text-xs text-gray-500">{pizza.originalPrice}</div>
                    </div>
                    <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white" asChild>
                      <Link href={`/urun/${pizza.id}`}>Sipariş Ver</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tüm Ürünler Button */}
      <div className="text-center mt-6">
        <Button size="lg" variant="outline" className="px-8">
          Tüm Ürünler
        </Button>
      </div>
    </div>
  )
}
