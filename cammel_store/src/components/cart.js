import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import styles from '../styles/Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  //const token = process.env.REACT_APP_API_TOKEN;
  const token = localStorage.getItem('jwt');

  const calculateTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };
  

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product from cart. Status: ${response.status}`);
      }
      console.log("Product removed from cart successfully");
      setCartItems(currentItems => currentItems.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleUpdateQuantityAndPrice = async (productId, change) => {
    // Find the product in the cart to get its current state
    const productToUpdate = cartItems.find(item => item.id === productId);
    if (!productToUpdate) {
      console.error("Product not found in cart:", productId);
      return;
    }
  
    // Calculate new quantity and price
    let newQuantity = productToUpdate.quantity + change;
    let newPrice = productToUpdate.price / productToUpdate.quantity * newQuantity; // Adjust price based on original unit price
  
    // If the new quantity is 0 or less, remove the item from the cart
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/cart/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: newQuantity,
          price: newPrice, // Updated price
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update cart item. Status: ${response.status}`);
      }
  
      // Update local state to reflect changes
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity, price: newPrice } : item
        )
      );
      console.log("Cart item updated successfully:", productId, "New quantity:", newQuantity, "New price:", newPrice);
    } catch (error) {
      console.error("Error updating cart item:", productId, error);
    }
  };
  
  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul className={styles.cartList}>
          {cartItems.map(item => (
            <li key={item.id} className={styles.cartItem}>
              <div className={styles.quantityContainer}>
                <button onClick={() => handleUpdateQuantityAndPrice(item.id, -1)} className={styles.quantityButton}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantityAndPrice(item.id, +1)} className={styles.quantityButton}>+</button>
              </div>
              <span className={styles.productDetails}>{item.name} - ${item.price}</span>
              <button onClick={() => handleRemoveFromCart(item.id)} className={styles.removeButton}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <p className={styles.total}>Total: ${calculateTotalCost()}</p>
      <button onClick={handleProceedToCheckout} className={styles.checkoutButton}>Proceed to Checkout</button>
    </div>
  );
  
};

export default Cart;