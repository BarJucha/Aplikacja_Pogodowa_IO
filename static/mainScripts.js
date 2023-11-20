var loginDialog = document.getElementById('loginForm');

let isLoggedIn = false;

window.onclick = function(event) {
    if (event.target === loginDialog) {
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
    isLoggedIn = true;
    updateUI();
    toggleForms();
}

function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
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
    isLoggedIn = true;
    toggleForms();
}

function logout() {
    isLoggedIn = false;
    toggleForms();

}


function toggleForms() {
    let loginForm = document.getElementById('loginForm');
    let logoutForm = document.getElementById('logoutForm');

    if (isLoggedIn) {
        loginForm.style.display = 'none';
        logoutForm.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        logoutForm.style.display = 'none';
    }

    document.getElementById('id01').style.display='block';
}




function getWeather() {

    fetch('/weather')
        .then(response => response.json())
        .then(data => {
            // document.getElementById('cityButton').innerText = data.city;
            document.getElementById('conditionHeader').innerText = `Warunki pogodowe: ${data.condition}`;
            document.getElementById('temperatureHeader').innerText = `Temperatura: ${data.temperature}°C`;
            document.getElementById('cityDateHeader').innerText = `${data.city}, ${new Date().toLocaleDateString()}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = function() {
    getWeather();
};

function updateUI() {
    alert("Udalo sie!");
}


