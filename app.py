import dataBase
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import hashlib
import os
import login
import currentWeather
import requests

from login import login_blueprint
app = Flask(__name__, static_url_path='/static')

db_connection = dataBase.DataBaseConnection()

app.secret_key = 'klucz_sesji'
app.register_blueprint(login_blueprint)
@app.route('/')
def index():
    return render_template('main.html')


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
        temperature_F = temperature * 33.8
        temperature_C = int(temperature)

        # Przygotuj dane do przekazania do szablonu HTML
        response_data = {'temperatura_C':temperature_C, 'temperatura_F':temperature_F, 'warunki':condition, 'ikona':icon, 'miasto':city, 'data':data}
        return jsonify(response_data)
        #return render_template('main.html', temp = temperature, warunki = condition, miasto = city, data = data, icon = icon)
    else:
        return redirect(url_for('index'))

@app.route('/submitCity', methods=['POST','GET'])
def submitWeather():
    if request.method=='POST':
        miasto = str(request.form['city'])
        api_key = 'c71bd51c9e09474a8db153108231911'

        # Wysyłanie zapytania do WeatherAPI
        weather_api_url = f'http://api.weatherapi.com/v1/current.json?key={api_key}&q={miasto}&aqi=no'
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
            temperature_F = temperature * 33.8
            data = data[:10]
            rok, miesiac, dzien = data.split('-')
            formatted_data = f"{dzien}-{miesiac}-{rok}"

            #return render_template('main.html', temp = formatted_temperature, warunki = condition, miasto = city, data = formatted_data, icon = icon)
            temperature_C = int(temperature)

            # Przygotuj dane do przekazania do szablonu HTML
            response_data = {'succes':True, 'temperatura_C':temperature_C, 'temperatura_F':temperature_F, 'warunki':condition, 
                             'ikona':icon, 'miasto':city, 'data':formatted_data}
            return jsonify(response_data)
            #return render_template('main.html', temp = temperature, warunki = condition, miasto = city, data = data, icon = icon)
        else:
            response_data = {'succes':False}
            return jsonify(response_data)

"""@app.route('/<int:userID>}')
def user_id(userID):
    session['user'] = userID
    query = "SELECT * FROM uzytkownik WHERE userID = %d"
    data = (userID,)
    cursor, user = db_connection.execute_query(query, data)
    background = user[0]['tlo']
    themeColors = {
    'light': '#ffffff',
    'dark': '#333333',
    'sky': '#87CEEB',
    'nature': '#228B22'
    }
    colorBackground = themeColors[background]
    api_key = 'c71bd51c9e09474a8db153108231911'

    city = 'Cracow'
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

    return render_template('userMain.html', temp = temperature, warunki = condition, miasto = city, data = data, icon = icon, user=user[0]['email'],
                           colorBackground=colorBackground)

@app.route('/update_background_color', methods=['POST'])
def update_background_color():
    if request.method == 'POST':
        user_id = session.get('user')  # Pobierz ID zalogowanego użytkownika
        background_color = request.form['color']

        # Aktualizuj kolor tła w bazie danych
        query = "UPDATE uzytkownik SET tlo = %s WHERE userID = %s"
        data = (background_color, user_id)
        db_connection.execute_query(query, data)

        return jsonify({'success': True})
"""
@app.route('/submitBackground', methods=['POST'])
def submitBackground():
    if 'user_id' in session:
        user_id = session['user_id']
        data = request.get_json()
        backgroundColor = data.get('color')
        query = "UPDATE uzytkownik SET tlo = %s WHERE userID = %s"
        data = (backgroundColor, user_id)
        cursor = db_connection.cursor()
        cursor.execute(query, data)
        db_connection.commit()
        cursor.close()
        return jsonify({'success':True, 'color':backgroundColor})
    else:
         return jsonify({'success':False, 'user_id': 'no in session'})

if __name__ == '__main__':
    app.run(debug=True)
    #db_connection.close_connection()