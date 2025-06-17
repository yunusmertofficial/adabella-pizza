"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, ShoppingCart, ChevronRight } from "lucide-react"
import { campaigns } from "@/app/api/mock-data"

// Kampanya ürün seçenekleri
const campaignProductOptions = [
  { id: "1", name: "Margarita Pizza", category: "pizza" },
  { id: "2", name: "Süperix Pizza", category: "pizza" },
  { id: "3", name: "Pepperoni Pizza", category: "pizza" },
  { id: "4", name: "Karışık Pizza", category: "pizza" },
  { id: "5", name: "Vejeteryan Pizza", category: "pizza" },
  { id: "6", name: "Ton Balıklı Pizza", category: "pizza" },
]

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<any>(null)
  const [campaignSelections, setCampaignSelections] = useState<{ [key: string]: string }>({})
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const foundCampaign = campaigns.find((c) => c.id === campaignId)
    if (foundCampaign) {
      setCampaign(foundCampaign)
    }
  }, [campaignId])

  const handleCampaignSelection = (productIndex: string, selectedProductId: string) => {
    setCampaignSelections({
      ...campaignSelections,
      [productIndex]: selectedProductId,
    })
  }

  const calculatePrice = () => {
    if (!campaign) return 0
    return campaign.price * quantity
  }

  const addToCart = () => {
    const cartItem = {
      campaignId: campaign.id,
      name: campaign.title,
      type: "campaign",
      selections: campaignSelections,
      quantity,
      unitPrice: campaign.price,
      totalPrice: calculatePrice(),
    }

    console.log("Sepete eklendi:", cartItem)
    alert("Kampanya sepete eklendi!")
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Kampanya bulunamadı</div>
        </div>
        <Footer />
      </div>
    )
  }

  const campaignProductCount = campaign.title.includes("2 Orta") ? 2 : campaign.title.includes("3 Orta") ? 3 : 2

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span>Ana Sayfa</span> &gt; <span>Tüm Kampanyalar</span> &gt;{" "}
          <span className="text-gray-900">{campaign.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol taraf - Kampanya görseli */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {campaign.badge && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white">{campaign.badge}</Badge>
              )}
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">Kampanya Detayları</h3>
              <p className="text-orange-700 text-sm">{campaign.description}</p>
              {campaign.originalPrice && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500 line-through">{campaign.originalPrice} TL</span>
                  <span className="ml-2 text-lg font-bold text-orange-600">{campaign.price} TL</span>
                  <span className="ml-2 text-sm text-green-600">
                    {Math.round(((campaign.originalPrice - campaign.price) / campaign.originalPrice) * 100)}% İndirim!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sağ taraf - Ürün seçimleri */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
              <p className="text-gray-600">Kampanyaya dahil ürünleri seçiniz</p>
            </div>

            {/* Ürün seçimleri */}
            <div className="space-y-4">
              {Array.from({ length: campaignProductCount }, (_, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Ürün {index + 1}</h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <Select
                    value={campaignSelections[`product_${index}`] || ""}
                    onValueChange={(value) => handleCampaignSelection(`product_${index}`, value)}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Seçiniz.." />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignProductOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Fiyat ve Miktar */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Fiyat</span>
                <span className="text-2xl font-bold text-orange-600">{campaign.price} TL</span>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sepete Ekle */}
            <Button
              onClick={addToCart}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              size="lg"
              disabled={Object.keys(campaignSelections).length < campaignProductCount}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Sepete Ekle - {calculatePrice()} TL
            </Button>

            {Object.keys(campaignSelections).length < campaignProductCount && (
              <p className="text-sm text-red-600 text-center">
                Lütfen tüm ürünleri seçiniz ({Object.keys(campaignSelections).length}/{campaignProductCount})
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
