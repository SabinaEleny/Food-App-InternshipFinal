import {useParams} from "react-router-dom";
import {useRestaurants} from "@/hooks/use-restaurants.ts";
import RestaurantCard from "@/components/cards/restaurant-card.tsx";
import {Loader2} from "lucide-react";
import {Carousel, CarouselContent, CarouselItem} from "../ui/carousel";
import {useRef} from "react";
import Autoplay from "embla-carousel-autoplay";

export default function RestaurantsByCategoryPage() {
    const {categoryName} = useParams<{ categoryName: string }>();
    const {data, isLoading, isError} = useRestaurants(1, 20, null, categoryName);
    const restaurants = data?.restaurants ?? [];
    const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : "category";

    const plugin = useRef(
        Autoplay({delay: 2000, stopOnInteraction: true})
    );

    return (
        <main className="container mx-auto py-8 pt-0 px-4">
            <div className="py-12 md:py-10">
                <h1 className="text-3xl md:text-3xl font-extrabold ">
                    The Best{' '}
                    <span className=" text-primary mt-1">{decodedCategoryName} Restaurants.</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                    Discover our handpicked selection for {decodedCategoryName}.
                </p>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            )}

            {isError && (
                <div className="container mx-auto px-4 mb-6 ml-0">
                    <p className="text-sm text-destructive mt-2">Couldn't load restaurants</p>
                </div>
            )}

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
                    {restaurants.map(restaurant => (
                        <CarouselItem key={restaurant.id} className="basis-1/3 md:basis-1/4 lg:basis-1/4">
                            <RestaurantCard restaurant={restaurant}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

        </main>
    );
}