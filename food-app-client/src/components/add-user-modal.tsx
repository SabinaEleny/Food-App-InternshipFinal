import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import type { CreateUserData } from '@/services/admin.service';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUserData: CreateUserData) => void;
  isSaving: boolean;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');

  if (!isOpen) {
    return null;
  }

  const handleSaveChanges = () => {
    onSave({ name, email, password, phone, role });
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-2xl relative">
        <CardHeader>
          <CardTitle>Add a New User</CardTitle>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-name">Full Name</Label>
            <Input id="add-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-email">Email Address</Label>
            <Input id="add-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-password">Password</Label>
            <Input id="add-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-phone">Phone Number (Optional)</Label>
            <Input id="add-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07xx xxx xxx"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-role">Role</Label>
            <Select value={role} onValueChange={(value: 'customer' | 'admin') => setRole(value)}>
              <SelectTrigger id="add-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-hover">
            {isSaving ? 'Creating...' : 'Create User'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};