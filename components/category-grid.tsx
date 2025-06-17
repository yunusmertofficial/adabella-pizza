"use client"

import { Pizza, Gift, Coffee, Percent } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    title: "Tüm Kampanyalar",
    icon: Gift,
    color: "bg-yellow-100 text-yellow-600",
    hoverColor: "hover:bg-yellow-200",
  },
  {
    title: "Tüm Pizzalar",
    icon: Pizza,
    color: "bg-red-100 text-red-600",
    hoverColor: "hover:bg-red-200",
  },
  {
    title: "Ekstralar ve İçecekler",
    icon: Coffee,
    color: "bg-blue-100 text-blue-600",
    hoverColor: "hover:bg-blue-200",
  },
  {
    title: "Fırsatlar",
    icon: Percent,
    color: "bg-green-100 text-green-600",
    hoverColor: "hover:bg-green-200",
  },
]

export function CategoryGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const IconComponent = category.icon
          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 ${category.hoverColor} hover:shadow-lg hover:scale-105`}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-800">{category.title}</h3>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
