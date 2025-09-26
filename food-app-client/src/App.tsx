import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminDashboard from '@/components/pages/admin-page';
import LoginPage from '@/components/pages/login-page';
import UserProfilePage from '@/components/pages/user-page';
import Layout from '@/components/layout';
import RestaurantPage from '@/components/pages/restaurant-page';
import SignupPage from '@/components/pages/sign-up-page';
import CheckoutPage from '@/components/pages/checkout-page';
import MainPage from '@/components/pages/main-page';
import { AuthProvider } from '@/context/auth.provider';
import ProtectedRoute from '@/auth/protected-route';
import PublicOnlyRoute from '@/auth/publiconly-route';
import { Toaster } from 'sonner';
import VerifyEmailPage from '@/components/pages/verify-email-page.tsx';
import ComingSoonPage from '@/components/pages/coming-soon-page.tsx';
import RestaurantsByCategoryPage from "@/components/pages/restaurants-by-categories-page.tsx";

const router = createBrowserRouter([
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: 'profile',
            element: <UserProfilePage />,
          },
          {
            path: 'admin',
            element: <AdminDashboard />,
          },
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'comingsoon',
            element: <ComingSoonPage />,
          },
        ],
      },
      {
        path: 'restaurant/:id',
        element: <RestaurantPage />,
      },
        {
            path: '/category/:categoryName',
            element: <RestaurantsByCategoryPage/>
        }
    ],
  },
]);


function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;