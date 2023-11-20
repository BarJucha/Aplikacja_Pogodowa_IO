import dataBase
from flask import Flask, request, session, redirect, url_for, jsonify
import hashlib
import os



app = Flask(__name__, static_url_path='/static')
app.secret_key = 'klucz_sesji'

db_connection = dataBase.DataBaseConnection()

def generate_salt():
    return os.urandom(16).hex()


def hash_password(password, salt):
    hashed_password = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed_password


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Pobierz informacje o użytkowniku z bazy danych
    query = "SELECT * FROM uzytkownik WHERE email = %s"
    data = (email,)
    cursor = db_connection.execute_query(query, data)
    user = cursor.fetchone()

    if user:
        # Sprawdź poprawność hasła
        hashed_password = hash_password(password, user['salt'])
        if hashed_password == user['password']:
            # Zaloguj użytkownika i ustaw informacje o nim w sesji
            session['user_id'] = user['id']
            session['user_email'] = user['email']
            response_data = {'success': True, 'message': 'Zalogowano pomyślnie'}
        else:
            response_data = {'success': False, 'message': 'Użytkownik o podanym email istnieje.'}
    else:
        response_data = {'success': False, 'message': 'Użytkownik o podanym email istnieje.'}
    return jsonify(response_data)


@app.route('/logout')
def logout():
    # Wyloguj użytkownika i wyczyść sesję
    session.clear()
    return redirect(url_for('login'))


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Sprawdź, czy użytkownik o podanym email już istnieje
    query_check_existing_user = "SELECT userID FROM uzytkownik WHERE email = %s"
    data_check_existing_user = (email,)
    cursor_existing_user = db_connection.execute_query(query_check_existing_user, data_check_existing_user)
    existing_user = cursor_existing_user.fetchone()

    if existing_user:
        response_data = {'success': False, 'message': 'Użytkownik o podanym email istnieje.'}
    else:
        response_data = {'success': True, 'message': 'Zarejestrowano poprawnie.'}

    # Wygeneruj unikalną sól dla każdego użytkownika
    salt = generate_salt()

    # Wygeneruj skrót hasła
    hashed_password = hash_password(password, salt)

    # Zapisz użytkownika do bazy danych
    query_register_user = "INSERT INTO uzytkownik (email, password, tlo, salt) VALUES (%s, %s, blue, %s)"
    data_register_user = (email, hashed_password, salt)
    db_connection.execute_query(query_register_user, data_register_user)

    return jsonify(response_data)
