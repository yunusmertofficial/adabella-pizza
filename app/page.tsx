import { Header } from "@/components/header";
import { HeroSlider } from "@/components/hero-slider";
import { SearchBar } from "@/components/search-bar";
import { PizzaCarousel } from "@/components/pizza-carousel";
import { Footer } from "@/components/footer";
import { PopularPizzas } from "@/components/popular-pizzas";
import { BeveragesSection } from "@/components/beverages-section";
import DeliveryMethodSelector from "@/components/delivery-method-selector/delivery-method-selector";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <DeliveryMethodSelector />
            <SearchBar />
          </div>
        </div>
        <HeroSlider />
        <PizzaCarousel />
        <PopularPizzas />
        <BeveragesSection />
      </main>
      <Footer />
    </div>
  );
}
