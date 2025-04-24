import React from "react"

export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="service">
      <h2>{icon}</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}