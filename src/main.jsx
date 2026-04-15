import React from 'react'
import ReactDOM from 'react-dom/client'

// ╔══════════════════════════════════════════════╗
// ║  DRAFT MODE: Showing "Coming Soon" page      ║
// ║  When ready to launch, change the line below: ║
// ║  FROM: import App from './ComingSoon.jsx'     ║
// ║  TO:   import App from './App.jsx'            ║
// ╚══════════════════════════════════════════════╝

import App from './ComingSoon.jsx'
// import App from './App.jsx'      // ← UNCOMMENT THIS LINE TO GO LIVE

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
