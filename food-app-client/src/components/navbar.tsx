import {Loader2, LogIn, Shield, ShoppingCart, Store, User, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {useAuth} from '@/hooks/use-auth.ts';
import {useCart} from '@/hooks/use-cart.ts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {removeItemFromCart} from '@/services/cart-service.ts';
import {toast} from 'sonner';

const Navbar = () => {
    const isLoggedIn = true;
    const {user, isAuthenticated} = useAuth();
    const {data: cart, isLoading} = useCart(!!user);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const cartItems = cart?.items ?? [];
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    const {mutate: removeItem, isPending: isRemovingItem} = useMutation({
        mutationFn: removeItemFromCart,
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart);
            toast.success('Item removed successfully!');
        },
        onError: (error) => {
            console.error("Failed to remove item from cart:", error);
            toast.error("Item could not be removed!");
        }
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsCartOpen(false);
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCartOpen]);

    const handleRemoveItem = (productId: string) => {
        removeItem(productId);
    };

    if (isLoading) {
        return (
            <section className="w-full my-12">
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
            </section>
        );
    }

    return (
        <nav className="bg-primary shadow-md sticky top-0 z-50 border-b border-border">
            <div className="max-w-8xl mx-auto px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="flex items-center">
                            <img
                                src="src/resources/images/logo2.png"
                                alt="Tastely Logo"
                                className="h-10 w-auto"
                            />
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <NavLink to="/"
                                 className={({isActive}) => `p-2 rounded-full transition-colors ${isActive ? 'bg-card text-foreground' : 'text-card hover:bg-foreground/20'}`}>
                            <Store className="h-6 w-6"/>
                        </NavLink>

                        {isAuthenticated && user?.role === 'admin' && (
                            <NavLink to="/admin"
                                     className={({isActive}) => `p-2 rounded-full transition-colors ${isActive ? 'bg-card text-foreground' : 'text-card hover:bg-foreground/20'}`}>
                                <Shield className="h-6 w-6"/>
                            </NavLink>
                        )}

                        <div className="relative" ref={cartRef}>
                            <button
                                onClick={() => setIsCartOpen(!isCartOpen)}
                                className="relative p-2 rounded-full text-card hover:bg-foreground/20 transition-colors"
                            >
                                <ShoppingCart className="h-6 w-6 hover:cursor-pointer"/>
                                {totalItemsInCart > 0 && (
                                    <span
                                        className="absolute top-0 right-0 h-4 w-4 bg-black text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                        {totalItemsInCart}
                                    </span>
                                )}
                            </button>

                            {isCartOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-xl border border-border animate-in fade-in-0 zoom-in-95">
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-foreground mb-4">Your Cart</h3>
                                        {totalItemsInCart > 0 ? (
                                            <>
                                                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                                    {cartItems.map(item => (
                                                        <div key={item.product.id} className="flex items-center gap-4">
                                                            <img src={item.product.imageUrl} alt={item.product.name}
                                                                 className="h-14 w-14 rounded-md object-cover"/>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-foreground text-sm">{item.product.name}</p>
                                                                <p className="text-muted-foreground text-xs">{item.quantity} x
                                                                    {' '} {(item.product.price).toFixed(2)} {' '} RON </p>
                                                            </div>
                                                            <button
                                                                className="text-muted-foreground hover:text-destructive transition-colors hover:cursor-pointer"
                                                                onClick={() => handleRemoveItem(item.product.id)}
                                                                disabled={isRemovingItem}
                                                            >
                                                                <X className="h-4 w-4"/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <hr className="my-4 border-border"/>
                                                <NavLink to="/checkout"
                                                         onClick={() => setIsCartOpen(false)}
                                                         className="w-full block text-center bg-black text-primary-foreground font-bold py-2 rounded-md hover:bg-black/80 transition-colors hover:cursor-pointer">
                                                    Go to Checkout
                                                </NavLink>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-8">Your shopping cart is
                                                empty.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {isLoggedIn ? (
                            <NavLink to="/profile"
                                     className={({isActive}) => `p-2 rounded-full transition-colors ${isActive ? 'bg-card text-foreground' : 'text-card hover:bg-foreground/20'}`}>
                                <User className="h-6 w-6"/>
                            </NavLink>
                        ) : (
                            <NavLink to="/login"
                                     className="flex items-center gap-2 text-foreground font-semibold hover:text-primary">
                                <LogIn className="h-5 w-5"/>
                                <span>Login</span>
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;