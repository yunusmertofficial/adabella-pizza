"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { MobileProfileSidebar } from "@/components/mobile-profile-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Clock, CheckCircle, Truck } from "lucide-react"

export default function PizzaTakipPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)

  const handleTrackOrder = () => {
    // Fake tracking data
    const fakeTrackingData = {
      orderNumber: "ADL-2024-006",
      status: "Yolda",
      estimatedTime: "15-20 dakika",
      steps: [
        { title: "Sipariş Alındı", completed: true, time: "20:15" },
        { title: "Hazırlanıyor", completed: true, time: "20:18" },
        { title: "Pişiriliyor", completed: true, time: "20:25" },
        { title: "Yolda", completed: true, time: "20:35", current: true },
        { title: "Teslim Edildi", completed: false, time: "" },
      ],
      items: ["1x Margarita Pizza (Büyük)", "1x Coca Cola 1L"],
      total: "245 TL",
      address: "İstanbul Başakşehir Güvercintepe Mah. Örnek Sok. No:15",
      courier: "Mehmet Yılmaz",
      courierPhone: "0532 123 45 67",
    }

    setTrackingResult(fakeTrackingData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <nav className="text-sm text-gray-600">
            <span>Anasayfa</span> &gt; <span className="text-gray-900">Pizza Takip</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Pizza Takip</h1>
        </div>

        {/* Mobile Profile Menu */}
        <MobileProfileSidebar />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <ProfileSidebar />
          </div>

          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Sipariş Takip */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg md:text-xl">Sipariş Takip</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orderNumber">Sipariş Numarası</Label>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-1">
                      <Input
                        id="orderNumber"
                        placeholder="Sipariş numaranızı giriniz"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleTrackOrder} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                        Görüntüle
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Result */}
            {trackingResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Sipariş Durumu - {trackingResult.orderNumber}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 md:space-y-6">
                    {/* Current Status */}
                    <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                        <div>
                          <h3 className="font-semibold text-blue-900 text-sm md:text-base">
                            Mevcut Durum: {trackingResult.status}
                          </h3>
                          <p className="text-blue-700 text-sm">Tahmini Teslimat: {trackingResult.estimatedTime}</p>
                        </div>
                        <Truck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Sipariş Süreci</h4>
                      <div className="space-y-3">
                        {trackingResult.steps.map((step: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                step.completed
                                  ? "bg-green-600 text-white"
                                  : step.current
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                              ) : step.current ? (
                                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                              ) : (
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <span
                                  className={`font-medium text-sm md:text-base ${
                                    step.current ? "text-blue-600" : step.completed ? "text-green-600" : "text-gray-500"
                                  }`}
                                >
                                  {step.title}
                                </span>
                                {step.time && <span className="text-xs md:text-sm text-gray-500">{step.time}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Sipariş Detayları</h4>
                        <div className="space-y-1 text-sm">
                          {trackingResult.items.map((item: string, index: number) => (
                            <p key={index}>• {item}</p>
                          ))}
                          <p className="font-semibold text-orange-600 mt-2">Toplam: {trackingResult.total}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Teslimat Bilgileri</h4>
                        <div className="space-y-1 text-sm">
                          <p>{trackingResult.address}</p>
                          <p>Kurye: {trackingResult.courier}</p>
                          <p>Telefon: {trackingResult.courierPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Digital Pizza Tracking System */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">Digital Pizza Takip Sistemi</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm md:text-base">
                    Sipariş verdiğin anda, Adabella Pizza şubesinden sipariş durumları anlık olarak alınır ve sana özel
                    pizza takip sayfasına yansıtılır. Siparişlerin durumlarını web'ten ya da cepten anlık olarak takip
                    edebilirsin.
                  </p>
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                    <p className="font-semibold text-blue-900 text-sm md:text-base">
                      Hemen sipariş var, her an takipte ol!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
