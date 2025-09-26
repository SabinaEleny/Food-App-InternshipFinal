import {Card, CardContent, CardFooter, CardTitle} from "../ui/card.tsx";
import {Loader2, Plus, Wheat} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {upsertItemInCart} from "@/services/cart-service.ts";
import {toast} from "sonner";

type ProductCardProps = {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    imageUrl: string;
    allergens?: string[];
    isAvailable?: boolean;
};

function ProductCard(props: ProductCardProps) {
    const queryClient = useQueryClient();
    const visibleAllergens = (props.allergens ?? []).filter(Boolean);
    const hasAllergens = visibleAllergens.length > 0;
    const hasDiscount = props.discountPrice && props.discountPrice < props.price;

    const {mutate: addItem, isPending} = useMutation({
        mutationFn: upsertItemInCart,
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(["cart"], updatedCart);
            toast.success("Product added in cart successfully!");
        },
        onError: (error) => {
            console.error("Failed to add item to cart:", error);
            toast.error("Product could not be added in cart!");
        },
    });

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        addItem({productId: props.id, quantity: 1});
    }

    return (
        <Card
            className="w-full overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col pt-0 pb-0">
            <div className="w-full overflow-hidden aspect-[4/3]">
                <img
                    src={props.imageUrl}
                    alt={props.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>
            <CardContent className="p-3 flex-grow">
                <CardTitle className="mb-2 text-lg font-bold text-card-foreground">{props.name}</CardTitle>
                <div className="text-muted-foreground text-sm">
                    {props.description}
                </div>
                <div className="flex items-start gap-2 pt-5 ">
                    <Wheat className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5"/>
                    <div>
                        <h4 className="font-bold text-xs text-card-foreground">Allergens</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                            {hasAllergens ? visibleAllergens.join(", ") : "Not specified"}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 mt-auto">
                <div className="flex flex-col">
                    {hasDiscount
                        ? (
                            <>
                            <span className="text-primary text-lg font-extrabold">
                                {(props.discountPrice!).toFixed(2)} RON
                            </span>

                                <del className="text-muted-foreground text-sm font-normal pl-0.5">
                                    {(props.price).toFixed(2)} RON
                                </del>
                            </>
                        )
                        : (

                            <span className="text-primary text-lg font-extrabold">
                            {(props.price).toFixed(2)} RON
                        </span>
                        )
                    }
                </div>
                <Button
                    size="icon"
                    variant="outline"
                    disabled={!props.isAvailable || isPending}
                    onClick={handleAdd}
                    className="ml-auto rounded-full border-primary text-primary hover:bg-primary/10 hover:cursor-pointer hover:text-primary"
                    aria-label={`Add ${props.name} to cart`}
                >
                    {isPending
                        ? (
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        )
                        : (

                            <Plus className="h-5 w-5"/>
                        )
                    }
                </Button>
            </CardFooter>
        </Card>
    );
}

export default React.memo(ProductCard);