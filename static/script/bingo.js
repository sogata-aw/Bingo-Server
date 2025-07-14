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
    "--overlay: repeating-linear-gradient(in oklab var(--lg-angle), transparent calc(0em + calc(var(--lg-length) * var(--animationCounter))), color-mix(in oklab, var(--teamRed)  var(--lg-opacity), transparent) calc(calc(var(--lg-length) / 2) + calc(var(--lg-length) * var(--animationCounter))), transparent calc(var(--lg-length) + calc(var(--lg-length) * var(--animationCounter))));",
    "--overlay: repeating-linear-gradient(in oklab var(--lg-angle), transparent calc(0em + calc(var(--lg-length) * var(--animationCounter))), color-mix(in oklab, var(--teamBlue) var(--lg-opacity), transparent) calc(calc(var(--lg-length) / 2) + calc(var(--lg-length) * var(--animationCounter))), transparent calc(var(--lg-length) + calc(var(--lg-length) * var(--animationCounter))));",
    "--overlay: repeating-linear-gradient(in oklab var(--lg-angle), transparent calc(0em + calc(var(--lg-length) * var(--animationCounter))), color-mix(in oklab, var(--teamRed) var(--lg-opacity), transparent) calc(calc(var(--lg-length) / 3) + calc(var(--lg-length) * var(--animationCounter))), color-mix(in oklab, var(--teamBlue) var(--lg-opacity), transparent) calc(calc(var(--lg-length) / 1.66) + calc(var(--lg-length) * var(--animationCounter))), transparent calc(var(--lg-length) + calc(var(--lg-length) * var(--animationCounter))));",
]

let currentPlayerName;
let bingo = [];

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

    updateBingoGrid();
}

//* @param {object} data*/
function updateBingoGrid(){
    for(let i = 0; i < bingo.length; i++){
        if(bingo[i].checkedBy){
            const teamColor = `var(${teams[bingo[i].checkedBy].color})`;
            bingoGrid.children[i].style = `--overlay: linear-gradient(color-mix(in oklab, ${teamColor} 50%, transparent));`;
            bingoGrid.children[i].disabled = true;
        }else if(bingo[i].challengers.length){
            let selectedOverlay = 0;
            let selectedOpacity = "";
            for(const challenger of bingo[i].challengers){
                if(challenger == currentPlayerName) selectedOpacity = "--lg-opacity: 100%;";
                if(teams.red.players.includes(challenger)) selectedOverlay |= 1;
                else if(teams.blu.players.includes(challenger)) selectedOverlay |= 2;
            }
            console.log(selectedOpacity);
            bingoGrid.children[i].style = selectedOpacity + challengeOverlays[selectedOverlay];
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
    socket.on('update_bingo', d => {bingo = d; updateBingoGrid();});

    for(const child of bingoGrid.children) child.addEventListener("click", e => {
        const ii = findBingoIndex(e.target);
        if(ii != undefined){
            if(!bingo[ii].challengers.includes(currentPlayerName)){
                socket.emit("case_click", {name: currentPlayerName, index: ii});
                return;
            }
            
            challengeDialogText.textContent = bingo[ii].text;
            challengeDialog.challengeIndex = ii;
            challengeDialog.showModal();
        }
    });

    challengeDialogClose.addEventListener("click", () => {challengeDialog.close();})
    challengeDialogUnchallenge.addEventListener("click", () => {
        socket.emit("case_click", {name: currentPlayerName, index: challengeDialog.challengeIndex});
        challengeDialog.close();
    })
    challengeDialogCheck.addEventListener("click", () => {
        socket.emit("add_request", {name: currentPlayerName, index: challengeDialog.challengeIndex});
        challengeDialog.close();
    })

    socket.emit('join', { name: currentPlayerName });
}

window.onbeforeunload = () => { socket.emit('leave', {name : currentPlayerName}); };