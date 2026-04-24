import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const { isLoggedIn, username, logout, authLoading } = useAuth();

    async function handleLogout() {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    if (authLoading) {
        return (
            <nav className="nav">
                <div className="nav__inner">
                    <NavLink to="/" className="nav__brand">
                        Sudoku
                    </NavLink>
                </div>
            </nav>
        );
    }

    return (
        <nav className="nav">
            <div className="nav__inner">
                <NavLink to="/" className="nav__brand">
                    Sudoku
                </NavLink>

                <div className="nav__links">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? 'nav__link nav__link--active' : 'nav__link'
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/games"
                        className={({ isActive }) =>
                            isActive ? 'nav__link nav__link--active' : 'nav__link'
                        }
                    >
                        Games
                    </NavLink>

                    <NavLink
                        to="/scores"
                        className={({ isActive }) =>
                            isActive ? 'nav__link nav__link--active' : 'nav__link'
                        }
                    >
                        Scores
                    </NavLink>

                    <NavLink
                        to="/rules"
                        className={({ isActive }) =>
                            isActive ? 'nav__link nav__link--active' : 'nav__link'
                        }
                    >
                        Rules
                    </NavLink>

                    {!isLoggedIn ? (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav__link nav__auth nav__auth--login nav__link--active"
                                        : "nav__link nav__auth nav__auth--login"
                                }
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav__link nav__auth nav__auth--register nav__link--active"
                                        : "nav__link nav__auth nav__auth--register"
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <span className="nav__link nav__user">{username}</span>
                            <button className="nav__link nav__logout" type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;