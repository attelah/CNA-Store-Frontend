import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useSearch } from './SearchContext';
import '../styles/store.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Store = () => {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch();
  const [camels, setCamels] = useState([]);
  //const token = process.env.REACT_APP_API_TOKEN;
  const token = localStorage.getItem('jwt');

  // Fetch data from the product API
  useEffect(() => {
    fetch(`${process.env.REACT_APP_PRODUCT_API}/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((data) => {
        setCamels(data);
      })
      .catch(() => {
        console.log('Error fetching data');
      });
  }, []);


  // Load images from local folder
  const loadImage = async (productId) => {
    try {
      const { default: camelImageSrc } = await import(`../camelImages/${productId}.jpg`);
      return camelImageSrc;
    } catch (error) {
      console.error('Error loading image:', error);
      return '';
    }
  };


  const CamelComponent = ({ camel }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
      loadImage(camel.product_id).then(setImageSrc);
    }, [camel.product_id]);

    const handleAddToCartEnhanced = () => {
      fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the authorization token
        },
        body: JSON.stringify({
          product: camel.id, // Use the unique identifier for the product
          quantity: 1,
          price: camel.price,
        }),
      })
      .then(response => {
        if (response.status === 201) {
          return response.json(); // Parse the JSON response body
        } else {
          throw new Error('Product not added to cart');
        }
      })
      .then(data => {
          addToCart({ ...camel, quantity: 1 }); // Update the local cart context with the camel and a quantity of 1
          console.log("Product added to cart:", data); // Log the data from the response
      })
      .catch(error => console.error('Error:', error));
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    // Close modal if clicked outside of it
    useEffect(() => {
      function clickOutside(event) {
          if (modalOpen) {
              const modal = document.querySelector('.modal-content');

              // Check if the click occurred outside the dropdown
              if (modal && !modal.contains(event.target)) {
                  setModalOpen(false);
              }
          }
      }

      // Add click event listener to the document
      document.addEventListener('click', clickOutside);

      // Cleanup function
      return () => document.removeEventListener('click', clickOutside);
    }, [modalOpen]);


    return (
      <>
        <div className="camel-card" onClick={openModal}>
          <div>
            <img src={imageSrc} alt={camel.name} />
          </div>
          <div className='camel-info'>
            <h2>{camel.name}</h2>
            <p>{camel.description}</p>
            {camel.quantity > 0 ? (
              <div className='price'>
                <h3>Price: {camel.price}€</h3>
                <button onClick={(event) => { event.stopPropagation(); handleAddToCartEnhanced(); }} id='cartButton'><FontAwesomeIcon icon={faShoppingCart}/></button>
              </div>
            ) : (
              <h3 className='stock'>Sold out!</h3>
            )}
          </div>
        </div>

        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div>
                <img src={imageSrc} alt={camel.name} className="modal-product-image" />
              </div>

              <div className='modal-text'>
                <h2>{camel.name}</h2>
                <p>{camel.description}</p>
                {camel.quantity > 0 ? (
                  <div className='modal-price'>
                    <h3>Price: {camel.price}€</h3>
                    <button onClick={handleAddToCartEnhanced} id='modalCartButton'><FontAwesomeIcon icon={faShoppingCart}/> Add to Cart</button>
                  </div>
                ) : (
                  <h3 className='modalStock'>Sold out!</h3>
                )}
              </div>

              <span className="close" onClick={closeModal}>&times;</span>
            </div>
          </div>
        )}
      </>
    );
  };
  
  const handleSort = (criteria) => {
    const sortedCamels = [...camels].sort((a, b) => {
      if (criteria === 'price-up') {
        return a.price - b.price;
      } else if (criteria === 'price-down') {
        return b.price - a.price;
      } else if (criteria === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    setCamels(sortedCamels);
  };

  const filteredCamels = camels.filter(camel => camel.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className='full-page'>
      <div className='banner'>
        <h1 id='banner-text'>Modern Camels</h1>
        <h2 id='selling-text'>Selling the worlds finest camels!</h2>
      </div>
      
      <div className='products-container'>
        <div className='sort-options'>
          <select onChange={(e) => handleSort(e.target.value)} id='sort-select'>
            <option value="price-up">Price ascending</option>
            <option value="price-down">Price descending</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
  
        <div className='card-box'>
          {filteredCamels.map((camel, index) => (
            <CamelComponent key={index} camel={camel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;