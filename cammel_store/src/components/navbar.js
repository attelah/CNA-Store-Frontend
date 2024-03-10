import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/navbar.css';
import { useAuth } from './CheckAuth';
import { useSearch } from './SearchContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout, login } = useAuth();
    const { setSearchTerm } = useSearch();
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                    throw new Error('Login failed. Please check your username and password.');
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
                    Camel Store
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
                                            <input type="text" id="username" name="username" required onChange={e => setUsername(e.target.value)} />
                                            <label htmlFor="password">Password:</label>
                                            <input type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />
                                            <button type="submit">Login</button>
                                        </form>
                                    </div>
                                )}
                                 <Link to="/register" className="navbar-links">| Register</Link>
                            </div>
                        )}
                    </li>
                    <li className="navbar-item">
                        <Link to="/cart" className="navbar-links">
                            <FontAwesomeIcon icon={faShoppingCart} className="icon-spacing" /> | Cart
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;