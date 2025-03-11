This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Avec Next plus besoin de App.js ni d'un router
Dans Next.js, chaque dossier dans app/ est une route !

| ⚛️ React Classique | ⚡ Next.js (App Router) |
|--------------------|------------------------|
| `App.js` gère tout | Plus de `App.js` |
| `react-router-dom` pour gérer les pages | Chaque dossier dans `app/` est une page |
| Fichiers `.jsx` dans `src/pages/` | Fichiers `page.jsx` dans `app/` |


📌 Structure recommandée pour Next.js ( FRONT-END )

📂 src/

    📂 app/ (Dossier principal du projet, contenant les routes & pages)
    
        📂 api/ ( Dossier des routes API, login, register, etc.... )
        
        📂 dashboard/
        
          📄 page.jsx (Affiché à `/dashboard` )
          
        📄 page.jsx (Page d'accueil ou HomePage du projet)
        
        📄 layout.js ( Layout sert à eviter de repeter du code et avoir des elements fixes sur la page comme le composant <Footer/> ou <Header/> ) 
        
    📂 components/ (Dossier pour les composants réutilisables comme Header.jsx)
    
        📄 Header.jsx
        
        📄 LoginForm.jsx (Composant du formulaire de connexion)
        
        📄 RegisterForm.jsx (Composant du formulaire d'inscription)
        
    📂 config/ 
    
    📂 styles/ (Pour organiser le CSS)
    

📌 Où mettre tes fichiers JSX ?

Les pages 📄 → Dans app/

    app/page.jsx → Page d'accueil (HomePage).
    
    app/dashboard/page.jsx → Page du dashboard après connexion

Les composants réutilisables ⚛️ → Dans components/

    Header.jsx, Footer.jsx, Button.jsx, etc.
    
    LoginForm.jsx et RegisterForm.jsx pour les formulaires.

Les API (backend) 🔗 → Dans app/api/

    app/api/login/route.js → Route pour la connexion.
    
    app/api/register/route.js → Route pour l'inscription.

Les styles 🎨 → Dans styles/ ou directement dans des fichiers .module.css

    Exemple : styles/globals.css
    
    Exemple : styles/login.module.css
