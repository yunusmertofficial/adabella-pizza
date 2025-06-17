"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { MobileProfileSidebar } from "@/components/mobile-profile-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function UyelikBilgilerimPage() {
  const [formData, setFormData] = useState({
    name: "Yunus Emre",
    surname: "Mert",
    email: "yunusemre@gmail.com",
    phone: "5308808637",
    birthDay: "15",
    birthMonth: "06",
    birthYear: "1990",
    occupation: "Yazılım Geliştirici",
    smsConsent: true,
    emailConsent: false,
    phoneConsent: true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Bilgiler kaydedildi:", formData)
    alert("Bilgileriniz başarıyla güncellendi!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 md:mb-6">
          <nav className="text-sm text-gray-600">
            <span>Anasayfa</span> &gt; <span className="text-gray-900">Üyelik Bilgilerim</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Üyelik Bilgilerim</h1>
        </div>

        {/* Mobile Profile Menu */}
        <MobileProfileSidebar />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Kişisel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Ad</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="surname">Soyad</Label>
                    <Input
                      id="surname"
                      value={formData.surname}
                      onChange={(e) => handleInputChange("surname", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-Posta Adresi</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" className="sm:ml-2 w-full sm:w-auto">
                      Güncelle
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Doğum Tarihi</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Select value={formData.birthDay} onValueChange={(value) => handleInputChange("birthDay", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gün" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.birthMonth}
                      onValueChange={(value) => handleInputChange("birthMonth", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ay" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Ocak",
                          "Şubat",
                          "Mart",
                          "Nisan",
                          "Mayıs",
                          "Haziran",
                          "Temmuz",
                          "Ağustos",
                          "Eylül",
                          "Ekim",
                          "Kasım",
                          "Aralık",
                        ].map((month, index) => (
                          <SelectItem key={index + 1} value={String(index + 1)}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={formData.birthYear} onValueChange={(value) => handleInputChange("birthYear", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Yıl" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => (
                          <SelectItem key={2024 - i} value={String(2024 - i)}>
                            {2024 - i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="occupation">Meslek</Label>
                  <Select value={formData.occupation} onValueChange={(value) => handleInputChange("occupation", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yazılım Geliştirici">Yazılım Geliştirici</SelectItem>
                      <SelectItem value="Öğretmen">Öğretmen</SelectItem>
                      <SelectItem value="Doktor">Doktor</SelectItem>
                      <SelectItem value="Mühendis">Mühendis</SelectItem>
                      <SelectItem value="Öğrenci">Öğrenci</SelectItem>
                      <SelectItem value="Diğer">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">İletişim Tercihleri</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="sms"
                        checked={formData.smsConsent}
                        onCheckedChange={(checked) => handleInputChange("smsConsent", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="sms" className="text-sm leading-relaxed">
                        SMS ile kampanya ve fırsatlardan haberdar olmak istiyorum
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="email"
                        checked={formData.emailConsent}
                        onCheckedChange={(checked) => handleInputChange("emailConsent", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="email" className="text-sm leading-relaxed">
                        E-Posta ile kampanya ve fırsatlardan haberdar olmak istiyorum
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="phone"
                        checked={formData.phoneConsent}
                        onCheckedChange={(checked) => handleInputChange("phoneConsent", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="phone" className="text-sm leading-relaxed">
                        Telefon ile kampanya ve fırsatlardan haberdar olmak istiyorum
                      </Label>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 py-3">
                  Değişiklikleri Kaydet
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
