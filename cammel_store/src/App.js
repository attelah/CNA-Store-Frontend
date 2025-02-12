import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/CheckAuth';
import { SearchProvider } from './components/SearchContext';
import { CartProvider } from './components/CartContext'; // Import CartProvider
import Store from './components/store';
import Checkout from './components/Checkout';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Cart from './components/cart';
import Register from './components/register';
import ChangePass from './components/changePass'

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
      <CartProvider> {/* Wrap components with CartProvider */}
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Store />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/store" element={<Store />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/changePass" element={<ChangePass />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
