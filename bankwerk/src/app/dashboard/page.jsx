"use client";
import { useState, useEffect } from "react";
import "../../styles/globals.css";

export default function Dashboard() {
  const [solde, setSolde] = useState(0);
  
  useEffect(() => {
    setSolde(1000);
  }, []);
  
  return (
    <div className="container">
      <h1>Tableau de Bord</h1>
      <p>Votre solde : {solde} €</p>
    </div>
  );
}