import dataBase
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import hashlib
import os
import login
import currentWeather
app = Flask(__name__)

@app.route('/')
def main():
    if request.method == 'POST':
        # Odbierz dane od front-endu (miasto)
        city = request.get_json()['city']


    return render_template('main.html')