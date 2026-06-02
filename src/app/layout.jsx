import './globals.css'
import { CartProvider } from '../components/CartContext'
import CartModal from '../components/CartModal'

export const metadata = {
  title: 'SENARA Botanical Science',
  description: 'Defining the future of luxury skincare through the lens of botanical molecular science.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          {children}
          <CartModal />
        </CartProvider>
      </body>
    </html>
  )
}
