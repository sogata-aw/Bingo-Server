function setToLocalStorage(name) {
    localStorage.setItem("name", name);
    window.location.href = "/bingo.html";
}

window.onload = () => {
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();

        let loginResponse = await fetch(`/login/${loginName.value}`).then(res => res.text());

        if(loginResponse === "OK") {
            alert(`Login de ${loginName.value}`);
            setToLocalStorage(loginName.value);
        }else if(loginResponse === "PASSWORD") {
            let passwd = prompt("saisissez le mot de passe :", "");
            let passwdResponse = await fetch("/checkpasswd", {
                method: "POST",
                body: JSON.stringify({
                    password: passwd
                }),
                headers: { "Content-Type": "application/json; charset=UTF-8" },
            }).then(res => res.text());
            if(passwdResponse === "OK") {
                alert(`Login de ${loginName.value}`);
                setToLocalStorage(loginName.value);
            }else{
                alert("Mot de passe incorrect")
            }

        }else if(loginResponse === "INVALID") {
            let addResponse = await fetch(`/login/create/${loginName.value}`);
            if(addResponse === "OK") {
                alert(`Login de ${loginName.value}`);
                setToLocalStorage(loginName.value);
            }else{
                alert("Une erreur est survenue");
            }
        }


    });
}