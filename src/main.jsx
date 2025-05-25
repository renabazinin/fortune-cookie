import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import CV from './CV.jsx'
import './index.css'

// Component to handle external redirect
const ExternalRedirect = ({ to }) => {
  React.useEffect(() => {
    window.location.href = to;
  }, [to]);
  
  return <p>Redirecting to wheel...</p>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        {/* Main app route */}
        <Route path="/" element={<App />} />
        
        {/* Redirect to external site */}
        <Route 
          path="#/toWheel" 
          element={<ExternalRedirect to="https://renabazinin.github.io/wheel/" />} 
        />
        
        {/*<Route 
          path="/toBazProject" 
          element={<ExternalRedirect to="https://renabazinin.github.io/fortune-cookie/" />} 
        />*/}
        <Route 
          path="#/toBazProject" 
          element={<ExternalRedirect to="https://renabazinin.github.io/fortune-cookie/#/CV" />} 
        />
        <Route 
          path="#/toRenanCV" 
          element={<ExternalRedirect to="https://renabazinin.github.io/fortune-cookie/#/CV" />} 
        />

        <Route path="/CV" element={<CV />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)