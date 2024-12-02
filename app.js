const form = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Backend URL
const BACKEND_URL = 'http://localhost:3000/api/messages';

// Carica i messaggi
async function loadMessages() {
  try {
    const response = await fetch(BACKEND_URL);
    const messages = await response.json();
    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
      const p = document.createElement('p');
      p.textContent = msg.text;
      messagesDiv.appendChild(p);
    });
  } catch (error) {
    console.error('Errore nel caricamento dei messaggi:', error);
  }
}

// Invia un nuovo messaggio
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    try {
      await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      messageInput.value = '';
      loadMessages();
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
    }
  }
});

// Carica i messaggi all'avvio
loadMessages();
