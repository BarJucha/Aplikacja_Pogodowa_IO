from dataBase import DataBaseConnection
from flask import Flask, request, session, redirect, url_for, jsonify, render_template
import requests

def fRemoveCityToFollow(db_connection, miasto, data, user_id):
    query = "DELETE FROM sledzona_pogoda WHERE miasto=%s AND userID =%s AND prognozaID IN (SELECT prognozaID FROM prognoza WHERE data=%s)"
    query_data = (miasto, user_id, data)
    db_connection.execute_query(query, query_data)