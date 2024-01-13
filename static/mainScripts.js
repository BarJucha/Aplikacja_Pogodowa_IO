let loginDialog = document.getElementById('loginForm');

let isLoggedIn = false;
let sessionId = -1;
let temperatureUnit = 0;

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
            temperatureUnit = data.unit;
            toggleForms();
            sessionId = data.sesja;
            changeTheme(data.backgroundColor);
            switchWeatherUnit(data.unit);
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

    temperatureUnit = 0;
    console.log(temperatureUnit);
    switchWeatherUnit("0");

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

    const body = document.body;
    body.style.transition = 'background-color 0.5s ease-in-out';

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

    setTimeout(() => {
        body.style.transition = '';
    }, 500);
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
    const elements = {
        temperatureElement: document.getElementById('temperature'),
        conditionsElement: document.getElementById('conditions'),
        cityElement: document.getElementById('city'),
        dateElement: document.getElementById('date'),
        weatherIconElement: document.getElementById('weatherIcon'),
    };


    Object.values(elements).forEach(element => {
        element.style.transition = 'transform 0.5s ease-in-out';
        element.style.transform = 'translateY(80px)';
    });

    if (temperatureUnit === 0){
        elements.temperatureElement.innerText = `${data.temperatura_C} °C`;
        console.log(temperatureUnit);
    }
    else {
        elements.temperatureElement.innerText = `${Math.round((data.temperatura_C - 32)*5/9)} °F`;
        console.log(temperatureUnit);
    }

    elements.conditionsElement.innerText = data.warunki;
    elements.cityElement.innerText = data.miasto;
    elements.dateElement.innerText = data.data;
    elements.weatherIconElement.src = data.ikona;


    setTimeout(() => {
        Object.values(elements).forEach(element => {
            element.style.transform = 'none';
        });
    }, 100);
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


function submitTemperature(tempUnit) {

    const requestData = {temperature: parseInt(tempUnit)};

    fetch('/submitTemperature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Udało się!');
            } else {
                console.error('Błąd!', data);
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
}

function switchWeatherUnit(tempUnit, temperatureElement = document.getElementById('temperature')) {
    const lastChar = temperatureElement.innerText.slice(-1);

    if ((tempUnit.toString() === "0" && lastChar === "C") || (tempUnit.toString() === "1" && lastChar === "F")) {
        return;
    }

    let cleanTempText = temperatureElement.innerText.replace(/[^\d.-]/g, '');
    let currentTemp = parseFloat(cleanTempText);

    temperatureElement.style.transition = 'transform 0.5s ease-in-out';
    temperatureElement.style.transform = 'translateY(80px)';

    setTimeout(() => {
        if (tempUnit === "0") {
            let celsiusTemp = Math.round((currentTemp - 32) * 5/9);
            temperatureElement.innerText = `${celsiusTemp} °C`;
        } else {
            let fahrenTemp = Math.round(9/5 * currentTemp + 32);
            temperatureElement.innerText = `${fahrenTemp} °F`;
        }

        temperatureElement.style.transform = 'none';
    }, 100);
}



