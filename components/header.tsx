"use client"

import { useState } from "react"
import { User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { CartDropdown } from "@/components/cart-dropdown"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Kullanıcı giriş durumu (gerçek uygulamada bir auth context'ten gelecek)
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const menuItems = [
    { name: "Tüm Kampanyalar", href: "/kampanyalar" },
    { name: "Tüm Pizzalar", href: "/pizzalar" },
    { name: "Ekstralar & İçecekler", href: "/ekstralar" },
  ]

  return (
    <>
      <header className="bg-black text-white sticky top-0 z-[9999] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button + Logo */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:text-red-500"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-xl font-bold">Adabella Pizza</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href} className="hover:text-red-500 transition-colors">
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Profile Dropdown - sadece desktop'ta görünecek */}
              <div className="hidden md:block">
                <ProfileDropdown />
              </div>

              <CartDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] md:hidden" onClick={toggleMobileMenu}>
          <div
            className="fixed left-0 top-0 w-full h-full bg-white shadow-lg z-[9999] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-xl font-bold">Adabella Pizza</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-6">
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block py-4 px-4 text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-lg font-medium border-b border-gray-100 last:border-b-0"
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Profile Button - En altta */}
            <div className="p-6 border-t border-gray-200">
              {isLoggedIn ? (
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold rounded-lg"
                  asChild
                >
                  <Link href="/profil/bilgilerim" onClick={toggleMobileMenu}>
                    <User className="h-5 w-5 mr-2" />
                    Profilim
                  </Link>
                </Button>
              ) : (
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-lg">
                  <User className="h-5 w-5 mr-2" />
                  Giriş Yap
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
