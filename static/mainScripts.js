let loginDialog = document.getElementById('loginForm');

let isLoggedIn = false;
let sessionId = -1;

window.onclick = function(event) {
    if (event.target === loginDialog) {
        loginDialog.style.display = "none";
    }
}


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
        if (data.success) {
            isLoggedIn = true;
            toggleForms();
            changeTheme(data.backgroundColor);
            sessionId = data.sesja;
        }
        else {
            alert(data.message);
        }
    })
        .catch(error => console.error('Error:', error));
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
        else {
            alert(data.message);
        }
    })
        .catch(error => console.error('Error:', error));
}

function logout() {
    isLoggedIn = false;
    toggleForms();
    changeTheme("light");

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


function changeTheme(selectedTheme) {
    const themeColors = {
        light: '#e6c50f',
        dark: '#333333',
        sky: '#87ceeb',
        nature: '#228B22'
    };

    document.body.style.backgroundColor = themeColors[selectedTheme];

    const h2Elements = document.querySelectorAll('h2');

    h2Elements.forEach((h2) => {
        if (selectedTheme === "dark") {
            h2.style.color = '#f0f8ff';
        } else {
            h2.style.color = '';
        }
    });

    if(isLoggedIn){
        submitBackground(selectedTheme);
    }
}

function getWeather(miasto) {
        if (miasto.trim() === "") {
            alert("Wprowadź nazwę miasta przed sprawdzeniem pogody.");
            return;
        }

        fetch('/submitCity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: miasto }),
        })
        .then(response => response.json())
        .then(data => updateWeatherElements(data))
        .catch(error => console.error('Error:', error));
}

function updateWeatherElements(data) {
    document.getElementById('temperature').innerText = `${data.temperatura_C}°C`;
    document.getElementById('conditions').innerText = data.warunki;
    document.getElementById('city').innerText = data.miasto;
    document.getElementById('date').innerText = data.data;
    document.getElementById('weatherIcon').src = data.ikona;
}

document.addEventListener("DOMContentLoaded", getWeather('Warsaw'));


function submitBackground(background) {
    fetch('/submitBackground', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({color: background}),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}