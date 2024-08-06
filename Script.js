const userName = localStorage.getItem("userName");
if (userName === "") {
  // Redirigir a la página de chat (aquí pones la URL de tu página de chat)
  window.location.href = "Index.html";
}
const ws = new WebSocket("wss://backend-websocket-production-3135.up.railway.app");
// const ws = new WebSocket("ws://localhost:3000");
ws.onmessage = (event) => {
  const reader = new FileReader();
  reader.onload = function () {
    CrearMensaje(reader.result);
  };
  reader.readAsText(event.data);
};

const panelMensajes = document.getElementById("messages-panel");
const botonEnviar = document.getElementById("send-button");
const input = document.getElementById("message-input");

botonEnviar.addEventListener("click", sendMessage);
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.ctrlKey) {
    e.preventDefault();
    sendMessage();
  } else if (e.key === "Enter" && e.ctrlKey) {
    this.value += "\n";
  }
});

function sendMessage() {
  const message = input.value.trim();
  if (message) {
    ws.send(`${userName}[Super-Separador]${message}`);
    input.value = "";
    input.focus();
  }
}

// Adjust the height of the textarea automatically
const textarea = document.getElementById("message-input");
textarea.addEventListener("input", adjustTextareaHeight);

function adjustTextareaHeight() {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function CrearMensaje(mensajeCrudo) {
  const messageElement = document.createElement("div");

  let [remitente, mensaje] = ObtenerMensaje(mensajeCrudo);
  if (remitente && mensaje) {
    if (remitente === userName) {
      messageElement.classList.add("message", "you");
      remitente = "You";
    } else {
      messageElement.classList.add("message", "other");
    }
    messageElement.innerHTML = `<div class="sender">${remitente}</div>${mensaje}`;
    panelMensajes.appendChild(messageElement);
    panelMensajes.scrollTop = panelMensajes.scrollHeight;
  }
}

function ObtenerMensaje(mensajeCrudo) {
  let [remitente, mensaje] = mensajeCrudo.split("[Super-Separador]");
  return [remitente, mensaje];
}
