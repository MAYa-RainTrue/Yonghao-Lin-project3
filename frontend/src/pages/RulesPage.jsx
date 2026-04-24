import '../styles/rules.css';
import {Fragment} from "react";

function RulesPage() {
    return (
        <main className="rules-page">
            <section className="rules-card">
                <h1 className="rules-title">Rules</h1>
                <p className="rules-subtitle">
                    Follow these basic Sudoku rules while playing in Easy or Normal mode.
                </p>

                <ol className="rules-list">
                    <li>Each row must contain each allowed number exactly once.</li>
                    <li>Each column must contain each allowed number exactly once.</li>
                    <li>Each subgrid must also contain each allowed number exactly once.</li>
                    <li>Only editable cells can be changed during gameplay.</li>
                    <li>Invalid entries will be highlighted to help indicate conflicts.</li>
                    <li>The puzzle is complete only when all cells are filled correctly.</li>
                </ol>
            </section>

            <section className="rules-grid">
                <article className="rules-panel">
                    <h2>Easy Mode</h2>
                    <p>
                        Easy mode uses a 6×6 board with half of the cells initially filled.
                    </p>
                </article>

                <article className="rules-panel">
                    <h2>Normal Mode</h2>
                    <p>
                        Normal mode uses a 9×9 board with 28-30 cells initially filled.
                    </p>
                </article>
            </section>

            <section className="rules-card">
                <h2 className="rules-section-title">Credits</h2>
                <p className="rules-text">
                    This project is a React-based and RESTful Sudoku interface developed for Project 3.
                    Links below are fake links for place holders.
                </p>

                <ul className="rules-links">
                    <li>
                        Email:{' '}
                        <a href="mailto:email_example@example.com">email_example@example.com</a>
                    </li>
                    <li>
                        GitHub:{' '}
                        <a
                            href="https://github.com/githubexample"
                            target="_blank"
                            rel="noreferrer"
                        >
                            github.com/githubexample
                        </a>
                    </li>
                    <li>
                        LinkedIn:{' '}
                        <a
                            href="https://www.linkedin.com/in/example"
                            target="_blank"
                            rel="noreferrer"
                        >
                            linkedin.com/in/example
                        </a>
                    </li>
                </ul>
            </section>
        </main>
    );
}

export default RulesPage;