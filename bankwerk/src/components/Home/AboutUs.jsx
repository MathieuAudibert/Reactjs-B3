import React from "react"

export default function AboutUs({ icon, title, text }) {
  return (
    <div className="service-us">
      <h2>{icon}</h2>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  )
}