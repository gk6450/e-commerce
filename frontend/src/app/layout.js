import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Mini E-Shop",
  description: "Mini E-commerce Application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Wrap the app in CartProvider */}
        <CartProvider>
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          <footer className="bg-white shadow-inner py-4">
            <div className="container mx-auto text-center text-gray-600">
              © {new Date().getFullYear()} Mini E-Shop. All rights reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
