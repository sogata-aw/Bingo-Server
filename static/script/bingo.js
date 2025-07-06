import { initView } from "../view/bingo-view.js";

const challenges = {
  1: "Monter 5 armes 1 étoile",
  2: "20 kills avec moins de 5 morts en Anarchie ou moins de 3 morts en Turf",
  3: "Réaliser une élimination tout seul ou 3 en équipe",
  4: "Faire un triple kill",
  5: "Faire un check avec quelqu'un de sa team",
  6: "Trouver 3 personnes qui jouent à Splatoon hors serveur Nintendo",
  7: "Gagner une partie avec la team entière en équipement héroïque",
  8: "Battre les Tridenfers dans le mode histoire du 3",
  9: "Battre le boss final de l'Octo Expansion",
  10: "Battre le boss final du 3 en moins de 30min (plus peut-être)",
  11: "Écouter Octoling RendezVous dans le hall",
  12: "Terminer un niveau Octaling dans le mode histoire du 2",
  13: "Gagner un match en jouant l'Épinceau brosse nuancé",
  14: "Faire la mission n°6 du secteur 1 en moins d'1min30",
  15: "Vaincre Cannon parallèle dans la Tour de l'Ordre",
  16: "Finir la Tour de l'Ordre en low hack avec le Lanceur Octaling",
  17: "Finir un niveau contenant des eight-ball dans l'Octo Expansion sans mourir",
  18: "Faire coucou aux idols des 3 jeux",
  19: "Dessiner un Inkling avec de l'encre",
  20: "Lancer une squid party avec des randoms",
  21: "Récupérer 125 œufs en Salmon Run",
  22: "Faire un match sur la 1ère map de tout Splatoon",
  23: "Faire un match sur la dernière map de tout Splatoon",
  24: "Faire la mission n°11 du secteur 5 en moins d'1min",
  25: "Faire la mission n°12 du secteur 6 en moins d'1min20 sans armes",
  26: "Prendre une photo devant Don Podio",
  27: "Vaincre 5 Gros Boulet",
  28: "Vaincre 5 Gobb",
  29: "Vaincre 5 Tête-de-pneu",
  30: "Gagner 3 guerres de territoires d'affilée",
  31: "Battre un boss de Splatoon 1",
  32: "Battre le seul boss apparu dans les 3 jeux (dans n'importe lequel)",
  33: "Gagner 3 matchs cartes et territoires",
  34: "Gagner un match en jouant le Trisperceur (Tri-Stringer)",
  35: "Gagner un match en jouant l'Encrifugeur (Sloshing Machine)",
  36: "Gagner un match en jouant le Liquidateur Pro (Splattershot Pro)",
  37: "Gagner un match en jouant le Dépoteur (Tri-Slosher)",
  38: "Gagner un match en jouant le Détubeur modifié",
  39: "Obtenir 3 brevets cartouches",
  40: "Jouer sur une map qui était en travaux dans un ancien opus",
  41: "Jouer sur une map introduite dans Splatoon 2",
  42: "Faire un match avec une arme exclusive au 3 (Trisperceur, Éclatana, Lanceur Spatial,...)",
  43: "Obtenir un équipement avec 3 bonus pareils",
  44: "Obtenir 3 nouveaux équipements",
  45: "Obtenir les 3 bonus d'un équipement",
  46: "Améliorer d'une étoile 3 équipements",
  47: "Réussir à lancer un match en rang X",
  48: "Finir tous les niveaux de l'Octo Canyon (zone d’intro avant Alterna)",
  49: "Finir le niveau secret d'Alterna",
  50: "Prendre une photo avec son équipe",
  51: "Prendre une photo devant le camion d'Omar (Splatoon 2) ou devant là où il était (Splatoon 3)",
  52: "Faire un K.O. en match Anarchie",
  53: "Gagner avec plus de 65% de la map encrée en guerre de territoire",
  54: "Obtenir le titre N° 1 au combat",
  55: "Obtenir le titre N° 1 en encrage de territoire",
  56: "Obtenir le titre N° 1 en super saut",
  57: "Gagner avec une équipe composée uniquement de snipers",
  58: "Colorer la page easter egg de Google en entier",
  59: "Utiliser 8 spéciaux en une partie",
  60: "Finir le tutoriel de l’un des Splatoon",
  61: "Speedrun de la tour de l'ordre (début ~30min)",
  62: "Quizz sur l’univers du jeu (vers 15h - 20/30min)",
  63: "Photo contest ? (avant 15h)",
  64: "Bataille de mini-jeux (vers 16h)"
};

const socket = io();

let nickname = localStorage.getItem("name") ? localStorage.getItem("name") : "";

let mode = "click";

function join(name) {
    socket.emit('join', { name: name});
}

function disconnect(name) {
    socket.emit('logout', { name: name });
}

function clickCase(idCase, name) {
    socket.emit('case_click', { case: idCase, name: name });
}

const clickHandler = () => clickCase(this.id, nickname);

function updateBingo(bingo) {
    let data = {}
    let state = "";
    for (let i = 0; i < bingo.length; i++) {
        if(bingo[i].style.backgroundColor === "#e34040"){
            state = "team1";
        }else if(bingo[i].style.backgroundColor === "#5963f0"){
            state = "team2";
        }
        data[i] = {text: bingo[i].textContent, state: bingo[i].style.backgroundColor};
    }
    socket.emit('update_bingo', { bingo: data });
}

function updateUser(name, team){
    socket.emit("update_user", { name: name, team: team });
}

document.addEventListener("DOMContentLoaded", async function () {
    const view = initView();
    console.log(view);

    socket.emit('get_bingo', {});

    socket.on('update_users', data => {
        view.neutral.classList.add("hidden");

        Array.from(view.left.children).forEach((item) => {
            if (item !== view.leftAdd) {
                view.left.removeChild(item);
            }
        });

        Array.from(view.right.children).forEach((item) => {
            if (item !== view.rightAdd) {
                view.right.removeChild(item);
            }
        });

        Array.from(view.neutral.children).forEach((item) => {
            view.neutral.removeChild(item);
        });

        data = data.map(item => {
            let h2 = document.createElement("h2");
            h2.appendChild(document.createTextNode(item["name"]));
            h2.setAttribute("draggable", "true");
            h2.setAttribute("id", item["name"]);
            if(item["team"] === "team1"){
                view.left.appendChild(h2);
            }else if(item["team"] === "team2"){
                view.right.appendChild(h2);
            }else{
                if(view.neutral.classList.contains("hidden")){
                    view.neutral.classList.remove("hidden");
                }
                view.neutral.appendChild(h2);
            }
            h2.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text", e.target.id);
            });
        })
    });

    socket.on('update_bingo', data => {
        console.log("called");
        for (let i = 0; i < view.cases.length; i++) {
            if(data[i]["state"] === "team1"){
                view.cases[i].style.backgroundColor = "#e34040";
            }else if(data[i]["state"] === "team2"){
                view.cases[i].style.backgroundColor = "#5963f0";
            }
            view.cases[i].textContent = data[i]["text"]
        }
    });

    join(nickname);

    if(nickname === "Soga") {
        view.actions.classList.remove("hidden");

        view.shuffle.addEventListener("click", () => {
            let choosen = [];
            let defi;

            view.cases.forEach(div => {
                do{
                    defi = Math.floor(Math.random() * Object.keys(challenges).length + 1);
                }while(choosen.includes(defi));

                div.textContent = challenges[defi];
                choosen.push(defi);
            });
            updateBingo(view.cases);
        });

        view.left.addEventListener("drop", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text");
            view.left.appendChild(document.getElementById(data));
            updateUser(data,"team2");
        });

        view.right.addEventListener("drop", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text");
            view.right.appendChild(document.getElementById(data));
            updateUser(data,"team1");
        });

        view.right.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

        view.left.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

    }

    view.cases.forEach(div => {
        div.addEventListener("click", clickHandler.bind(this, div));
    })

})

window.addEventListener("beforeunload", () => {
    disconnect(nickname);
});