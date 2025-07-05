import { initView } from "./view/index-view.js";

const socket = io();

function updatePLayer(name, team = ""){
    socket.emit('update_player', { name: name, team: team });
}

document.addEventListener("DOMContentLoaded", () => {
  const view = initView();

  view.btnLog.addEventListener('click', async function(){
    const name = view.nameInput.value;
    let exist = await fetch("/playerexist/" + name).then(res => res.text());
    console.log(exist);
    console.log(name);
    if(exist === ""){
        updatePLayer(name);
    }
    if(name === "Soga"){
       const password = window.prompt("Veuillez saisir le mdp :", "");
       const res = await fetch("/passwd").then(res => res.text());
       if(password !== res){
           window.alert("Mot de passe incorrect !");
       }else{
           localStorage.setItem("name", name);

           window.location.href = "./bingo";
       }
    }else{
        localStorage.setItem("name", name);
        window.location.href = "./bingo";
    }
  });
});