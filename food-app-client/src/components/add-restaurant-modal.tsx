import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import type { RestaurantData } from '../services/admin-restaurant.service.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RestaurantData) => void;
  isSaving: boolean;
}

export const AddRestaurantModal: React.FC<Props> = ({ isOpen, onClose, onSave, isSaving }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState('');

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
          <CardTitle>Add New Restaurant</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="res-name">Name</Label>
            <Input id="res-name" value={name} onChange={e => setName(e.target.value)} required placeholder="Pizza Gusto" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-desc">Description</Label>
            <Textarea id="res-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Authentic Italian pizza." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-address">Address</Label>
            <Input id="res-address" value={address} onChange={e => setAddress(e.target.value)} required placeholder="123 Main St, Bucharest" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-phone">Phone</Label>
            <Input id="res-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="07xxxxxxxx" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-email">Email</Label>
            <Input id="res-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="contact@pizzagusto.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="res-cat">Categories (comma-separated)</Label>
            <Input id="res-cat" value={categories} onChange={e => setCategories(e.target.value)} required placeholder="Italian, Pizza, Pasta" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-hover">
            {isSaving ? 'Saving...' : 'Create Restaurant'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};