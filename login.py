import dataBase
from flask import Blueprint, Flask, request, session, redirect, url_for, jsonify
import hashlib
import os

login_blueprint = Blueprint('login', __name__)

app = Flask(__name__, static_url_path='/static')
app.secret_key = 'klucz_sesji'

db_connection = dataBase.DataBaseConnection()

def generate_salt():
    return os.urandom(16).hex()


def hash_password(password, salt):
    hashed_password = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed_password


@login_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    # Pobierz informacje o użytkowniku z bazy danych
    query = "SELECT * FROM uzytkownik WHERE email = %s"
    data = (email,)
    cursor, user = db_connection.execute_query(query, data)

    if user:
        # Sprawdź poprawność hasła
        hashed_password = hash_password(password, user[0]['salt'])
        if hashed_password == user[0]['haslo']:
            # Zaloguj użytkownika i ustaw informacje o nim w sesji
            response_data = {'success': True, 'message': 'Zalogowano pomyślnie'}
        else:
            response_data = {'success': False, 'message': 'Użytkownik o podanym email istnieje, ale błędne hasło.'}
    else:
        response_data = {'success': False, 'message': 'Użytkownik o podanym email nie istnieje.'}
        
    print(response_data)
    return jsonify(response_data)


@login_blueprint.route('/logout')
def logout():
    # Wyloguj użytkownika i wyczyść sesję
    session.clear()
    return redirect(url_for('login'))


@login_blueprint.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Sprawdź, czy użytkownik o podanym email już istnieje
        query_check_existing_user = "SELECT userID FROM uzytkownik WHERE email = %s"
        data_check_existing_user = (email,)

        cursor_existing_user, existing_user = db_connection.execute_query(query_check_existing_user, data_check_existing_user)

        if existing_user:
            response_data = {'success': False, 'message': 'Użytkownik o podanym email już istnieje.'}
        else:
            # Wygeneruj unikalną sól dla każdego użytkownika
            salt = generate_salt()

            # Wygeneruj skrót hasła
            hashed_password = hash_password(password, salt)

    # Zapisz użytkownika do bazy danych
        query_register_user = "INSERT INTO uzytkownik (email, password, tlo, salt) VALUES (%s, %s, blue, %s)"
        data_register_user = (email, hashed_password, salt)
        db_connection.execute_query(query_register_user, data_register_user)

        return jsonify(response_data)

    except Exception as e:
        print(f"Błąd podczas rejestracji: {e}")
        return jsonify({'success': False, 'message': 'Wystąpił błąd podczas rejestracji.'})