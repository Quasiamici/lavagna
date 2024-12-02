// Carica i messaggi all'avvio
async function loadMessages() {
  try {
    // Usa il link raw per caricare il file JSON
    const response = await fetch('https://raw.githubusercontent.com/Quasiamici/lavagna/main/backend/messages.json');
    
    // Controlla se la risposta è valida
    if (!response.ok) {
      throw new Error(`Errore: ${response.statusText}`);
    }

    // Parsea la risposta come JSON
    const messages = await response.json();

    // Verifica se i messaggi sono correttamente caricati
    console.log("Messaggi caricati:", messages);

    messagesDiv.innerHTML = ''; // Pulisce i messaggi esistenti
    messages.forEach(msg => {
      const p = document.createElement('p');  // Usa un paragrafo <p> per i messaggi
      p.classList.add('message');  // Aggiungi una classe per lo stile
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
    await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
    messageInput.value = '';  // Svuota il campo di input
    loadMessages();  // Ricarica i messaggi dopo aver inviato uno nuovo
  }
});

// Carica i messaggi iniziali
loadMessages();
