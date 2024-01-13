from dataBase import DataBaseConnection
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests


def fgetFavouriteCities(db_connection, user_id):
    query = "SELECT miasto FROM ulubione_miasta WHERE userID = %s"
    cursor, result = db_connection.execute_query(query, user_id)
    api_key = 'c71bd51c9e09474a8db153108231911'
    result_data = []
    for miasto in result:
        weather_api_url = f'http://api.weatherapi.com/v1/current.json?key={api_key}&q={miasto}&aqi=no'
        response = requests.get(weather_api_url)
        if response.status_code == 200:
            weather_data = response.json()
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

            # Przygotuj dane do przekazania do szablonu HTML
            response_data = {'temperatura_C':temperature_C, 'temperatura_F':temperature_F, 'warunki':condition, 
                             'ikona':icon, 'miasto':city, 'data':formatted_data}
            result_data.append(response_data)

    return jsonify(result_data)