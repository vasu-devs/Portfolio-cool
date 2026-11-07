import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Mounted at / locally and at /new/ on the live site (vite build --base). */}
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
