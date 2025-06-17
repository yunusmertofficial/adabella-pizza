"use client"

import { X, Truck, Store, User, ChevronRight, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MethodSelectionModalProps {
  onClose: () => void
  onSelectMethod: (method: "address" | "pickup") => void
}

export function MethodSelectionModal({ onClose, onSelectMethod }: MethodSelectionModalProps) {
  return (
    <div className="relative flex flex-col h-full">
      <DialogHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
        <div className="w-5"></div>
        <DialogTitle className="text-center flex-1 text-xl font-bold text-blue-600">Merhaba!</DialogTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-0 h-auto">
          <X className="h-5 w-5" />
        </Button>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">Siparişini nasıl almak istersin?</p>
        </div>

        <div className="space-y-4">
          {/* Address Delivery */}
          <div
            className="relative p-4 border-2 border-green-200 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-colors"
            onClick={() => onSelectMethod("address")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 text-lg">Adrese Teslim</h3>
                  <p className="text-green-600 text-sm">Siparişini adresine getirelim.</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-green-600" />
            </div>
          </div>

          {/* Pickup */}
          <div
            className="relative p-4 border-2 border-blue-200 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => onSelectMethod("pickup")}
          >
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Gel Al'a Özel İndirimler!
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg">Beklemeden Gel Al</h3>
                  <p className="text-blue-600 text-sm">Sıra beklemeden şubeden teslim al.</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>İster restoranda ye</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>İster paket teslim al</span>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          {/* Member Login */}
          <div className="relative p-4 border-2 border-gray-200 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Üye Girişi / Üye Ol</h3>
                  <p className="text-gray-600 text-sm">Giriş yap / üye ol ve avantajlardan faydalanı</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
