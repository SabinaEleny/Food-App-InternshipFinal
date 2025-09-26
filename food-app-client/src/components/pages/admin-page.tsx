import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Bike, Pencil, PlusCircle, Search, Store, Trash2, Users, Utensils, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  type CreateUserData,
  deleteUserById,
  getAllUsers,
  updateUserById,
  type UpdateUserData,
} from '@/services/admin.service';
import { type Courier, type Product, type SortOption, type User } from '@/types';
import type { BackendRestaurant } from '@/services/restaurant.service.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { EditUserModal, type UpdateAdminUserData } from '@/components/edit-user-modal.tsx';
import { AddUserModal } from '@/components/add-user-modal.tsx';
import {
  type CourierData,
  createCourier,
  deleteCourierById,
  getAllCouriers,
  updateCourierById,
} from '@/services/courier.service';
import { AddCourierModal } from '@/components/add-courier-modal.tsx';
import { EditCourierModal } from '@/components/edit-courier-modal.tsx';
import {
  createProduct,
  createRestaurant,
  deleteProductById,
  deleteRestaurantById,
  getAllAdminRestaurants,
  getProductsByRestaurantId,
  type ProductData,
  type RestaurantData,
  updateProductById,
  updateRestaurantById,
} from '@/services/admin-restaurant.service.ts';
import { AddRestaurantModal } from '@/components/add-restaurant-modal.tsx';
import { EditRestaurantModal } from '@/components/edit-restaurant-modal.tsx';
import { AddProductModal } from '@/components/add-product-modal.tsx';
import { EditProductModal } from '@/components/edit-product-modal.tsx';


const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading admin data...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your application data efficiently.</p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-full border-2 border-primary">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <Button onClick={() => logout()} variant="link" className="text-sm text-primary hover:underline p-0 h-auto">Log out</Button>
            </div>
          </div>
        </div>
        <Tabs defaultValue="restaurants">
          <TabsList className="grid w-full grid-cols-3 p-1.5 h-auto rounded-full bg-muted-foreground/10">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full py-2.5 text-muted-foreground transition-all duration-300 font-semibold"><Users className="mr-2 h-5 w-5" />Manage Users</TabsTrigger>
            <TabsTrigger value="restaurants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full py-2.5 text-muted-foreground transition-all duration-300 font-semibold"><Store className="mr-2 h-5 w-5" />Manage Restaurants</TabsTrigger>
            <TabsTrigger value="couriers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full py-2.5 text-muted-foreground transition-all duration-300 font-semibold"><Bike className="mr-2 h-5 w-5" />Manage Couriers</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6"><UsersManagement /></TabsContent>
          <TabsContent value="restaurants" className="mt-6"><RestaurantsManagement /></TabsContent>
          <TabsContent value="couriers" className="mt-6"><CouriersManagement /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ManagementHeader: React.FC<{ onSearch: (term: string) => void; onSort: (option: string) => void; sortOptions: SortOption[]; }> = ({ onSearch, onSort, sortOptions }) => (
  <div className="flex justify-between items-center mb-5 px-1">
    <div className="relative w-2/5">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input type="text" placeholder="Search..." onChange={(e) => onSearch(e.target.value)} className="w-full bg-card border border-border rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-300 text-sm placeholder:text-muted-foreground"/>
    </div>
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-muted-foreground">Sort by:</label>
      <select id="sort-select" onChange={(e) => onSort(e.target.value)} className="text-center border shadow rounded-full py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary/30 outline-none bg-background appearance-none">
        {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  </div>
);

const UsersManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: users, isLoading, isError } = useQuery<User[]>({ queryKey: ['users'], queryFn: getAllUsers });

  const deleteUserMutation = useMutation({ mutationFn: deleteUserById, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); toast.success('User deleted successfully!'); }, onError: (error) => toast.error(`Failed to delete user: ${error.message}`) });
  const updateUserMutation = useMutation({ mutationFn: (vars: { userId: string; data: UpdateUserData }) => updateUserById(vars.userId, vars.data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); setIsEditModalOpen(false); toast.success('User updated successfully!'); }, onError: (error) => toast.error(`Failed to update user: ${error.message}`) });
  const createUserMutation = useMutation({ mutationFn: createUser, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); setIsAddModalOpen(false); toast.success('User created successfully!'); }, onError: (error) => toast.error(`Failed to create user: ${error.message}`) });

  const handleEditClick = (user: User) => { setSelectedUser(user); setIsEditModalOpen(true); };
  const handleSaveChanges = (updatedData: UpdateAdminUserData) => { if (!selectedUser) return; updateUserMutation.mutate({ userId: selectedUser._id, data: updatedData }); };
  const handleCreateUser = (newUserData: CreateUserData) => { createUserMutation.mutate(newUserData); };
  const sortOptions: SortOption[] = [ { value: 'name-asc', label: 'Name (A-Z)' }, { value: 'name-desc', label: 'Name (Z-A)' }, { value: 'email-asc', label: 'Email (A-Z)' } ];
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => { switch (sortOption) { case 'name-desc': return b.name.localeCompare(a.name); case 'email-asc': return a.email.localeCompare(b.email); default: return a.name.localeCompare(b.name); } });
  }, [searchTerm, sortOption, users]);

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error fetching users. Please try again.</div>;

  return (
    <>
      <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleCreateUser} isSaving={createUserMutation.isPending} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} userToEdit={selectedUser} onSave={handleSaveChanges} isSaving={updateUserMutation.isPending} />
      <Card className="bg-card rounded-2xl shadow-lg border-0 text-card-foreground">
        <CardHeader className="flex flex-row justify-between items-center"><CardTitle>All Users ({users?.length || 0})</CardTitle><Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-hover text-primary-foreground rounded-full px-5 py-2.5 h-auto font-semibold"><PlusCircle className="mr-2 h-4 w-4"/>Add User</Button></CardHeader>
        <CardContent>
          <ManagementHeader onSearch={setSearchTerm} onSort={setSortOption} sortOptions={sortOptions} />
          <Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredUsers.map(user => <UserTableRow key={user._id} user={user} onDelete={() => deleteUserMutation.mutate(user._id)} onEdit={() => handleEditClick(user)} />)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

const CouriersManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const { data: couriers, isLoading, isError } = useQuery<Courier[]>({ queryKey: ['couriers'], queryFn: getAllCouriers });
  const createCourierMutation = useMutation({ mutationFn: createCourier, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['couriers'] }); setIsAddModalOpen(false); toast.success('Courier created successfully!'); }, onError: (error) => toast.error(`Failed to create courier: ${error.message}`) });
  const updateCourierMutation = useMutation({ mutationFn: (vars: { courierId: string; data: Partial<CourierData> }) => updateCourierById(vars.courierId, vars.data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['couriers'] }); setIsEditModalOpen(false); toast.success('Courier updated successfully!'); }, onError: (error) => toast.error(`Failed to update courier: ${error.message}`) });
  const deleteCourierMutation = useMutation({ mutationFn: deleteCourierById, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['couriers'] }); toast.success('Courier deleted successfully!'); }, onError: (error) => toast.error(`Failed to delete courier: ${error.message}`) });
  const handleEditClick = (courier: Courier) => { setSelectedCourier(courier); setIsEditModalOpen(true); };
  const handleCreateCourier = (data: Omit<CourierData, 'isAvailable'>) => createCourierMutation.mutate(data);
  const handleUpdateCourier = (data: Partial<CourierData>) => { if (selectedCourier) updateCourierMutation.mutate({ courierId: selectedCourier._id, data }); };
  const sortOptions: SortOption[] = [ { value: 'name-asc', label: 'Name (A-Z)' }, { value: 'name-desc', label: 'Name (Z-A)' }];
  const filteredCouriers = useMemo(() => {
    if (!couriers) return [];
    return couriers.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => { const nameA = `${a.firstName} ${a.lastName}`; const nameB = `${b.firstName} ${b.lastName}`; return sortOption === 'name-desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB); });
  }, [searchTerm, sortOption, couriers]);

  if (isLoading) return <div>Loading couriers...</div>;
  if (isError) return <div>Error fetching couriers. Please try again.</div>;

  return (
    <>
      <AddCourierModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleCreateCourier} isSaving={createCourierMutation.isPending} />
      <EditCourierModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} courierToEdit={selectedCourier} onSave={handleUpdateCourier} isSaving={updateCourierMutation.isPending} />
      <Card className="bg-card rounded-2xl shadow-lg border-0 text-card-foreground">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>All Couriers ({couriers?.length || 0})</CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-hover text-primary-foreground rounded-full px-5 py-2.5 h-auto font-semibold"><PlusCircle className="mr-2 h-4 w-4" />Add Courier</Button>
        </CardHeader>
        <CardContent>
          <ManagementHeader onSearch={setSearchTerm} onSort={setSortOption} sortOptions={sortOptions} />
          <Table><TableHeader><TableRow><TableHead>Courier</TableHead><TableHead>Phone</TableHead><TableHead>Vehicle</TableHead><TableHead>Available</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredCouriers.map(courier => <CourierTableRow key={courier._id} courier={courier} onEdit={() => handleEditClick(courier)} onDelete={() => deleteCourierMutation.mutate(courier._id)} />)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

const RestaurantsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [isMenuModalOpen, setMenuModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<BackendRestaurant | null>(null);

  const { data: restaurants, isLoading, isError } = useQuery<BackendRestaurant[]>({
    queryKey: ['admin-restaurants'],
    queryFn: getAllAdminRestaurants,
  });

  const createRestaurantMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      setAddModalOpen(false);
      toast.success('Restaurant created successfully!');
    },
    onError: (error) => toast.error(`Failed to create restaurant: ${error.message}`),
  });

  const updateRestaurantMutation = useMutation({
    mutationFn: (vars: { id: string; data: Partial<RestaurantData> }) => updateRestaurantById(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      setEditModalOpen(false);
      toast.success('Restaurant updated successfully!');
    },
    onError: (error) => toast.error(`Failed to update restaurant: ${error.message}`),
  });

  const deleteRestaurantMutation = useMutation({
    mutationFn: deleteRestaurantById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      toast.success('Restaurant deleted successfully!');
    },
    onError: (error) => toast.error(`Failed to delete restaurant: ${error.message}`),
  });

  const handleManageMenu = (restaurant: BackendRestaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuModalOpen(true);
  };

  const handleEditClick = (restaurant: BackendRestaurant) => {
    setSelectedRestaurant(restaurant);
    setEditModalOpen(true);
  };

  const handleCreateRestaurant = (data: RestaurantData) => {
    createRestaurantMutation.mutate(data);
  };

  const handleUpdateRestaurant = (data: Partial<RestaurantData>) => {
    if (selectedRestaurant) {
      updateRestaurantMutation.mutate({ id: selectedRestaurant._id, data });
    }
  };

  const sortOptions: SortOption[] = [ { value: 'name-asc', label: 'Name (A-Z)' }, { value: 'name-desc', label: 'Name (Z-A)' } ];
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
    return restaurants.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => {
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, sortOption, restaurants]);

  if (isLoading) return <div>Loading restaurants...</div>;
  if (isError) return <div>Error fetching restaurants data.</div>;

  return (
    <>
      <AddRestaurantModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleCreateRestaurant} isSaving={createRestaurantMutation.isPending} />
      <EditRestaurantModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleUpdateRestaurant} isSaving={updateRestaurantMutation.isPending} restaurantToEdit={selectedRestaurant} />
      <Card className="bg-card rounded-2xl shadow-lg border-0 text-card-foreground">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>All Restaurants ({restaurants?.length || 0})</CardTitle>
          <Button onClick={() => setAddModalOpen(true)} className="bg-primary hover:bg-hover text-primary-foreground rounded-full px-5 py-2.5 h-auto font-semibold">
            <PlusCircle className="mr-2 h-4 w-4" />Add Restaurant
          </Button>
        </CardHeader>
        <CardContent>
          <ManagementHeader onSearch={setSearchTerm} onSort={setSortOption} sortOptions={sortOptions} />
          <Table>
            <TableHeader><TableRow><TableHead>Restaurant</TableHead><TableHead>Address</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredRestaurants.map(r => (
                <RestaurantTableRow key={r._id} restaurant={r} onManageMenu={() => handleManageMenu(r)} onEdit={() => handleEditClick(r)} onDelete={() => deleteRestaurantMutation.mutate(r._id)} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedRestaurant && ( <MenuItemsManagementModal isOpen={isMenuModalOpen} onClose={() => setMenuModalOpen(false)} restaurant={selectedRestaurant} /> )}
    </>
  );
};

const UserTableRow: React.FC<{ user: User; onDelete: () => void; onEdit: () => void; }> = ({ user, onDelete, onEdit }) => (
  <TableRow className="hover:bg-accent/50">
    <TableCell className="font-medium"><div className="flex items-center gap-3"><Avatar className="h-10 w-10 border-2 border-card shadow-sm"><AvatarImage src={user.avatarUrl} alt={user.name} /><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>{user.name}</div></TableCell>
    <TableCell className="text-muted-foreground">{user.email}</TableCell>
    <TableCell>{user.phone || 'N/A'}</TableCell>
    <TableCell><Badge className={user.role === 'admin' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}>{user.role}</Badge></TableCell>
    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" /></Button><ConfirmationDialog title="Delete User?" description="This action cannot be undone." onConfirm={onDelete} trigger={<Button variant="ghost" size="icon" disabled={user.role === 'admin'}><Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" /></Button>}/></TableCell>
  </TableRow>
);

const CourierTableRow: React.FC<{ courier: Courier; onEdit: () => void; onDelete: () => void; }> = ({ courier, onEdit, onDelete }) => (
  <TableRow className="hover:bg-accent/50">
    <TableCell className="font-medium">{`${courier.firstName} ${courier.lastName}`}</TableCell>
    <TableCell>{courier.phone}</TableCell>
    <TableCell>{courier.vehicleType}</TableCell>
    <TableCell><Badge className={courier.isAvailable ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}>{courier.isAvailable ? 'Yes' : 'No'}</Badge></TableCell>
    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" /></Button><ConfirmationDialog title="Delete Courier?" description="This action is permanent." onConfirm={onDelete} trigger={<Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" /></Button>} /></TableCell>
  </TableRow>
);

const RestaurantTableRow: React.FC<{ restaurant: BackendRestaurant; onManageMenu: () => void; onEdit: () => void; onDelete: () => void; }> = ({ restaurant, onManageMenu, onEdit, onDelete }) => (
  <TableRow className="hover:bg-accent/50">
    <TableCell className="font-medium">
      <div className="flex items-center gap-3">
        <img
          src={restaurant.images?.logoUrl || ''}
          alt={restaurant.name}
          className="h-10 w-10 rounded-md object-cover border-2 border-card shadow-sm"
        />
        <div>
          {restaurant.name}
          <p className="text-xs text-muted-foreground font-normal">
            {restaurant.categories?.join(', ')}
          </p>
        </div>
      </div>
    </TableCell>
    <TableCell>{restaurant.address}</TableCell>
    <TableCell className="text-right space-x-1">
      <Button onClick={onManageMenu} variant="outline" size="sm" className="rounded-full"><Utensils className="mr-2 h-3 w-3"/> Manage Menu</Button>
      <Button onClick={onEdit} variant="ghost" size="icon"><Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" /></Button>
      <ConfirmationDialog title="Delete Restaurant?" description="This action is permanent." onConfirm={onDelete} trigger={
        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" /></Button>
      } />
    </TableCell>
  </TableRow>
);

const MenuItemsManagementModal: React.FC<{ isOpen: boolean; onClose: () => void; restaurant: BackendRestaurant; }> = ({ isOpen, onClose, restaurant }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products', restaurant._id],
    queryFn: () => getProductsByRestaurantId(restaurant._id),
    enabled: isOpen,
  });

  const createProductMutation = useMutation({
    mutationFn: (data: ProductData) => createProduct(restaurant._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', restaurant._id] });
      setAddProductModalOpen(false);
      toast.success('Product added successfully!');
    },
    onError: (error) => toast.error(`Failed to add product: ${error.message}`)
  });

  const updateProductMutation = useMutation({
    mutationFn: (vars: { productId: string, data: Partial<ProductData> }) => updateProductById(vars.productId, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', restaurant._id] });
      setEditProductModalOpen(false);
      toast.success('Product updated successfully!');
    },
    onError: (error) => toast.error(`Failed to update product: ${error.message}`)
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', restaurant._id] });
      toast.success('Product deleted successfully!');
    },
    onError: (error) => toast.error(`Failed to delete product: ${error.message}`)
  });

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditProductModalOpen(true);
  };

  const handleCreateProduct = (data: ProductData) => {
    createProductMutation.mutate(data);
  };

  const handleUpdateProduct = (data: Partial<ProductData>) => {
    if (selectedProduct) {
      updateProductMutation.mutate({ productId: selectedProduct._id, data });
    }
  };

  const sortOptions: SortOption[] = [ { value: 'name-asc', label: 'Name (A-Z)' }, { value: 'name-desc', label: 'Name (Z-A)' }, { value: 'price-desc', label: 'Price (High-Low)' }, { value: 'price-asc', label: 'Price (Low-High)' }, ];
  const filteredItems = useMemo(() => {
    if (!products) return [];
    return products.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => { switch (sortOption) { case 'name-desc': return b.name.localeCompare(a.name); case 'price-desc': return b.price - a.price; case 'price-asc': return a.price - b.price; default: return a.name.localeCompare(b.name); } });
  }, [searchTerm, sortOption, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setAddProductModalOpen(false)} onSave={handleCreateProduct} isSaving={createProductMutation.isPending} />
      <EditProductModal isOpen={isEditProductModalOpen} onClose={() => setEditProductModalOpen(false)} onSave={handleUpdateProduct} isSaving={updateProductMutation.isPending} productToEdit={selectedProduct} />
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <header className="flex justify-between items-center p-6 border-b border-border flex-shrink-0">
          <div><h2 className="text-2xl font-bold">Manage Menu</h2><p className="text-muted-foreground">Restaurant: <span className="font-semibold text-primary">{restaurant.name}</span></p></div>
          <div className="flex items-center gap-4"><Button onClick={() => setAddProductModalOpen(true)} className="bg-primary hover:bg-hover text-primary-foreground rounded-full px-5 h-10 font-semibold"><PlusCircle className="mr-2 h-4 w-4"/>Add New Product</Button><Button onClick={onClose} variant="ghost" size="icon" className="rounded-full"><X className="h-6 w-6 text-muted-foreground" /></Button></div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          <ManagementHeader onSearch={setSearchTerm} onSort={setSortOption} sortOptions={sortOptions} />
          {isLoading ? (<div>Loading products...</div>) : isError ? (<div>Error fetching products.</div>) : (
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{filteredItems.map(item => <ProductTableRow key={item._id} {...item} onEdit={() => handleEditClick(item)} onDelete={() => deleteProductMutation.mutate(item._id)} />)}</TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductTableRow: React.FC<Product & { onEdit: () => void, onDelete: () => void }> = ({ onEdit, onDelete, ...item }) => (
  <TableRow className="hover:bg-accent/50">
    <TableCell>
      <div className="flex items-center gap-4">
        <img src={item.images?.[0] || item.imageUrl || ''} alt={item.name} className="h-12 w-12 rounded-full object-cover border-2 border-hover shadow-sm"/>
        <div className='flex flex-col'>
          <span className="font-semibold">{item.name}</span>
          <span className='text-xs text-muted-foreground'>{item.description}</span>
        </div>
      </div>
    </TableCell>
    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
    <TableCell className="font-semibold">{item.price.toFixed(2)} RON</TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" /></Button>
      <ConfirmationDialog title="Delete product?" description="This action is permanent." onConfirm={onDelete} trigger={
        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" /></Button>
      } />
    </TableCell>
  </TableRow>
);

export default AdminDashboard;