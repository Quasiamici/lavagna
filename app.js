const form = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Sostituisci con il tuo nome utente e repository
const GITHUB_API_URL = 'https://api.github.com/repos/Quasiamici/lavagna/contents/messages.json';

// Funzione per caricare i messaggi da GitHub
async function loadMessages() {
  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) {
      console.error('Errore nel caricamento dei messaggi:', response.status, await response.text());
      return;
    }

    const data = await response.json();
    const content = atob(data.content); // Decodifica in base64
    const messages = JSON.parse(content);

    messagesDiv.innerHTML = ''; // Pulisce i messaggi esistenti
    messages.forEach(msg => {
      const p = document.createElement('p');
      p.textContent = msg.text;
      messagesDiv.appendChild(p);
    });
  } catch (error) {
    console.error('Errore durante il caricamento dei messaggi:', error);
  }
}

// Invia un messaggio al file messages.json su GitHub
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (message) {
    try {
      const response = await fetch(GITHUB_API_URL);
      if (!response.ok) {
        console.error('Errore nel caricamento dei messaggi:', response.status, await response.text());
        return;
      }

      const data = await response.json();
      const content = atob(data.content); // Decodifica in base64
      const messages = JSON.parse(content);

      // Aggiungi il nuovo messaggio
      messages.push({ text: message });

      // Salva il nuovo messaggio nel file su GitHub
      const newContent = JSON.stringify(messages, null, 2);
      const encodedContent = btoa(newContent); // Codifica in base64

      const updateResponse = await fetch(GITHUB_API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Aggiungi un nuovo messaggio',
          content: encodedContent,
          sha: data.sha, // SHA del file per aggiornamento
        }),
      });

      if (updateResponse.ok) {
        messageInput.value = ''; // Svuota il campo di input
        loadMessages(); // Ricarica i messaggi
      } else {
        console.error('Errore nel salvataggio del messaggio:', updateResponse.status, await updateResponse.text());
      }
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error);
    }
  }
});

// Carica i messaggi all'avvio
loadMessages();
