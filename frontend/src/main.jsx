import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SudokuProvider } from './context/SudokuContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <SudokuProvider>
                <App />
            </SudokuProvider>
        </AuthProvider>
    </React.StrictMode>,
);