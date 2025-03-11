// import { initializeApp } from "firebase/app"

const admin = require('firebase-admin')
require('dotenv').config()

const firebaseAccount = require('../config/config.json')

if (!admin.apps.length) {
admin.initializeApp({
  credential: admin.credential.cert(firebaseAccount)
})
}


// const firebaseConfig = {
//   apiKey: process.env.APIKEY,
//   authDomain: process.env.AUTHDOMAIN,
//   databaseURL: process.env.DATABASEURL,
//   projectId: process.env.PROJECTID,
//   storageBucket: process.env.STORAGEBUCKET,
//   messagingSenderId: process.env.MESSAGINGSENDERID,
//   appId: process.env.APPID
// };

const auth = admin.auth()
const db = admin.firestore()
module.exports = {auth, db}
