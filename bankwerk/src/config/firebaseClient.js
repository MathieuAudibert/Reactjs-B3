const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")
require('dotenv').config()


const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

module.exports = {
  auth,
  getToken
}