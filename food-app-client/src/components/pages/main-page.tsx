import RestaurantCarousel from "@/components/carousels/restaurants-carousel.tsx";
import AllergenCarousel from "@/components/carousels/allergens-carousel.tsx";
import CategoriesCarousel from "@/components/carousels/categories-carousel.tsx";

export default function MainPage() {
    return (
        <main className="py-8 overflow-hidden">
            <div className="space-y-16">
                <CategoriesCarousel/>
                <RestaurantCarousel/>
                <AllergenCarousel/>
            </div>
        </main>
    );
}