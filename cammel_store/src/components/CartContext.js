import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0); // State to keep track of total cost

    useEffect(() => {
        // Recalculate total cost whenever cartItems changes
        const newTotalCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        setTotalCost(newTotalCost.toFixed(2)); // Update total cost state
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(currentItems => {
            const itemFound = currentItems.find(item => item.id === product.id);
            if (itemFound) {
                // If item already exists, just update the quantity
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1, price: item.unitPrice * (item.quantity + 1) } : item
                );
            }
            // If new item, add it with quantity 1, set unitPrice as its price, and include imageUrl
            return [...currentItems, { ...product, quantity: 1, unitPrice: product.price, imageUrl: product.imageUrl }];
        });
    };
    
    
    

    const removeFromCart = (productId) => {
        setCartItems(currentItems => 
            currentItems.filter(item => item.id !== productId)
        );
    };

    const updateQuantity = async (productId, newQuantity) => {
        const token = process.env.REACT_APP_API_TOKEN;
        // Assume each item in cartItems includes a 'unitPrice' property
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity, price: item.unitPrice * newQuantity } : item
            ).filter(item => item.quantity > 0) // Remove items with 0 quantity
        );
    
        // Then, asynchronously update the backend
        try {
            const response = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/cart/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update cart item on the server.');
            }
        } catch (error) {
            console.error("Error updating cart item:", productId, error);
            // Optionally, handle the error by possibly reverting the optimistic update
        }
    };
    

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            setCartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            totalCost, // Provide totalCost for access within the context
            calculateTotalCost: () => totalCost // Provide a function to get the current totalCost
        }}>
            {children}
        </CartContext.Provider>
    );
};
