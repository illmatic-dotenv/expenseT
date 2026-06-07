import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CurrencyProvider } from './context/CurrencyContext'
import App from './App.jsx'
import './index.css'

// CurrencyProvider wraps the entire app
// This makes the selected currency available to every component
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </StrictMode>
)