const form = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// URL del repository su GitHub
const GITHUB_API_URL = 'https://api.github.com/repos/Quasiamici/lavagna/contents/messages.json';
const GITHUB_TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN'; // Usa il token generato

// Carica i messaggi dal file messages.json su GitHub
async function loadMessages() {
  try {
    const response = await fetch(GITHUB_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
      }
    });

    if (!response.ok) {
      console.error('Errore nel caricamento dei messaggi:', response.status);
      return;  // Esci dalla funzione se c'è un errore
    }

    const data = await response.json();
    const content = atob(data.content); // Decodifica il contenuto Base64
    const messages = JSON.parse(content);

    messagesDiv.innerHTML = ''; // Pulisce i messaggi esistenti
    messages.forEach(msg => {
      const p = document.createElement('p');
      p.textContent = msg.text;
      messagesDiv.appendChild(p);
    });
  } catch (error) {
    console.error('Errore durante la richiesta API:', error);
  }
}

// Invia un messaggio al file messages.json su GitHub
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (message) {
    try {
      // Carica i messaggi esistenti
      const response = await fetch(GITHUB_API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
        },
      });

      if (!response.ok) {
        console.error('Errore nel caricamento dei messaggi:', response.status);
        return;
      }

      const data = await response.json();
      const content = atob(data.content); // Decodifica il contenuto Base64
      const messages = JSON.parse(content);

      // Aggiungi il nuovo messaggio
      messages.push({ text: message });

      // Salva i nuovi messaggi nel file su GitHub
      const newContent = JSON.stringify(messages, null, 2);
      const encodedContent = btoa(newContent); // Codifica in Base64

      const updateResponse = await fetch(GITHUB_API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Aggiungi un nuovo messaggio',
          content: encodedContent,
          sha: data.sha, // La versione del file precedente per l'operazione di aggiornamento
        }),
      });

      if (updateResponse.ok) {
        messageInput.value = '';  // Svuota il campo di input
        loadMessages();  // Ricarica i messaggi
      } else {
        console.error('Errore nel salvataggio del messaggio:', updateResponse.status);
      }
    } catch (error) {
      console.error('Errore nel salvataggio del messaggio:', error);
    }
  }
});

// Carica i messaggi all'avvio
loadMessages();
