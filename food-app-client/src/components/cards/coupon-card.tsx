import {Card, CardContent} from "@/components/ui/card";
import {Ticket} from "lucide-react";
import {formatDate} from "@/utils/date-utils.ts";
import type {Coupon} from "@/types";

interface CouponCardProps {
    coupon: Coupon;
}

export default function CouponCard(props: CouponCardProps) {
    const formatCouponValue = () => {
        if (props.coupon.type === 'percent') {
            return `${props.coupon.value}% OFF`;
        }
        return `$${props.coupon.value} OFF`;
    };

    const formatMinOrderAmount = () => {
        if (props.coupon.minOrderAmount && props.coupon.minOrderAmount > 0) {
            return `On orders over $${props.coupon.minOrderAmount}`;
        }
        return "No minimum order";
    };

    return (
        <div className="p-5 h-full">
            <Card
                className="bg-gradient-to-br from-primary to-accent border-none shadow-md h-full flex flex-col select-none hover:scale-105 hover:cursor-pointer transition-transform duration-300">
                <CardContent className="flex flex-col justify-between p-6 flex-grow">
                    <div className="flex items-start">
                        <div className="bg-primary-foreground p-4 rounded-lg mr-6">
                            <Ticket className="w-8 h-8 text-primary"/>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-primary-foreground tracking-tight">{formatCouponValue()}</h3>
                            <p className="text-primary-foreground/90 mt-1 text-sm">{formatMinOrderAmount()}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        {
                            props.coupon.validUntil && (
                                <p className="text-xs text-primary-foreground/70">
                                    Valid until: {formatDate(props.coupon.validUntil)}
                                </p>
                            )
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}