const { auth, db } = require('../../../config/firebase')
const bcrypt  = require('bcrypt')

export async function POST(req) {
    const { nom, prenom, mdp, email, solde, compte_id, date_crea_cpt } = await req.json() // change with body
    const createdDate = new Date()
    try {
        
        const hashedPassword = await bcrypt.hash(mdp, 10)
        const user = await auth.createUser({
            email,
            password: mdp,
        })
        db.collection('Users').doc(user.uid).set({
            nom,
            prenom,
            email,
            mdp : hashedPassword,
            date_crea_cpt: createdDate, // default
            solde : 0, // default
            compte_id : 'test_compte_id', // default
            date_crea: createdDate // default
        })
        
        return Response.json({ uid: user.uid, email: user.email });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}
