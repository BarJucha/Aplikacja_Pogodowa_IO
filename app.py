import dataBase
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import hashlib
import os
import login
import currentWeather

from login import login_blueprint
app = Flask(__name__, static_url_path='/static')

app.secret_key = 'klucz_sesji'
app.register_blueprint(login_blueprint)
@app.route('/')
def index():
    if request.method == 'POST':
        #Odbierz dane od front-endu (miasto)
    
        city = request.get_json()['city']
        currentWeather.getCurrentWeather(city)
    else:
        return render_template('main.html')

if __name__ == '__main__':
    app.run(debug=True)
    #db_connection.close_connection()