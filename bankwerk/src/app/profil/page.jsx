"use client";
import { useState, useEffect } from "react";
import "../../styles/globals.css";
import { useRouter } from 'next/navigation';

export default function Profil() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    rib: '',
    date_crea: ''
  });
  const router = useRouter();
//fff
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = localStorage.getItem('user');

        if (!userString) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const uid = user;

        if (!uid) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/user?uid=${uid}`);
        if (!response.ok) throw new Error("Erreur de récupération des données");

        const data = await response.json();
        setUserData({
          nom: data.nom,
          prenom: data.prenom,
          rib: data.rib,
          date_crea: new Date(data.date_crea).toLocaleDateString()
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("❌ Erreur dans fetchUserData:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Chargement...</div>;

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Profil</h1>
        <p>Vous devez être connecté pour voir votre profil.</p>
      </div>
    );
  }

  return (
    <div className="profil-container">
      <h1>Profil Utilisateur</h1>
      <div className="user-info">
        <p><strong>Nom:</strong> {userData.nom}</p>
        <p><strong>Prénom:</strong> {userData.prenom}</p>
        <p><strong>RIB:</strong> {userData.rib}</p>
        <p><strong>Date de création:</strong> {userData.date_crea}</p>
      </div>
    </div>
  );
}
