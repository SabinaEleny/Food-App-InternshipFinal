import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmailToken } from '@/services/auth.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check the link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await verifyEmailToken(token);
        setStatus('success');
        setMessage(response.message);
      } catch (error: any) {
        setStatus('error');
        const errorMessage = error.response?.data?.message || 'Verification failed. The link may be expired or invalid.';
        setMessage(errorMessage);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <p>Verifying your email, please wait...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <ShieldCheck className="h-12 w-12 mx-auto text-green-500" />
              <p className="font-semibold text-green-600">{message}</p>
              <p>You can now log in to your account.</p>
              <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
            </>
          )}
          {status === 'error' && (
            <>
              <ShieldAlert className="h-12 w-12 mx-auto text-red-500" />
              <p className="font-semibold text-red-600">{message}</p>
              <Button onClick={() => navigate('/signup')} variant="outline" className="w-full">Try Signing Up Again</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}