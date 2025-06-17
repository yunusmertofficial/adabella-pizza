"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { MobileProfileSidebar } from "@/components/mobile-profile-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Package, CheckCircle } from "lucide-react"

const fakeOrders = [
  {
    id: "ADL-2024-001",
    date: "15 Ocak 2024",
    time: "19:30",
    status: "Teslim Edildi",
    statusColor: "bg-green-100 text-green-800",
    total: "285 TL",
    items: ["2x Margarita Pizza (Orta)", "1x Coca Cola 1L", "1x Garlic Bread"],
    address: "İstanbul Başakşehir Güvercintepe Mah.",
  },
  {
    id: "ADL-2024-002",
    date: "12 Ocak 2024",
    time: "20:15",
    status: "Teslim Edildi",
    statusColor: "bg-green-100 text-green-800",
    total: "420 TL",
    items: ["1x Pepperoni Pizza (Büyük)", "1x Karışık Pizza (Orta)", "2x Fanta 500ml"],
    address: "İstanbul Başakşehir Güvercintepe Mah.",
  },
  {
    id: "ADL-2024-003",
    date: "8 Ocak 2024",
    time: "18:45",
    status: "Teslim Edildi",
    statusColor: "bg-green-100 text-green-800",
    total: "350 TL",
    items: ["3x Küçük Pizza Kampanyası", "1x Sprite 1L"],
    address: "İstanbul Başakşehir Güvercintepe Mah.",
  },
  {
    id: "ADL-2024-004",
    date: "5 Ocak 2024",
    time: "21:00",
    status: "Teslim Edildi",
    statusColor: "bg-green-100 text-green-800",
    total: "195 TL",
    items: ["1x Vejeteryan Pizza (Orta)", "1x Ayran 250ml"],
    address: "İstanbul Başakşehir Güvercintepe Mah.",
  },
  {
    id: "ADL-2024-005",
    date: "2 Ocak 2024",
    time: "19:20",
    status: "Teslim Edildi",
    statusColor: "bg-green-100 text-green-800",
    total: "480 TL",
    items: ["2x Büyük Pizza + İçecek Kampanyası", "1x Chicken Wings"],
    address: "İstanbul Başakşehir Güvercintepe Mah.",
  },
]

export default function SiparislerimPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <nav className="text-sm text-gray-600">
            <span>Anasayfa</span> &gt; <span className="text-gray-900">Siparişlerim</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Siparişlerim</h1>
        </div>

        {/* Mobile Profile Menu */}
        <MobileProfileSidebar />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <ProfileSidebar />
          </div>

          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Aktif Siparişler */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg">Aktif Siparişlerim</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <Package className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm md:text-base">Şu anda aktif siparişiniz bulunmamaktadır.</p>
                </div>
              </CardContent>
            </Card>

            {/* Eski Siparişler */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Eski Siparişlerim</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fakeOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 space-y-2 md:space-y-0">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">Sipariş #{order.id}</h3>
                            <Badge className={order.statusColor}>{order.status}</Badge>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {order.date} - {order.time}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">{order.address}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-lg md:text-xl font-bold text-orange-600">{order.total}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Sipariş Detayları:</h4>
                        <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Detayları Görüntüle
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Tekrar Sipariş Ver
                        </Button>
                      </div>
                    </div>
                  ))}
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
