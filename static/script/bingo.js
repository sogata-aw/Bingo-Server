import {initView} from "../view/bingo-view.js";

const socket = io()

const name = localStorage.getItem('name')

function connect(name){
    console.log("yeah")
    socket.emit('join', { name: name });
}

window.onload = () => {
    const view = initView();

    socket.on('update_connected_users', data => {
        view.greyTeam.classList.add("hidden");
        view.redTeam.innerHTML = "";
        view.blueTeam.innerHTML = "";
        view.greyTeam.innerHTML = "";

        data.forEach(user => {
            if(user["team"] === "red"){
                view.redTeam.appendChild(document.createElement("h2").appendChild(document.createTextNode(user["name"])));
            }else if(user["team"] === "blu"){
                view.blueTeam.appendChild(document.createElement("h2").appendChild(document.createTextNode(user["name"])));
            }else{
                if(view.greyTeam.classList.contains("hidden")){
                    view.greyTeam.classList.remove("hidden");
                }
                view.greyTeam.appendChild(document.createElement("h2").appendChild(document.createTextNode(user["name"])));
            }
        })
    });

    connect(name);
}

window.onbeforeunload = () => {
    socket.emit('leave', {"name" : name})
}