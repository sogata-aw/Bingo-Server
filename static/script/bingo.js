const socket = io()

const name = localStorage.getItem('name')

window.onload = () => {
    socket.emit("connect", {"name" : name})
}

window.onbeforeunload = () => {
    socket.emit("disconnect", {"name" : name})
}