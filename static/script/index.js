function setToLocalStorage(name) {
    localStorage.setItem("name", name);
    window.location.href = "/bingo.html";
}

window.onload = () => {
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();

        let loginResponse = await fetch(`/login/${loginName.value}`).then(res => res.text());

        if(loginResponse === "OK") {
            setToLocalStorage(loginName.value);
        }else if(loginResponse === "INVALID") {
            let addResponse = await fetch(`/login/create/${loginName.value}`);
            if(addResponse === "OK") {
                setToLocalStorage(loginName.value);
            }else{
                alert("Une erreur est survenue");
            }
        }


    });
}