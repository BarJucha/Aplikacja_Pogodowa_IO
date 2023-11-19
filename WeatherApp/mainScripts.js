var loginDialog = document.getElementById('id01');

let isLoggedIn = false;

window.onclick = function(event) {
    if (event.target == loginDialog) {
        loginDialog.style.display = "none";
    }
}



const base_url = 'http://127.0.0.1:5000';

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let data = {
        email: email,
        password: password
    };


    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Obsługa odpowiedzi z serwera
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch(`/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}