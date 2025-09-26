import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import type { RestaurantData } from '../services/admin-restaurant.service.ts';
import type { BackendRestaurant } from '../services/restaurant.service.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<RestaurantData>) => void;
  isSaving: boolean;
  restaurantToEdit: BackendRestaurant | null;
}

export const EditRestaurantModal: React.FC<Props> = ({ isOpen, onClose, onSave, isSaving, restaurantToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState('');

  useEffect(() => {
    if (restaurantToEdit) {
      setName(restaurantToEdit.name || '');
      setDescription(restaurantToEdit.description || '');
      setAddress(restaurantToEdit.address || '');
      setPhone(restaurantToEdit.phone || '');
      setEmail(restaurantToEdit.email || '');
      setCategories(restaurantToEdit.categories?.join(', ') || '');
    }
  }, [restaurantToEdit]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const categoriesArray = categories.split(',').map(cat => cat.trim()).filter(Boolean);
    onSave({ name, description, address, phone, email, categories: categoriesArray });
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-2xl relative">
        <CardHeader>
          <CardTitle>Edit Restaurant</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="res-name-edit">Name</Label>
            <Input id="res-name-edit" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-desc-edit">Description</Label>
            <Textarea id="res-desc-edit" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-address-edit">Address</Label>
            <Input id="res-address-edit" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-phone-edit">Phone</Label>
            <Input id="res-phone-edit" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-email-edit">Email</Label>
            <Input id="res-email-edit" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-cat-edit">Categories (comma-separated)</Label>
            <Input id="res-cat-edit" value={categories} onChange={e => setCategories(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-hover">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};