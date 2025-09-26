import {useState} from "react";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Button} from "@/components/ui/button.tsx";
import RestaurantCard from "@/components/cards/restaurant-card.tsx";
import {useRestaurants} from "@/hooks/use-restaurants.ts";
import {useAllergens} from "@/hooks/use-allergens.ts";
import {Loader2} from "lucide-react";

export default function AllergenCarousel() {
    const [selectedAllergen, setSelectedAllergen] = useState<string | null>(null);
    const {
        data: restaurantsData,
        isLoading: isLoadingRestaurants,
        isError: isErrorRestaurants
    } = useRestaurants(1, 12, selectedAllergen);
    const {
        data: allergens,
        isLoading: isLoadingAllergens,
        isError: isErrorAllergens
    } = useAllergens();

    const handleAllergenSelect = (allergen: string) => {
        if (selectedAllergen === allergen) {
            setSelectedAllergen(null);
        } else {
            setSelectedAllergen(allergen);
        }
    };

    const restaurants = restaurantsData?.restaurants ?? [];

    return (
        <section className="w-full my-12">
            <div className="container mx-auto px-4 ml-0">
                <h2 className="text-3xl font-extrabold pb-2 text-black/90 select-none">Allergens</h2>
                <p className="text-muted-foreground mb-6 select-none">Find restaurants with products free of certain
                    allergens.</p>

                {isLoadingAllergens && (
                    <p className="text-sm text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    </p>
                )}
                {isErrorAllergens && (
                    <p className="text-sm text-destructive"> Could not load filters.</p>)}

                {allergens && allergens.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {(allergens ?? [])
                            .filter(allergen => allergen && allergen.trim() !== '')
                            .map(allergen => (
                                <Button
                                    key={allergen}
                                    className="hover:cursor-pointer hover:bg-[var(--primary)] transition-colors"
                                    variant={selectedAllergen === allergen ? "default" : "outline"}
                                    onClick={() => handleAllergenSelect(allergen)}
                                >
                                    {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                                </Button>
                            ))
                        }
                    </div>
                )}
            </div>

            {isLoadingRestaurants && (
                <section className="w-full my-12">
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    </div>
                </section>
            )}

            {isErrorRestaurants && (
                <p className="container mx-auto px-4 ml-0 text-destructive">Coult not load the restaurants.</p>
            )}

            {!isLoadingRestaurants && !isErrorRestaurants && restaurants.length === 0 && (
                <div className="container mx-auto px-4 ml-0">
                    <p className="text-sm text-muted-foreground mt-2">
                        {selectedAllergen
                            ? `Didn't find any restaurants without"${selectedAllergen}".`
                            : "There are no restaurants available."
                        }
                    </p>
                </div>
            )}

            {restaurants.length > 0 && (
                <Carousel className="w-full" opts={{align: "start", loop: true}}>
                    <CarouselContent className="px-4 md:px-8 -ml-5">
                        {restaurants.map((restaurant) => (
                            <CarouselItem key={restaurant.id} className="basis-1/3 md:basis-1/4 lg:basis-1/4">
                                <RestaurantCard restaurant={restaurant}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        className="hidden md:flex absolute left-4 hover:bg-[var(--card)] hover:cursor-pointer"/>
                    <CarouselNext
                        className="hidden md:flex absolute right-4 hover:bg-[var(--card)] hover:cursor-pointer"/>
                </Carousel>
            )}
        </section>
    );
}