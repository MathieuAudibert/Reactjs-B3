"use client";

import Link from "next/link";
import "../styles/globals.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsConnected(!!localStorage.getItem("token"));
        };
        window.addEventListener("storage", handleStorageChange);
        handleStorageChange();
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsConnected(false);
        router.push("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link href="/">BANKWERK</Link>
            </div>
            {isConnected ? (
                <ul>
                    <li>
                        <Link href="/dashboard">Mon Portefeuille</Link>
                    </li>
                    <li>
                        <Link href="/transactions">Virements</Link>
                    </li>
                    <li>
                        <Link href="/cryptos">Cryptomonnaies</Link>
                    </li>
                    <li>
                        <Link href="/buy">Acheter/Vendre</Link>
                    </li>
                    <li>
                        <button onClick={logout} className="btn-blueDark">Déconnexion</button>
                    </li>
                </ul>
            ) : (
                <React.Fragment>
                    <div className="navbar-links">
                        <ul>
                            <li>
                                <Link href="/services">Nos Services</Link>
                            </li>
                            <li>
                                <Link href="/cryptos">Cryptomonnaies</Link>
                            </li>
                            <li>
                                <Link href="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="navbar-auth">
                        <ul>
                            <li>
                                <Link href="/login" className="btn-blueDark">Mon compte</Link>
                            </li>
                        </ul>
                    </div>
                </React.Fragment>
            )}
        </nav>
    );
}
