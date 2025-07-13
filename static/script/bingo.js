const socket = io();
const teams = {
    red : {
        players: [],
        element: teamRed,
        color: "--teamRed"
    },
    blu : {
        players: [],
        element: teamBlue,
        color: "--teamBlue"
    },
    neutral : {
        players: [],
        element: teamNeutral,
        color: "transparent"
    }
};

const challengeOverlays = [
    "--overlay: linear-gradient(transparent);",
    "--overlay: repeating-linear-gradient(transparent calc(0em + calc(1em * var(--animationCounter))), var(--teamRed)  calc(.5em + calc(1em * var(--animationCounter))), transparent calc(1em + calc(1em * var(--animationCounter))))",
    "--overlay: repeating-linear-gradient(transparent calc(0em + calc(1em * var(--animationCounter))), var(--teamBlue) calc(.5em + calc(1em * var(--animationCounter))), transparent calc(1em + calc(1em * var(--animationCounter))))",
    "--overlay: repeating-linear-gradient(transparent calc(0em + calc(1em * var(--animationCounter))), var(--teamRed) calc(.33em + calc(1em * var(--animationCounter))), var(--teamBlue) calc(.66em + calc(1em * var(--animationCounter))), transparent calc(1em + calc(1em * var(--animationCounter))))",
]

let currentPlayerName;

/** @param {HTMLElement} element */
function findBingoIndex(element){
    for(let i = 0; i < bingoGrid.children.length; i++)
        if(bingoGrid.children[i] == element)
            return i;
    return undefined
}

//* @param {object} data*/
function updateConnectedUsers(data){
    teams.red.element.innerHTML = '<div style="flex-grow: 1;"></div>';
    teams.blu.element.innerHTML = '<div style="flex-grow: 1;"></div>';
    teams.neutral.element.innerHTML = '<div style="flex-grow: 1;"></div>';

    data.forEach(user => {
        const nameDisplay = document.createElement("p");
        nameDisplay.textContent = user.name;

        if(!Object.keys(teams).includes(user.team)) user.team = "neutral";

        teams[user.team].element.appendChild(nameDisplay);
        teams[user.team].players.push(user.name);

    })

    teams.red.element.innerHTML += '<div style="flex-grow: 1;"></div>';
    teams.blu.element.innerHTML += '<div style="flex-grow: 1;"></div>';
    teams.neutral.element.innerHTML += '<div style="flex-grow: 1;"></div>';
}

//* @param {object} data*/
function updateBingoGrid(data){
    for(let i = 0; i < data.length; i++){
        if(data[i].checkedBy){
            const teamColor = `var(${teams[data[i].checkedBy].color})`;
            bingoGrid.children[i].style = `--overlay: linear-gradient(color-mix(in oklab, ${teamColor} 50%, transparent));`;
        }else if(data[i].challengers.length){
            let selectedOverlay = 0;
            for(const challenger of data[i].challengers){
                if(teams.red.players.includes(challenger)) selectedOverlay |= 1;
                else if(teams.blu.players.includes(challenger)) selectedOverlay |= 2;
            }
            bingoGrid.children[i].style = challengeOverlays[selectedOverlay];
        }else{
            bingoGrid.children[i].style = "--overlay: linear-gradient(transparent);";
        }
    }
}

window.onload = () => {
    currentPlayerName = localStorage.getItem('name');
    if(!currentPlayerName){
        alert("no player name in local storage");
        return;
    }

    socket.on('update_connected_users', updateConnectedUsers);
    socket.on('update_bingo', updateBingoGrid);

    for(const child of bingoGrid.children)
        child.addEventListener("click", e => {
            const ii = findBingoIndex(e.target);
            if(ii != undefined){
                socket.emit("case_click", {name: currentPlayerName, index: ii});
            }
        });

    socket.emit('join', { name: currentPlayerName });
}

window.onbeforeunload = () => { socket.emit('leave', {name : currentPlayerName}); };