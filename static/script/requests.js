const socket = io();

const grid = document.getElementById('requests');
const checks = document.querySelectorAll('.check');
const refuse = document.querySelectorAll('.refuse');

socket.on('update_requests', data => {
   grid.innerHTML = '';
   data.forEach(element => {
      let div =  document.createElement('div');

      div.innerHTML = `<p>Team : ${element['team']}</p>
                <p>Défi : ${element['text']}</p>
                <div class="buttons">
                    <button id="${element['index']}" class="check" value="${element['team']}">Valider</button>
                    <button id="${element['index']}" class="refuse" value="${element['team']}">Refuser</button>
                </div>`;

       div.classList.add('request');
       div.classList.add(element['team']);

       div.querySelector('.check').addEventListener('click', (event) => {
           socket.emit('check_challenge', {index: element['index'], team: element['team']});
       });

       div.querySelector('.refuse').addEventListener('click', (event) => {
           socket.emit('refuse_challenge', {index: element['index'], team: element['team']});
       });

       grid.appendChild(div);
   });

});

checks.forEach((check) => {
    check.addEventListener('click', (event) => {
        socket.emit('check_challenge', {index: check.id, team: check.value});
    })
});

refuse.forEach((check) => {
    check.addEventListener('click', (event) => {
        socket.emit('refuse_challenge', {index: check.id, team: check.value});
    })
});