import requests
from flask import render_template

def getCurrentWeather(city):
    # Klucz API dostarczony przez WeatherAPI
    api_key = 'c71bd51c9e09474a8db153108231911'

    # Wysyłanie zapytania do WeatherAPI
    weather_api_url = f'http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}&aqi=no'
    response = requests.get(weather_api_url)

    # Sprawdź, czy zapytanie było udane
    if response.status_code == 200:
        weather_data = response.json()

        # Przetwórz dane pogodowe
        temperature = weather_data['current']['temp_c']
        condition = weather_data['current']['condition']['text']
        icon = weather_data['current']['condition']['icon']

        # Przygotuj dane do przekazania do szablonu HTML
        data = {
            'city': city,
            'temperature': temperature,
            'condition': condition,
            'icon': icon
        }

        return render_template('main.html', data=data)