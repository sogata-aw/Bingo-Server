function setToLocalStorage(name) {
    localStorage.setItem("name", name);
    window.location.href = "/bingo.html";
}

window.onload = () => {
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();

        const loginResponse = await fetch(`/login/${loginName.value}`).then(res => res.text());

        if(loginResponse === "INVALID"){
            alert("Nom d'utilisateur non reconnu");
            return;
        }else if(loginResponse === "LOGGED IN"){
            alert("Cet utilisateur est déjà connecté");
            return;
        }

        setToLocalStorage(loginName.value);
    });
}