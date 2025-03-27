"use client"
import { useState } from "react"
import { useRouter } from "next/navigation" 
import "../../styles/globals.css"

export default function RegisterPage() {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [mdp, setMdp] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "nom") setNom(value)
    if (name === "prenom") setPrenom(value)
    if (name === "email") setEmail(value)
    if (name === "mdp") setMdp(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, mdp }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.")
      return 
    }
    router.push("/login")
  }

  return (
    <div className="container">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Nom" name="nom" onChange={handleChange} required />
        <input type="text" placeholder="Prénom" name="prenom" onChange={handleChange} required />
        <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
        <input type="password" placeholder="Mot de passe" name="mdp" onChange={handleChange} required />
        <p>Mot de passe oublié ?</p>
        <button type="submit">S'inscrire</button>
        <p>Déjà un compte ? Connectez-vous ici.</p>
      </form>
    </div>
  )
}
