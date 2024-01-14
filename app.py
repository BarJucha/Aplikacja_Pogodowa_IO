import dataBase
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests
from getFavouriteCties import fgetFavouriteCities
from getWeather import fgetHourForecast, fgetDailyForecast, getCurrentWeather
from followCity import fgetFollowedCities, fRemoveCityToFollow

from login import login_blueprint
app = Flask(__name__, static_url_path='/static')

db_connection = dataBase.DataBaseConnection()

app.secret_key = 'klucz_sesji'
app.register_blueprint(login_blueprint)
@app.route('/')
def index():
    return render_template('main.html')

# Endpoint obługujący żadanie pobrania aktualnej pogody dla miasta.
@app.route('/submitCity', methods=['POST','GET'])
def submitWeather():
    if request.method=='POST':
        miasto = str(request.get_json()['city']) # Pobranie miasta
        result = getCurrentWeather(miasto)
        if result['success'] == True:
            return jsonify(result)
        else:
            response_data = {'success':False}
            return jsonify(response_data)

# Endpoint obsługujący żądania godzinowej prognozy pogody.
@app.route('/getHourForecast', methods=['POST', 'GET'])
def getHourForecast():
    if request.method=='POST':
        miasto = str(request.get_json()['city']) 
        result = fgetHourForecast(miasto) # Wywołanie funkcji obsługującej prognozę godzinową
        return result

# Endpoint obsługujący żądania dziennej prognozy pogody.
@app.route('/getDailyForecast', methods=['POST', 'GET'])
def getDailyForecast():
    if request.method == 'POST':
        miasto = str(request.get_json()['city'])
        result = fgetDailyForecast(miasto)  # Wywołanie funkcji obsługującej prognozę dzienną
        return result


# Endpoint obsługujący zapis ustawień tła dla użytkownika
@app.route('/submitBackground', methods=['POST'])
def submitBackground():
    if 'user_id' in session:
        user_id = session['user_id']
        data = request.get_json()
        backgroundColor = data.get('color')
        query = "UPDATE uzytkownik SET tlo = %s WHERE userID = %s"
        data = (backgroundColor, user_id)
        db_connection.execute_query(query, data)

        return jsonify({'success':True, 'color':backgroundColor})
    else:
         return jsonify({'success':False, 'user_id': 'no in session'})


# Endpoint obsługujący zmiane opcji wyświetlania temperatury dla użytkownika
@app.route('/submitTemperature', methods=['POST'])
def submitTemperature():
    if 'user_id' in session:
        user_id = session['user_id']
        data = request.get_json()
        temp = data.get('temperature')
        query = "UPDATE uzytkownik SET temp = %s WHERE userID = %s"
        data = (temp, user_id)
        db_connection.execute_query(query, data)

        return jsonify({'success': True, 'temp': temp})
    else:
        return jsonify({'success': False, 'user_id': 'no in session'})

@app.route('/submitDefaultCity', methods=['POST'])
def submitDefaultCity():
    if 'user_id' in session:
        user_id = session['user_id']
        data = request.get_json()
        city = data.get('city')
        query = "UPDATE uzytkownik SET miasto = %s WHERE userID = %s"
        data = (city, user_id)
        db_connection.execute_query(query, data)

        return jsonify({'success': True, 'default': city})
    else:
        return jsonify({'success': False, 'user_id': 'no in session'})

@app.route('/submitNotification', methods=['POST'])
def submitNotification():
    if 'user_id' in session:
        user_id = session['user_id']
        data = request.get_json()
        notification = data.get('notification')
        query = "UPDATE uzytkownik SET powiadomienia = %s WHERE userID = %s"
        data = (notification, user_id)
        db_connection.execute_query(query, data)
        print(notification);

        return jsonify({'success': True, 'default': notification})
    else:
        return jsonify({'success': False, 'user_id': 'no in session'})


# Endpoint obsługujący dodanie ulubionego miasta użytkownika do bazy danych
@app.route('/addCityToFavourite', methods=['POST', 'GET'])
def addCityToFavourite():
    if request.method == 'POST':
        miasto = str(request.get_json()['city'])
        user_id = session['user_id']
        query_check_existing_city = "SELECT * FROM ulubione_miasta WHERE user_id = %s AND miasto = %s"
        data_check_existing_city = (user_id, miasto)
        existing_city = db_connection.execute_query(query_check_existing_city, data_check_existing_city)

        if not existing_city:
            query_add_favorite_city = "INSERT INTO ulubione_miasta (user_id, miasto) VALUES (%s, %s)"
            data_add_favorite_city = (user_id, miasto)
            db_connection.execute_query(query_add_favorite_city, data_add_favorite_city)
        

# Endpoint obsługujący usunięcie ulubionego miasta użytkownika z bazy danych
@app.route('/deleteCityFromFavourite', methods=['POST', 'GET'])
def deleteCityFromFavourite():
    if request.method == 'POST':
        miasto = str(request.get_json()['city'])
        user_id = session['user_id']
        query = "DELETE FROM ulubione_miasta WHERE user_id = %s AND miasto = %s"
        data_to_delete = (user_id, miasto)
        db_connection.execute_query(query, data_to_delete)


# Endpoint obsługujący pobranie ulubionych miast zalogowanego użytkownika
@app.route('/getFavouriteCities', methods=['POST', 'GET'])
def getFavouriteCities():
    user_id = session['user_id']
    result = fgetFavouriteCities(db_connection, user_id)
    return result

# Endpoint obsługujący dodanie miasta do śledzenia
@app.route('/addCityToFollow', methods=['POST', 'GET'])
def addCityToFollow():
    if request.method == 'POST':
        miasto = str(request.get_json()['city'])
        date = str(request.get_json()['date'])
        user_id = session['user_id']

        # TODO
        query_to_add = "INSERT INTO sledzona_pogoda (miasto, userID, prognozaID) VALUES (%s, %s, %s)"
        data = (miasto, user_id, )
        cursor, result = db_connection.execute_query(query_to_add, data)

        cities_data = [{'miasto': row['miasto'], 'data': row['datetime'], 'stan': row['stan'], 'icon': row['icon']} for row in result]

        return jsonify(cities_data)

# Endpoint obsługujący usunięcie miasta do śledzenia
@app.route('/removeCityToFollow', methods=['POST', 'GET'])
def removeCityToFollow():
    if request.method == 'POST':
        miasto = str(request.get_json()['city'])
        date = str(request.get_json()['date'])
        user_id = session['user_id']
        fRemoveCityToFollow(db_connection, miasto, date, user_id)

# Endpoint obsługujący pobranie miast do śledzenia zalogowanego użytkownika
@app.route('/getFollowedCities', methods=['POST', 'GET'])
def getFollowedCities():
    if request.method == 'POST':
        user_id = session['user_id']
        result = fgetFollowedCities(db_connection, user_id)
        return result

if __name__ == '__main__':
    app.run(debug=True)
