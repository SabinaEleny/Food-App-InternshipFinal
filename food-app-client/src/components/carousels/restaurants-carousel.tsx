import Autoplay from "embla-carousel-autoplay";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel.tsx";
import RestaurantCard from "@/components/cards/restaurant-card.tsx";
import {useRef} from "react";
import {useRestaurants} from "@/hooks/use-restaurants.ts";
import {Loader2} from "lucide-react";

export default function RestaurantCarousel() {
    const plugin = useRef(
        Autoplay({delay: 2000, stopOnInteraction: true})
    );
    const {data, isLoading, isError} = useRestaurants(1, 12);

    if (isLoading) {
        return (
            <section className="w-full my-12">
                <div className="container mx-auto px-4 mb-6 ml-0">
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Popular Restaurants</h2>
                </div>
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="w-full my-12">
                <div className="container mx-auto px-4 mb-6 ml-0">
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Popular Restaurants</h2>
                    <p className="text-sm text-destructive mt-2">Couldn't load restaurants</p>
                </div>
            </section>
        );
    }

    const items = data?.restaurants ?? [];
    if (items.length === 0) {
        return (
            <section className="w-full my-12">
                <div className="container mx-auto px-4 mb-6 ml-0">
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Popular Restaurants</h2>
                    <p className="text-sm text-muted-foreground mt-2 select-none">There are currently no
                        restaurants.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full my-12">
            <div className="container mx-auto px-4 mb-6 ml-0">
                <h2 className="text-3xl font-extrabold text-black/90 select-none">Popular Restaurants</h2>
            </div>
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    loop: true
                }}
            >
                <CarouselContent className="px-4 md:px-8">
                    {items.map((restaurant) => (
                        <CarouselItem key={restaurant.id} className="basis-1/3 md:basis-1/4 lg:basis-1/4">
                            <RestaurantCard restaurant={restaurant}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}