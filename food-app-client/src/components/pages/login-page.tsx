import { Label } from '../ui/label.tsx';
import { Input } from '../ui/input.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.tsx';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import bgImage from '../../resources/images/login-image.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth.ts';
import { isAxiosError } from 'axios';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const getErrorMessage = () => {
    if (!loginError) return null;

    if (isAxiosError(loginError) && loginError.response?.data?.message) {
      return loginError.response.data.message;
    }

    return loginError.message;
  };

  const errorMessage = getErrorMessage();

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
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <Card
            className="w-full max-w-md rounded-2xl shadow-2xl bg-[var(--card-background)] backdrop-blur-lg border">
            <CardHeader className="px-8 pt-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="src/resources/images/logo2.png"
                  alt="Logo"
                  className="w-auto h-20"
                />
              </div>
              <CardTitle
                className="text-2xl font-semibold text-black/80 text-center pb-2">
                Welcome back
              </CardTitle>
              <CardDescription className="text-sm text-[var(--muted-foreground)] text-center">
                Log in to your account to continue enjoying fresh meals.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-10 pt-6">
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm text-[var(--muted-foreground)] block mb-2"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full rounded-xl bg-[var(--input)] text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)] pl-4 pr-10 py-3 border"
                    />
                    <Mail
                      size={15}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--card-foreground)]/60"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm text-[var(--muted-foreground)] block mb-2"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Your Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full rounded-xl bg-[var(--input)] text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)] pl-4 pr-4 py-3 border"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-semibold shadow-lg transform transition duration-150 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)]/20 cursor-pointer"
                  >
                    {isLoggingIn ? 'Logging in...' : 'Log in'}
                  </Button>
                </div>
                <div className="text-center ">
                                      <span className="text-base font-bold text-white">
                                        No account yet?{" "}
                                      </span>
                  <a className="text-base font-bold text-[var(--primary)] hover:underline ml-1 cursor-pointer" onClick={() => navigate('/signup')}>
                    Create one
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}