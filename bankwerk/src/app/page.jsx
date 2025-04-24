'use client'
import { services, aboutUs} from "../utils/utils.jsx"
import React, { useState, useEffect } from "react"
import ServiceCard from "@/components/Home/ServiceCard.jsx"
import TopHeader from "@/components/Home/TopHeader.jsx"
import AboutUs from "@/components/Home/AboutUs.jsx"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsConnected(!!token)
  }, [])

  return (
    <main>
      <TopHeader isConnected={isConnected} />

      <div className="home">
        <h1>Nos services</h1>
        <div className="container-services">
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} />
          ))}
        </div>
      </div>

      <div className="home">
        <h1>Qui sommes-nous ?</h1>
        {aboutUs.map((a, i) => (
          <AboutUs key={i} {...a} />
        ))}
      </div>
    </main>
  )
}
