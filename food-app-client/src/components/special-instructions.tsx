import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

type SpecialInstructionsProps = {
    value: string;
    onChange: (value: string) => void;
};

export function SpecialInstructions(props: SpecialInstructionsProps) {
    return (
        <Card className="bg-popover shadow-sm border-0">
            <CardHeader><CardTitle className="text-lg">Special instructions</CardTitle></CardHeader>
            <CardContent>
                <Textarea
                    placeholder="e.g. No onions, extra napkins, etc."
                    className="bg-input"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                />
            </CardContent>
        </Card>
    );
}