import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UpdateNotificationProvider } from './context/UpdateNotificationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UpdateNotificationProvider>
      <App />
    </UpdateNotificationProvider>
  </StrictMode>
);
