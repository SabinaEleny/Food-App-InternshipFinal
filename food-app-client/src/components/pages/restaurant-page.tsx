import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Loader2,
  MapPin,
  Search,
  ShoppingCart,
  Timer,
  Truck,
} from 'lucide-react';
import {Button} from '../ui/button.tsx';
import ProductCard from '../cards/product-card.tsx';
import {Input} from '../ui/input.tsx';
import {useMemo, useRef, useState} from 'react';
import {useSpring} from '@react-spring/web';
import {useHorizontalScroll} from '@/hooks/use-horizontal-scroll.ts';
import {useParams} from 'react-router-dom';
import {useRestaurant} from '@/hooks/use-restaurants.ts';
import {useProductsByRestaurant} from '@/hooks/use-products.ts';
import {useAuth} from '@/hooks/use-auth.ts';
import {useFavorites} from '@/hooks/use-favorites.ts';

export default function RestaurantPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const navRef = useRef<HTMLElement>(null);
    const {scrollContainerRef, scroll, showLeftArrow, showRightArrow} = useHorizontalScroll<HTMLDivElement>();
    const {id: restaurantId} = useParams();
    const {data: fetchedRestaurant, isLoading: isLoadingRestaurant} = useRestaurant(restaurantId);
    const {user} = useAuth();
    const {toggleFavorite, isTogglingFavorite} = useFavorites();

    const isFavorite = useMemo(() =>
            user?.favorites?.some(fav => fav._id === restaurantId),
        [user, restaurantId]
    );

    const restaurant = fetchedRestaurant;
    const {
        data: productsResp,
        isLoading: isLoadingProducts,
        isError: isErrorProducts
    } = useProductsByRestaurant(restaurantId, 1, 400);

    const products = useMemo(() => {
        const list = productsResp?.products ?? [];
        return list.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            category: product.category,
            allergens: (product.allergens ?? []).filter(Boolean),
            imageUrl: product.imageUrl ?? product.images?.[0],
            isAvailable: product.isAvailable ?? true,
            discountPrice: product.discountPrice
        }));
    }, [productsResp]);

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return products;
        return products.filter((product) => product.name.toLowerCase().includes(query));
    }, [products, searchQuery]);

    const categories = useMemo(
        () => Array.from(new Set(filteredProducts.map((product) => product.category))).filter(Boolean),
        [filteredProducts]
    );

    const [, api] = useSpring(() => ({
        scrollTop: 0,
        config: {mass: 1, tension: 170, friction: 26},
        onChange: ({value}) => {
            window.scrollTo(0, value.scrollTop);
        },
    }));

    const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: string) => {
        e.preventDefault();
        const targetElement = document.getElementById(categoryId);
        const navHeight = navRef.current?.clientHeight || 80;

        if (targetElement) {
            const targetPosition = targetElement.offsetTop - navHeight;
            api.start({scrollTop: targetPosition});
        }
    };

    if (!restaurant && isLoadingRestaurant) {
        return (
            <div className="container mx-auto px-4 py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="container mx-auto px-4 py-10">
                <p className="text-sm text-destructive">Restaurant not found</p>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground">
            <header className="relative h-64 md:h-80 w-full">
                <img src={restaurant.images?.cover} alt={`${restaurant.name} cover`}
                     className="h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                <div className="absolute bottom-0 left-0 p-4 md:p-8 flex items-end space-x-4">
                    <img src={restaurant.images?.icon} alt={`${restaurant.name} logo`}
                         className="h-20 w-20 md:h-24 md:w-24 rounded-lg border-4 border-background bg-card shadow-lg"/>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground shadow-md">{restaurant.name}</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-14 w-14 text-primary-foreground hover:bg-white/20 disabled:opacity-50"
                            onClick={() => toggleFavorite(restaurantId!)}
                            disabled={isTogglingFavorite}
                        >
                            <Heart
                                className={`h-10 w-10 transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}/>
                        </Button>
                    </div>
                </div>
            </header>

            <section
                className="container mx-auto px-4 md:px-8 py-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-0 border-b border-border">
                <div className="flex items-center gap-2"><MapPin
                    className="h-5 w-5 text-primary"/><span>{restaurant.location?.address}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>
                    <span>Open until {restaurant.openingHours?.to}</span>
                </div>
                {restaurant.delivery?.minOrder && (
                    <div className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-primary"/> <span>Minimum order {restaurant.delivery?.minOrder.toFixed(2)} RON</span>
                    </div>
                )}
                {restaurant.delivery?.fee && (
                    <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary"/>
                        <span>
                            {restaurant.delivery.fee === 0
                                ? "Free delivery"
                                : `Delivery fee ${restaurant.delivery.fee.toFixed(2)} RON`}
                        </span>
                    </div>
                )}
                {restaurant.delivery?.estimatedMinutes && (
                    <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5 text-primary"/>
                        <span>≈ {restaurant.delivery.estimatedMinutes} min</span>
                    </div>
                )}
            </section>

            <nav ref={navRef}
                 className="sticky top-15 bg-background/95 backdrop-blur-sm z-10 py-3 mb-8 border-b border-border">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-6">
                    <div ref={scrollContainerRef} className=" overflow-hidden scrollbar-hide py-2">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                            {categories.map((category) => {
                                const categoryId = category.replace(/\s+/g, "-");
                                return (
                                    <a
                                        href={`#${categoryId}`}
                                        key={category}
                                        onClick={(e) => handleCategoryClick(e, categoryId)}
                                    >
                                        <Button
                                            variant="outline"
                                            className="rounded-full shadow-sm bg-white hover:cursor-pointer hover:bg-[var(--hover)] hover:text-white"
                                        >
                                            {category}
                                        </Button>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => scroll('left')} disabled={!showLeftArrow}
                                className="rounded-full h-9 w-9 hover:cursor-pointer hover:bg-[var(--hover)] hover:text-white">
                            <ChevronLeft className="h-5 w-5"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => scroll('right')} disabled={!showRightArrow}
                                className="rounded-full h-9 w-9 hover:cursor-pointer hover:bg-[var(--hover)] hover:text-white">
                            <ChevronRight className="h-5 w-5"/>
                        </Button>
                        <div className="relative w-full max-w-xs">
                            <Search
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground bg-white"/>
                            <Input type="search" placeholder="Search for a product ..."
                                   className="pl-11 w-full rounded-full bg-white"
                                   value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 md:px-8 py-6">
                {isLoadingProducts ? (
                    <div className="text-center py-10">
                        <p className="text-sm text-muted-foreground">Loading products...</p>
                    </div>
                ) : isErrorProducts ? (
                    <div className="text-center py-10">
                        <p className="text-sm text-destructive">Could not load products.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {categories.length > 0 ? (
                            categories.map((category) => {
                                const categoryId = category.replace(/\s+/g, "-");
                                const group = filteredProducts.filter((product) => product.category === category);
                                return (
                                    <section key={category} id={categoryId} className="scroll-mt-24 pb-5">
                                        <h2 className="text-3xl font-bold mb-6 text-foreground">{category}</h2>
                                        <div
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {group.map((product) => (
                                                <ProductCard key={product.id} {...product} />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-lg text-muted-foreground">
                                    No products were found that match your search.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};