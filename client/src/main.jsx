import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/polish.css'
import App from './App.jsx'

// Restore SPA route if redirected from static 404 fallback
const spaRedirect = sessionStorage.getItem('spa_redirect')
if (spaRedirect) {
  sessionStorage.removeItem('spa_redirect')
  if (spaRedirect !== window.location.pathname) {
    window.history.replaceState(null, null, spaRedirect)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
