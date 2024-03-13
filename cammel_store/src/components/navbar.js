import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import '../styles/navbar.css';
import { useAuth } from './CheckAuth';
import { useSearch } from './SearchContext';
import { useNavigate } from 'react-router-dom';
import camelLogo from '../camelImages/camellogo-transformed-removebg-preview.png'
//import camelText from '../camelImages/cooltext453914258362390.png'

const Navbar = () => {
    const { user, logout, login } = useAuth();
    const { setSearchTerm } = useSearch();
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message] = useState('');

    useEffect(() => {
        function handleClickOutside(event) {
            if (isLoginFormVisible) {
                const dropdown = document.querySelector('.login-dropdown');
    
                // Check if the click occurred outside the dropdown
                if (dropdown && !dropdown.contains(event.target)) {
                    setIsLoginFormVisible(false);
                }
            }
        }
    
        // Add click event listener to the document
        document.addEventListener('click', handleClickOutside);
    
        // Cleanup function
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isLoginFormVisible]);

    const handleDropdownClick = (event) => {
        // Prevent the event from bubbling up to the document
        event.stopPropagation();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { username, password };

        fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(message);
                }
                return response.json();
            })
            .then(data => {
                login(username);
                localStorage.setItem('jwt', data.token);
                setIsLoginFormVisible(false);
                navigate('/store');
            })
            .catch(error => {
                console.error('Login error:', error);
            });
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                <img src={camelLogo} id="camelLogo" alt="Camel Logo" />
                  <h3 id="camelStoreLogoText">Camel Store</h3>  
                </Link>
                <div className="search-bar">
                <input type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <button type="submit"><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        {user ? (
                            <button onClick={logout} className="navbar-button">
                                <FontAwesomeIcon icon={faUser} className="icon-spacing" /> | {user.username}
                            </button>
                        ) : (
                            <div className="navbar-links">
                                <FontAwesomeIcon icon={faUser} className="icon-spacing" />
                                <span className="login-text" onClick={() => setIsLoginFormVisible(!isLoginFormVisible)}>
                                    | Login
                                </span>
                                {isLoginFormVisible && (
                                    <div className="login-dropdown" onClick={handleDropdownClick}>
                                        <form onSubmit={handleSubmit}>
                                            <label htmlFor="username">Username:</label>
                                            <input type="text" id="username" name="username" required value={username} onChange={e => setUsername(e.target.value)} />
                                            <label htmlFor="password">Password:</label>
                                            <input type="password" id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} />
                                            <button type="submit">Login</button>
                                        </form>
                                        <Link to="/register" className="register">Register</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                    <li className="navbar-item">
                        <Link to="/cart" className="navbar-links">
                            <FontAwesomeIcon icon={faShoppingCart} className="icon-spacing" /> | Cart
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/changePass" className="navbar-links">
                            <FontAwesomeIcon icon={faCog} className="icon-spacing" />
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;