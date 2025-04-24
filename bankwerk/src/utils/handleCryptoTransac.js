import { db } from "@/config/firebaseAdmin"

export async function handleCryptoTransaction({ mode, symbole, montant, quantite, rib, uid }) {
  if (!["achat", "vente"].includes(mode)) {
    throw new Error("Mode invalide")
  }

  if (!symbole || !montant || !quantite || !rib || !uid) {
    throw new Error("Données manquantes")
  }

  const montantNum = parseFloat(montant)
  const quantiteNum = parseFloat(quantite)
  if (isNaN(montantNum) || isNaN(quantiteNum) || montantNum <= 0 || quantiteNum <= 0) {
    throw new Error("Montant ou quantité invalide")
  }

  const compteSnapshot = await db.collection("Compte").where("rib", "==", rib).limit(1).get()
  if (compteSnapshot.empty) throw new Error("Compte non trouvé")

  const compteDoc = compteSnapshot.docs[0]
  const compteData = compteDoc.data()

  if (mode === "achat" && compteData.solde < montantNum) {
    throw new Error("Solde insuffisant")
  }
  if (mode === "vente") {
    const cryptoExist = compteData.cryptos?.find(c => c.symbole === symbole)
    if (!cryptoExist || cryptoExist.quantite < quantiteNum) {
      throw new Error("Pas assez de cryptos")
    }
  }

  const cryptoSnapshot = await db.collection("Crypto").where("symbole", "==", symbole).limit(1).get()
  if (cryptoSnapshot.empty) throw new Error("Crypto non trouvée")

  const cryptoDoc = cryptoSnapshot.docs[0]
  const cryptoData = cryptoDoc.data()
  const prixUnite = parseFloat(cryptoData.prix)

  const prixCalcule = quantiteNum * prixUnite
  if (Math.abs(prixCalcule - montantNum) > 0.01) {
    throw new Error("Le prix a changé, veuillez actualiser la page")
  }

  const batch = db.batch()

  const soldeMaj = mode === "achat"
    ? compteData.solde - montantNum
    : compteData.solde + montantNum

  batch.update(compteDoc.ref, {
    solde: parseFloat(soldeMaj.toFixed(2))
  })

  let cryptosPossedees = compteData.cryptos || []
  const index = cryptosPossedees.findIndex(c => c.symbole === symbole)

  if (index >= 0) {
    cryptosPossedees[index].quantite = parseFloat(
      (mode === "achat"
        ? cryptosPossedees[index].quantite + quantiteNum
        : cryptosPossedees[index].quantite - quantiteNum
      ).toFixed(8)
    )
  } else {
    cryptosPossedees.push({
      symbole,
      quantite: quantiteNum,
      nom: cryptoData.nom
    })
  }

  batch.update(compteDoc.ref, { cryptos: cryptosPossedees })

  const transactionRef = db.collection("Transactions").doc()
  batch.set(transactionRef, {
    rib_cible: mode === "achat" ? "BWK92-00000000" : rib,
    rib_deb: mode === "achat" ? rib : "BWK92-00000000",
    id_compte: compteDoc.id,
    date_transa: new Date(),
    montant: montantNum,
    type: `${mode} de cryptos`,
    details: {
      id_crypto: cryptoDoc.id,
      nombre_crypto: quantiteNum,
      prix_unite_crypto: prixUnite,
      symbole_crypto: symbole
    },
    statut: "completed"
  })

  await batch.commit()

  return {
    message: `${mode === "achat" ? "Achat" : "Vente"} de ${quantiteNum} ${symbole} effectué avec succès`
  }
}
