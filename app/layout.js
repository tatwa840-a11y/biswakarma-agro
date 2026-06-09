import { CartProvider } from './context/CartContext';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Biswakarma Agro',
  description: 'Agro Products Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}