import Link from "next/link";
import "../styles/globals.css";

export default function Header(){
    return (
<nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">BANKWERK</Link> {/* ✅ Cliquable vers la home */}
      </div>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li> {/* ✅ Ajout du Dashboard */}
        <li><Link href="/login">Connexion</Link></li>
        <li><Link href="/register">Inscription</Link></li>
      </ul>
    </nav>
      );
    }