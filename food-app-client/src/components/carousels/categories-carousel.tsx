import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel.tsx";
import CategoryCard from "@/components/cards/category-card.tsx";
import {useCategories} from "@/hooks/use-categories.ts";
import {Link} from "react-router-dom";
import {Loader2} from "lucide-react";

export default function CategoriesCarousel() {
    const {data: categories, isLoading, isError} = useCategories();

    if (isLoading) {
        return (
            <section className="w-full my-12">
                <div className="container mx-auto px-4 mb-6 ml-0">
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Popular Categories</h2>
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
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Popular Categories</h2>
                    <p className="text-sm text-destructive mt-2">Couldn't load categories</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full my-8">
            <div className="container mx-auto px-4 mb-6 ml-0">
                <h2 className="text-3xl font-extrabold text-black/90 select-none">Popular Categories</h2>
            </div>

            <Carousel className="w-full" opts={{align: "start"}}>
                <CarouselContent className="px-4 md:px-8">
                    {(categories ?? [])
                        .filter(cat => cat && cat.trim() !== '')
                        .map((category) => (
                            <CarouselItem key={category} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                                <Link to={`/category/${encodeURIComponent(category)}`}>
                                    <CategoryCard tag={category}/>
                                </Link>
                            </CarouselItem>
                        ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}