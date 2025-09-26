import { Outlet } from 'react-router-dom';
import Navbar from './navbar.tsx';
import Footer from '@/components/footer.tsx';
import { useAuth } from '@/hooks/use-auth.ts';
import AiChat from '@/components/AI-chat.tsx';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-grow">
        <Outlet/>
      </main>
      <Footer/>

      {isAuthenticated && <AiChat />}
    </div>
  );
};

export default Layout;