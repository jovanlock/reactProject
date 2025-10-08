const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// GET all users
app.get('/users', (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if(err) return res.status(500).json(err);
    res.json(data);
  });
});

// POST add user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const q = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(q, [name, email], (err, data) => {
    if(err) return res.status(500).json(err);
    res.json({ id: data.insertId, name, email });
  });
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const q = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(q, [name, email, id], (err) => {
    if(err) return res.status(500).json(err);
    res.json({ id, name, email });
  });
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM users WHERE id = ?";
  db.query(q, [id], (err) => {
    if(err) return res.status(500).json(err);
    res.json({ message: "Utilisateur supprimé" });
  });
});

app.listen(PORT, () => console.log(`🚀 Serveur backend démarré sur le port ${PORT}`));
