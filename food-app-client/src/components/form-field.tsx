import type {InputHTMLAttributes, ReactNode} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

type Props = {
    id: string;
    label: string;
    required?: boolean;
    type?: InputHTMLAttributes<HTMLInputElement>["type"];
    placeholder?: string;
    rightAdornment?: ReactNode;
};

export default function FormField(props: Props) {
    return (
        <div>
            <Label htmlFor={props.id} className="text-sm text-[var(--muted-foreground)] block mb-2">
                {props.label} {props.required && <span className="text-[var(--destructive)]">*</span>}
            </Label>

            <div className="relative">
                <Input
                    id={props.id}
                    required={props.required}
                    type={props.type}
                    placeholder={props.placeholder}
                    className="w-full rounded-xl bg-[var(--input)] text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)] pl-4 pr-10 py-3 border"
                />

                {props.rightAdornment && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {props.rightAdornment}
                    </div>
                )}
            </div>
        </div>
    );
}