from dataBase import DataBaseConnection
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests

def fgetFollowedCities(db_connection, user_id):
    query = "SELECT p.miasto, p.data, p.stan, p.icona FROM sledzona_pogoda s JOIN prognoza p ON s.prodnozaID = p.prognozaID WHERE s.userID = %s"
    cursor, result = db_connection.execute_query(query, user_id)
    result_data = []
    for row in result:
        city_data = {'miasto':row['miasto'], 'data':row['data'], 'stan':['stan'], 'icona':['icona']}
        result_data.append(city_data)
    
    return jsonify(result_data)
