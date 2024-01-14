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
        while(count < 25):
            epoch = weather_data['forecast']['forecastday'][i]['hour'][j]['time_epoch']
            if epoch > current_epoch:
                time = weather_data['forecast']['forecastday'][i]['hour'][j]['time']
                temp = weather_data['forecast']['forecastday'][i]['hour'][j]['temp_c']
                icon = weather_data['forecast']['forecastday'][i]['hour'][j]['condition']['icon']
                result_data.append({'time':time, 'temp':temp, 'icon':icon})
                count +=1
            j += 1
            if j==24:
                j = 0
                i += 1
        return result_data
    else:
        result_data = {'succes': False}
        return result_data
    
#Funkcja zwraca prognozę pogody na następne 9 dni dla podanego miasta
def fgetDailyForecast(miasto):
    api_key = 'c71bd51c9e09474a8db153108231911'
    weather_api_url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={miasto}&days=10&aqi=no&alerts=no'
    response = requests.get(weather_api_url)

    if response.status_code == 200:
        weather_data = response.json()
        result_data = []
        for i in range(9):
            max_temp = weather_data['forecast']['forecastday'][i+1]['day']['maxtemp_c']
            min_temp = weather_data['forecast']['forecastday'][i+1]['day']['mintemp_c']
            max_wind = weather_data['forecast']['forecastday'][i+1]['day']['maxwind_kph']
            avghumidity = weather_data['forecast']['forecastday'][i+1]['day']['avghumidity']
            condition = weather_data['forecast']['forecastday'][i+1]['day']['condition']['text']
            icon = weather_data['forecast']['forecastday'][i+1]['day']['condition']['icon']
            uv = weather_data['forecast']['forecastday'][i+1]['day']['uv']
            sunrise = weather_data['forecast']['forecastday'][i+1]['astro']['sunrise']
            sunset = weather_data['forecast']['forecastday'][i+1]['astro']['sunset']
            result_data.append({
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
    else:
        result_data = {'succes': False}
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
        response_data = {'succes':True, 'temperatura_C':temperature_C, 'temperatura_F':temperature_F, 'warunki':condition, 
                         'ikona':icon, 'miasto':city, 'data':formatted_data}
        return response_data
    else:
        response_data = {'succes': False}
        return response_data

# Funkcja zwracająca pogodę dla miasta w danym dniu
def fgetForecastInDay(miasto, data):
    api_key = 'c71bd51c9e09474a8db153108231911'
    weather_api_url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={miasto}&days=10&aqi=no&alerts=no'
    response = requests.get(weather_api_url)

    if response.status_code == 200:
        weather_data = response.json()

        i=0
        icon = " "
        stan = " "
        while(True):
            if(weather_data['forecast']['forecastday'][i]['date'] == data):
                stan = ['forecast']['forecastday'][i]['day']['condition']['text']
                icon = ['forecast']['forecastday'][i]['day']['condition']['icon']
                temp = ['forecast']['forecastday'][i]['day']['maxtemp_c']
                break
            i += 1
        
        response_data = {'stan':stan, 'icon':icon, 'temp': temp}
        return response_data
            

    else:
        response_data = {'succes': False}
        return response_data
