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
import { Eye, EyeOff, Lock } from "lucide-react"

export default function SifreDegistirPage() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Yeni şifreler eşleşmiyor!")
      return
    }
    if (passwords.new.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!")
      return
    }
    alert("Şifreniz başarıyla değiştirildi!")
    setPasswords({ current: "", new: "", confirm: "" })
  }

  const passwordRequirements = [
    { text: "Minimum 6 karakter olmalı", met: passwords.new.length >= 6 },
    { text: "En az bir büyük harf içermeli", met: /[A-Z]/.test(passwords.new) },
    { text: "En az bir küçük harf içermeli", met: /[a-z]/.test(passwords.new) },
    { text: "Şifreler eşleşmeli", met: passwords.new === passwords.confirm && passwords.new.length > 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <nav className="text-sm text-gray-600">
            <span>Anasayfa</span> &gt; <span className="text-gray-900">Şifre Değiştir</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Şifre Değiştir</h1>
        </div>

        {/* Mobile Profile Menu */}
        <MobileProfileSidebar />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <ProfileSidebar />
          </div>

          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg md:text-xl">Şifre Güncelleme</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <p className="text-gray-600 text-sm md:text-base">
                  Aşağıda belirtilen standartlara göre şifrenizi güncellemeniz gerekmektedir. Şifrenizi güncelledikten
                  sonra otomatik olarak yeni şifre ile giriş yapılacaksınız.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Eski Şifre</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="Eski şifrenizi giriniz"
                        value={passwords.current}
                        onChange={(e) => handlePasswordChange("current", e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Yeni Şifre</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Yeni şifrenizi giriniz"
                        value={passwords.new}
                        onChange={(e) => handlePasswordChange("new", e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="Yeni şifrenizi tekrar giriniz"
                        value={passwords.confirm}
                        onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm md:text-base">Şifre Gereksinimleri:</h4>
                  <ul className="space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center ${
                            req.met ? "bg-green-600" : "bg-gray-300"
                          }`}
                        >
                          {req.met && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`text-xs md:text-sm ${req.met ? "text-green-600" : "text-gray-500"}`}>
                          {req.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 py-3">
                  Değiştir
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
