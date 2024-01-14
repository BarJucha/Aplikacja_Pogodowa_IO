from dataBase import DataBaseConnection
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests
from getWeather import fgetDailyForecast, fgetForecastInDay

# Funkcja dodająca miasto do śledzenia
def faddCityToFollow(db_connection, miasto, data, user_id):

    weather = fgetForecastInDay(miasto, data) # Wywołanie funkcji pobierającej pogodę dla miasto w podanej dacie
    icona = weather['icon']
    stan = weather['stan']
    temp = weather['temp']

    query_prognoza = "INSERT INTO prognoza ('miasto', 'stan', 'icona', 'data', 'temp') VALUES (%s, %s, %s, %s, %s)"
    dane_do_prognozy = (miasto, stan, icona, data, temp)
    db_connection.execute_query(query_prognoza, dane_do_prognozy)

    query_to_get_prognozaID = "SELECT prognozaID FROM prognoza ORDER BY prognozaID DESC LIMIT 1"
    cursor, result = db_connection.execute_query(query_to_get_prognozaID)

    for row in result:
        prognozaID = row['prognozaID']

    query_sledzenie = "INSERT INTO sledzona_pogoda ('miasto', 'userID', 'prognozaID') VALUES (%s, %s, %s)"
    dane_do_sledzenia = (miasto, user_id, prognozaID)
    db_connection.execute_query(query_sledzenie, dane_do_sledzenia)


# Funkcja usuwająca miasto do śledzenia
def fRemoveCityToFollow(db_connection, miasto, data, user_id):
    query = "DELETE FROM sledzona_pogoda WHERE miasto=%s AND userID =%s AND prognozaID IN (SELECT prognozaID FROM prognoza WHERE data=%s)"
    query_data = (miasto, user_id, data)
    db_connection.execute_query(query, query_data)


# Funkcja pobierająca miasta do śledzenia
def fgetFollowedCities(db_connection, user_id):
    query = "SELECT p.miasto, p.data, p.stan, p.icona FROM sledzona_pogoda s JOIN prognoza p ON s.prodnozaID = p.prognozaID WHERE s.userID = %s"
    cursor, result = db_connection.execute_query(query, user_id)
    result_data = []
    for row in result:
        city_data = {'miasto':row['miasto'], 'data':row['data'], 'stan':['stan'], 'icona':['icona']}
        result_data.append(city_data)
    
    return result_data

