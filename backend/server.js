const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // Importa il modulo File System

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './messages.json'; // File per salvare i messaggi

// Funzione per leggere i messaggi dal file
function readMessages() {
  if (!fs.existsSync(FILE_PATH)) {
    return []; // Se il file non esiste, restituisci un array vuoto
  }
  const data = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

// Funzione per scrivere i messaggi nel file
function writeMessages(messages) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(messages, null, 2), 'utf-8');
}

// Carica i messaggi iniziali
let messages = readMessages();

// Endpoint per ottenere i messaggi
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// Endpoint per aggiungere un nuovo messaggio
app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (text) {
    messages.push({ text });
    writeMessages(messages); // Salva i messaggi nel file
    res.status(201).send();
  } else {
    res.status(400).send();
  }
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
