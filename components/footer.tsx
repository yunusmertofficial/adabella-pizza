"use client"

import { Facebook, Twitter, Youtube, Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* App Download Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="text-sm">Google Play'den Al</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
            <div className="w-6 h-6 bg-white rounded"></div>
            <span className="text-sm">App Store'dan İndir</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span className="text-sm">AppGallery</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Messenger</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kurumsal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Yatırım Fırsatları
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Kişisel Verilerin Koruma Kanunu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Bilgi Toplum Hizmetleri
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Responsible Disclosure
                </a>
              </li>
            </ul>
          </div>

          {/* Yardım */}
          <div>
            <h3 className="font-bold text-lg mb-4">Yardım</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Bize Ulaşın
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Üyelik
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Sıkça Sorulan Sorular
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Alerjen Listesi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Tedarikçilerimizin Helal Belgeleri
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Hijyen Politikası
                </a>
              </li>
            </ul>
          </div>

          {/* İnovasyon Dünyası */}
          <div>
            <h3 className="font-bold text-lg mb-4">İnovasyon Dünyası</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Promosyonlar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pizza Takip
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Online Ödeme
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  30 Dakikada Kapında
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  %100 Müşteri Memnuniyeti
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Temassız Teslimat
                </a>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold text-lg mb-4">Sipariş Hattı</h3>
            <div className="text-2xl font-bold text-red-500 mb-4">444 33 22</div>

            <h4 className="font-bold mb-2">Şikayet / Öneri Hattı</h4>
            <div className="text-xl font-bold mb-4">0850 755 33 22</div>

            <div className="text-sm text-gray-300">info@adabellapizza.com.tr</div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-white">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Youtube className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-sm text-gray-400 border-t border-gray-800 pt-6">
          <p className="mb-2">Fiyatlarımız, Adabella Pizza'nın tavsiye ettiği ürün satış fiyatlarıdır.</p>
          <p>
            Ürünlerimizde kullandığımız soğan, sucuk, kuş sucuk, pepperoni, jambon ve hamburger köftesi pilç ve/veya
            hindi etinden üretilmiştir.
          </p>
        </div>
      </div>
    </footer>
  )
}
