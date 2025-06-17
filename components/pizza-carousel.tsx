"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const campaigns = [
  {
    id: 1,
    name: "2 Orta Boy Süperix veya Margarita",
    price: "350 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    badge: null,
  },
  {
    id: 2,
    name: "2 Orta Boy Pan Cazip Pizzalar",
    price: "390 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    badge: "YENİ PAN150",
  },
  {
    id: 3,
    name: "Pizza X-Large Süperix veya Margarita",
    price: "320 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    badge: null,
  },
  {
    id: 4,
    name: "2 Orta Boy Bol Pan Pizza",
    price: "440 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    badge: "YENİ PAN150",
  },
  {
    id: 5,
    name: "Büyük Boy Süperix veya Margarita",
    price: "270 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    badge: null,
  },
  {
    id: 6,
    name: "3 Orta Boy Karışık Pizza",
    price: "580 TL",
    originalPrice: "den başlayan fiyatlarla",
    image: "/placeholder.svg?height=200&width=200",
    badge: null,
  },
]

export function PizzaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerView >= campaigns.length ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, campaigns.length - itemsPerView) : prev - 1))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Popüler Kampanyalar</h2>
        <div className="hidden md:flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= campaigns.length}
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
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="w-1/4 flex-shrink-0 px-2">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {campaign.badge && (
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white">{campaign.badge}</Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2 min-h-[3rem]">{campaign.name}</h3>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-600">{campaign.price}</div>
                    <div className="text-sm text-gray-500">{campaign.originalPrice}</div>
                  </div>

                  <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white" asChild>
                    <Link href={`/kampanya/${campaign.id}`}>Sipariş Ver</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{campaign.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-orange-600">{campaign.price}</div>
                      <div className="text-xs text-gray-500">{campaign.originalPrice}</div>
                    </div>
                    <Button size="sm" className="bg-gray-800 hover:bg-gray-900 text-white" asChild>
                      <Link href={`/kampanya/${campaign.id}`}>Sipariş Ver</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tüm Kampanyalar Button */}
      <div className="text-center mt-6">
        <Button size="lg" variant="outline" className="px-8">
          Tüm Kampanyalar
        </Button>
      </div>
    </div>
  )
}
