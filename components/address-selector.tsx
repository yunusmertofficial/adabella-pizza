"use client"

import { MapPin, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddressSelector() {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
        <MapPin className="h-4 w-4 text-red-600" />
        <span className="text-sm font-medium">Adrese Teslim</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">İstanbul Başakşehir Güvercintepe</span>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
