import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import type { ProductData } from '../services/admin-restaurant.service.ts';
import type { Product } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProductData>) => void;
  isSaving: boolean;
  productToEdit: Product | null;
}

export const EditProductModal: React.FC<Props> = ({ isOpen, onClose, onSave, isSaving, productToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price);
      setCategory(productToEdit.category);
      setImageUrl(productToEdit.imageUrl || '');
    }
  }, [productToEdit]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({ name, description, price, category, imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-2xl relative">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="prod-name-edit">Name</Label><Input id="prod-name-edit" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="prod-desc-edit">Description</Label><Textarea id="prod-desc-edit" value={description} onChange={e => setDescription(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="prod-cat-edit">Category</Label><Input id="prod-cat-edit" value={category} onChange={e => setCategory(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="prod-price-edit">Price</Label><Input id="prod-price-edit" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label htmlFor="prod-img-edit">Image URL</Label><Input id="prod-img-edit" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
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