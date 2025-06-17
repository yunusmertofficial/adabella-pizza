"use client"
import { User, ChevronDown, Settings, CreditCard, Package, MapPin, Lock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white border-0">
          <User className="h-4 w-4 mr-2" />
          Profilim
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-[10000]">
        <DropdownMenuItem asChild>
          <Link href="/profil/bilgilerim" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Üyelik Bilgilerim
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profil/siparislerim" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Siparişlerim
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profil/pizza-takip" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Pizza Takip
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profil/notlarim" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Notlarım
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profil/kredi-kartlarim" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Kredi Kartlarım
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profil/sifre-degistir" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Şifre Değiştir
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
