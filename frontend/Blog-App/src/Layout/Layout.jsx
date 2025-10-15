import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="container mx-auto my-8 px-4">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}