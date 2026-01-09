import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { UserTypeProvider } from './context/UserTypeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <CurrencyProvider>
        <UserTypeProvider>
          <App />
        </UserTypeProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </StrictMode>,
)
