import {Card, CardContent} from "@/components/ui/card";
import type {Restaurant} from "@/types";
import {useNavigate} from "react-router-dom";

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export default function RestaurantCard(props: RestaurantCardProps) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/restaurant/${props.restaurant.id}`, {state: props.restaurant});
    }

    return (
        <div className="pt-5 pb-5 pl-5">
            <Card
                onClick={handleNavigate}
                className="bg-primary overflow-hidden border-none shadow-lg transform transition-transform duration-300 hover:scale-105 hover:cursor-pointer select-none ">
                <CardContent className="relative flex flex-col items-center justify-center p-0">
                    <img
                        src={props.restaurant.images?.icon}
                        alt={`Cover image for ${props.restaurant.name}`}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                    {props.restaurant.discount && (
                        <div
                            className="absolute top-4 right-4 bg-primary text-primary-foreground font-bold text-xl p-3 rounded-full shadow-2xl">
                            -{props.restaurant.discount}%
                        </div>
                    )}
                    <div
                        className="absolute bottom-0 left-0 bg-primary/70 backdrop-blur-sm p-4 w-full">
                        <div className="flex items-center">
                            <div>
                                <h3 className="text-xl font-bold text-primary-foreground">{props.restaurant.name}</h3>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}