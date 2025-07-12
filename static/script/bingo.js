const socket = io()

const currentPlayerName = localStorage.getItem('name');

function connect(name){
    console.log("yeah");
    socket.emit('join', { name: name });
}

/** @param {HTMLElement} element */
function findBingoIndex(element){
    for(let i = 0; i < bingoGrid.children.length; i++)
        if(bingoGrid.children[i] == element)
            return i;
    return undefined
}

window.onload = () => {
    const teamsDisplay = {
        red : teamRed,
        blu : teamBlue,
        neutral : teamNeutral,
    };

    socket.on('update_connected_users', data => {
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
    });

    for(const child of bingoGrid.children)
        child.addEventListener("click", e => {
            const ii = findBingoIndex(e.target);
            if(ii != undefined){
                console.log(ii);
            }
        });
    

    connect(currentPlayerName);
}

window.onbeforeunload = () => {
    socket.emit('leave', {"name" : currentPlayerName});
}