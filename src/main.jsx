import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import './styles/index.css';

ReactGA.initialize('G-FL3KEFSZ75');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

