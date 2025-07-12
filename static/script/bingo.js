const socket = io();
const teamsDisplay = {
    red : teamRed,
    blu : teamBlue,
    neutral : teamNeutral,
};

let bingoData;
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
    teamsDisplay.red.innerHTML = '<div style="flex-grow: 1;"></div>';
    teamsDisplay.blu.innerHTML = '<div style="flex-grow: 1;"></div>';
    teamsDisplay.neutral.innerHTML = '<div style="flex-grow: 1;"></div>';

    data.forEach(user => {
        const nameDisplay = document.createElement("p");
        nameDisplay.textContent = user.name;

        if(!Object.keys(teamsDisplay).includes(user.team)) user.team = "neutral";

        teamsDisplay[user.team].appendChild(nameDisplay);

    })

    teamsDisplay.red.innerHTML += '<div style="flex-grow: 1;"></div>';
    teamsDisplay.blu.innerHTML += '<div style="flex-grow: 1;"></div>';
    teamsDisplay.neutral.innerHTML += '<div style="flex-grow: 1;"></div>';
}

//* @param {object} data*/
function updateBingoGrid(data){
    console.log(data);
    bingoData = data;
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