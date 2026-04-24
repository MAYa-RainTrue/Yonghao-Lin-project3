import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [error, setError] = useState('');

    const isDisabled = !username.trim() || !password.trim() || !verifyPassword.trim();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        if (password !== verifyPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register(username.trim(), password);
            navigate('/games');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1 className="auth-title">Register</h1>
                <p className="auth-subtitle">
                    Create an account to save your progress and compete on the high score board.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span className="auth-label">Username</span>
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label className="auth-field">
                        <span className="auth-label">Password</span>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <label className="auth-field">
                        <span className="auth-label">Confirm Password</span>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Confirm your password"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                        />
                    </label>

                    {error && <p className="auth-error">{error}</p>}

                    <button className="auth-button" type="submit" disabled={isDisabled}>
                        Create Account
                    </button>
                </form>
            </section>
        </main>
    );
}

export default RegisterPage;