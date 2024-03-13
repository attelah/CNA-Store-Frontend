import React, { useState } from 'react';
import '../styles/changePass.css';

const token = process.env.REACT_APP_API_TOKEN;

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [changeSuccess, setChangeSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            setValidationError('New password must be at least 8 characters long.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setValidationError('New password and confirm password do not match.');
            return;
        }

        // Clear any previous validation errors
        setValidationError('');

        // Make an API call to validate the old password and change the password
        fetch(`${process.env.REACT_APP_API_URL}/changePass`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Old password does not match.');
                } else {
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
                    <label htmlFor="currentPassword" className="change-password-label">Current Password: </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        required
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="change-password-input"
                    />
                    <br />
                    <label htmlFor="newPassword" className="change-password-label">New Password: </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
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
