const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Usa JSON parsing per il body delle richieste
app.use(express.json());

// Percorso per caricare i messaggi
app.get('/api/messages', (req, res) => {
  fs.readFile('backend/messages.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Errore nel caricamento dei messaggi');
    }
    const messages = JSON.parse(data);
    res.json(messages);
  });
});

// Percorso per aggiungere un nuovo messaggio
app.post('/api/messages', (req, res) => {
  const newMessage = req.body;  // Ottieni il messaggio dalla richiesta
  
  fs.readFile('backend/messages.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Errore nel sal
