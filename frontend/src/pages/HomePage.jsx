import { Link } from 'react-router-dom';
import '../styles/home.css';

function HomePage() {
    return (
        <main className="home-page">
            <section className="home-hero">
                <div className="home-hero__text">
                    <h1 className="home-title">
                        Sudoku
                        <span className="home-badge">Project 3</span>
                    </h1>

                    <p className="home-subtitle">
                        A Sudoku game with React and RESTful for Project 3. Having two game modes with easy 6*6 size and normal 9*9 size.
                    </p>

                    <div className="home-actions">
                        <Link className="home-btn home-btn--primary" to="/games">
                            Start
                        </Link>
                        <Link className="home-btn home-btn--secondary" to="/rules">
                            Read Rules
                        </Link>
                    </div>

                    <div className="home-stats">
                        <div className="home-stat">
                            <span className="home-stat__num">2</span>
                            <span className="home-stat__label">Modes</span>
                        </div>
                    </div>
                </div>

                <div className="home-hero__media">
                    <div className="home-preview">
                        <div className="home-preview__header">Sudoku Preview (no diagonal in real game)</div>
                        <div className="home-preview__board">
                            <div className="preview-cell preview-cell--fixed">5</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell">3</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell preview-cell--fixed">1</div>
                            <div className="preview-cell"></div>

                            <div className="preview-cell"></div>
                            <div className="preview-cell preview-cell--fixed">2</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell">6</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell">4</div>

                            <div className="preview-cell">1</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell preview-cell--fixed">6</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell">5</div>
                            <div className="preview-cell"></div>

                            <div className="preview-cell"></div>
                            <div className="preview-cell">4</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell preview-cell--fixed">2</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell">1</div>

                            <div className="preview-cell preview-cell--fixed">3</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell">2</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell preview-cell--fixed">4</div>
                            <div className="preview-cell"></div>

                            <div className="preview-cell"></div>
                            <div className="preview-cell">1</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell">5</div>
                            <div className="preview-cell"></div>
                            <div className="preview-cell preview-cell--fixed">6</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-cards">
                <div className="home-card">
                    <h2>Choose a Mode</h2>
                    <p>Start with Easy for a 6×6 board or Normal for a 9×9 challenge.</p>
                    <Link className="home-card__link" to="/games">Go to Games --</Link>
                </div>

                <div className="home-card">
                    <h2>Track Scores</h2>
                    <p>Use the scores page to preview score and overall progress.</p>
                    <Link className="home-card__link" to="/scores">View Scores --</Link>
                </div>

                <div className="home-card">
                    <h2>Learn the Rules</h2>
                    <p>Review game rules and credits in this page.</p>
                    <Link className="home-card__link" to="/rules">Open Rules --</Link>
                </div>
            </section>
        </main>
    );
}

export default HomePage;