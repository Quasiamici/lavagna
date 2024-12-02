const form = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// URL per il webhook che attiva GitHub Actions
const GITHUB_ACTION_URL = 'https://api.github.com/repos/Quasiamici/lavagna/dispatches'; // Cambia con il tuo repository

// Carica i messaggi dal file messages.json su GitHub
async function loadMessages() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Quasiamici/lavagna/main/messages.json');
    if (!response.ok) {
      console.error('Errore nel caricamento dei messaggi:', response.status);
      return;
    }

    const messages = await response.json();
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

// Invia un messaggio al file messages.json tramite GitHub Actions
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (message) {
    try {
      // Invio dei dati a GitHub Actions tramite il webhook
      const response = await fetch(GITHUB_ACTION_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`, // Usa il tuo token segreto
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'add_message',
          client_payload: { message: message },
        }),
      });

      if (!response.ok) {
        console.error('Errore nell\'invio del messaggio:', response.status, await response.text());
        return;
      }

      messageInput.value = '';  // Svuota il campo di input
      loadMessages();  // Ricarica i messaggi
    } catch (error) {
      console.error('Errore nel salvataggio del messaggio:', error);
    }
  }
});

// Carica i messaggi all'avvio
loadMessages();
