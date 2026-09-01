import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { addCollection } from '@iconify/react';
import offlineIcons from '@/lib/offlineIcons.json';
import './index.css';
import App from './App';

// Register offline icons so no network requests are made to api.iconify.design
try {
  if (offlineIcons.mdi) addCollection(offlineIcons.mdi as any);
  if (offlineIcons.logos) addCollection(offlineIcons.logos as any);
} catch {
  // Graceful fallback
}

// Clean up any stale/orphaned service workers on localhost to prevent 404 console errors
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.hostname === 'localhost') {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().catch(() => {});
    }
  }).catch(() => {});
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found in index.html');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
