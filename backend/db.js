// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // ton utilisateur MySQL
  password: '',       // ton mot de passe MySQL
  database: 'reactdb' // nom de ta base
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connecté à MySQL');
});

module.exports = db;
