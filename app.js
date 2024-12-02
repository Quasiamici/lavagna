const form = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');

// Carica i messaggi all'avvio
async function loadMessages() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Quasiamici/lavagna/main/backend/messages.json');
    const messages = await response.json();
    messagesDiv.innerHTML = ''; // Pulisce i messaggi esistenti
    messages.forEach(msg => {
      const p = document.createElement('p');  // Usa un paragrafo <p> invece di un <div>
      p.classList.add('message');  // Aggiungi la classe message per stilizzare il messaggio
      p.textContent = msg.text;
      messagesDiv.appendChild(p);
    });
  } catch (error) {
    console.error('Errore nel caricamento dei messaggi:', error);
  }
}

// Invia un messaggio
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  if (message) {
    // Non inviare il messaggio se non hai un backend attivo
    messageInput.value = '';  // Svuota il campo di input
    loadMessages();  // Ricarica i messaggi dopo aver inviato uno nuovo
  }
});

// Carica i messaggi iniziali
loadMessages();
