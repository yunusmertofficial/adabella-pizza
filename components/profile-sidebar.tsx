"use client"

import { Settings, Package, MapPin, CreditCard, Lock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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

export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm p-6">
      {menuItems.map((section, index) => (
        <div key={index}>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">{section.title}</h3>
          <nav className="space-y-2">
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
  )
}
