import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom' // <-- MUST IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- MUST WRAP APP */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)