"use client"

import Link from "next/link";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header(){
  
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(token) {
      setIsConnected(true)
    }
  },[])


  const logout = () => {
    localStorage.removeItem("token")
    setIsConnected(false)
    router.push("/")
  }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link href="/">BANKWERK</Link> 
            </div>
            {
                isConnected ? (
                    <ul>
                        <li><Link href="/profile">Mon Compte</Link></li>
                        <li><button onClick={logout}>Déconnexion</button></li>
                    </ul>
                ) : (
                    <ul>
                        <li><Link href="/dashboard">Dashboard</Link></li>
                        <li><Link href="/login">Connexion</Link></li>
                        <li><Link href="/register">Inscription</Link></li>
                    </ul>
                )
            }
        </nav>
    );
}