"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserCircle, List, X } from "@phosphor-icons/react"
import "../styles/globals.css"

export default function Header() {
    const router = useRouter()
    const [isConnected, setIsConnected] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleStorageChange = () => {
            setIsConnected(!!localStorage.getItem("token"))
        }
        window.addEventListener("storage", handleStorageChange)
        handleStorageChange()
        return () => {
            window.removeEventListener("storage", handleStorageChange)
        }
    }, [])

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setIsConnected(false)
        router.push("/")
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link href="/">BANKWERK</Link>
                {isConnected && (
                    <button
                        onClick={() => {
                            router.push("/profile")
                            setMenuOpen(false)
                        }}
                        className="header-profile-icon mobile-only"
                    >
                        <UserCircle size={28} weight="fill" />
                    </button>
                )}
            </div>

            <div className="burger-menu" onClick={toggleMenu}>
                {menuOpen ? (
                    <X size={28} weight="bold" />
                ) : (
                    <List size={28} weight="bold" />
                )}
            </div>

            <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                {isConnected ? (
                    <ul>
                        <li>
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Mon Portefeuille</Link>
                        </li>
                        <li>
                            <Link href="/transactions" onClick={() => setMenuOpen(false)}>Virements</Link>
                        </li>
                        <li>
                            <Link href="/cryptos" onClick={() => setMenuOpen(false)}>Cryptomonnaies</Link>
                        </li>
                        <li className="desktop-only">
                            <button
                              onClick={() => {
                                  router.push("/profile")
                                  setMenuOpen(false)
                              }}
                              className="header-profile-icon"
                            >
                              <UserCircle size={28} weight="fill" />
                            </button>
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
                                    <Link href="/services" onClick={() => setMenuOpen(false)}>Nos Services</Link>
                                </li>
                                <li>
                                    <Link href="/cryptos" onClick={() => setMenuOpen(false)}>Cryptomonnaies</Link>
                                </li>
                                <li>
                                    <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="navbar-auth">
                            <ul>
                                <li>
                                    <Link href="/login" className="btn-blueDark" onClick={() => setMenuOpen(false)}>Mon compte</Link>
                                </li>
                            </ul>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </nav>
    )
}
