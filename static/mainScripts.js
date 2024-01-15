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
        if (data.success) {
            isLoggedIn = true;
            temperatureUnit = data.unit;
            toggleForms();
            sessionId = data.sesja;
            changeTheme(data.backgroundColor);
            getWeather(data.defaultCity);
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
    getWeather(document.getElementById('city').innerText);

}


function toggleForms() {
    let loginForm = document.getElementById('loginForm');
    let defaultButton = document.getElementById('defaultButton')
    let logoutForm = document.getElementById('logoutForm');

    if (isLoggedIn) {
        defaultButton.style.display = 'block';
        loginForm.style.display = 'none';
        document.getElementById('settings').style.display = 'block';
        logoutForm.style.display = 'block';
    } else {
        defaultButton.style.display = 'none';
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


    document.body.style.transition = 'background-color 0.3s ease-in-out';
    document.getElementById('clock').style.color= '#333';
    document.body.style.backgroundColor = themeColors[selectedTheme];

    const h2Elements = document.querySelectorAll('h2');

    h2Elements.forEach((h2) => {
        if (selectedTheme === "dark") {
            h2.style.color = '#f0f8ff';
            document.getElementById('clock').style.color = '#f0f8ff';
        } else {
            h2.style.color = '';
        }
    });

    if(isLoggedIn){
        submitBackground(selectedTheme);
    }

    setTimeout(() => {
        document.body.style.transition = '';
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


    animatedForecastChange(miasto, 'overlay_cal');
    animatedForecastChange(miasto, 'overlay_box');

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

    if (temperatureUnit === 0)
        elements.temperatureElement.innerText = `${data.temperatura_C} °C`;
    else
        elements.temperatureElement.innerText = `${Math.round((9/5*data.temperatura_C + 32))} °F`;


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


document.addEventListener("DOMContentLoaded", function() {
    getWeather('Warsaw');
});

/*
let resizeTimeout;
window.addEventListener('resize', function() {
    const miasto = document.getElementById('city').innerText;

    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(function() {
        animatedForecastChange(miasto, 'overlay_box');
    }, 500);
});
*/

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
        console.log("SubmitBackground udany!");
    })
    .catch(error => console.error('Error:', error));
}

function submitNotification(value) {
    fetch('/submitNotification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({notification: value}),
    })
        .then(response => response.json())
        .then(data => {
            console.log("SubmitNotification udane!");
        })
        .catch(error => console.error('Error:', error));
}


function submitTemperature(tempUnit) {

    temperatureUnit = parseInt(tempUnit);
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
                console.log('submitTemperature udane!');
            } else {
                console.error('Błąd!', data);
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
}

function submitDefaultCity() {
    const requestData =  {city: document.getElementById('city').innerText};

    fetch('/submitDefaultCity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('submitDefaultCity udane!');
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



function getHourForecast(miasto) {

    fetch('/getHourForecast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: miasto }),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                if (temperatureUnit === 1) {
                    data.forEach(item => {
                        item.temp = ((9 / 5) * item.temp + 32).toFixed(1);
                    });
                }
                const points = data.map((data, index) => ({
                    x: index * 3,
                    y: data.temp,
                    z: data.time.slice(-5),
                }));
                drawFunctionFromPoints(points);
            } else {
                console.error('Błąd!', data);
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
}

function getDailyForecast(miasto) {

    fetch('/getDailyForecast', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: miasto }),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                if (temperatureUnit === 1) {
                    data.forEach(item => {
                        item.max_temp = Math.round((9 / 5) * item.max_temp + 32);
                        item.min_temp = Math.round((9 / 5) * item.min_temp + 32);
                    });
                }
                renderCalendar(data);
            } else {
                console.error('Błąd!', data);
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
}



function renderCalendar(forecastData) {
    const calendarContainer = document.getElementById('calendar-container');
    const calendar = document.getElementById('calendar');

    while (calendar.firstChild) {
        calendar.removeChild(calendar.firstChild);
    }

    const dayElement = document.createElement('div');
    dayElement.classList.add('day');

    calendar.appendChild(dayElement);

    const updateDay = (index) => {
        const day = forecastData[index];
        const temperatureUnitLabel = temperatureUnit === 1 ? '°F' : '°C';

        dayElement.innerHTML = `
            <h3>${day.date}</h3>
            <p>Sunrise: ${day.sunrise}</p>
            <p>Sunset: ${day.sunset}</p>
            <p>Max Temp: ${day.max_temp}${temperatureUnitLabel}</p>
            <p>Min Temp: ${day.min_temp}${temperatureUnitLabel}</p>
            <p>Max Wind: ${day.max_wind} kph</p>
            <p>Average Humidity: ${day.avghumidity}%</p>
            <p>Condition: ${day.condition}</p>
            <img src="${day.icon}" alt="${day.condition}">
            <p>UV index: ${day.uv}</p>
        `;
    };

    let currentIndex = 0;

    const updateVisibility = () => {
        dayElement.style.opacity = 1;
    };

    updateDay(currentIndex);
    updateVisibility();

    document.getElementById('arrowleft').addEventListener('click', () => {
        scrollCalendar(-1);
    });

    document.getElementById('arrowright').addEventListener('click', () => {
        scrollCalendar(1);
    });

    window.scrollCalendar = (direction) => {
        const maxIndex = forecastData.length - 1;

        currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));

        const currentDay = document.querySelector('.day');
        currentDay.classList.add('hidden');
        updateDay(currentIndex);

        document.getElementById('arrowleft').style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        document.getElementById('arrowright').style.visibility = currentIndex === maxIndex ? 'hidden' : 'visible';

        setTimeout(() => {
            currentDay.classList.remove('hidden');
        }, 300);

        updateVisibility();
    };
}

function updateClock() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();


    document.getElementById('clock').innerText = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
}

function padZero(number) {
    return number < 10 ? "0" + number : number;
}

setInterval(updateClock, 1000);


function animatedForecastChange(miasto, overlayId) {
    let overlay = document.getElementById(overlayId);
    overlay.classList.add('slideIn');
    overlay.style.backgroundColor = document.body.style.backgroundColor;
    overlay.style.filter = `saturate(80%)`;
    overlay.style.display = 'block';


    setTimeout(function () {
        if(overlayId === 'overlay_box')
            getHourForecast(miasto);
        else if (overlayId === 'overlay_cal')
            getDailyForecast(miasto);
        overlay.classList.remove('slideIn');
        overlay.classList.add('slideOut');

        setTimeout(function () {
            overlay.style.display = 'none';
            overlay.classList.remove('slideOut');
        }, 2000);
    }, 1000);
}