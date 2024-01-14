from dataBase import DataBaseConnection
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests

#Funkcja zwracająca prognozę pogody na najbliższe 24h dla podanego miasta
def fgetHourForecast(miasto):
    api_key = 'c71bd51c9e09474a8db153108231911'

    # Wysyłanie zapytania do WeatherAPI
    weather_api_url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={miasto}&days=2&aqi=no&alerts=no'
    response = requests.get(weather_api_url)
    if response.status_code == 200:
        weather_data = response.json()
        current_epoch = weather_data['current']['last_updated_epoch']
        current_temp = weather_data['current']['temp_c']
        current_icon = weather_data['current']['condition']['icon']
        count = 0
        i = 0
        j = 0
        result_data = []
        result_data.append({'time': "now", 'temp': current_temp, 'icon': current_icon})
        while(count < 9):
            epoch = weather_data['forecast']['forecastday'][i]['hour'][j]['time_epoch']
            if epoch > current_epoch:
                time = weather_data['forecast']['forecastday'][i]['hour'][j]['time']
                temp = weather_data['forecast']['forecastday'][i]['hour'][j]['temp_c']
                icon = weather_data['forecast']['forecastday'][i]['hour'][j]['condition']['icon']
                result_data.append({'time':time, 'temp':temp, 'icon':icon})
                count +=1
            j += 3
            if j >= 24:
                j = 0
                i += 1

        return jsonify(result_data)
    
#Funkcja zwraca prognozę pogody na następne 9 dni dla podanego miasta
def fgetDailyForecast(miasto):
    api_key = 'c71bd51c9e09474a8db153108231911'
    weather_api_url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={miasto}&days=10&aqi=no&alerts=no'
    response = requests.get(weather_api_url)

    if response.status_code == 200:
        weather_data = response.json()
        result_data = []

        if 'forecast' in weather_data and 'forecastday' in weather_data['forecast']:
            for i in range(1, min(10, len(weather_data['forecast']['forecastday']))):
                day_data = weather_data['forecast']['forecastday'][i]['day']
                date = weather_data['forecast']['forecastday'][i]['date']
                max_temp = day_data.get('maxtemp_c')
                min_temp = day_data.get('mintemp_c')
                max_wind = day_data.get('maxwind_kph')
                avghumidity = day_data.get('avghumidity')
                condition = day_data['condition']['text']
                icon = day_data['condition']['icon']
                uv = day_data.get('uv')
                sunrise = weather_data['forecast']['forecastday'][i]['astro']['sunrise']
                sunset = weather_data['forecast']['forecastday'][i]['astro']['sunset']

                year, month, day = date.split('-')
                formatted_date = f'{day}-{month}-{year}'


                result_data.append({
                    'date': formatted_date,
                    'max_temp': max_temp,
                    'min_temp': min_temp,
                    'max_wind': max_wind,
                    'avghumidity': avghumidity,
                    'condition': condition,
                    'icon': icon,
                    'uv': uv,
                    'sunrise': sunrise,
                    'sunset': sunset
                })

        return result_data
    
#Funkcja zwraca funkcje
def getCurrentWeather(miasto):
    api_key = 'c71bd51c9e09474a8db153108231911'

    # Wysyłanie zapytania do WeatherAPI
    weather_api_url = f'http://api.weatherapi.com/v1/current.json?key={api_key}&q={miasto}&aqi=no'
    response = requests.get(weather_api_url)

    if response.status_code == 200:
        weather_data = response.json()

        #Przetwarzanie danych
        temperature = weather_data['current']['temp_c']
        condition = weather_data['current']['condition']['text']
        icon = weather_data['current']['condition']['icon']
        city = weather_data['location']['name']
        data = weather_data['location']['localtime']

        data = data[:10]
        rok, miesiac, dzien = data.split('-')
        formatted_data = f"{dzien}-{miesiac}-{rok}"

        temperature_F = int(temperature * 9 / 5 + 32)
        temperature_C = int(temperature)

        #Przygotowanie danych do wysłania do HTML
        response_data = {'success':True, 'temperatura_C':temperature_C, 'temperatura_F':temperature_F, 'warunki':condition,
                         'ikona':icon, 'miasto':city, 'data':formatted_data}
        return response_data