import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Eye, EyeOff, Mail, User } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import bgImage from '../../resources/images/login-image.png';
import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth.ts';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import PasswordCriteria from '@/components/password-criteria.tsx';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    const navigate = useNavigate();
    const {register, isRegistering} = useAuth();

    useEffect(() => {
        setPasswordCriteria({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        });
    }, [password]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
        if (!allCriteriaMet) {
            toast.error("Password does not meet all security criteria.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const fullPhoneNumber = `${phone}`;
        register({name, email, password, phone: fullPhoneNumber}, {
            onSuccess: () => {
                toast.success("Account created successfully! Please log in.");
                navigate('/login');
            },
            onError: (error) => {
                const message = isAxiosError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : error.message;
                toast.error(message);
            }
        });
    };

    return (
        <div
            className="min-h-screen relative bg-[var(--background)]"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "50%",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div className="relative z-10 min-h-screen flex">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-0">
                    <Card
                        className="w-full max-w-md rounded-2xl shadow-2xl bg-[var(--card-background)] backdrop-blur-lg border">
                        <CardHeader className="px-8 pt-0">
                            <div className="flex items-center justify-center mb-3">
                                <img
                                    src="src/resources/images/logo2.png"
                                    alt="Logo"
                                    className="w-auto h-12"
                                />
                            </div>
                            <CardTitle
                                className="text-2xl font-bold text-[var(--primary-foreground)] text-center">Create
                                your account</CardTitle>
                            <CardDescription
                                className="text-sm text-[var(--muted-foreground)] text-center pt-1">Join us and start
                                ordering fresh meals in minutes.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-6 pt-3">
                            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                                <div className="space-y-1">
                                    <Label htmlFor="email"
                                           className="text-xs font-medium text-[var(--muted-foreground)]">Email
                                        address *</Label>
                                    <div className="relative">
                                        <Mail size={16}
                                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                        <Input id="email" type="email" value={email}
                                               onChange={(e) => setEmail(e.target.value)} required
                                               placeholder="Email Address"
                                               className="bg-white rounded-full border-gray-300 focus:border-primary focus:ring-primary/20 pl-10"/>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="name"
                                               className="text-xs font-medium text-[var(--muted-foreground)]">Full
                                            name *</Label>
                                        <div className="relative">
                                            <User size={16}
                                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                            <Input id="name" value={name}
                                                   onChange={(e) => setName(e.target.value)} required
                                                   placeholder="Full Name"
                                                   className="bg-white rounded-full border-gray-300 focus:border-primary focus:ring-primary/20 pl-10"/>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="phone"
                                               className="text-xs font-medium text-[var(--muted-foreground)]">Phone
                                            number</Label>
                                        <div className="relative">
                       <span className="absolute inset-y-0 left-4 flex items-center text-sm text-gray-500">
                         +40
                       </span>
                                            <Input id="phone" type="tel" value={phone}
                                                   onChange={(e) => setPhone(e.target.value)}
                                                   placeholder="07xx xxx xxx"
                                                   className="bg-white rounded-full border-gray-300 focus:border-primary focus:ring-primary/20 pl-14"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="password"
                                               className="text-xs font-medium text-[var(--muted-foreground)]">Password
                                            *</Label>
                                        <div className="relative">
                                            <Input id="password" type={showPassword ? "text" : "password"}
                                                   value={password}
                                                   onChange={(e) => setPassword(e.target.value)}
                                                   required
                                                   placeholder="Password"
                                                   className="bg-white rounded-full border-gray-300 focus:border-primary focus:ring-primary/20 pr-10"/>
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                                {showPassword ? <EyeOff size={16} className="text-gray-400"/> :
                                                    <Eye size={16} className="text-gray-400"/>}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="confirm-password"
                                               className="text-xs font-medium text-[var(--muted-foreground)]">Confirm
                                            Password *</Label>
                                        <div className="relative">
                                            <Input id="confirm-password"
                                                   type={showConfirmPassword ? "text" : "password"}
                                                   value={confirmPassword}
                                                   onChange={(e) => setConfirmPassword(e.target.value)} required
                                                   placeholder="Confirm Password"
                                                   className="bg-white rounded-full border-gray-300 focus:border-primary focus:ring-primary/20 pr-10"/>
                                            <button type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                                {showConfirmPassword ? <EyeOff size={16} className="text-gray-400"/> :
                                                    <Eye size={16} className="text-gray-400"/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs">
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                        <PasswordCriteria
                                            text="At least 8 characters"
                                            met={passwordCriteria.length}
                                        />
                                        <PasswordCriteria
                                            text="One uppercase letter"
                                            met={passwordCriteria.uppercase}
                                        />
                                        <PasswordCriteria
                                            text="One lowercase letter"
                                            met={passwordCriteria.lowercase}
                                        />
                                        <PasswordCriteria
                                            text="One number"
                                            met={passwordCriteria.number}
                                        />
                                        <PasswordCriteria
                                            text="One special character"
                                            met={passwordCriteria.special}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" disabled={isRegistering}
                                            className="w-full py-2.5 rounded-full bg-[var(--primary)] text-white font-semibold shadow-lg">
                                        {isRegistering ? 'Creating account...' : 'Create account'}
                                    </Button>
                                </div>
                                <div className="text-center">
                                    <span className="text-s font-bold text-white">Already have an account? </span>
                                    <a className="text-s font-bold text-[var(--primary)] hover:underline ml-1 cursor-pointer"
                                       onClick={() => navigate('/login')}>Log in</a>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}