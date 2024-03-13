import React, { useState } from 'react';
import '../styles/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [validationError, setValidationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (username.length < 4) {
      setValidationError('Username must be at least 4 characters long.');
      return;
    }
  
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }
  
    // Clear any previous validation errors
    setValidationError('');
  
    fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }
      return response.json();
    })
    .then(data => {
      // Handle successful registration
      setRegistrationSuccess(true);
    })
    .catch(error => {
      console.error('Registration error:', error);
      setValidationError('Registration failed. Please try again. (Username already taken?)');
    });
  };

  return (
    <div className="register-container">
      {!registrationSuccess && (
        <form className="register-form" id="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="username" className="register-label">Username: </label>
          <input
            type="username"
            id="username"
            name="username"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="register-input"
          />
          <br></br><label htmlFor="email" className="register-label">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="register-input"
          />
          <br></br><label htmlFor="password" className="register-label">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="register-input"
          />
          <br></br><label htmlFor="address" className="register-label">Address (Optional): </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="register-input"
          />
          {validationError && <div className="register-error">{validationError}</div>}
          <br></br><button type="submit" className="register-button">Register</button>
        </form>
      )}
        {registrationSuccess && (
          <div className="registration-success">
            You have successfully registered! You can now login.
          </div>
        )}
    </div>
  );
}

export default Register;