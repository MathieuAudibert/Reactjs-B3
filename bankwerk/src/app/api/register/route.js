const { auth, db } = require('../../../config/firebaseAdmin');
const bcrypt = require('bcrypt');

function genereRIB() {
    const prefix = "BWK92-"
    const chiffres = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    return prefix + chiffres
}

export async function POST(req) {
    try {
        const { nom, prenom, mdp, email } = await req.json();
        const createdDate = new Date();

        if (!nom) {
            return new Response(JSON.stringify({ error: 'Veuillez remplir le champ nom.' }), { status: 400 });
        }

        if (!prenom) {
            return new Response(JSON.stringify({ error: 'Veuillez remplir le champ prénom.' }), { status: 400 });
        }

        if (!email) {
            return new Response(JSON.stringify({ error: 'Veuillez remplir le champ email.' }), { status: 400 });
        }

        if (!mdp) {
            return new Response(JSON.stringify({ error: 'Veuillez remplir le champ mot de passe.' }), { status: 400 });
        }

        if (mdp.length < 6) {
            return new Response(JSON.stringify({ error: 'Le mot de passe doit contenir au moins 6 caractères.' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(mdp, 10);
        const user = await auth.createUser({ email, password: mdp });
        const rib = genereRIB();

        await db.collection('Users').doc(user.uid).set({
            nom,
            prenom,
            email,
            mdp: hashedPassword,
            date_crea_cpt: '',
            solde: 0,
            compte_id: user.uid,
            date_crea: createdDate
        });

        const userRef = db.collection('Users').doc(user.uid);
        const userDoc = await userRef.get();
        const userSolde = userDoc.data().solde;

        await db.collection('Compte').doc(user.uid).set({
            solde: userSolde,
            date_crea: createdDate,
            rib: rib
        });

        const date_creaAccountDoc = await db.collection('Compte').doc(user.uid).get();
        const date_creaAccountData = date_creaAccountDoc.data().date_crea;

        await db.collection('Users').doc(user.uid).update({
            date_crea_cpt: date_creaAccountData
        });

        const token = await auth.createCustomToken(user.uid);

        return new Response(JSON.stringify({ uid: user.uid, email: user.email, token }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}
