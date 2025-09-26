import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { Address } from '@/types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Address, '_id'>) => void;
  isSaving: boolean;
  addressToEdit: Address | null;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, isSaving, addressToEdit }) => {
  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const isEditMode = !!addressToEdit;

  useEffect(() => {
    if (isOpen && addressToEdit) {
      setTitle(addressToEdit.title);
      setStreet(addressToEdit.street);
      setCity(addressToEdit.city);
    } else {
      setTitle('');
      setStreet('');
      setCity('');
    }
  }, [isOpen, addressToEdit]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ title, street, city });
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-2xl relative">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Address' : 'Add a New Address'}</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}><X className="h-5 w-5" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Title (e.g., Home, Office)</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="space-y-2"><Label>Street & Number</Label><Input value={street} onChange={(e) => setStreet(e.target.value)} /></div>
          <div className="space-y-2"><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-hover">{isSaving ? 'Saving...' : 'Save Address'}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};