"use client";
import { useState, useEffect } from "react";
import "../../styles/globals.css";

export default function Dashboard() {
  const [solde, setSolde] = useState(0);
  
  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const response = await fetch("/api/balance", {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch balance")
        }
  
        const data = await response.json()
        console.log("Fetched balance:", data)
        setSolde(data.solde)
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    };
  
    fetchSolde(); 
  }, [])
  
  return (
    <div className="container">
      <h1>Tableau de Bord</h1>
      <p>Votre solde : {solde} €</p>
    </div>
  );
}