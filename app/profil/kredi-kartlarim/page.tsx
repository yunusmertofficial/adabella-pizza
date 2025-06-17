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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Plus, Trash2, Edit } from "lucide-react"

const fakeCreditCards = [
  {
    id: 1,
    name: "Kişisel Kartım",
    number: "**** **** **** 1234",
    fullNumber: "1234567812341234",
    type: "Visa",
    expiry: "12/26",
    expiryMonth: "12",
    expiryYear: "26",
    holderName: "YUNUS EMRE MERT",
    isDefault: true,
  },
  {
    id: 2,
    name: "İş Kartım",
    number: "**** **** **** 5678",
    fullNumber: "5678901256785678",
    type: "Mastercard",
    expiry: "08/25",
    expiryMonth: "08",
    expiryYear: "25",
    holderName: "YUNUS EMRE MERT",
    isDefault: false,
  },
]

export default function KrediKartlarimPage() {
  const [cards, setCards] = useState(fakeCreditCards)
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [isEditCardOpen, setIsEditCardOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<any>(null)
  const [newCard, setNewCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
    holderName: "",
  })

  const handleAddCard = () => {
    const card = {
      id: cards.length + 1,
      name: newCard.name,
      number: `**** **** **** ${newCard.number.slice(-4)}`,
      fullNumber: newCard.number,
      type: newCard.number.startsWith("4") ? "Visa" : "Mastercard",
      expiry: newCard.expiry,
      expiryMonth: newCard.expiry.split("/")[0],
      expiryYear: newCard.expiry.split("/")[1],
      holderName: newCard.holderName,
      isDefault: cards.length === 0,
    }
    setCards([...cards, card])
    setNewCard({ name: "", number: "", expiry: "", cvv: "", holderName: "" })
    setIsAddCardOpen(false)
    alert("Kart başarıyla eklendi!")
  }

  const handleEditCard = () => {
    if (!editingCard) return

    const updatedCards = cards.map((card) =>
      card.id === editingCard.id
        ? {
            ...card,
            name: editingCard.name,
            holderName: editingCard.holderName,
            expiry: editingCard.expiry,
            expiryMonth: editingCard.expiry.split("/")[0],
            expiryYear: editingCard.expiry.split("/")[1],
          }
        : card,
    )
    setCards(updatedCards)
    setIsEditCardOpen(false)
    setEditingCard(null)
    alert("Kart başarıyla güncellendi!")
  }

  const handleDeleteCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleSetDefault = (id: number) => {
    const updatedCards = cards.map((card) => ({
      ...card,
      isDefault: card.id === id,
    }))
    setCards(updatedCards)
    alert("Varsayılan kart güncellendi!")
  }

  const openEditModal = (card: any) => {
    setEditingCard({
      ...card,
      expiry: `${card.expiryMonth}/${card.expiryYear}`,
    })
    setIsEditCardOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <nav className="text-sm text-gray-600">
            <span>Anasayfa</span> &gt; <span className="text-gray-900">Kredi Kartlarım</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Kredi Kartlarım</h1>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-lg md:text-xl">Kayıtlı Kartlarım</CardTitle>
                  <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Kart Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md mx-4">
                      <DialogHeader>
                        <DialogTitle>Yeni Kart Ekle</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">Kart Adı</Label>
                          <Input
                            id="cardName"
                            placeholder="Örn: Kişisel Kartım"
                            value={newCard.name}
                            onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Kart Numarası</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={newCard.number}
                            onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="holderName">Kart Sahibi Adı</Label>
                          <Input
                            id="holderName"
                            placeholder="YUNUS EMRE MERT"
                            value={newCard.holderName}
                            onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Son Kullanma</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={newCard.expiry}
                              onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={newCard.cvv}
                              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddCard} className="w-full bg-green-600 hover:bg-green-700">
                          Kartı Ekle
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {cards.length === 0 ? (
                  <div className="text-center py-6 md:py-8 text-gray-500">
                    <CreditCard className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm md:text-base">Henüz kayıtlı kartınız bulunmamaktadır.</p>
                    <p className="text-xs md:text-sm">Hızlı ödeme için kart ekleyebilirsiniz.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cards.map((card) => (
                      <div key={card.id} className="border rounded-lg p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-3 md:space-y-0">
                          <div className="flex items-center space-x-3 md:space-x-4">
                            <div className="w-10 h-6 md:w-12 md:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                              <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm md:text-base">{card.name}</h3>
                              <p className="text-xs md:text-sm text-gray-600">
                                {card.type} {card.number}
                              </p>
                              <p className="text-xs text-gray-500">Son Kullanma: {card.expiry}</p>
                              <p className="text-xs text-gray-500">Kart Sahibi: {card.holderName}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditModal(card)} className="text-xs">
                              <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Düzenle
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="mx-4">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Kartı Sil</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bu kartı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`default-${card.id}`}
                              checked={card.isDefault}
                              onCheckedChange={() => handleSetDefault(card.id)}
                            />
                            <Label htmlFor={`default-${card.id}`} className="text-xs md:text-sm">
                              Varsayılan kart olarak kullan
                            </Label>
                          </div>
                          {card.isDefault && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Varsayılan Kart
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Card Modal */}
      <Dialog open={isEditCardOpen} onOpenChange={setIsEditCardOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Kartı Düzenle</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCardName">Kart Adı</Label>
                <Input
                  id="editCardName"
                  placeholder="Örn: Kişisel Kartım"
                  value={editingCard.name}
                  onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editCardNumber">Kart Numarası</Label>
                <Input id="editCardNumber" value={editingCard.number} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500 mt-1">Güvenlik nedeniyle kart numarası değiştirilemez</p>
              </div>
              <div>
                <Label htmlFor="editHolderName">Kart Sahibi Adı</Label>
                <Input
                  id="editHolderName"
                  placeholder="YUNUS EMRE MERT"
                  value={editingCard.holderName}
                  onChange={(e) => setEditingCard({ ...editingCard, holderName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editExpiry">Son Kullanma Tarihi</Label>
                <Input
                  id="editExpiry"
                  placeholder="MM/YY"
                  value={editingCard.expiry}
                  onChange={(e) => setEditingCard({ ...editingCard, expiry: e.target.value })}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button onClick={() => setIsEditCardOpen(false)} variant="outline" className="flex-1">
                  İptal
                </Button>
                <Button onClick={handleEditCard} className="flex-1 bg-green-600 hover:bg-green-700">
                  Güncelle
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
