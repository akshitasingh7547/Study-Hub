import React from 'react'

export default function Atmosphere() {
  return (
    <>
      <div className="magic-moon" />

      <div className="magic-fog" />

      <div className="candle-glow" />

      <img
        src="/cloud.png"
        className="magic-cloud"
        alt=""
      />

      <img
        src="/cloud.png"
        className="magic-cloud"
        alt=""
      />

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
    </>
  )
}
