import {Card, CardContent} from "@/components/ui/card.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Clock, MapPin} from "lucide-react";
import type {Restaurant} from "@/types";
import {useUserAddresses} from "@/hooks/use-user-address.ts";
import {type ChangeEvent, useEffect, useState} from "react";

type DeliveryDetailsProps = {
    deliveryMethod: 'delivery' | 'pickup';
    onDeliveryMethodChange: (value: 'delivery' | 'pickup') => void;
    selectedAddress: { street: string; city: string; };
    errors: { street: string; city: string; };
    onAddressSelect: (address: { street: string; city: string; }) => void;
    restaurant: Restaurant;
};

export function DeliveryDetails(props: DeliveryDetailsProps) {
    const {data: savedAddresses = []} = useUserAddresses();
    const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
    const showNewAddressForm = selectedOption === 'new';

    useEffect(() => {
        if (savedAddresses.length > 0 && !selectedOption) {
            handleOptionSelect(savedAddresses[0]._id);
        } else if (savedAddresses.length === 0 && !selectedOption) {
            setSelectedOption('new');
        }
    }, [savedAddresses, selectedOption]);

    const handleOptionSelect = (value: string) => {
        setSelectedOption(value);
        if (value === 'new') {
            props.onAddressSelect({street: '', city: ''});
        } else {
            const address = savedAddresses.find(addr => addr._id === value);
            if (address) {
                props.onAddressSelect({street: address.street, city: address.city});
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        props.onAddressSelect({...props.selectedAddress, [name]: value});
    };

    const isDelivery = props.deliveryMethod === 'delivery';

    return (
        <Card className="bg-popover shadow-sm border-0">
            <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-foreground">Delivery Details</h2>
                <RadioGroup
                    value={props.deliveryMethod}
                    onValueChange={(value) => props.onDeliveryMethodChange(value as 'delivery' | 'pickup')}
                    className="flex gap-6"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" className="hover:cursor-pointer"/>
                        <Label htmlFor="delivery">Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" className="hover:cursor-pointer"/>
                        <Label htmlFor="pickup">Pick-up</Label>
                    </div>
                </RadioGroup>
                <Separator/>

                {isDelivery ? (
                        <div className="space-y-4 pt-2">
                            <h3 className="font-semibold text-foreground">Please select an address for delivery</h3>
                            <RadioGroup onValueChange={handleOptionSelect} value={selectedOption} className="space-y-2">
                                {savedAddresses.map((addr) => (
                                    <div key={addr._id} className="flex items-center space-x-2 p-3 border rounded-md">
                                        <RadioGroupItem value={addr._id} id={addr._id}/>
                                        <Label htmlFor={addr._id} className="font-normal w-full">
                                            <p className="font-semibold">{addr.title}</p>
                                            <p className="text-muted-foreground">{addr.street}, {addr.city}</p>
                                        </Label>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-2 p-3 border rounded-md">
                                    <RadioGroupItem value="new" id="new-address"/>
                                    <Label htmlFor="new-address" className="font-normal">Enter a new address</Label>
                                </div>
                            </RadioGroup>

                            {showNewAddressForm && (
                                <div className="space-y-4 pt-2 pl-8 border-l ml-2">
                                    <div>
                                        <Label htmlFor="street" className="pb-2">Street and number</Label>
                                        <Input id="street" name="street" value={props.selectedAddress.street}
                                               onChange={handleInputChange}
                                               className={props.errors.street ? "border-destructive" : ""}/>
                                        {props.errors.street &&
                                            <p className="text-sm text-destructive mt-1">{props.errors.street}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="city" className="pb-2">City</Label>
                                        <Input id="city" name="city" value={props.selectedAddress.city}
                                               onChange={handleInputChange}
                                               className={props.errors.city ? "border-destructive" : ""}/>
                                        {props.errors.city &&
                                            <p className="text-sm text-destructive mt-1">{props.errors.city}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                    : (
                        <div className="flex items-start gap-4 pt-2">
                            <MapPin className="h-6 w-6 text-primary mt-1 shrink-0"/>
                            <div>
                                <p className="font-semibold text-foreground">Pickup location</p>
                                <p className="text-muted-foreground">{props.restaurant.location?.address ?? 'Address unavailable'}</p>
                            </div>
                        </div>
                    )
                }

                {props.restaurant.delivery?.estimatedMinutes && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                        <Clock className="h-4 w-4"/>
                        <span> Estimated order preparation time: {props.restaurant.delivery.estimatedMinutes} minutes</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}