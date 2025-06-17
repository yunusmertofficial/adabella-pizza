"use client"

import { Settings, Package, MapPin, CreditCard, Lock, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const menuItems = [
  {
    title: "Hesap Bilgilerim",
    items: [
      { name: "Üyelik Bilgilerim", href: "/profil/bilgilerim", icon: Settings },
      { name: "Siparişlerim", href: "/profil/siparislerim", icon: Package },
      { name: "Pizza Takip", href: "/profil/pizza-takip", icon: MapPin },
      { name: "Notlarım", href: "/profil/notlarim", icon: Settings },
      { name: "Kredi Kartlarım", href: "/profil/kredi-kartlarim", icon: CreditCard },
      { name: "Şifre Değiştir", href: "/profil/sifre-degistir", icon: Lock },
    ],
  },
]

export function MobileProfileSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  const currentPage = menuItems[0].items.find((item) => item.href === pathname)

  return (
    <Card className="md:hidden mb-6">
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full p-4 justify-between text-left"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            {currentPage && <currentPage.icon className="h-5 w-5 text-blue-600" />}
            <span className="font-medium">{currentPage?.name || "Profil Menüsü"}</span>
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {isExpanded && (
          <div className="border-t">
            {menuItems.map((section, index) => (
              <div key={index} className="p-4">
                <h3 className="text-sm font-semibold text-blue-600 mb-3">{section.title}</h3>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const IconComponent = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        )}
                        onClick={() => setIsExpanded(false)}
                      >
                        <IconComponent className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
