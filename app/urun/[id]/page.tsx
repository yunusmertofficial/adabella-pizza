"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ShoppingCart, Star, Heart, X, RotateCcw } from "lucide-react"
import { products } from "@/app/api/mock-data"

// Ek malzemeler
const extraIngredients = [
  { id: "extra-cheese", name: "Ekstra Peynir", price: 15 },
  { id: "pepperoni", name: "Pepperoni", price: 20 },
  { id: "mushroom", name: "Mantar", price: 12 },
  { id: "olive", name: "Zeytin", price: 10 },
  { id: "tomato", name: "Domates", price: 8 },
  { id: "onion", name: "Soğan", price: 8 },
  { id: "pepper", name: "Biber", price: 10 },
  { id: "corn", name: "Mısır", price: 12 },
]

// Boyut fiyat çarpanları
const sizeMultipliers = {
  Küçük: 0.8,
  Orta: 1.0,
  Büyük: 1.3,
  "X-Large": 1.6,
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])

  useEffect(() => {
    // Sadece pizzaları getir (categoryId === "1")
    const foundProduct = products.find((p) => p.id === productId && p.categoryId === "1")
    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedSize(foundProduct.sizes[1] || foundProduct.sizes[0]) // Varsayılan olarak orta boy

      // Önerilen ürünleri getir (içecekler ve ekstralar)
      const recommended = products
        .filter((p) => p.categoryId === "2" || p.categoryId === "3") // İçecekler ve ekstralar
        .slice(0, 6)
      setRecommendedProducts(recommended)
    }
  }, [productId])

  const handleExtraChange = (extraId: string, checked: boolean) => {
    if (checked) {
      setSelectedExtras([...selectedExtras, extraId])
    } else {
      setSelectedExtras(selectedExtras.filter((id) => id !== extraId))
    }
  }

  const handleRemoveIngredient = (ingredient: string) => {
    setRemovedIngredients([...removedIngredients, ingredient])
  }

  const handleAddBackIngredient = (ingredient: string) => {
    setRemovedIngredients(removedIngredients.filter((ing) => ing !== ingredient))
  }

  const calculatePrice = () => {
    if (!product) return 0

    const basePrice = product.price * (sizeMultipliers[selectedSize as keyof typeof sizeMultipliers] || 1)
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = extraIngredients.find((e) => e.id === extraId)
      return total + (extra?.price || 0)
    }, 0)

    return (basePrice + extrasPrice) * quantity
  }

  const addToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      type: "pizza",
      size: selectedSize,
      extras: selectedExtras.map((id) => extraIngredients.find((e) => e.id === id)).filter(Boolean),
      removedIngredients,
      quantity,
      notes,
      unitPrice: calculatePrice() / quantity,
      totalPrice: calculatePrice(),
    }

    console.log("Sepete eklendi:", cartItem)
    alert("Pizza sepete eklendi!")
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Pizza bulunamadı</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span>Anasayfa</span> &gt; <span>Tüm Pizzalar</span> &gt;{" "}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ürün Görseli */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.badges && product.badges.length > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white">{product.badges[0]}</Badge>
              )}
              <Button variant="outline" size="icon" className="absolute top-4 right-4 bg-white hover:bg-gray-100">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Ürün Değerlendirmeleri */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8) • 127 değerlendirme</span>
            </div>
          </div>

          {/* Ürün Detayları */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
            </div>

            {/* Mevcut Malzemeler - Çıkarılabilir */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Malzemeler:</h3>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {product.ingredients.map((ingredient: string, index: number) => {
                    const isRemoved = removedIngredients.includes(ingredient)
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 border rounded-lg transition-all ${
                          isRemoved ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${isRemoved ? "bg-red-500" : "bg-green-500"}`} />
                          <span className={`${isRemoved ? "text-red-600 line-through" : "text-green-700"}`}>
                            {ingredient}
                          </span>
                          {isRemoved && <span className="text-xs text-red-500">(Çıkarıldı)</span>}
                        </div>
                        {isRemoved ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddBackIngredient(ingredient)}
                            className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Tekrar Ekle
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveIngredient(ingredient)}
                            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Çıkar
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
                {removedIngredients.length > 0 && (
                  <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
                    💡 Malzeme çıkarma işlemi fiyatı etkilemez. Bu malzemeler zaten pizzanın içinde bulunmaktadır.
                  </div>
                )}
              </div>
            )}

            {/* Boyut Seçimi */}
            {product.sizes && product.sizes.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3">Boyut Seçin:</h3>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid grid-cols-2 gap-3">
                    {product.sizes.map((size: string) => (
                      <div key={size} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                        <RadioGroupItem value={size} id={size} />
                        <Label htmlFor={size} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span>{size}</span>
                            <span className="font-semibold text-orange-600">
                              {Math.round(product.price * (sizeMultipliers[size as keyof typeof sizeMultipliers] || 1))}{" "}
                              TL
                            </span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Ek Malzemeler */}
            <div>
              <h3 className="font-semibold mb-3">Ek Malzemeler:</h3>
              <div className="text-xs text-blue-600 mb-2">💰 Ek ücret karşılığında ekleyebileceğiniz malzemeler</div>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {extraIngredients.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={extra.id}
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={(checked) => handleExtraChange(extra.id, checked as boolean)}
                      />
                      <Label htmlFor={extra.id} className="cursor-pointer">
                        {extra.name}
                      </Label>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">+{extra.price} TL</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Özel Notlar */}
            <div>
              <h3 className="font-semibold mb-2">Özel Notlar:</h3>
              <Textarea
                placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Miktar ve Fiyat */}
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Adet:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{calculatePrice()} TL</div>
                {quantity > 1 && (
                  <div className="text-sm text-gray-600">({Math.round(calculatePrice() / quantity)} TL / adet)</div>
                )}
              </div>
            </div>

            {/* Sepete Ekle Butonu */}
            <Button
              onClick={addToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Sepete Ekle - {calculatePrice()} TL
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Önerilen Ürünler */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Bunları da Deneyebilirsiniz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((recommendedProduct) => (
              <Card key={recommendedProduct.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={recommendedProduct.image || "/placeholder.svg"}
                      alt={recommendedProduct.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{recommendedProduct.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{recommendedProduct.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">{recommendedProduct.price} TL</span>
                    <Button size="sm" variant="outline">
                      Ekle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
