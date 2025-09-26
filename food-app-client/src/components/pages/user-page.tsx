import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Check,
  Clock,
  Edit,
  Heart,
  Home,
  Loader2,
  LogOut,
  Pencil,
  Phone,
  Trash2,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { useAuth } from '@/hooks/use-auth.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Address, Courier, Order, OrderHistoryItem, Restaurant, User } from '@/types';
import { addAddress, deleteAddress, updateAddress } from '@/services/address.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { EditProfileModal } from '../edit-profile-modal.tsx';
import { AddressModal } from '../address-modal.tsx';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useOrders } from '@/hooks/use-orders.ts';
import { format } from 'date-fns';
import { Accordion } from '@radix-ui/react-accordion';
import { OrderItem } from '@/components/order-item.tsx';
import { useFavorites } from '@/hooks/use-favorites.ts';
import { useCouriers } from '@/hooks/use-couriers.ts'; // Importul necesar

type FavoriteRestaurantItemProps = {
    restaurant: Restaurant;
    onToggleFavorite: (restaurantId: string) => void;
    isTogglingFavorite: boolean;
};

function UserProfilePage() {
    const queryClient = useQueryClient();
    const {user, logout, updateProfile, isUpdatingProfile} = useAuth();
    const {toggleFavorite, isTogglingFavorite} = useFavorites();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const {data: orders, isLoading: isLoadingOrders} = useOrders();

    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [courier, setCourier] = useState<Courier | null>(null);
    const [orderStatus, setOrderStatus] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const {data: couriers} = useCouriers();


    useEffect(() => {
        const savedOrderData = sessionStorage.getItem('activeOrder');
        if (savedOrderData) {
            const savedOrder: Order = JSON.parse(savedOrderData);
            setActiveOrder(savedOrder);
            setOrderStatus('Confirmed');
            sessionStorage.removeItem('activeOrder');
        }
    }, []);

    useEffect(() => {
        if (activeOrder && couriers) {
            if (!courier) {
                const availableCouriers = couriers.filter((c: Courier) => c.isAvailable);
                if (availableCouriers.length > 0) {
                    const randomCourier = availableCouriers[Math.floor(Math.random() * availableCouriers.length)];
                    setCourier(randomCourier);
                }
            }

            const now = new Date();
            const arrivalStart = new Date(now.getTime() + 25 * 60000);
            const arrivalEnd = new Date(now.getTime() + 40 * 60000);
            const formatTime = (date: Date) => date.toLocaleTimeString('ro-RO', {hour: '2-digit', minute: '2-digit'});
            setEstimatedTime(`${formatTime(arrivalStart)} - ${formatTime(arrivalEnd)}`);

            const statuses = ['Confirmed', 'Preparing', 'On its way', 'Delivered'];
            let currentStatusIndex = statuses.indexOf(orderStatus);

            if (currentStatusIndex >= statuses.length - 1) {
                return;
            }

            const interval = setInterval(() => {
                currentStatusIndex++;
                if (currentStatusIndex < statuses.length) {
                    const newStatus = statuses[currentStatusIndex];
                    setOrderStatus(newStatus);
                    if (newStatus === 'Delivered') {
                        clearInterval(interval);
                        toast.success('Your order has been successfully delivered!');
                        setTimeout(() => {
                            setActiveOrder(null);
                            setCourier(null);
                            void queryClient.invalidateQueries({queryKey: ['orders']});
                        }, 4000);
                    }
                } else {
                    clearInterval(interval);
                }
            }, 15000);

            return () => clearInterval(interval);
        }
    }, [activeOrder, orderStatus, couriers, courier, queryClient]);

    const addressMutationOptions = {
        onSuccess: (data: { user: User }) => {
            queryClient.setQueryData(['user'], data.user);
            setIsAddressModalOpen(false);
            toast.success('Address saved successfully!');
        },
        onError: (error: Error) => {
            const message = isAxiosError(error) && error.response?.data?.message ? error.response.data.message : error.message;
            toast.error(`An error occurred: ${message}`);
        },
    };

    const createAddressMutation = useMutation({mutationFn: addAddress, ...addressMutationOptions});
    const updateAddressMutation = useMutation({
        mutationFn: (vars: {
            addressId: string,
            data: Partial<Omit<Address, '_id'>>
        }) => updateAddress(vars.addressId, vars.data), ...addressMutationOptions
    });
    const deleteAddressMutation = useMutation({mutationFn: deleteAddress, ...addressMutationOptions});

    const getInitials = (name: string | undefined) => {
        if (!name) return 'U';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleSaveProfile = (updatedData: Partial<User>) => {
        updateProfile(updatedData, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                toast.success('Profile updated successfully!');
            },
            onError: (error) => {
                const message = isAxiosError(error) && error.response?.data?.message ? error.response.data.message : error.message;
                toast.error(`Failed to update profile: ${message}`);
            }
        });
    };

    const handleSaveAddress = (data: Omit<Address, '_id'>) => {
        if (selectedAddress) {
            updateAddressMutation.mutate({addressId: selectedAddress._id, data});
        } else {
            createAddressMutation.mutate(data);
        }
    };

    const handleDeleteAddress = (addressId: string) => {
        deleteAddressMutation.mutate(addressId);
    };

    if (!user) {
        return <div>Loading user profile...</div>;
    }

    return (
        <>
            <EditProfileModal user={user} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
                              onSave={handleSaveProfile} isSaving={isUpdatingProfile}/>
            <AddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)}
                          onSave={handleSaveAddress}
                          isSaving={createAddressMutation.isPending || updateAddressMutation.isPending}
                          addressToEdit={selectedAddress}/>

            <div className="min-h-screen bg-[#FFFBF7] p-8 font-sans">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                                        <AvatarImage
                                            src={user.avatarUrl}/><AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                                        <p className="text-gray-500">{user.email}</p>
                                        {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm"
                                            className="border-[var(--hover)] text-[var(--hover)] hover:bg-[var(--hover)] hover:text-white rounded-lg"><Edit
                                        className="mr-2 h-4 w-4"/> Edit Profile</Button>
                                    <Button onClick={() => logout()} variant="destructive" size="sm"
                                            className="rounded-lg"><LogOut className="mr-2 h-4 w-4"/> Logout</Button>
                                </div>
                            </div>

                            <Tabs defaultValue="active-order">
                                <TabsList className="grid w-full grid-cols-3 p-1 h-auto rounded-full bg-gray-200/75">
                                    <TabsTrigger value="active-order"
                                                 className="data-[state=active]:bg-[var(--hover)] data-[state=active]:text-white rounded-full py-2 text-gray-600 transition-all duration-300 relative">
                                        <Truck
                                            className="mr-2 h-4 w-4"/>Active Order
                                        {activeOrder && <span
                                            className="absolute top-1 right-2 block h-2 w-2 rounded-full bg-green-500"/>}
                                    </TabsTrigger>
                                    <TabsTrigger value="history"
                                                 className="data-[state=active]:bg-[var(--hover)] data-[state=active]:text-white rounded-full py-2 text-gray-600 transition-all duration-300"><Clock
                                        className="mr-2 h-4 w-4"/>Order History</TabsTrigger>
                                    <TabsTrigger value="favorites"
                                                 className="data-[state=active]:bg-[var(--hover)] data-[state=active]:text-white rounded-full py-2 text-gray-600 transition-all duration-300"><Heart
                                        className="mr-2 h-4 w-4"/>Favorites</TabsTrigger>
                                </TabsList>

                                <TabsContent value="active-order" className="mt-4">
                                    {activeOrder ? (
                                        <ActiveOrderCard estimatedArrival={estimatedTime}
                                                         courierName={courier ? `${courier.firstName} ${courier.lastName}` : 'Searching...'}
                                                         courierPhone={courier ? courier.phone : 'N/A'}
                                                         currentStatus={orderStatus}/>
                                    ) : (
                                        <div className="text-center text-muted-foreground py-16">
                                            <p>You have no active orders at the moment.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="history" className="mt-4">
                                    <Card className="text-gray-800 rounded-2xl shadow-lg p-4 bg-white">
                                        <CardHeader className="flex flex-row justify-between items-center pb-2">
                                            <CardTitle className="text-gray-800 pt-2">Recent Orders</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {isLoadingOrders
                                                ? (
                                                    <div className="flex justify-center items-center py-8">
                                                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                                    </div>
                                                )
                                                : !orders || orders.length === 0
                                                    ? (
                                                        <p className="text-center text-muted-foreground py-8">You
                                                            haven't
                                                            placed
                                                            any orders yet.</p>
                                                    )
                                                    : (
                                                        <div className="max-h-90 overflow-y-auto pr-2 space-y-1">
                                                            <Accordion type="single" collapsible className="w-full">
                                                                {(orders as OrderHistoryItem[]).map(order => (
                                                                    <OrderItem
                                                                        key={order.id}
                                                                        orderId={order.id}
                                                                        restaurant={order.restaurantId.name}
                                                                        restaurantImage={(order.restaurantId.images as any)?.logoUrl}
                                                                        items={`${order.items.length} item(s)`}
                                                                        itemsList={order.items}
                                                                        date={format(new Date(order.createdAt), 'dd MMM, yyyy')}
                                                                        price={`${(order.amounts.total).toFixed(2)} RON`}
                                                                    />
                                                                ))}
                                                            </Accordion>
                                                        </div>
                                                    )
                                            }
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="favorites" className="mt-4">
                                    {user.favorites && user.favorites.length > 0 ? (
                                        <div className="space-y-4">
                                            {user.favorites.map(restaurant => (
                                                <FavoriteRestaurantItem
                                                    key={restaurant._id}
                                                    restaurant={restaurant}
                                                    onToggleFavorite={toggleFavorite}
                                                    isTogglingFavorite={isTogglingFavorite}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">
                                            You haven't added any favorite restaurants yet.
                                        </p>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="space-y-6">
                            <Card className="shadow-md bg-white text-card-foreground border-0 rounded-2xl">
                                <CardHeader><CardTitle className="text-gray-800">Saved
                                    Addresses</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {user.addresses && user.addresses.length > 0 ? (
                                        user.addresses.map(address => (
                                            <SavedAddressItem
                                                key={address._id}
                                                icon={address.title.toLowerCase().includes('home') ? Home : Briefcase}
                                                title={address.title}
                                                address={`${address.street}, ${address.city}`}
                                                onEdit={() => {
                                                    setSelectedAddress(address);
                                                    setIsAddressModalOpen(true);
                                                }} onDelete={() => handleDeleteAddress(address._id)}/>
                                        ))
                                    ) : (
                                        <p className="text-center text-muted-foreground py-4">No saved addresses
                                            yet.</p>
                                    )}
                                    <Button onClick={() => {
                                        setSelectedAddress(null);
                                        setIsAddressModalOpen(true);
                                    }}
                                            className="w-full mt-2 h-11 bg-[var(--hover)] text-white hover:bg-[#D46A4A] rounded-lg text-base">Add
                                        a new address</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

type ActiveOrderCardProps = {
    estimatedArrival: string;
    courierName: string;
    courierPhone: string;
    currentStatus: string;
};

const ActiveOrderCard: React.FC<ActiveOrderCardProps> = ({
                                                             estimatedArrival,
                                                             courierName,
                                                             courierPhone,
                                                             currentStatus
                                                         }) => {
    return (
        <Card className="text-gray-800 rounded-2xl shadow-lg p-4 bg-white overflow-hidden">
            <CardHeader><CardTitle className="text-gray-800">Your Active Order</CardTitle></CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="h-48 md:h-full w-full rounded-xl overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.841517036732!2d26.10125021544979!3d44.43614137910222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4a8894985f%3A0x25656ee1366113b6!2sPia%C8%9Ba%20Unirii!5e0!3m2!1sen!2sro!4v1663151289132!5m2!1sen!2sro"
                            width="100%" height="100%" style={{border: 0}} allowFullScreen={false} loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div className="space-y-4">
                        <div><p className="text-sm text-gray-500">Estimated Arrival</p><p
                            className="text-2xl font-bold text-[var(--hover)]">{estimatedArrival}</p></div>
                        <div className="border-t border-gray-200/80 pt-4">
                            <p className="text-sm font-semibold mb-2">Courier Info</p>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11"><AvatarImage
                                    src={`https://i.pravatar.cc/150?u=${courierName}`}/><AvatarFallback>{courierName.charAt(0)}</AvatarFallback></Avatar>
                                <div><p className="font-semibold">{courierName}</p><a href={`tel:${courierPhone}`}
                                                                                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--hover)]"><Phone
                                    className="h-3.5 w-3.5"/> {courierPhone}</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-2"><OrderStatusProgressBar currentStatus={currentStatus}/></div>
            </CardContent>
        </Card>
    );
};

const OrderStatusProgressBar: React.FC<{ currentStatus: string }> = ({currentStatus}) => {
    const statuses = ['Confirmed', 'Preparing', 'On its way', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);

    return (
        <div className="flex items-center justify-between">
            {statuses.map((status, index) => {
                const isCompleted = index <= currentIndex;
                const isActive = index === currentIndex && currentIndex < statuses.length - 1;
                const isLast = index === statuses.length - 1;

                return (
                    <React.Fragment key={status}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex items-center justify-center h-8 w-8 rounded-full border-2 transition-all duration-300 ${isCompleted ? 'border-[var(--hover)]' : 'border-gray-300'} ${isCompleted ? 'bg-[var(--hover)] text-white' : 'bg-white'}`}>
                                {isCompleted ? <Check className="h-5 w-5"/> : <div
                                    className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-[var(--hover)]' : 'bg-gray-300'}`}></div>}
                            </div>
                            <p className={`mt-2 text-xs text-center font-semibold ${isCompleted ? 'text-[var(--hover)]' : 'text-gray-400'}`}>{status}</p>
                        </div>
                        {!isLast && (<div
                            className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${index < currentIndex ? 'bg-[var(--hover)]' : 'bg-gray-300'}`}></div>)}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

function SavedAddressItem({icon: Icon, title, address, onEdit, onDelete}: {
    icon: React.ElementType,
    title: string,
    address: string,
    onEdit: () => void,
    onDelete: () => void
}) {
    return (
        <div className="flex items-center gap-4">
            <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Icon className="h-6 w-6"/></div>
            <div className="flex-1"><p className="font-semibold text-gray-700">{title}</p><p
                className="text-sm text-gray-500">{address}</p></div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={onEdit}><Pencil
                    className="h-4 w-4 text-gray-400 hover:text-gray-600"/></Button>
                <ConfirmationDialog title="Delete Address?" description="Are you sure you want to delete this address?"
                                    onConfirm={onDelete} trigger={<Button variant="ghost" size="icon"><Trash2
                    className="h-4 w-4 text-red-400 hover:text-red-600"/></Button>}/>
            </div>
        </div>
    );
}

function FavoriteRestaurantItem({restaurant, onToggleFavorite, isTogglingFavorite}: FavoriteRestaurantItemProps) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl shadow-md border border-gray-100 bg-white">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <img src={(restaurant.images as any)?.logoUrl}  alt={restaurant.name} className="h-20 w-20 rounded-lg object-cover"/>
            <div className="flex-1">
                <p className="font-bold text-lg text-gray-800">{restaurant.name}</p>
                <p className="text-sm text-gray-500">{restaurant.tags?.join(', ')}</p>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="self-start"
                onClick={() => onToggleFavorite(restaurant._id)}
                disabled={isTogglingFavorite}
            >
                <Heart className="h-6 w-6 text-red-500 fill-red-500"/>
            </Button>
        </div>
    );
}

export default UserProfilePage;