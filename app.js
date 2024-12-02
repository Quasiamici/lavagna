const form = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Usa il tuo GitHub repository URL e token
const GITHUB_API_URL = 'https://api.github.com/repos/Quasiamici/lavagna/actions/workflows/update-message.yml/dispatches';

async function loadMessages() {
  try {
    const response = await fetch('https://api.github.com/repos/Quasiamici/lavagna/contents/messages.json');
    const data = await response.json();
    const content = atob(data.content);
    const messages = JSON.parse(content);

    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
      const p = document.createElement('p');
      p.textContent = msg.text;
      messagesDiv.appendChild(p);
    });
  } catch (error) {
    console.error('Errore durante la richiesta API:', error);
  }
}

// Invio del messaggio tramite GitHub Action
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (message) {
    const newMessage = { text: message };

    // Chiamata al workflow GitHub Action per aggiornare il file JSON
    try {
      const response = await fetch(GITHUB_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `token YOUR_GITHUB_TOKEN`,  // Usa un token sicuro
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',  // La branch a cui inviare la modifica
          inputs: { message: newMessage }
        }),
      });

      if (response.ok) {
        loadMessages();
        messageInput.value = '';
      } else {
        console.error('Errore nell\'invio del messaggio:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
    }
  }
});

// Carica i messaggi all'avvio
loadMessages();
