"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CampaignFilterSidebar } from "@/components/campaign-filter-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Grid, List } from "lucide-react";
import Link from "next/link";
import DeliveryMethodSelector from "@/components/delivery-method-selector/delivery-method-selector";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";

const campaigns = [
  {
    id: 1,
    name: "2 Orta Boy Süperix veya Margarita",
    price: 350,
    originalPrice: 450,
    image: "/placeholder.svg?height=200&width=200",
    badge: "YENİ",
    category: "Margarita",
    size: "Orta",
  },
  {
    id: 2,
    name: "2 Orta Boy Pan Cazip Pizzalar",
    price: 390,
    originalPrice: 500,
    image: "/placeholder.svg?height=200&width=200",
    badge: "PAN150",
    category: "Karışık",
    size: "Orta",
  },
  {
    id: 3,
    name: "Pizza X-Large Süperix veya Margarita",
    price: 320,
    originalPrice: 420,
    image: "/placeholder.svg?height=200&width=200",
    badge: null,
    category: "Margarita",
    size: "X-Large",
  },
  {
    id: 4,
    name: "2 Orta Boy Bol Pan Pizza",
    price: 440,
    originalPrice: 580,
    image: "/placeholder.svg?height=200&width=200",
    badge: "YENİ",
    category: "Pepperoni",
    size: "Orta",
  },
  {
    id: 5,
    name: "Büyük Boy Süperix veya Margarita",
    price: 270,
    originalPrice: 350,
    image: "/placeholder.svg?height=200&width=200",
    badge: null,
    category: "Margarita",
    size: "Büyük",
  },
  {
    id: 6,
    name: "3 Orta Boy Karışık Pizza",
    price: 580,
    originalPrice: 720,
    image: "/placeholder.svg?height=200&width=200",
    badge: "SÜPER FİYAT",
    category: "Karışık",
    size: "Orta",
  },
];

export default function KampanyalarPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);

  const handleFilterChange = (filters: any) => {
    const filtered = campaigns.filter((campaign) => {
      const priceInRange =
        campaign.price >= filters.priceRange[0] &&
        campaign.price <= filters.priceRange[1];
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(campaign.category);
      const sizeMatch =
        filters.sizes.length === 0 || filters.sizes.includes(campaign.size);

      return priceInRange && categoryMatch && sizeMatch;
    });

    setFilteredCampaigns(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DeliveryMethodSelector />

      <main className="container mx-auto px-4 py-8">
        <CustomBreadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Tüm Kampanyalar", href: "/kampanyalar" },
          ]}
        />
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <CampaignFilterSidebar
              isOpen={true}
              onClose={() => {}}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <CampaignFilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
          />

          {/* Products Grid/List */}
          <div className="flex-1 min-h-0">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600 text-center">
                {filteredCampaigns.length} kampanya bulundu
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={campaign.image || "/placeholder.svg"}
                          alt={campaign.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {campaign.badge && (
                          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                            {campaign.badge}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-800 mb-2">
                        {campaign.name}
                      </h3>

                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-orange-600">
                            {campaign.price} TL
                          </span>
                          {campaign.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {campaign.originalPrice} TL
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                        asChild
                      >
                        <Link href={`/kampanya/${campaign.id}`}>
                          Sipariş Ver
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <img
                          src={campaign.image || "/placeholder.svg"}
                          alt={campaign.name}
                          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">
                                {campaign.name}
                              </h3>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-2xl font-bold text-orange-600">
                                  {campaign.price} TL
                                </span>
                                {campaign.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {campaign.originalPrice} TL
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              {campaign.badge && (
                                <Badge className="bg-red-600 text-white">
                                  {campaign.badge}
                                </Badge>
                              )}
                              <Button
                                className="bg-gray-800 hover:bg-gray-900 text-white"
                                asChild
                              >
                                <Link href={`/kampanya/${campaign.id}`}>
                                  Sipariş Ver
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
