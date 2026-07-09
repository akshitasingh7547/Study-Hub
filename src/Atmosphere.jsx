import React from 'react'
import cloud from './pages/data/public/41e6100f6d397633827752a4a870a2a3.jpg'

export default function Atmosphere() {
  return (
    <>
      {/* Moon */}
      <div className="magic-moon" />

      {/* Fog */}
      <div className="magic-fog" />

      {/* Candle */}
      <div className="candle-glow" />

      {/* Clouds */}
      <img src={cloud} className="magic-cloud cloud1" alt="" />
      <img src={cloud} className="magic-cloud cloud2" alt="" />
      <img src={cloud} className="magic-cloud cloud3" alt="" />

      {/* Stars */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="magic-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Sparkles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="magic-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
    </>
  )
}
