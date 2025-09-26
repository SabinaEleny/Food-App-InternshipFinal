import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { type Courier, type VehicleType, VehicleTypes } from '@/types';
import type { CourierData } from '@/services/courier.service';

interface EditCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CourierData>) => void;
  isSaving: boolean;
  courierToEdit: Courier | null;
}

export const EditCourierModal: React.FC<EditCourierModalProps> = ({ isOpen, onClose, onSave, isSaving, courierToEdit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleTypes.MOTORCYCLE);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (courierToEdit) {
      setFirstName(courierToEdit.firstName);
      setLastName(courierToEdit.lastName);
      setPhone(courierToEdit.phone);
      setVehicleType(courierToEdit.vehicleType);
      setIsAvailable(courierToEdit.isAvailable);
    }
  }, [courierToEdit]);

  if (!isOpen || !courierToEdit) return null;

  const handleSave = () => {
    onSave({ firstName, lastName, phone, vehicleType, isAvailable });
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-2xl relative">
        <CardHeader>
          <CardTitle>Edit Courier: {courierToEdit.firstName}</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}><X className="h-5 w-5" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>First Name</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="space-y-2"><Label>Vehicle</Label><Select value={vehicleType} onValueChange={(v: VehicleType) => setVehicleType(v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value={VehicleTypes.MOTORCYCLE}>Motorcycle</SelectItem><SelectItem value={VehicleTypes.BICYCLE}>Bicycle</SelectItem><SelectItem value={VehicleTypes.CAR}>Car</SelectItem></SelectContent></Select></div>
          <div className="flex items-center space-x-2 pt-2"><Switch id="is-available" checked={isAvailable} onCheckedChange={setIsAvailable} /><Label htmlFor="is-available">Is Available</Label></div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-hover">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};