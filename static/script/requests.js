const socket = io();

const grid = document.getElementById('requests');
const checks = document.querySelectorAll('.checks');
const refuse = document.querySelectorAll('.refuse');

socket.on('update_requests', data => {
   grid.innerHTML = '';
   data.forEach(element => {
      let div =  document.createElement('div');
      let team = document.createElement("p");
      let challenge = document.createElement("p");
      team.textContent = element['team'];
      challenge.textContent = element['challenge'];

      div.appendChild(team);
      div.appendChild(challenge);
   });

});

checks.forEach((check) => {
    check.addEventListener('click', (event) => {
        socket.emit('check_challenge', {id: check.id, team: check.value});
    })
});

refuse.forEach((check) => {
    check.addEventListener('click', (event) => {
        socket.emit('refuse_challenge', {id: check.id, team: check.value});
    })
});