import { CartProvider } from './context/CartContext'
import './globals.css'

export const metadata = {
  title: 'Biswakarma Agro',
  description: 'Agro Products Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}