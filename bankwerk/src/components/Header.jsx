"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../app/styles/globals.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser); 
    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">BANKWERK</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li>Bonjour, {user.nom}</li>
            <li><button id="deco" onClick={handleLogout}>Déconnexion</button></li>
          </>
        ) : (
          <>
            <li><Link href="/register">Inscription</Link></li>
            <li><Link href="/login">Connexion</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
