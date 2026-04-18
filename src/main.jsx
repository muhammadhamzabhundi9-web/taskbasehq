import React from 'react'
import ReactDOM from 'react-dom/client'

// ╔══════════════════════════════════════════════╗
// ║  SWITCH MODES:                                ║
// ║  ComingSoon = Coming Soon page (LIVE)         ║
// ║  Dashboard  = AI Tools Dashboard (TESTING)    ║
// ║  App        = Full Marketing Website          ║
// ╚══════════════════════════════════════════════╝

import App from './ComingSoon.jsx'         // LIVE - Coming Soon
// import App from './Dashboard.jsx'       // TESTING - AI Dashboard
// import App from './App.jsx'             // LATER - Full Website

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
