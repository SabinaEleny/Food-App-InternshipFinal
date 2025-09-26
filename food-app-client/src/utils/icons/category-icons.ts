import {
    CupSoda,
    Fish,
    FishSymbol,
    Hamburger,
    type LucideProps,
    Pizza,
    ReceiptJapaneseYen,
    Sandwich,
    Shrimp,
    Soup,
    Utensils
} from "lucide-react";

export const categoryIcons: Record<string, React.FC<LucideProps>> = {
    "Pizza": Pizza,
    "Traditional": Soup,
    "Burger": Hamburger,
    "Seafood": Shrimp,
    "Fish": Fish,
    "Asian": ReceiptJapaneseYen,
    "Sushi": FishSymbol,
    "American": CupSoda,
    "Fast Food": Sandwich
};

export const defaultIcon = Utensils;