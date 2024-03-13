import React, { useState } from 'react';
import '../styles/changePass.css';

function ChangePassword() {
    const [password, setpassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [changeSuccess, setChangeSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setValidationError('New password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmNewPassword) {
            setValidationError('New password and confirm password do not match.');
            return;
        }

        // Clear any previous validation errors
        setValidationError('')

        const token = localStorage.getItem('jwt');
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const parsedToken = JSON.parse(window.atob(base64));
        console.log(parsedToken.id)

        // Make an API call to validate the old password and change the password
        fetch(`${process.env.REACT_APP_API_URL}/user/${parsedToken.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                password
            })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Failed to change password.');
                }
            }
            return response.json();
        })
        .then(() => {
            // Handle successful password change
            setChangeSuccess(true);
        })
        .catch(error => {
            console.error('Change password error:', error);
            setValidationError(error.message);
        });
    };

    return (
        <div className="change-password-container">
            {!changeSuccess && (
                <form className="change-password-form" onSubmit={handleSubmit}>
                    <label htmlFor="password" className="change-password-label">New Password: </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={e => setpassword(e.target.value)}
                        className="change-password-input"
                    />
                    <br />
                    <label htmlFor="confirmNewPassword" className="change-password-label">Confirm New Password: </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        required
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        className="change-password-input"
                    />
                    {validationError && <div className="change-password-error">{validationError}</div>}
                    <br />
                    <button type="submit" className="change-password-button">Change Password</button>
                </form>
            )}
            {changeSuccess && (
                <div className="change-password-success">
                    Your password has been successfully changed!
                </div>
            )}
        </div>
    );
}

export default ChangePassword;
