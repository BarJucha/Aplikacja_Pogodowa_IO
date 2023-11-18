import dataBase
from flask import Flask, request, session, redirect, url_for
import hashlib
import os

app = Flask(__name__)
app.secret_key = 'klucz_sesji'

db_connection = dataBase.DataBaseConnection()

def generate_salt():
    return os.urandom(16).hex()

def hash_password(password, salt):
    hashed_password = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed_password

@app.route('/login', methods = ['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

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
            return "Zalogowano pomyślnie"

    return "Błąd logowania"

@app.route('/logout')
def logout():
    # Wyloguj użytkownika i wyczyść sesję
    session.clear()
    return redirect(url_for('login'))

@app.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    password = request.form.get('password')

    # Sprawdź, czy użytkownik o podanym email już istnieje
    query_check_existing_user = "SELECT userID FROM uzytkownik WHERE email = %s"
    data_check_existing_user = (email,)
    cursor_existing_user = db_connection.execute_query(query_check_existing_user, data_check_existing_user)
    existing_user = cursor_existing_user.fetchone()

    if existing_user:
        return "Użytkownik o podanym adresie e-mail już istnieje."

    # Wygeneruj unikalną sól dla każdego użytkownika
    salt = generate_salt()

    # Wygeneruj skrót hasła
    hashed_password = hash_password(password, salt)

    # Zapisz użytkownika do bazy danych
    query_register_user = "INSERT INTO uzytkownik (email, password, salt) VALUES (%s, %s, %s)"
    data_register_user = (email, hashed_password, salt)
    db_connection.execute_query(query_register_user, data_register_user)

    return "Zarejestrowano pomyślnie"