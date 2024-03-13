import React, { useState } from 'react';
import { useCart } from './CartContext'; // Adjust the path as necessary
import styles from '../styles/Checkout.module.css';

const Checkout = () => {
  const { cartItems, clearCart } = useCart(); // Assuming there's a method to clear the cart
  const [address, setAddress] = useState(''); // State to store the address
 
  const handleSubmit = async (event) => {
    event.preventDefault();

    const orderData = {
      products: cartItems.map((item) => ({
        product: item.product_id, // or item.id, depending on your data structure
        price: item.price,
        quantity: item.quantity,
      })),
      address: address, // Include the address in the order data
    };

    const token = process.env.REACT_APP_API_TOKEN; // Use your actual token
  //const token = localStorage.getItem('jwt');
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

      // Handle the response, e.g., show success message, clear cart
      alert('Order placed successfully');
      clearCart(); // Assuming you have a method to clear the cart
      // Redirect to success page or reset form as needed
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };
 
  const calculateTotalCost = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    
    <div className={styles.checkoutContainer}>
      <h2 className={styles.checkoutTitle}>Checkout</h2>
      <form onSubmit={handleSubmit}>
        {/* Include other form fields as needed */}
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit">Place Order</button>
      </form>
   
      <div className={styles.orderSummary}>
        <h3 className={styles.summaryTitle}>Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index}>
            {item.name} - ${item.price} x {item.quantity}
          </div>
        ))}
        <p>Total: ${calculateTotalCost()}</p>
      </div>
    </div>
    
  );
};

export default Checkout;