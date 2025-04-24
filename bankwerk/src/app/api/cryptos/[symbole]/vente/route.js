import { handleCryptoTransaction } from "@/utils/handleCryptoTransac"

export async function POST(request, { params }) {
  try {
    const { montant, quantite, rib, uid } = await request.json()
    const data = await handleCryptoTransaction({
      mode: "vente",
      symbole: params.symbole,
      montant,
      quantite,
      rib,
      uid
    })
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}
