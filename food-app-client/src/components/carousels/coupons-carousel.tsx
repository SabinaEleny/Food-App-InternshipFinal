import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel.tsx";
import CouponCard from "@/components/cards/coupon-card.tsx";
import type {Coupon} from "@/types";
import {useCoupons} from "@/hooks/use-coupons.ts";
import {Loader2} from "lucide-react";

export default function CouponsCarousel() {
    const {data, isLoading, isError} = useCoupons(1, 20);

    if (isLoading) {
        return (
            <section className="w-full my-12">
                <div className="container mx-auto px-4 mb-6 ml-0">
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Your Coupons</h2>
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
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Your coupons</h2>
                    <p className="text-sm text-destructive mt-2 select-none">Couldn't load coupons</p>
                </div>
            </section>
        );
    }

    const coupons = data?.coupons ?? [];
    if (coupons.length === 0) {
        return (
            <section className="w-full my-12">
                <div className="container mx-auto px-4 mb-6 ml-0">
                    <h2 className="text-3xl font-extrabold text-foreground select-none">Your coupons</h2>
                    <p className="text-sm text-muted-foreground mt-2 select-none">There are currently no coupons.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full my-12">
            <div className="container mx-auto px-4 mb-6 ml-0">
                <h2 className="text-3xl font-extrabold text-foreground select-none">
                    Your coupons
                </h2>
            </div>
            <Carousel className="w-full">
                <CarouselContent className="px-4 md:px-8 -ml-5">
                    {coupons.map((coupon: Coupon) => (
                        <CarouselItem key={coupon.id} className="md:basis-1/2 lg:basis-1/3">
                            <CouponCard coupon={coupon}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    className="hidden md:flex absolute left-4 hover:bg-[var(--card)] hover:cursor-pointer"
                />
                <CarouselNext
                    className="hidden md:flex absolute right-4 hover:bg-[var(--card)] hover:cursor-pointer"
                />
            </Carousel>
        </section>
    );
}