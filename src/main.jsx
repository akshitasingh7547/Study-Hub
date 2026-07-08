import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    {/* Hogwarts Global Atmosphere */}

    <div className="magic-rain"></div>

    <div className="magic-cloud"></div>
    <div className="magic-cloud"></div>

    <div className="candle-glow"></div>

    <div className="magic-sparkle"></div>


    <BrowserRouter>
      <App />
    </BrowserRouter>


  </React.StrictMode>
)
