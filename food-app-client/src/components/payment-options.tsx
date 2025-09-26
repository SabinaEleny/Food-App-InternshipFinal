import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {CreditCard, DollarSign} from "lucide-react";

type PaymentOptionsProps = {
    paymentMethod: 'card' | 'cash';
    onPaymentMethodChange: (value: 'card' | 'cash') => void;
};

export function PaymentOptions(props: PaymentOptionsProps) {
    return (
        <Card className="bg-popover shadow-sm border-0">
            <CardHeader><CardTitle className="text-lg">Payment Method</CardTitle></CardHeader>
            <CardContent>
                <RadioGroup
                    value={props.paymentMethod}
                    onValueChange={(value) => props.onPaymentMethodChange(value as 'card' | 'cash')}
                    className="space-y-4"
                >
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="card" id="card" className="hover:cursor-pointer"/>
                        <Label htmlFor="card" className="font-semibold flex items-center gap-2"><CreditCard
                            className="h-5 w-5"/> Card</Label>
                    </div>
                    <Separator/>
                    <div className="flex items-center space-x-3">
                        <RadioGroupItem value="cash" id="cash" className="hover:cursor-pointer"/>
                        <Label htmlFor="cash" className="font-semibold flex items-center gap-2"><DollarSign
                            className="h-5 w-5"/> Cash</Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}