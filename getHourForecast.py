from dataBase import DataBaseConnection
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests

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
        return jsonify(result_data)