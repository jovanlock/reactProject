import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  // Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Erreur de connexion au serveur');
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Ajouter ou modifier
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.email){
      setMessage('Veuillez remplir tous les champs');
      return;
    }
    try {
      if(editingUser){
        await axios.put(`http://localhost:5000/users/${editingUser.id}`, form);
        setMessage('Utilisateur modifié');
        setEditingUser(null);
      } else {
        await axios.post('http://localhost:5000/users', form);
        setMessage('Utilisateur ajouté');
      }
      setForm({ name: '', email: '' });
      fetchUsers();
    } catch(err) {
      console.error(err);
      setMessage('Erreur serveur');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // Supprimer
  const handleDelete = async (id) => {
    if(!window.confirm('Voulez-vous vraiment supprimer ?')) return;
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setMessage('Utilisateur supprimé');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch(err){
      console.error(err);
      setMessage('Erreur serveur');
    }
  };

  // Modifier
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email });
  };

  // Filtrer par recherche
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Gestion des Utilisateurs 👥</h1>
      {message && <p className="message">{message}</p>}

      <input 
        type="text" 
        placeholder="Recherche..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        className="search"
      />

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nom" 
          value={form.name} 
          onChange={e => setForm({ ...form, name: e.target.value })} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={e => setForm({ ...form, email: e.target.value })} 
        />
        <button type="submit">{editingUser ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <ul>
        {filteredUsers.map(u => (
          <li key={u.id}>
            <span>{u.name} ({u.email})</span>
            <div className="actions">
              <button onClick={() => handleEdit(u)}>✏️ Modifier</button>
              <button onClick={() => handleDelete(u.id)}>❌ Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
