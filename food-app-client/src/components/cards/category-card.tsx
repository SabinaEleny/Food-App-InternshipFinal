import {Card, CardContent} from "@/components/ui/card";
import type {CategoryTag} from "@/types";
import {categoryIcons, defaultIcon} from "@/utils/icons/category-icons.ts";

type CategoryCardProps = {
    tag: CategoryTag;
};

export default function CategoryCard(props: CategoryCardProps) {
    const IconComponent = categoryIcons[props.tag] || defaultIcon;

    return (
        <div className="pt-5 pb-5 pl-5">
            <Card
                className="bg-primary group rounded-lg overflow-hidden border-border shadow-sm hover:scale-105 hover:shadow-lg hover:bg-[var(--color-popover)] transition-all cursor-pointer select-none">
                <CardContent className="flex flex-col items-center justify-center p-1 ">
                    <div className="flex items-center justify-center w-10 h-10">
                        <IconComponent
                            className="w-8 h-8 text-primary-foreground group-hover:text-primary transition-colors duration-200"
                            strokeWidth={1.5}
                        />
                    </div>
                    <p className="font-semibold text-primary-foreground group-hover:text-primary text-center text-sm truncate w-full">{props.tag}</p>
                </CardContent>
            </Card>
        </div>
    );
}