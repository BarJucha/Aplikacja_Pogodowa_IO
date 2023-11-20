var loginDialog = document.getElementById('loginForm');

let isLoggedIn = false;

window.onclick = function(event) {
    if (event.target === loginDialog) {
        loginDialog.style.display = "none";
    }
}



const base_url = 'http://127.0.0.1:5000';

function login() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        console.error('Wprowadź poprawny email i hasło.');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd sieci!');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
<<<<<<< HEAD
        if (data.success) {
            isLoggedIn = true;
            toggleForms();
        }
    })
}


function register() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        console.error('Wprowadź poprawny email i hasło.');
        return;
    }

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
    .then(data => {
        console.log(data);
        if (data.success) {
            isLoggedIn = true;
            toggleForms();
        }
    })
        .catch(error => console.error('Error:', error));
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
        document.getElementById('settings').style.display = 'block';
        logoutForm.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        document.getElementById('settings').style.display = 'none';
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



function updateUI() {
    alert("Udalo sie!");
}

function changeTheme(selectedTheme) {
    const themeColors = {
        light: '#ffffff',
        dark: '#333333',
        sky: '#87CEEB',
        nature: '#228B22'
    };

    document.body.style.backgroundColor = themeColors[selectedTheme];
}
