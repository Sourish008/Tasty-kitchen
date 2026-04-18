import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingCart from './FloatingCart';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col pt-16">
        <Outlet />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Layout;
