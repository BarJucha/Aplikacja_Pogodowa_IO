import dataBase
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import hashlib
import os
import login
import currentWeather
import requests

from login import login_blueprint
app = Flask(__name__, static_url_path='/static')

app.secret_key = 'klucz_sesji'
app.register_blueprint(login_blueprint)
@app.route('/')
def index():
    return currentWeather('Cracow')


@app.route('/currentWeather/<string:city>')
def currentWeather(city):
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
        city = weather_data['location']['name']
        data = weather_data['location']['localtime']

        # Przygotuj dane do przekazania do szablonu HTML
        data = data[:10]
        rok, miesiac, dzien = data.split('-')
        formatted_data = f"{dzien}-{miesiac}-{rok}"
        formatted_temperature = int(temperature)

        return render_template('main.html', temp = formatted_temperature, warunki = condition, miasto = city, data = formatted_data, icon = icon)
    else:
        return redirect(url_for('index'))

@app.route('/submitCity', methods=['POST','GET'])
def submitWeather():
    if request.method=='POST':
        miasto = str(request.form['city'])
    return redirect(url_for('currentWeather',city=miasto))

if __name__ == '__main__':
    app.run(debug=True)
    #db_connection.close_connection()