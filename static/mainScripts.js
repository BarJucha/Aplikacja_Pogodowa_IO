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
            //switchWeatherUnit(data.unit);
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
    //switchWeatherUnit("0");
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
        getHourForecast(miasto);
        getDailyForecast(miasto);

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

    if (temperatureUnit === 0)
        elements.temperatureElement.innerText = `${data.temperatura_C} °C`;
    else
        elements.temperatureElement.innerText = `${Math.round((9/5*data.temperatura_C - 32))} °F`;


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
            console.log(data);
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
                console.log('Udało się!');
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
                        item.temp = (9 / 5) * item.temp + 32;
                    });
                }
                console.log(data);
                const interpolationPoints = data.map((data, index) => ({
                    x: index * 3,
                    y: data.temp,
                    z: data.time.slice(-5),
                }));
                console.log(interpolationPoints);
                drawInterpolatedPolynomialChart("interpolatedPolynomialChartSmall",interpolationPoints, "small");
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
                console.log(data);
            } else {
                console.error('Błąd!', data);
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
}



function renderCalendar(forecastData) {
    const calendarContainer = document.getElementById('dailyForecast');
    const calendar = document.getElementById('calendar');

    // Usuń istniejące elementy kalendarza
    while (calendar.firstChild) {
        calendar.removeChild(calendar.firstChild);
    }

    forecastData.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        if (temperatureUnit === 1)
            dayElement.innerHTML = `
                <h3>${day.date}</h3>
                <p>Sunrise: ${day.sunrise}</p>
                <p>Sunset: ${day.sunset}</p>
                <p>Max Temp: ${day.max_temp}°F</p>
                <p>Min Temp: ${day.min_temp}°F</p>
                <p>Max Wind: ${day.max_wind} kph</p>
                <p>Average Humidity: ${day.avghumidity}%</p>
                <p>Condition: ${day.condition}</p>
                <img src="${day.icon}" alt="${day.condition}">
                <p>UV index: ${day.uv}</p>
            `;
        else
            dayElement.innerHTML = `
                <h3>${day.date}</h3>
                <p>Sunrise: ${day.sunrise}</p>
                <p>Sunset: ${day.sunset}</p>
                <p>Max Temp: ${day.max_temp}°C</p>
                <p>Min Temp: ${day.min_temp}°C</p>
                <p>Max Wind: ${day.max_wind} kph</p>
                <p>Average Humidity: ${day.avghumidity}%</p>
                <p>Condition: ${day.condition}</p>
                <img src="${day.icon}" alt="${day.condition}">
                <p>UV index: ${day.uv}</p>
            `;

        calendar.appendChild(dayElement);
    });

    const days = document.querySelectorAll('.day');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');

    let currentIndex = 0;

    const updateVisibility = () => {
        days.forEach((day, index) => {
            day.style.opacity = index === currentIndex ? 1 : 0;
        });
    };

    const scrollCalendar = (direction) => {
        const dayWidth = days[0].offsetWidth + 10;
        const maxIndex = forecastData.length - 1;

        currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));

        const transformValue = -currentIndex * dayWidth + 'px';
        calendar.style.transform = `translateX(${transformValue})`;

        prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
        nextButton.style.display = currentIndex === maxIndex ? 'none' : 'block';

        updateVisibility();
    };

    prevButton.onclick = () => scrollCalendar(-1);
    nextButton.onclick = () => scrollCalendar(1);

    prevButton.style.display = 'none';
    nextButton.style.display = forecastData.length > 1 ? 'block' : 'none';

    scrollCalendar(1);
    scrollCalendar(-1);
    updateVisibility();
}

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Formatowanie czasu do postaci hh:mm:ss
    var formattedTime = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);

    // Wyświetlanie sformatowanego czasu w elemencie div
    document.getElementById('clock').innerText = formattedTime;
}

function padZero(number) {
    return number < 10 ? "0" + number : number;
}

setInterval(updateClock, 1000);
updateClock();