import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useCart } from './CartContext'; // Adjust the path as necessary
import styles from '../styles/Checkout.module.css';

const Checkout = () => {

  const { cartItems, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT", error);
      return null;
    }
  };

  // Extract email and name from JWT stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const userInfo = decodeJWT(token);
      if (userInfo) {
        setUserEmail(userInfo.email || '');
        setUserName(userInfo.username || '');
      }
    }
  }, []);

  const calculateTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const orderData = {
      products: cartItems.map((item) => ({
        product: item.product_id,
        price: item.price,
        quantity: item.quantity,
      })),
      address: address,
    };

    
    try {
      const response = await fetch(process.env.REACT_APP_ORDER_SERVICE_URL, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      alert('Order placed successfully');
      clearCart();
      navigate('/store');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.orderSummary}>
        <h3 className={styles.summaryTitle}>Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index} className={styles.productLine}>
            {item.quantity} x {item.name} | {item.price}€
          </div>
        ))}
        <p className={styles.total}>Total: ${calculateTotalCost()}</p>
      </div>
      <h2 className={styles.checkoutTitle}>Checkout</h2>
      <p>Name: {userName}</p>
      <p>Email: {userEmail}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="address">Delivery address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit" className={styles.checkoutButton}>Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
