import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HardHat, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <HardHat className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Coming Soon!
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            This feature is currently under construction.
            <br />
            We're working hard to bring it to you!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-primary hover:bg-hover text-primary-foreground"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Back to Main Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonPage;