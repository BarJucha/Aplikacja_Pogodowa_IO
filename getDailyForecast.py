from dataBase import DataBaseConnection
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests

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
        return jsonify(result_data)