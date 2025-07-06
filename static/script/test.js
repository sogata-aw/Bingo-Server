const socket = io();

// Réception de mises à jour
socket.on('update_response', data => {
    const li = document.createElement("li");
    li.innerText = data.message;
    document.getElementById("updates").appendChild(li);
});

// Envoi de mise à jour
function sendUpdate() {
    const msg = document.getElementById("msg").value;
    socket.emit('update_request', { message: msg });
    document.getElementById("msg").value = '';
}
