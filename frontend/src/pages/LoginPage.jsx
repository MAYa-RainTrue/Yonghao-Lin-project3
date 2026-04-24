import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isDisabled = !username.trim() || !password.trim();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        try {
            await login(username.trim(), password);
            navigate('/games');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1 className="auth-title">Login</h1>
                <p className="auth-subtitle">
                    Sign in to create games, track progress, and view your account status.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span className="auth-label">Username</span>
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label className="auth-field">
                        <span className="auth-label">Password</span>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    {error && <p className="auth-error">{error}</p>}

                    <button className="auth-button" type="submit" disabled={isDisabled}>
                        Login
                    </button>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;