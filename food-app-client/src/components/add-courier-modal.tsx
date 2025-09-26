import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { type VehicleType, VehicleTypes } from '@/types';
import type { CourierData } from '@/services/courier.service';

interface AddCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<CourierData, 'isAvailable'>) => void;
  isSaving: boolean;
}

export const AddCourierModal: React.FC<AddCourierModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleTypes.MOTORCYCLE);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ firstName, lastName, phone, vehicleType });
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-2xl relative">
        <CardHeader>
          <CardTitle>Add New Courier</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}><X className="h-5 w-5" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>First Name</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="space-y-2"><Label>Vehicle</Label><Select value={vehicleType} onValueChange={(v: VehicleType) => setVehicleType(v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value={VehicleTypes.MOTORCYCLE}>Motorcycle</SelectItem><SelectItem value={VehicleTypes.BICYCLE}>Bicycle</SelectItem><SelectItem value={VehicleTypes.CAR}>Car</SelectItem></SelectContent></Select></div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-hover">Create Courier</Button>
        </CardFooter>
      </Card>
    </div>
  );
};