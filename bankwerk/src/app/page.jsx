import React from "react";
import Navbar from "../components/Header";
import "./styles/globals.css";

export const metadata = {
  title: "BankWerk - Home",
};

export default function Home() {
  return (
    <React.Fragment>
      <main>
        <h1>Bienvenue sur BankWerk</h1>
        <p>Gérez vos finances en toute simplicité.</p>
        <ul>
          <li>Créer un compte</li>
          <li>Consulter votre solde</li>
          <li>Échanger des cryptomonnaies</li>
          <li>Réaliser des virements bancaires</li>
        </ul>
      </main>
    </React.Fragment>
  );
}
