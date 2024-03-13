import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems(currentItems => {
            const itemFound = currentItems.find(item => item.id === product.id);
            if (itemFound) {
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(currentItems => 
            currentItems.filter(item => item.id !== productId)
        );
    };

    const updateQuantity = (productId, quantity) => {
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.id === productId ? { ...item, quantity: quantity } : item
            ).filter(item => item.quantity > 0) // Optionally remove item if quantity is 0
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const calculateTotalCost = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            setCartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            calculateTotalCost 
        }}>
            {children}
        </CartContext.Provider>
    );
};
