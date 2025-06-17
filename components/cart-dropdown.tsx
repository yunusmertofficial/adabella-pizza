"use client"

import { useState } from "react"
import { ShoppingCart, Minus, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Fake cart data - gerçek uygulamada bu global state'den gelecek
const fakeCartItems = [
  {
    id: "1",
    name: "2 Orta Boy Süperix veya Margarita",
    description: "Orta Boy Süperix Klasik Kenar İnce Hamur, Orta Boy Süperix Klasik Kenar İnce Hamur",
    price: 350,
    quantity: 1,
    image: "/placeholder.svg?height=60&width=60",
    type: "campaign",
  },
  {
    id: "2",
    name: "2 Orta Boy Pan Cazip Pizzalar",
    description:
      "Orta Boy Bol Sucuksever Pan Pizza Klasik Kenar Pan Hamur, Orta Boy Süperix Pan Pizza Klasik Kenar Pan Hamur",
    price: 390,
    quantity: 1,
    image: "/placeholder.svg?height=60&width=60",
    type: "campaign",
  },
]

export function CartDropdown() {
  const [cartItems, setCartItems] = useState(fakeCartItems)
  const [isOpen, setIsOpen] = useState(false)

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)),
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId))
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getDiscountedTotal = () => {
    const total = getTotalPrice()
    const discount = 200 // CEPTE200 promosyon kodu
    return Math.max(0, total - discount)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:text-red-500 relative">
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0 max-h-[85vh] overflow-hidden z-[10000]" sideOffset={5}>
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <h3 className="font-semibold text-lg">Sepetim</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex-1 flex flex-col items-center justify-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Sepetiniz boş</p>
              <p className="text-sm">Lezzetli ürünlerimizi keşfedin!</p>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 border-b last:border-b-0">
                    <div className="flex space-x-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-orange-600 text-sm">{item.price * item.quantity} TL</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Banner - Fixed */}
              <div className="p-4 bg-green-50 border-t flex-shrink-0">
                <div className="flex items-center space-x-2 text-green-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm font-medium">
                    CEPTE200 promosyon kodu ile sepette 200 TL indirim seni bekliyor.
                  </span>
                </div>
              </div>

              {/* Total Section - Fixed */}
              <div className="p-4 bg-gray-800 text-white flex-shrink-0 rounded-b-lg">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Ara Toplam:</span>
                    <span>{getTotalPrice()} TL</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span>İndirim (CEPTE200):</span>
                    <span>-200 TL</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Toplam</span>
                      <span className="text-xl font-bold">{getDiscountedTotal()} TL</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to checkout
                    console.log("Sepete git clicked")
                  }}
                >
                  Sepete Git
                </Button>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
