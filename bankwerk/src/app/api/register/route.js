const { auth, db } = require('../../../config/firebaseAdmin')
const bcrypt  = require('bcrypt')

export async function POST(req) {
    const { nom, prenom, mdp, email } = await req.json() // change with body
    const createdDate = new Date()
    try {
        
        if (!nom || !prenom || !mdp || !email) {
            console.log('please fill all fields')
            return Response.json({ error: 'Veuillez remplir tous les champs.' }, { status: 400 })
        }
        
        if (mdp.length < 6) {
            console.log('password must be at least 6 characters.')
            return Response.json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' }, { status: 400 })
        }
        
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
            date_crea_cpt: '',
            solde : 0, // UPDATE 
            compte_id : user.uid, 
            date_crea: createdDate 
        })
        
        const userRef = db.collection('Users').doc(user.uid)
        const userDoc = await userRef.get()
        const userSolde = userDoc.data().solde

        
        db.collection('Compte').doc(user.uid).set({
            solde : userSolde,
            date_crea: createdDate
        })
        
        const date_creaAccount = db.collection('Compte').doc(user.uid)
        const date_creaAccountDoc = await date_creaAccount.get()
        const date_creaAccountData = date_creaAccountDoc.data().date_crea

        db.collection('Users').doc(user.uid).update({
            date_crea_cpt: date_creaAccountData
        })
        
        const token = await auth.createCustomToken(user.uid)

        return Response.json({ uid: user.uid, email: user.email, token })

    } catch (error) {

        if (error.message.includes("FirebaseError") || error.message.includes("Firestore")) {
            console.log("delete user from firebase auth")
            try {
                const user = await auth.getUserByEmail(email)
                await auth.deleteUser(user.uid)

                await db.collection('Users').doc(user.uid).delete();

                console.log("user deleted")
            } catch (deleteError) {
                console.error(deleteError.message)
            }
        }
        return Response.json({ error: error.message }, { status: 400 })
    }
}
