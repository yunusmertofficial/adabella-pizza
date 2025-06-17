"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { MobileProfileSidebar } from "@/components/mobile-profile-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function NotlarimPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <nav className="text-sm text-gray-600">
            <span>Anasayfa</span> &gt; <span className="text-gray-900">Notlarım</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Notlarım</h1>
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
                <CardTitle className="text-lg md:text-xl">Sipariş Notlarım</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 md:py-8 text-gray-500">
                  <FileText className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm md:text-base">Henüz kaydedilmiş notunuz bulunmamaktadır.</p>
                  <p className="text-xs md:text-sm">Sipariş verirken özel notlarınızı kaydedebilirsiniz.</p>
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
